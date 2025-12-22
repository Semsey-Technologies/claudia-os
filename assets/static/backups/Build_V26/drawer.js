/* static/drawer.js */

// --- STATE TRACKING ---
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


// --- 3. TAB SWITCHING LOGIC ---
function switchDrawerTab(targetTab) {
    activeTab = targetTab;

    // Update UI
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${targetTab}`).classList.add('active');

    const grid = document.getElementById('app-grid');
    grid.innerHTML = '<div style="padding:20px; color:#555;">LOADING...</div>';

    if (targetTab === currentPlatform) loadNativeApps();
    else loadRemoteApps(targetTab);
}

// --- 4. APP LOADING ---
function loadNativeApps() {
    if (typeof ClaudiaHost === 'undefined') return;
    try {
        const jsonString = ClaudiaHost.getAppList();
        if (!jsonString) {
            document.getElementById('app-grid').innerHTML = "NO APPS FOUND";
            return;
        }
        const apps = JSON.parse(jsonString);
        renderGrid(apps, true); 
    } catch (e) { console.error(e); }
}

function loadRemoteApps(targetSystem) {
    // Placeholder Data
    const mockWindowsApps = [
        { name: "Chrome", package: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" },
        { name: "VS Code", package: "code" },
        { name: "Cyberpunk 2077", package: "steam://run/1091500" }
    ];
    const mockAndroidApps = [
        { name: "Camera", package: "com.android.camera" },
        { name: "Maps", package: "com.google.android.apps.maps" }
    ];
    const data = (targetSystem === 'windows') ? mockWindowsApps : mockAndroidApps;
    renderGrid(data, false); 
}

function renderGrid(appList, isLocal) {
    const grid = document.getElementById('app-grid');
    grid.innerHTML = ''; 
    appList.forEach(app => {
        const div = document.createElement('div');
        div.className = 'app-item';
        div.innerText = app.name;
        if (!isLocal) div.style.borderColor = "#444"; 
        div.onclick = function() { 
            if (isLocal) ClaudiaHost.launchApp(app.package); 
            else sendCommandToServer(activeTab, app.package); 
        };
        grid.appendChild(div);
    });
}

async function sendCommandToServer(targetDevice, payload) {
    alert(`COMMAND SENT TO ${targetDevice.toUpperCase()}:\nLaunch ${payload}`);
}


// --- 5. SETTINGS LOGIC ---
function toggleSetting(setting) {
    const key = 'claudia_' + setting;
    const currentState = localStorage.getItem(key) === 'true';
    const newState = !currentState;
    
    localStorage.setItem(key, newState);
    updateToggle('tog-' + setting, newState);
    
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

// --- 6. SYSTEM MENU LOGIC (GEAR ICON) ---
function toggleContextMenu() {
    // Since we now have a Settings Page, this button just redirects there
    toggleView('settings');
}

// --- 7. ANDROID BACK BUTTON HANDLER (CRITICAL!) ---
// This is called by MainActivity.kt when you press the physical back button
function handleAndroidBack() {
    const desktop = document.getElementById('desktop-view');
    
    // A: If we are NOT on the desktop (Drawer or Settings), go to Desktop
    if (desktop.classList.contains('hidden')) {
        toggleView('desktop');
    } 
    // B: If we ARE on Desktop already, tell Android to start the exit timer
    else {
        if (typeof ClaudiaHost !== 'undefined' && ClaudiaHost.triggerDoubleBackExit) {
            ClaudiaHost.triggerDoubleBackExit();
        } else {
             // Fallback if APK isn't updated yet
             console.log("APK not updated: triggerDoubleBackExit missing");
        }
    }
}