// Listen for alarm event
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "drink_water") {
        showReminderNotification();
    } else if (alarm.name === "postponed_drink_water") {
        showPostponedReminderNotification();
    }
});

// Listen for messages from popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setReminder" && request.time) {
        console.log('Received message from popup:', request);
        createAlarm(request.time);
        sendResponse({ success: true }); // Send response to acknowledge receipt of the message
    } else if (request.action === "postponeReminder" && request.time) {
        postponeReminder(request.time);
        sendResponse({ success: true }); // Send response to acknowledge receipt of the message
    }
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (notificationId === "drink_water") {
        if (buttonIndex === 0) {
            // Send a message to the background script to decrease water level
  
            chrome.runtime.sendMessage({ action: 'decreaseWaterLevel' }, function(response) {
                // Handle response if needed
            });
        } else if (buttonIndex === 1) {
            // Show input field in the notification for setting another reminder
            showSetReminderNotification();
        }
    }
});




function showSetReminderNotification() {
    chrome.notifications.create("set_reminder", {
        type: "basic",
        iconUrl: "alarm.png",
        title: "Set Reminder",
        message: "Choose one of the number of minutes:",
        buttons: [{ title: "5 min" },{ title: "15 min" }],
        requireInteraction: true // Allow the notification to stay open until user interaction
    });
}

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (notificationId === "set_reminder" && buttonIndex === 0) {
        // Handle user's response to "Set" button in the set reminder notification
        chrome.notifications.clear("set_reminder"); // Clear the set reminder notification
        postponeReminder(5);
        chrome.runtime.sendMessage({ action: 'postponeReminder', time: 5 });
        alert(`Reminder set for 5 minutes`);
    } else if (notificationId === "set_reminder" && buttonIndex === 1) {
        // Handle user's response to "Set" button in the set reminder notification
        chrome.notifications.clear("set_reminder"); // Clear the set reminder notification
        postponeReminder(15);
        chrome.runtime.sendMessage({ action: 'postponeReminder', time: 15 });
    }
});

function createAlarm(reminderTime) {
    chrome.alarms.create("drink_water", {
        delayInMinutes: reminderTime, // Set the delay based on user input time
        periodInMinutes: reminderTime // Set the period to the same value for a one-time alarm
    });
}

function postponeReminder(postponeTime) {
    chrome.alarms.create("postponed_drink_water", {
        delayInMinutes: postponeTime
    });
}

function showReminderNotification() {
    chrome.notifications.create("drink_water", {
        type: "basic",
        iconUrl: "alarm.png",
        title: "Stay Hydrated",
        message: "Take a sip !!!",
        silent: false,
        buttons: [{ title: "I did!" },{ title: "Postpone" }], // Add action button
        requireInteraction: true
    });
}

function showPostponedReminderNotification() {
    chrome.notifications.create("postponed_drink_water", {
        type: "basic",
        iconUrl: "alarm.png",
        title: "Stay Hydrated",
        message: "I see you did not took a sip, here is another chance!",
        silent: false,
        buttons: [{ title: "I did!" }], // Add action button
        requireInteraction: true

    });
}





