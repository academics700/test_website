function resizeTabOnClick(tab_buttons, title_container, frame_container, menu_image, menu_images, i) {
    for (let j=0; j<tab_buttons.length; j++) {
        if (colorState === 'dark') {
            tab_buttons[j].classList.remove('tab-dark-active');
            tab_buttons[i].classList.add('tab-dark-active');
        }
        else {
            tab_buttons[j].classList.remove('tab-active');
            tab_buttons[i].classList.add('tab-active');
        }
        menu_image.classList.remove(menu_images[j])
    }
    if (tab_buttons[i].classList.contains('home')) {
        title_container.classList.remove('main-title-active');
        title_container.classList.add('main-title-inactive');
        frame_container.classList.remove('child-container-home-inactive');
        frame_container.classList.add('child-container-home-active');
    }
    else {
        title_container.classList.remove('main-title-inactive');
        title_container.classList.add('main-title-active');
        frame_container.classList.add('child-container-home-inactive');
        frame_container.classList.remove('child-container-home-active');
    }
    menu_image.classList.add(menu_images[i]);
}

function updateIframeSource(iframe_source) {
    var i_frame = document.getElementById('content-frame');
    i_frame.src = `html/${iframe_source}.html`;
}

function switchTabs() {
    const tab_buttons = document.getElementsByClassName('tab');
    const title_container = document.getElementsByClassName('main-title')[0];
    const frame_container = document.getElementsByClassName('content-container')[0];
    var menu_image = document.getElementsByClassName('menu-image')[0];
    const menu_images = ["menu-home-image", "menu-about-image", "menu-equipment-image", "menu-collaborations-image", "menu-research-image", "menu-data-image", "menu-people-image", "menu-contact-image"];
    const iframe_source = ["home", "about", "equipment", "collaborations", "research", "data", "people", "contact"];

    for (let i=0; i<tab_buttons.length; i++) {
        const iFrame = document.getElementById('content-frame');
        const iframeDocument = iFrame.contentDocument || iFrame.contentWindow.document;
        iFrame.addEventListener('load', function() {
            iframeDocument.getElementById('home-research-button').addEventListener('click', () => {
                updateIframeSource(iframe_source[4]);
                resizeTabOnClick(tab_buttons, title_container, frame_container, menu_image, menu_images, 4);
                var iFrame = document.getElementById('content-frame');
                iFrame.addEventListener('load', function() {
                    if (colorState === 'dark') {
                        darkMode();
                    }
                    else {
                        lightMode();
                    }
                });
                try {
                    document.getElementById('collapsible-menu-close').click();
                }
                catch {
                }
            });
        })
        tab_buttons[i].addEventListener('click', () => {
            updateIframeSource(iframe_source[i]);
            resizeTabOnClick(tab_buttons, title_container, frame_container, menu_image, menu_images, i);
            var iFrame = document.getElementById('content-frame');
            iFrame.addEventListener('load', function() {
                if (colorState === 'dark') {
                    darkMode();
                }
                else {
                    lightMode();
                }
            });
            try {
                document.getElementById('collapsible-menu-close').click();
            }
            catch {
            }
        });
    }
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

function openMenu() {
    const width = window.innerWidth;
    if (width >= 1200) {
        growMenuTabs('-xl');
    }
    else {
        document.getElementById('collapsible-menu').addEventListener('click', function() {
            this.style.display = 'none';
            document.getElementById('collapsible-menu-close').style.display = 'block';
            document.getElementById('menu-wrapper').scrollTop = 0;
            guessHeight = document.getElementById('menu-tabs').scrollHeight;
            menuContainer = document.getElementById('menu-container');
            menuContainer.style.visibility = 'visible';
            menuContainer.style.position = 'absolute';
            menuContainer.style.zIndex = '5';
            menuContainer.style.top = '3rem';
            menuContainer.classList.remove('hide-menu');
            var menuContainerHeight = Math.floor((1.01*guessHeight < window.innerHeight*0.9) ? 1.01*guessHeight : window.innerHeight*0.9);
            menuContainer.style.height = `${menuContainerHeight}px`;
            document.getElementById('menu-tabs').style.height = `${menuContainerHeight*0.95}px`;
            growMenuTabs('');
        });
    }
}

function closeMenu() {
    document.getElementById('collapsible-menu-close').addEventListener('click', function() {
        this.style.display = 'none';
        document.getElementById('collapsible-menu').style.display = 'block';
        menuContainer.style.height = '0';
        menuContainer.addEventListener('transitionend', function() {
            menuContainer.style.visibility = 'hidden';
        }, { once: true });
        menuLink = document.getElementsByClassName('menu-link');
        for (let i = 0; i < menuLink.length; i++) {
            menuLink[i].classList.remove('menu-tab-animation-grow');
            menuLink[i].classList.add('menu-tab-animation-shrink');
            menuLink[i].addEventListener('animationend', function() {
                menuLink[i].classList.add('scale-0');
            }, { once: true });
            menuLink[i].style.animationDelay = `${0.035*(7-i)}s`;
        }
    });
}

function growMenuTabs(tag) {
    menuLink = document.getElementsByClassName('menu-link');
    for (let i = 0; i < menuLink.length; i++) {
        if (menuLink[i].classList.contains('menu-tab-animation-shrink')) {
            menuLink[i].classList.remove('menu-tab-animation-shrink');
        }
        menuLink[i].classList.add(`menu-tab-animation${tag}-grow`);
        menuLink[i].addEventListener('animationend', function() {
            menuLink[i].classList.remove('scale-0');
        }, { once: true });
        menuLink[i].style.animationDelay = `${0.07*i}s`;
    }
}

function switchColorMode() {
    if (colorState === 'dark') 
    document.getElementById('dark-mode').addEventListener('click', function() {
        lightModeButton.style.visibility = 'visible';
        darkModeButton.style.visibility = 'hidden';
        lightModeButton.style.zIndex = '4';
        darkModeButton.style.zIndex = '5';
        darkMode();
        colorState = 'dark';
    });

    document.getElementById('light-mode').addEventListener('click', function() {
        darkModeButton.style.visibility = 'visible';
        lightModeButton.style.visibility = 'hidden';
        lightModeButton.style.zIndex = '5';
        darkModeButton.style.zIndex = '4';
        lightMode();
        colorState = 'light';
    });
}

function darkMode() {
    const iFrame = document.getElementById('content-frame');
    const iframeDocument = iFrame.contentDocument || iFrame.contentWindow.document;
    var tabs = document.getElementsByClassName('tab');
    var contentTabs = iframeDocument.getElementsByClassName('content-tab');
    var cards = iframeDocument.getElementsByClassName('card')
    Array.from(cards).forEach(function(tab) {
        tab.style.backgroundColor = 'rgba(7, 9, 17, 0.5)';
    });
    Array.from(contentTabs).forEach(function(tab) {
        tab.style.backgroundColor = 'rgba(7, 9, 17, 0.5)';
    });
    Array.from(tabs).forEach(function(tab) {
        if (tab.classList.contains('tab-active')) {
            tab.classList.remove('tab-active');
            tab.classList.add('tab-dark-active');
        }
        tab.classList.remove('tab-light-mode');
        tab.classList.add('tab-dark-mode');
    });
}

function lightMode() {
    const iFrame = document.getElementById('content-frame');
    const iframeDocument = iFrame.contentDocument || iFrame.contentWindow.document;
    var tabs = document.getElementsByClassName('tab');
    var contentTabs = iframeDocument.getElementsByClassName('content-tab');
    var cards = iframeDocument.getElementsByClassName('card')
    Array.from(cards).forEach(function(tab) {
        tab.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
    });
    Array.from(contentTabs).forEach(function(tab) {
        tab.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
    });
    Array.from(tabs).forEach(function(tab) {
        if (tab.classList.contains('tab-dark-active')) {
            tab.classList.remove('tab-dark-active');
            tab.classList.add('tab-active');
        }
        tab.classList.remove('tab-dark-mode');
        tab.classList.add('tab-light-mode');
    });
}

var colorState = 'dark';
darkModeButton = document.getElementById('dark-mode')
lightModeButton = document.getElementById('light-mode')
switchColorMode();
switchTabs();
openMenu();
closeMenu();

window.addEventListener('load', function() {
    const loader = document.querySelector('.loader-background');
    loader.style.display = 'none';
    document.querySelector('.parent-container').style.display = 'block';
});