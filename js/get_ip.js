function fetchIP(ip) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "../json/data.json", false);
    try {
        xhr.send();
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const ip = data.ip;
            return ip;
        } else {
            console.error('Error fetching the IP:', xhr.statusText);
        }
    } catch (error) {
        console.error('Error fetching the IP:', error);
    }
}