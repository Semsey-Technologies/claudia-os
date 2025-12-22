/**
 * CLAUDIA OS - Desktop & App Manager
 * Handles the main UI after login/onboarding
 */
const MAIN = {
    init() {
        console.log("DESKTOP: Initializing System Hub...");
        this.renderDesktop();
        this.checkPermissions();
    },

    renderDesktop() {
        const desktop = document.getElementById("home-screen");
        if (!desktop) return;

        // Retrieve user data saved during onboarding/login
        const handle = localStorage.getItem('claudia_user_handle') || 'GUEST';
        const role = localStorage.getItem('user_role') || 'guest';

        desktop.innerHTML = `
            <div class="desktop-header">
                <div class="user-info">
                    <span class="status-dot"></span>
                    <span class="handle">${handle}</span>
                    <span class="role">[${role.toUpperCase()}]</span>
                </div>
                <div class="system-time" id="clock">00:00</div>
            </div>

            <div class="app-grid" id="app-grid">
                <div class="app-icon" onclick="ClaudiaOS.launchApp('messenger', 'apps/messenger/index.html')">
                    <div class="icon-box">MSG</div>
                    <span>Messenger</span>
                </div>
                
                <div class="app-icon" onclick="ClaudiaOS.launchApp('settings', 'sys/settings/settings.html')">
                    <div class="icon-box">SYS</div>
                    <span>Settings</span>
                </div>

                ${role === 'admin' ? `
                    <div class="app-icon admin-app" onclick="ClaudiaOS.launchApp('terminal', 'apps/terminal/index.html')">
                        <div class="icon-box" style="border-color:#FF0055; color:#FF0055;">ROOT</div>
                        <span>Terminal</span>
                    </div>
                ` : ''}
            </div>
        `;

        this.startClock();
    },

    startClock() {
        const update = () => {
            const now = new Date();
            const clock = document.getElementById('clock');
            if (clock) {
                clock.innerText = now.getHours().toString().padStart(2, '0') + ":" + 
                                  now.getMinutes().toString().padStart(2, '0');
            }
        };
        setInterval(update, 1000);
        update();
    },

    checkPermissions() {
        if (typeof AndroidInterface !== 'undefined') {
            const storage = AndroidInterface.hasStoragePermission();
            console.log("System Storage Integrity: " + (storage ? "VERIFIED" : "FAIL"));
        }
    }
};

// Start the desktop when the page loads
document.addEventListener("DOMContentLoaded", () => MAIN.init());