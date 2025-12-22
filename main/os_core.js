const ClaudiaOS = {
    init: function() {
        console.log("Claudia OS: Logic Initialized");
        // Ensure system modules are hydrated
        if (typeof AndroidInterface !== 'undefined') {
            AndroidInterface.hydrateSystem();
        }
    },

    login: function(username, pin) {
        if (username.toLowerCase() === "don" && pin === "0415") {
            // Provide visual feedback that we are moving
            document.getElementById('login-screen').innerHTML = "<h1 class='neon-text'>VERIFYING...</h1>";
            
            if (typeof AndroidInterface !== 'undefined') {
                // This triggers the Kernel to download onboarding.html and then open it
                AndroidInterface.syncAndNavigate("onboarding.html");
            } else {
                window.location.href = "onboarding.html";
            }
        } else {
            alert("IDENTITY ERROR");
        }
    }
};

ClaudiaOS.init();