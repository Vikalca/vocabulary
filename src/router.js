import menuIcon from "./assets/icons/Menu.svg";
import libraryIcon from "./assets/icons/Library.svg";
import studyIcon from "./assets/icons/Study.svg";
import addIcon from "./assets/icons/Add.svg";
import settingsIcon from "./assets/icons/Settings.svg";
import whiteAddIcon from "./assets/icons/White-add.svg";
const router = (navigate) => {
  const app = document.getElementById("app");
  if (!app) return;

  const topbar = app.querySelector(".topbar");
  if (topbar) {
    topbar.innerHTML = `
      <button class="primary" id="go-create" type="button"><img src="${whiteAddIcon}" alt="Add"></button>
      <button class="settings-btn" type="button"><img src="${settingsIcon}" alt="Settings"></button>
    `;
    if (!topbar.dataset.bound) {
      topbar.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        if (btn.id === "go-create") navigate("create");
      });
      topbar.dataset.bound = "1";
    }
  }

  let nav = app.querySelector("nav.app-nav");
  if (!nav) {
    const sidebar = app.querySelector(".sidebar");
    if (sidebar) {
      sidebar.insertAdjacentHTML(
        "beforeend",
        `
          <nav class="app-nav">
          <button id="menu-btn"><img src="${menuIcon}" alt="Menu"/></button>
            <button id="library-btn"><img src="${libraryIcon}" alt="Library"></button>
            <button id="study-btn"><img src="${studyIcon}" alt="Study"></button>
            <button id="create-btn"><img src="${addIcon}" alt="Add"></button>
          </nav>
        `,
      );
      nav = sidebar.querySelector("nav.app-nav");
    }

    if (nav && !nav.dataset.bound) {
      nav.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        if (btn.id === "library-btn") navigate("library");
        if (btn.id === "study-btn") navigate("study");
        if (btn.id === "create-btn") navigate("create");
      });

      nav.dataset.bound = "1";
    }
  }
};

export default router;
