/* static/onboarding/onboarding.js */

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

        localStorage.setItem('claudia_user_handle', handle);
        if(pinInput && pinInput.value.trim().length > 0) {
            localStorage.setItem('claudia_user_pin', pinInput.value.trim());
        }

        if (handle === "SEMSEY") {
            localStorage.setItem('claudia_user_role', 'ADMIN');
        } else {
            localStorage.setItem('claudia_user_role', 'USER');
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
                    <h2>${step.title}</h2>
                    <p>${step.content}</p>
                    <div style="display:flex; flex-direction:column; gap:15px; margin-top:20px;">
                        <button id="btn-perm-overlay" onclick="OB.askOverlay()" class="perm-btn"
                                style="border:1px solid #555; background:rgba(0,0,0,0.5); padding:15px; color:#aaa; text-align:left; cursor:pointer;">
                            [ ] ENABLE SYSTEM OVERLAY
                        </button>
                        <button id="btn-perm-storage" onclick="OB.askStorage()" class="perm-btn"
                                style="border:1px solid #555; background:rgba(0,0,0,0.5); padding:15px; color:#aaa; text-align:left; cursor:pointer;">
                            [ ] GRANT STORAGE ACCESS
                        </button>
                    </div>
                `;
                this.checkPermissionStatus();
            } else {
                container.innerHTML = `<h2>${step.title}</h2><p>${step.content}</p>`;
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
            } else {
                overlayBtn.innerHTML = "<b>[!] ENABLE SYSTEM OVERLAY</b>";
                overlayBtn.style.borderColor = "#FF0055";
                overlayBtn.style.color = "#FF0055";
            }
        }

        const storageBtn = document.getElementById('btn-perm-storage');
        if (storageBtn) {
            if (AndroidInterface.hasStoragePermission()) {
                storageBtn.innerHTML = "<b>[✓] STORAGE ACCESS GRANTED</b>";
                storageBtn.style.borderColor = "#00FFCC";
                storageBtn.style.color = "#00FFCC";
                storageBtn.disabled = true;
            } else {
                storageBtn.innerHTML = "<b>[!] GRANT STORAGE ACCESS</b>";
                storageBtn.style.borderColor = "#FF0055";
                storageBtn.style.color = "#FF0055";
            }
        }
    },

    askOverlay: function() {
        if (typeof AndroidInterface !== 'undefined') {
            AndroidInterface.requestOverlayPermission();
            setTimeout(() => this.checkPermissionStatus(), 1000);
            setTimeout(() => this.checkPermissionStatus(), 3000);
        }
    },

    askStorage: function() {
        if (typeof AndroidInterface !== 'undefined') {
            AndroidInterface.requestStoragePermission();
            setTimeout(() => this.checkPermissionStatus(), 2000);
        }
    },

    nextStep: function() {
        if (this.currentStep < this.steps.length - 1) {
            this.loadStep(this.currentStep + 1);
        } else {
            this.finishSetup();
        }
    },

    prevStep: function() {
        if (this.currentStep > 0) {
            this.loadStep(this.currentStep - 1);
        } else {
            document.getElementById('ob-wizard').classList.add('hidden');
            document.getElementById('ob-identity').classList.remove('hidden');
        }
    },

    skipStep: function() { this.nextStep(); },

    finishSetup: function() {
        console.log("Onboarding: Setup Complete.");
        localStorage.setItem('claudia_setup_complete', 'true');
        if (typeof OS !== 'undefined' && typeof OS.loadModule === 'function') {
            OS.loadModule('desktop');
        } else {
            window.location.reload();
        }
    },

    skipAll: function() {
        localStorage.setItem('claudia_setup_complete', 'true');
        localStorage.setItem('claudia_user_handle', 'GUEST');
        if (typeof OS !== 'undefined' && typeof OS.loadModule === 'function') {
            OS.loadModule('desktop');
        } else {
            window.location.reload();
        }
    }
};

(function initOnboarding() {
    setTimeout(() => {
        const splash = document.getElementById('ob-splash');
        const identity = document.getElementById('ob-identity');
        if (splash) splash.classList.add('hidden');
        if (identity) identity.classList.remove('hidden');
    }, 2500);
})();