const ClaudiaOS = {
    init: function() {
        console.log("Claudia OS Soul: Online");
        if (typeof AndroidInterface !== 'undefined') {
            AndroidInterface.hydrateSystem();
        }
    },

    login: function(username, pin) {
        if (username.toLowerCase() === "don" && pin === "0415") {
            // Check if we have already onboarded
            const status = localStorage.getItem('onboarding_complete');
            
            if (status === 'true') {
                AndroidInterface.syncAndNavigate("desktop.html");
            } else {
                AndroidInterface.syncAndNavigate("onboarding.html");
            }
        } else {
            alert("IDENTITY MISMATCH.");
        }
    }
};
ClaudiaOS.init();