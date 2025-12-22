/* static/nav/nav.js */
console.log("NAV: Module Loaded");

const ClaudiaNav = {

    goBack: function() {
        // Checks if running inside your Kotlin app
        if (typeof AndroidInterface !== 'undefined') {
            AndroidInterface.triggerBack();
        } else {
            console.log("Back clicked (Web Mode)");
        }
    },

    goHome: function() {
        if (typeof AndroidInterface !== 'undefined') {
            AndroidInterface.triggerHome();
        } else {
            console.log("Home clicked (Web Mode)");
        }
    },

    goRecents: function() {
        if (typeof AndroidInterface !== 'undefined') {
            AndroidInterface.triggerRecents();
        } else {
            console.log("Recents clicked (Web Mode)");
        }
    },

    toggleDrawer: function() {
        console.log("Drawer toggle clicked");
        // We will implement this next
    },

    openSettings: function() {
        console.log("Settings clicked");
    }
};