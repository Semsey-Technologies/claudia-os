/* static/settings.js - v2 (With Force Reload) */



// --- 1. INITIALIZE BRIDGE ---

window.addEventListener('pywebviewready', function() {

    window.ClaudiaHost = window.pywebview.api;

});



// --- 2. LOAD SAVED PREFERENCES ---

document.addEventListener("DOMContentLoaded", () => {

    // Check Fullscreen

    if (localStorage.getItem('claudia_fullscreen') === 'true') {

        updateToggle('tog-full', true);

    }

    // Check HUD

    if (localStorage.getItem('claudia_hud') === 'true') {

        updateToggle('tog-hud', true);

    }

});



// --- 3. TOGGLE LOGIC ---

function toggleSetting(setting) {

    const key = 'claudia_' + setting;

    const currentState = localStorage.getItem(key) === 'true';

    const newState = !currentState;

    

    localStorage.setItem(key, newState);

    updateToggle('tog-' + setting, newState);

    

    if (setting === 'fullscreen') {

        if(typeof ClaudiaHost !== 'undefined' && ClaudiaHost.setFullscreen) {

            ClaudiaHost.setFullscreen(newState);

        }

    }

}



function updateToggle(id, isActive) {

    const el = document.getElementById(id);

    if(isActive) el.classList.add('active');

    else el.classList.remove('active');

}



// --- 4. NEW: FORCE RELOAD LOGIC ---

function forceSystemReload() {

    const btn = document.getElementById('btn-reload');

    btn.innerText = "DOWNLOADING UPDATE...";

    

    // Add a random timestamp to the URL (v=123456789)

    // This forces the phone to ignore its cache and fetch the server files again.

    setTimeout(() => {

        window.location.href = 'index.html?v=' + Date.now();

    }, 500);

}



// --- 5. ANDROID BACK BUTTON SUPPORT ---

function handleAndroidBack() {

    window.location.href = 'index.html';

}