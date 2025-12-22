/* static/drawer.js - v19 (Safe Mode & Swipe Fix) */



// Initialize safely

let currentPlatform = 'unknown'; 

let activeTab = 'android';       



// --- INITIALIZATION ---

// Detect Android immediately if possible

if (typeof ClaudiaHost !== 'undefined') {

    currentPlatform = 'android';

}



// Also wait for window load to be sure

window.addEventListener('load', () => {

    if (typeof ClaudiaHost !== 'undefined') {

        currentPlatform = 'android';

        console.log("Claudia Connected: Android Mode");

    } else {

        console.log("Claudia Connected: Server/PC Mode");

    }

});



// --- VIEW CONTROLLER (The brain of your navigation) ---

function toggleView(viewName) {

    console.log("Switching to view: " + viewName); // Debug log



    // 1. Hide all screens

    const screens = ['desktop-view', 'second-view', 'drawer-view', 'recents-view'];

    screens.forEach(s => {

        const el = document.getElementById(s);

        if(el) el.classList.add('hidden');

    });



    // 2. Close Notification Panel

    const notif = document.getElementById('notif-panel');

    if(notif) notif.classList.remove('open');



    // 3. Show the Target Screen

    const target = document.getElementById(viewName + '-view');

    if(target) {

        target.classList.remove('hidden');

    } else {

        console.error("View not found: " + viewName);

        return;

    }



    // 4. Specific Logic

    if (viewName === 'drawer') {

        // If we are on a phone, show Android apps by default

        if(currentPlatform === 'android') switchDrawerTab('android');

        else switchDrawerTab('windows');

    }

    if (viewName === 'recents') {

        renderRecents();

    }

}



// --- APP DRAWER LOGIC ---

function switchDrawerTab(targetTab) {

    activeTab = targetTab;

    

    // Update Tabs UI

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const btn = document.getElementById(`tab-${targetTab}`);

    if(btn) btn.classList.add('active');

    

    // Load Data

    if (targetTab === 'android' && currentPlatform === 'android') {

        loadNativeApps();

    } else {

        loadRemoteApps();

    }

}



function loadNativeApps() {

    const grid = document.getElementById('app-grid');

    if(!grid) return;

    

    // Retry if bridge isn't ready

    if (typeof ClaudiaHost === 'undefined') {

        grid.innerHTML = '<div style="padding:20px; text-align:center;">CONNECTING TO SYSTEM...</div>';

        setTimeout(loadNativeApps, 1000); 

        return;

    }



    try {

        const jsonString = ClaudiaHost.getAppList();

        if (!jsonString || jsonString === "[]") {

             grid.innerHTML = '<div style="padding:20px; text-align:center;">LOADING APPS...</div>';

             // Retry once

             setTimeout(() => {

                 const retry = ClaudiaHost.getAppList();

                 if(retry && retry !== "[]") renderGrid(JSON.parse(retry), true);

                 else grid.innerHTML = '<div style="padding:20px; text-align:center;">NO APPS FOUND.<br>CHECK PERMISSIONS.</div>';

             }, 1000);

             return;

        }

        renderGrid(JSON.parse(jsonString), true); 

    } catch (e) { 

        console.error(e);

        grid.innerHTML = '<div style="padding:20px; color:red;">ERROR LOADING DATA</div>';

    }

}



function loadRemoteApps() {

    const mockApps = [

        { name: "Terminal", package: "cmd" },

        { name: "Server Status", package: "ping" }

    ];

    renderGrid(mockApps, false);

}



function renderGrid(appList, isLocal) {

    const grid = document.getElementById('app-grid');

    if(!grid) return;

    grid.innerHTML = ''; 

    

    appList.forEach(app => {

        const div = document.createElement('div');

        div.className = 'app-item';

        div.innerText = app.name;

        if (!isLocal) div.style.borderColor = "#444"; 

        

        div.onclick = function() { 

            if (isLocal) { 

                ClaudiaHost.launchApp(app.package); 

            } else {

                alert("Command sent to server: " + app.package);

            }

        };

        grid.appendChild(div);

    });

}



// --- RECENTS LOGIC ---

function renderRecents() {

    const grid = document.getElementById('recents-grid');

    if(!grid) return;

    grid.innerHTML = '';



    if (typeof ClaudiaHost === 'undefined') {

        grid.innerHTML = '<div style="padding:20px;">CONNECTING...</div>';

        return;

    }



    // Check Kotlin Permission

    if (!ClaudiaHost.hasUsagePermission()) {

        grid.innerHTML = `

            <div style="grid-column: span 2; text-align: center; padding: 20px;">

                <div style="margin-bottom: 10px; color: var(--primary);">PERMISSION REQUIRED</div>

                <button onclick="ClaudiaHost.requestUsagePermission()" style="padding:10px;">GRANT ACCESS</button>

            </div>

        `;

        return;

    }



    try {

        const jsonString = ClaudiaHost.getRecentApps();

        const recents = JSON.parse(jsonString);



        if (recents.length === 0) {

            grid.innerHTML = '<div style="padding:20px; color:#555; text-align:center; grid-column: span 2;">NO RECENT ACTIVITY</div>';

            return;

        }



        recents.forEach(app => {

            const div = document.createElement('div');

            div.className = 'recent-card'; 

            div.innerHTML = `<div style="font-weight:bold; color:#00FFCC; margin-bottom:5px;">${app.name}</div><div style="font-size:10px; color:#666;">${app.package}</div>`;

            div.onclick = function() { ClaudiaHost.launchApp(app.package); };

            grid.appendChild(div);

        });

    } catch(e) {

        grid.innerHTML = '<div style="padding:20px; color:red;">ERROR READING RECENTS</div>';

    }

}



// --- SYSTEM BUTTONS ---

function triggerNativeRecents() { toggleView('recents'); }

function toggleNotifications() { 

    const panel = document.getElementById('notif-panel');

    if(panel) panel.classList.toggle('open');

}



function handleAndroidBack() {

    // 1. Close Notif

    const notif = document.getElementById('notif-panel');

    if (notif && notif.classList.contains('open')) {

        notif.classList.remove('open');

        return;

    }

    

    // 2. Go Home if on another screen

    const desktop = document.getElementById('desktop-view');

    if (desktop && desktop.classList.contains('hidden')) {

        toggleView('desktop');

    } else {

        // 3. Exit App

        if (typeof ClaudiaHost !== 'undefined' && ClaudiaHost.triggerDoubleBackExit) {

            ClaudiaHost.triggerDoubleBackExit();

        }

    }

}



// --- SWIPE LOGIC (Fixed) ---

let touchStartX = 0;

let touchEndX = 0;



document.addEventListener('touchstart', e => {

    touchStartX = e.changedTouches[0].screenX;

}, {passive: true});



document.addEventListener('touchend', e => {

    touchEndX = e.changedTouches[0].screenX;

    handleSwipe();

}, {passive: true});



function handleSwipe() {

    // Min swipe distance 50px

    if (touchEndX < touchStartX - 50) {

        // SWIPE LEFT -> Go to Data

        if (!document.getElementById('desktop-view').classList.contains('hidden')) {

            toggleView('second');

        }

    }

    if (touchEndX > touchStartX + 50) {

        // SWIPE RIGHT -> Go to Desktop

        if (!document.getElementById('second-view').classList.contains('hidden')) {

            toggleView('desktop');

        }

    }

}



// --- CLOCK & BATTERY ---

setInterval(() => {

    const t = document.getElementById('hud-time');

    if(t) t.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

}, 1000);



setInterval(() => {

    const b = document.getElementById('hud-batt');

    if(b && typeof ClaudiaHost !== 'undefined') b.innerText = ClaudiaHost.getBatteryLevel() + "%";

}, 5000);