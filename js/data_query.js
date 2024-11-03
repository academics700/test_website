document.getElementById('data-query-form').addEventListener('submit', function(event) {
    event.preventDefault();
    filterData();
    document.getElementById('data-query-form').reset();
});

function convertToJ2000(date, time) {
    let dateObj = new Date(date + 'T' + time);
    const j2000Epoch = new Date(Date.UTC(2000, 0, 1, 11, 58, 55.816));
    const diffInMilliseconds = dateObj - j2000Epoch;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const timeJ2000 = diffInMilliseconds / millisecondsPerDay;

    return Number(timeJ2000);
}

function j2000ToDate(time) {
    const j2000Time = 2451545.0;
    const msPerDay = 86400000;
    const leapSeconds = 64.184; // Leap seconds difference between TT and UTC at J2000

    const j2000Epoch = new Date(Date.UTC(2000, 0, 1, 12, 0, 0, 0) - leapSeconds * 1000);
    const diff = (time - j2000Time) * msPerDay;
    const finalDate = new Date(j2000Epoch.getTime() + diff);
    const datePart = finalDate.toISOString().split('T')[0];
    const timePart = finalDate.toISOString().split('T')[1].slice(0, 8);

    return {
        date: datePart,
        time: timePart
    };
}

function filterData() {
    const objectName = document.getElementById('object-name').value.trim();
    const ra = document.getElementById('ra').value.trim();
    const dec = document.getElementById('dec').value.trim();
    const startDate = document.getElementById('start-date').value.trim();
    const endDate = document.getElementById('end-date').value.trim();
    const startTime = document.getElementById('start-time').value.trim();
    const endTime = document.getElementById('end-time').value.trim();
    const minExposure = document.getElementById('min-exposure').value.trim();
    let searchRadius = document.getElementById('search-radius').value.trim() || 10.0; // Default value in arc-sec
    const limit = document.getElementById('limit').value.trim();
    let maxRa = ra;
    let minRa = ra;
    let maxDec = dec;
    let minDec = dec;
    let startTimeJ2000 = startDate;
    let endTimeJ2000 = endDate;

    searchRadius /= 3600;
    if (!(ra === null || ra === undefined || ra === '')) {
        maxRa = ra + searchRadius;
        minRa = ra - searchRadius;
    }

    if (!(dec === null || dec === undefined || dec === '')) {
        maxDec = dec + searchRadius;
        minDec = dec - searchRadius;
    }
    if (!(startDate === null || startDate === undefined || startDate === '')) {
        startTimeJ2000 = convertToJ2000(startDate, startTime);
    }
    if (!(endDate === null || endDate === undefined || endDate === '')) {
        endTimeJ2000 = convertToJ2000(endDate, endTime);
    }

    const publicIP = fetchIP();

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `http://${publicIP}/ado_website/php/filter_data.php`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onload = function() {
        if (this.status === 200) {
            displayResults(JSON.parse(this.responseText));
        }
    };

    xhr.onerror = function() {
        document.getElementById('data-query-form').reset();
        console.error("Request failed"); // Log if the request fails
    };
    // Send the form data
    xhr.send(`objectName=${encodeURIComponent(objectName)}
                &startTime=${encodeURIComponent(startTimeJ2000)}
                &endTime=${encodeURIComponent(endTimeJ2000)}
                &minExposure=${encodeURIComponent(minExposure)}
                &maxRA=${encodeURIComponent(maxRa)}
                &maxDEC=${encodeURIComponent(maxDec)}
                &minRA=${encodeURIComponent(minRa)}
                &minDEC=${encodeURIComponent(minDec)}`);
}

function displayResults(filteredData) {
    var formContainer = document.getElementById('form-container');
    var tableContainer = document.getElementById('table-container');
    formContainer.classList.remove('visible');
    formContainer.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    tableContainer.classList.add('visible');

    const tbody = document.getElementById('results-table').querySelector('tbody');
    //tbody.innerHTML = ''; // Clear previous results

    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No results found</td></tr>';
        return;
    }

    // Populate table with filtered results
    let customIndex = 0;
    filteredData.forEach(item => {
        console.log(item.file_location.trim())
        customIndex++;
        startDate = j2000ToDate(item.start_time).date;
        startTime = j2000ToDate(item.start_time).time;
        endDate = j2000ToDate(item.end_time).date;
        endTime = j2000ToDate(item.end_time).time;
        const row = `<tr class="row-container">
            <td class="result-row table-row">${item.object_name}</td>
            <td class="result-row table-row">${Number(item.ra).toFixed(3)}</td>
            <td class="result-row table-row">${Number(item.decn).toFixed(3)}</td>
            <td class="result-row table-row">${startDate}</td>
            <td class="result-row table-row">${endDate}</td>
            <td class="result-row table-row">${startTime}</td>
            <td class="result-row table-row">${endTime}</td>
            <td class="result-row table-row">${Number(item.exposure).toFixed()}</td>
            <td class="result-row table-row">
            <button class="download-data" id="download-button-${customIndex}">
            </button>
            </td>
        </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
        document.getElementById(`download-button-${customIndex}`).onclick = function() {
            const publicIP = fetchIP();
            const link = document.createElement('a');
            link.href = `http://${publicIP}/ado_website/php/download.php?file=${encodeURIComponent(item.file_location)}`;
            link.click();
        };
    });
}

function clearTable() {
    const tbody = document.getElementById('results-table').querySelector('tbody');
    var formContainer = document.getElementById('form-container');
    var tableContainer = document.getElementById('table-container');
    tbody.innerHTML = '';
    formContainer.classList.remove('hidden');
    formContainer.classList.add('visible');
    tableContainer.classList.remove('visible');
    tableContainer.classList.add('hidden');
}