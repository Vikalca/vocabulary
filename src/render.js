import state from "./state.js";
import renderLibrary from "./views/library.js";
import renderStudy from "./views/study.js";
import renderCreate from "./views/create.js";
// import renderLearn from "./views/learn.js";

function setVisible(view) {
  const containers = {
    library: document.querySelector(".library-container"),
    study: document.querySelector(".study-container"),
    create: document.querySelector(".create-container"),
    learn: document.querySelector(".learn-container"),
  };

  Object.entries(containers).forEach(([key, el]) => {
    if (!el) return;
    el.style.display = key === view ? "block" : "none";
  });

  const nav = document.querySelector("nav.app-nav");
  if (nav) {
    nav
      .querySelectorAll("button")
      .forEach((btn) => btn.classList.remove("active"));
    const activeBtn =
      view === "library"
        ? nav.querySelector("#library-btn")
        : view === "study"
          ? nav.querySelector("#study-btn")
          : view === "create"
            ? nav.querySelector("#create-btn")
            : null;
    activeBtn?.classList.add("active");
  }
}

function render() {
  setVisible(state.currentView);

  if (state.currentView === "library") renderLibrary();
  if (state.currentView === "study") renderStudy();
  if (state.currentView === "create") renderCreate();
  // if (state.currentView === "learn") renderLearn();
}

export default render;
