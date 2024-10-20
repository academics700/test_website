function changeCss(element, state) {
    element.classList.add(state);
}

function checkIframeLoadStatus() {
    const i_frame = document.getElementById('content-frame')
    i_frame.onload = () => {
        lightenImage(i_frame);
    };
}

function lightenImage(i_frame) {

    const i_frame_left = document.getElementsByClassName('content-container')[0].offsetLeft;
    const i_frame_top = document.getElementsByClassName('content-container')[0].offsetTop;
    const iframe_document = i_frame.contentDocument || i_frame.contentWindow.document;
    const parent_container = document.getElementsByClassName('parent-container')[0];
    image_container = iframe_document.getElementById('network-image-container');
    var img;

    if (image_container != null) {
        img = image_container.querySelector('img');
    }
    else {
        return 0;
    }
    
    const canvas = document.createElement('canvas');
    const canvas_update = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const ctx_update = canvas_update.getContext('2d');
    
    const parent_styles = window.getComputedStyle(parent_container);
    const parent_bg_image = parent_styles.backgroundImage.slice(5, -2); // Extract URL

    const img_width = img.offsetWidth;
    const img_height = img.offsetHeight;
    const img_left = img.offsetLeft;
    const img_top = img.offsetTop;

    const background_image = new Image();
    background_image.src = parent_bg_image;

    background_image.onload = function() {
        canvas.width = parent_container.offsetWidth;
        canvas.height = parent_container.offsetHeight;
        canvas_update.width = img_width;
        canvas_update.height = img_height;

        offset_left = i_frame_left + img_left
        offset_top = i_frame_top + img_top

        ctx.drawImage(background_image, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'blur(60px)';
        ctx.drawImage(canvas, 0, 0);
        ctx_update.drawImage(canvas, offset_left, offset_top, img_width, img_height, 0, 0, img_width, img_height);
        const rgbaOverlay = 'rgba(19, 35, 40, 0.5)';
        ctx_update.fillStyle = rgbaOverlay;
        ctx_update.fillRect(0, 0, canvas_update.width, canvas_update.height);

        image_container.style.background = `url(${canvas_update.toDataURL()})`;
        image_container.style.backgroundClip = "padding-box";
        image_container.style.backgroundRepeat = "no-repeat";
        image_container.style.backgroundPosition = "center";
        image_container.style.backgroundSize = `${img_width}px ${img_height}px`;
    };
}

function resizeTabOnClick(tab_buttons, title_container, frame_container, menu_image, menu_images, i) {
    for (let j=0; j<tab_buttons.length; j++) {
        tab_buttons[j].classList.remove('tab-active');
        menu_image.classList.remove(menu_images[j])
    }
    if (tab_buttons[i].classList.contains('home')) {
        title_container.classList.remove('main-title-active');
        title_container.classList.add('main-title-inactive');
        frame_container.classList.remove('child-container-home-inactive');
        frame_container.classList.add('child-container-home-active');

    }
    else {
        title_container.classList.remove('main-title-inactive')
        title_container.classList.add('main-title-active')
        frame_container.classList.add('child-container-home-inactive');
        frame_container.classList.remove('child-container-home-active');
    }
    tab_buttons[i].classList.add('tab-active');
    menu_image.classList.add(menu_images[i]);
}

function updateIframeSource(iframe_source) {
    var i_frame = document.getElementById('content-frame');
    i_frame.src = "html/" + iframe_source + ".html";
}

function switchTabs() {
    const tab_buttons = document.getElementsByClassName('tab');
    const title_container = document.getElementsByClassName('main-title')[0];
    const frame_container = document.getElementsByClassName('content-container')[0];
    var menu_image = document.getElementsByClassName('menu-image')[0];
    const menu_images = ["menu-home-image", "menu-about-image", "menu-equipment-image", "menu-collaborations-image", "menu-research-image", "menu-data-image", "menu-people-image", "menu-contact-image"];
    const iframe_source = ["home", "about", "equipment", "collaborations", "research", "data", "people", "contact"];

    for (let i=0; i<tab_buttons.length; i++) {
        tab_buttons[i].addEventListener('click', () => {
            updateIframeSource(iframe_source[i]);
            resizeTabOnClick(tab_buttons, title_container, frame_container, menu_image, menu_images, i);
            checkIframeLoadStatus();
        });
    }
}


function rescaleContainer() {
}

function filterData() {
    const objectName = document.getElementById('objectName').value;
    const ra = document.getElementById('ra').value;
    const dec = document.getElementById('dec').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    // Create an XMLHttpRequest to send data to the PHP script
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'filter_data.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (this.status === 200) {
            displayResults(JSON.parse(this.responseText));
        }
    };

    // Send the form data
    xhr.send(`objectName=${encodeURIComponent(objectName)}&ra=${encodeURIComponent(ra)}&dec=${encodeURIComponent(dec)}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`);
}

function displayResults(filteredData) {
    const tbody = document.getElementById('resultsTable').querySelector('tbody');
    tbody.innerHTML = ''; // Clear previous results

    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No results found</td></tr>';
        return;
    }

    // Populate table with filtered results
    filteredData.forEach(item => {
        const row = `<tr>
            <td>${item.object_name}</td>
            <td>${item.ra}</td>
            <td>${item.dec}</td>
            <td>${item.start_time}</td>
            <td>${item.end_time}</td>
            <td>${item.exposure}</td>
        </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}


//imageLighten();
switchTabs();
