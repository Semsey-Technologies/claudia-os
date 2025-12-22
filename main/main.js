const MAIN = {
    showHome() {
        document.getElementById("home-screen").innerHTML = `
            <div class="home-welcome">Welcome to Claudia OS</div>
        `;
    }
};

document.addEventListener("DOMContentLoaded", MAIN.showHome);