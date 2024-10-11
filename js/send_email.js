function submitForm(event) {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    const publicIP = fetchIP();

    // Prepare the URL for the request
    const url = `http://${publicIP}/ado_website/php/send_email.php`;

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Prepare the form data
    const formData = new URLSearchParams();
    formData.append('firstName', document.getElementById('first-name').value);
    formData.append('lastName', document.getElementById('last-name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('affiliation', document.getElementById('affiliation').value);
    formData.append('questions', document.getElementById('questions').value);

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Response received:', xhr.responseText);
        } else {
            console.error('Error sending email:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Network error occurred');
    };

    xhr.send(formData.toString());
    console.log('Email sending initiated');

    document.getElementById('contact-form').reset();
}