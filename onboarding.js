/**
 * CLAUDIA OS - Onboarding Logic
 * Handles User Identity and System Permissions
 */
console.log("ONBOARDING: Module Loaded");

const OB = {
    currentStep: 0,
    steps: [
        {
            title: "SYSTEM CHECK",
            content: "Verifying hardware integrity...<br>Memory: OK<br>Storage: OK<br>Neural Link: CALIBRATING..."
        },
        {
            title: "NETWORK",
            content: "Establishing secure uplink to CLAUDIA.NET...<br>Proxy: HIDDEN<br>Encryption: AES-256"
        },
        {
            id: "permissions",
            title: "SYSTEM PERMISSIONS",
            content: "Claudia.OS requires low-level system access to function as a shell."
        },
        {
            title: "COMPLETE",
            content: "Initialization successful.<br>Welcome to Claudia OS."
        }
    ],

    nextIdentity: function() {
        const nameInput = document.getElementById('ob-name');
        const pinInput = document.getElementById('ob-pin');

        if (!nameInput) return;

        const handle = nameInput.value.trim().toUpperCase();

        if (handle.length < 2) {
            alert("ERROR: HANDLE INVALID. MIN LENGTH 2.");
            return;
        }

        // Save to LocalStorage for use in Desktop.html
        localStorage.setItem('claudia_user_handle', handle);
        
        if(pinInput && pinInput.value.trim().length > 0) {
            localStorage.setItem('claudia_user_pin', pinInput.value.trim());
        }

        // Admin Detection (Syncs with your os_core logic)
        if (handle === "SEMSEY" || handle === "DON") {
            localStorage.setItem('user_role', 'admin');
        } else {
            localStorage.setItem('user_role', 'user');
        }

        document.getElementById('ob-identity').classList.add('hidden');
        document.getElementById('ob-wizard').classList.remove('hidden');
        this.loadStep(0);
    },

    loadStep: function(index) {
        this.currentStep = index;
        const container = document.getElementById('ob-step-container');
        const step = this.steps[index];

        if (container) {
            if (step.id === "permissions") {
                container.innerHTML = `
                    <h2 style="color:#00FFCC;">${step.title}</h2>
                    <p>${step.content}</p>
                    <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
                        <button id="btn-perm-overlay" onclick="OB.askOverlay()" 
                                style="border:1px solid #555; background:rgba(0,0,0,0.5); padding:12px; color:#aaa; text-align:left; cursor:pointer;">
                            [ ] ENABLE SYSTEM OVERLAY
                        </button>
                        <button id="btn-perm-storage" onclick="OB.askStorage()" 
                                style="border:1px solid #555; background:rgba(0,0,0,0.5); padding:12px; color:#aaa; text-align:left; cursor:pointer;">
                            [ ] GRANT STORAGE ACCESS
                        </button>
                    </div>
                `;
                this.checkPermissionStatus();
            } else {
                container.innerHTML = `<h2 style="color:#00FFCC;">${step.title}</h2><p>${step.content}</p>`;
            }
        }

        const nextBtn = document.getElementById('ob-next');
        const skipBtn = document.getElementById('ob-skip-step');

        if (nextBtn) {
            if (index === this.steps.length - 1) {
                nextBtn.innerText = "LAUNCH SYSTEM";
                nextBtn.onclick = () => this.finishSetup();
                if(skipBtn) skipBtn.style.visibility = "hidden";
            } else {
                nextBtn.innerText = "NEXT ►";
                nextBtn.onclick = () => this.nextStep();
                if(skipBtn) skipBtn.style.visibility = "visible";
            }
        }
    },

    checkPermissionStatus: function() {
        if (typeof AndroidInterface === 'undefined') return;

        const overlayBtn = document.getElementById('btn-perm-overlay');
        if (overlayBtn) {
            if (AndroidInterface.hasOverlayPermission()) {
                overlayBtn.innerHTML = "<b>[✓] SYSTEM OVERLAY GRANTED</b>";
                overlayBtn.style.borderColor = "#00FFCC";
                overlayBtn.style.color = "#00FFCC";
                overlayBtn.disabled = true;
            }
        }

        const storageBtn = document.getElementById('btn-perm-storage');
        if (storageBtn) {
            if (AndroidInterface.hasStoragePermission()) {
                storageBtn.innerHTML = "<b>[✓] STORAGE ACCESS GRANTED</b>";
                storageBtn.style.borderColor = "#00FFCC";
                storageBtn.style.color = "#00FFCC";
                storageBtn.disabled = true;
            }
        }
    },

    askOverlay: function() {
        if (typeof AndroidInterface !== 'undefined') {
            AndroidInterface.requestOverlayPermission();
            setTimeout(() => this.checkPermissionStatus(), 1500);
        }
    },

    askStorage: function() {
        if (typeof AndroidInterface !== 'undefined') {
            AndroidInterface.requestStoragePermission();
            setTimeout(() => this.checkPermissionStatus(), 1500);
        }
    },

    nextStep: function() {
        if (this.currentStep < this.steps.length - 1) {
            this.loadStep(this.currentStep + 1);
        } else {
            this.finishSetup();
        }
    },

    finishSetup: function() {
        console.log("Onboarding: Finalizing...");
        localStorage.setItem('onboarding_complete', 'true');
        
        // Use the Centralized Navigator from os_core.js
        if (typeof ClaudiaOS !== 'undefined') {
            ClaudiaOS.navigate("desktop.html");
        } else {
            window.location.href = "desktop.html";
        }
    },

    skipAll: function() {
        localStorage.setItem('onboarding_complete', 'true');
        localStorage.setItem('claudia_user_handle', 'GUEST');
        
        if (typeof ClaudiaOS !== 'undefined') {
            ClaudiaOS.navigate("desktop.html");
        } else {
            window.location.href = "desktop.html";
        }
    }
};

// Initial Splash Timeout
(function initOnboarding() {
    setTimeout(() => {
        const splash = document.getElementById('ob-splash');
        const identity = document.getElementById('ob-identity');
        if (splash) splash.style.display = 'none';
        if (identity) identity.style.display = 'block';
    }, 2500);
})();