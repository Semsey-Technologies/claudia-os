/* static/drawer.js */

// State Tracking
let currentPlatform = 'unknown'; 
let activeTab = 'android';       

// --- 1. INITIALIZATION & SETTINGS ---
window.addEventListener('pywebviewready', function() {
    window.ClaudiaHost = window.pywebview.api;
    currentPlatform = 'windows';
});

// Load Settings on Start
document.addEventListener("DOMContentLoaded", () => {
    // Check Fullscreen Preference
    if (localStorage.getItem('claudia_fullscreen') === 'true') {
        updateToggle('tog-full', true);
        if(typeof ClaudiaHost !== 'undefined' && ClaudiaHost.setFullscreen) {
            ClaudiaHost.setFullscreen(true);
        }
    }
    // Check HUD Preference
    if (localStorage.getItem('claudia_hud') === 'true') {
        updateToggle('tog-hud', true);
        toggleHUD(true);
    }
    
    // Start Clock
    setInterval(updateHUDClock, 1000);
    updateHUDClock();
});


// --- 2. VIEW CONTROLLER ---
function toggleView(viewName) {
    const screens = ['desktop-view', 'drawer-view', 'settings-view'];
    
    // Hide all screens
    screens.forEach(s => document.getElementById(s).classList.add('hidden'));

    // Show target
    document.getElementById(viewName + '-view').classList.remove('hidden');

    if (viewName === 'drawer') {
        if(currentPlatform === 'windows') switchDrawerTab('windows');
        else switchDrawerTab('android');
    }
}


// --- 3. SETTINGS LOGIC ---
function toggleSetting(setting) {
    const key = 'claudia_' + setting;
    const currentState = localStorage.getItem(key) === 'true';
    const newState = !currentState;
    
    // Save
    localStorage.setItem(key, newState);
    
    // UI Update
    updateToggle('tog-' + setting, newState);
    
    // Action
    if (setting === 'fullscreen') {
        if(typeof ClaudiaHost !== 'undefined' && ClaudiaHost.setFullscreen) {
            ClaudiaHost.setFullscreen(newState);
        } else {
            alert("This feature requires the latest Android APK update.");
        }
    }
    
    if (setting === 'hud') {
        toggleHUD(newState);
    }
}

function updateToggle(id, isActive) {
    const el = document.getElementById(id);
    if(isActive) el.classList.add('active');
    else el.classList.remove('active');
}

function toggleHUD(show) {
    const barTop = document.getElementById('custom-status-bar');
    const barBot = document.getElementById('custom-nav-bar');
    
    if (show) {
        barTop.classList.remove('hidden');
        barBot.classList.remove('hidden');
        // Update battery immediately
        if(typeof ClaudiaHost !== 'undefined' && ClaudiaHost.getBatteryLevel) {
            document.getElementById('hud-batt').innerText = ClaudiaHost.getBatteryLevel() + "%";
        }
    } else {
        barTop.classList.add('hidden');
        barBot.classList.add('hidden');
    }
}

function updateHUDClock() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('hud-time').innerText = time;
}


// --- [KEEP YOUR EXISTING DRAWER/APP LOADING CODE BELOW THIS LINE] ---
// ... (switchDrawerTab, loadNativeApps, etc) ...