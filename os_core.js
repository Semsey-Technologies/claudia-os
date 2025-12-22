/**
 * CLAUDIA OS - Core Kernel Logic
 * Handles Platform Detection, Authentication, and Modular Loading
 */
const ClaudiaOS = {
    // 1. Platform Sniffer
    isAndroid: (typeof AndroidInterface !== 'undefined'),
    isWindows: (navigator.platform.toUpperCase().indexOf('WIN') !== -1),

    init: function() {
        console.log("Claudia OS Soul: Linked");
        
        // Apply mobile-specific UI fixes if on Android
        if (this.isAndroid) {
            document.body.style.userSelect = "none"; // Prevent text highlighting
            AndroidInterface.hydrateSystem(); // Sync essentials
        } else {
            console.log("Running in Desktop Browser Mode");
        }
    },

login: function(username, pin) {
        // Normalize input
        const user = username.trim().toLowerCase();
        const pass = pin.trim();

        // 1. Administrator Check (Don / 0415)
        if (user === "don" && pass === "0415") {
            if (this.isAndroid) AndroidInterface.showToast("ADMIN ACCESS GRANTED: Welcome Don.");
            localStorage.setItem('user_role', 'admin');
            this.proceed();
        } 
        // 2. Open Access Check (Any name, no pin)
        else if (user !== "" && pass === "") {
            if (this.isAndroid) AndroidInterface.showToast("GUEST ACCESS: Welcome " + username);
            localStorage.setItem('user_role', 'guest');
            this.proceed();
        } 
        // 3. Rejection
        else {
            alert("ACCESS DENIED: Enter a name and leave PIN blank for Guest, or use Admin credentials.");
        }
    },

    proceed: function() {
        const hasOnboarded = localStorage.getItem('onboarding_complete');
        if (hasOnboarded === 'true') {
            this.navigate("desktop.html");
        } else {
            this.navigate("onboarding.html");
        }
    },
    // 3. Smart Navigation (Bridge vs. Browser)
    navigate: function(targetPage) {
        console.log("Navigating to: " + targetPage);
        
        if (this.isAndroid) {
            // Tell the Kotlin Muscle to sync the page from GitHub before opening
            AndroidInterface.syncAndNavigate(targetPage);
        } else {
            // Standard Windows browser redirect
            window.location.href = targetPage;
        }
    },

    // 4. On-Demand App Installer
    launchApp: function(appId, appPath) {
        if (this.isAndroid) {
            // This triggers the "Check if downloaded, if not pull from GitHub" logic
            AndroidInterface.checkAndDownloadApp(appId, appPath);
        } else {
            window.location.href = appPath;
        }
    }
};

// Initialize the OS
ClaudiaOS.init();