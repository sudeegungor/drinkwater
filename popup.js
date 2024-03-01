document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('btn');
    const quantityInput = document.getElementById('quantity');

    btn.addEventListener('click', function () {
        const reminderTime = parseInt(quantityInput.value); // Convert input value to integer
        if (!isNaN(reminderTime) && reminderTime > 0) {
            // Send reminder time to background script
            chrome.runtime.sendMessage({ action: 'setReminder', time: reminderTime }, function(response) {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError.message);
                } else {
                    console.log('Message sent successfully:', response);
                }
            });
            alert(`Reminder set for ${reminderTime} minutes`);
        } else {
            alert('Please enter a valid reminder time');
        }
    });
});


//content.js
/*chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(request, sender, sendResponse);
    sendResponse('i got it：'+JSON.stringify("request"));
});*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'decreaseWaterLevel') {
        decreaseWaterLevel();
    }
});

function decreaseWaterLevel() {
    // Your logic to decrease the water level
    const waterLevelElement = document.querySelector('.bottle-container .mask .fill');
    let currentHeight = parseFloat(waterLevelElement.style.height);
    currentHeight -= 10; // Example: decrease by 10%
    if (currentHeight < 0) {
        currentHeight = 0;
    }
    waterLevelElement.style.height = currentHeight + '%';
}

function decreaseWaterLevel() {
    // Your existing logic to decrease the water level
    const waterLevelElement = document.querySelector('.bottle-container .mask .fill');
    let currentHeight = parseFloat(waterLevelElement.style.height);
    currentHeight -= 10;
    if (currentHeight < 0) {
        currentHeight = 0;
    }
    waterLevelElement.style.height = currentHeight + '%';
    console.log("decrease");
}


