import store from "./store.js";
import renderLibrary from "./views/library.js";
import renderStudy from "./views/study.js";
import renderCreate from "./views/create.js";
import renderModal from "./views/modal.js";
import renderToasts from "./views/toasts.js";

const render = (type) => {
  if (type === "toasts") return renderToasts();
  if (type === "modal") return renderModal();

  const { currentView } = store.getState();

  const containers = {
    library: document.querySelector(".library-container"),
    study: document.querySelector(".study-container"),
    create: document.querySelector(".create-container"),
  };

  Object.entries(containers).forEach(([key, el]) => {
    if (!el) return;
    el.style.display = key === currentView ? "block" : "none";
  });

  const nav = document.querySelector("nav.app-nav");
  if (nav) {
    nav
      .querySelectorAll("button")
      .forEach((btn) => btn.classList.remove("active"));
    const activeBtn = nav.querySelector(`#${currentView}-btn`);
    if (activeBtn) activeBtn.classList.add("active");
  }

  if (currentView === "library") renderLibrary();
  if (currentView === "create") renderCreate();
  if (currentView === "study") renderStudy();
  renderModal();
  renderToasts();
};

export default render;
