
function imageLighten() {
    const imageDiv = document.getElementById('network-image-container');
    const parentDiv = document.getElementsByClassName('parent-container')[0];
    if (imageDiv != null) {
        const img = imageDiv.querySelector('img');
    }
    else {
        return 0;
    }
    console.log(parentDiv);
    
    /*const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const parentStyles = window.getComputedStyle(parentDiv);
    const parentBgImage = parentStyles.backgroundImage.slice(5, -2); // Extract URL

    const imgWidth = img.offsetWidth;
    const imgHeight = img.offsetHeight;
    const imgLeft = imageDiv.offsetLeft;
    const imgTop = imageDiv.offsetTop;

    const backgroundImage = new Image();
    backgroundImage.src = parentBgImage;

    backgroundImage.onload = function() {
        canvas.width = parentDiv.offsetWidth;
        canvas.height = parentDiv.offsetHeight;

        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(imgLeft, imgTop, imgWidth, imgHeight).data;

        const pixelData = [];
        for (let y = 0; y < imgHeight; y++) {
            for (let x = 0; x < imgWidth; x++) {
                const index = (y * imgWidth + x) * 4;
                const r = imageData[index];
                const g = imageData[index + 1];
                const b = imageData[index + 2];
                const a = imageData[index + 3];
                pixelData.push(`rgba(${r},${g},${b},${a / 255})`);
            }
        }

        // Apply pixel colors to the background of the imageDiv
        const pixelMapCanvas = document.createElement('canvas');
        const pixelMapCtx = pixelMapCanvas.getContext('2d');
        pixelMapCanvas.width = imgWidth;
        pixelMapCanvas.height = imgHeight;

        for (let y = 0; y < imgHeight; y++) {
            for (let x = 0; x < imgWidth; x++) {
                pixelMapCtx.fillStyle = pixelData[y * imgWidth + x];
                pixelMapCtx.fillRect(x, y, 1, 1);
            }
        }

        imageDiv.style.backgroundImage = `url(${pixelMapCanvas.toDataURL()})`;
        imageDiv.style.backgroundSize = `${imgWidth}px ${imgHeight}px`;
    };*/
}

imageLighten();
//var img = document.getElementById("myImg");


/*document.addEventListener("DOMContentLoaded", function() {
    var img = document.getElementById("myImg");
    var outerContainer = document.getElementById("container1");

    // Function to get the computed background color
    function getBackgroundColor(element) {
        return window.getComputedStyle(element).backgroundColor;
    }

    // Function to blend the image with the background color
    function blendImageWithBackground(img, backgroundColor) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var imgWidth = img.width;
        var imgHeight = img.height;

        canvas.width = imgWidth;
        canvas.height = imgHeight;

        // Fill the canvas with the background color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, imgWidth, imgHeight);

        // Set the global composite operation to multiply
        ctx.globalCompositeOperation = 'multiply';

        // Draw the image on top
        var image = new Image();
        image.src = img.src;
        image.onload = function() {
            ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
            // Replace the original image with the canvas
            img.src = canvas.toDataURL();
        };
    }

    // Get the background color of the outermost container
    var bgColor = getBackgroundColor(outerContainer);

    // Blend the image with the background color
    blendImageWithBackground(img, bgColor);
});*/