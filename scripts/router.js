function update() {
  const now = new Date();
  document.getElementById('date').textContent = now.toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', year: '2-digit' }).replaceAll('.', '-')
  document.getElementById('time').textContent = now.toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' })
}
update();
setInterval(update, 1000);

const routes = {
    "/": "./pages/profile/profile.html",
    "/about": "./pages/about/about.html",
    "/experience": "./pages/experience/experience.html",
    "/projects": "./pages/projects/projects.html",
    "/skills": "./pages/skills/skills.html",
    "/achievements": "./pages/achievements/achievements.html",
    "/education": "./pages/education/education.html",
    404: "./pages/page404/404.html"
};


const getPath = () => window.location.hash.slice(1) || "/";

const getNavLinks = () => [...document.querySelectorAll(".main-nav a")];

const handleLocation = async () => {
    const path = getPath();
    const route = routes[path] || routes[404];

    const links = getNavLinks();
    const activeLink = links.find((link) => link.hash === "#" + path);
    links.forEach((link) => link.classList.toggle("active", link === activeLink));
    document.getElementById("section-label").textContent = activeLink
        ? activeLink.querySelector(".nav-label").textContent.replace(/ \(.*\)$/, "")
        : "404";

    const html = await fetch(route).then((data) => data.text());
    
    if (getPath() !== path) return;
    document.getElementById("main").innerHTML = html;

    const page = document.querySelector("#main .page");
    document.getElementById("sys-msg").textContent = page ? page.dataset.sysMsg : "";
}

window.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    if (event.target.closest("input, textarea, select")) return;

    const links = getNavLinks();
    const current = links.findIndex((link) => link.hash === "#" + getPath());
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next = current === -1
        ? (step === 1 ? 0 : links.length - 1)
        : (current + step + links.length) % links.length;

    event.preventDefault();
    window.location.hash = links[next].hash;
});

window.addEventListener("hashchange", handleLocation);

handleLocation();
