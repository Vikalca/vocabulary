import render from "./render.js";
import router from "./router.js";
import state from "./state.js";
import { modules } from "./data.js";
import { loadModules } from "./storage.js";

const saved = loadModules();
if (saved && Array.isArray(saved)) {
  modules.length = 0;
  modules.push(...saved);
}

if (state.selectedModule == null && modules[0]) {
  state.selectedModule = modules[0].id;
}

const navigate = (view) => {
  state.currentView = view;
  render();
};

document.addEventListener("app:navigate", (e) => {
  const view = e?.detail?.view;
  if (typeof view === "string") navigate(view);
});

router(navigate);
render();
