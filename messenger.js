// This is called automatically when a text is received
window.onNewSMS = function(sender, content) {
    console.log("OS intercepted message from: " + sender);
    
    // Example: Create a Sci-Fi notification
    const notification = document.createElement('div');
    notification.className = 'neon-alert';
    notification.innerHTML = `INCOMING TRANSMISSION: [${sender}] <br> ${content}`;
    document.body.appendChild(notification);
    
    // Play the theme sound
    if(typeof playSound === 'function') playSound('beep.wav');
};