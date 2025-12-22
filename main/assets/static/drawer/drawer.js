const DRAWER = {
    open() {
        document.getElementById("drawer-overlay").classList.remove("hidden");
        this.loadApps();
    },
    close() {
        document.getElementById("drawer-overlay").classList.add("hidden");
    },
    toggle() {
        const el = document.getElementById("drawer-overlay");
        el.classList.contains("hidden") ? this.open() : this.close();
    },
    loadApps() {
        const grid = document.getElementById("drawer-grid");
        grid.innerHTML = "";
        APP_LIST.forEach(app => {
            const item = document.createElement("div");
            item.className = "drawer-item";
            item.innerHTML = `<img src="${app.icon}"><div>${app.name}</div>`;
            item.onclick = () => APP.launch(app.id);
            grid.appendChild(item);
        });
    },
    filter() {
        const q = document.getElementById("drawer-search").value.toLowerCase();
        document.querySelectorAll(".drawer-item").forEach(item => {
            item.style.display = item.innerText.toLowerCase().includes(q) ? "" : "none";
        });
    }
};