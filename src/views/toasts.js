import { escapeHtml } from "../escapeHTML.js";
import store from "../store.js";

const renderToasts = () => {
  const container = document.getElementById("toast-root");
  if (!container) return;

  const { toasts } = store.getState();

  if (toasts.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = toasts
    .map(
      (toast) => `<div class="toast toast-${toast.type}" data-id="${toast.id}">
      ${escapeHtml(toast.message)}
      <button class="toast-close" data-id="${toast.id}">✖</button>
    </div>`,
    )
    .join("");

  container.querySelectorAll(".toast-close").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      store.removeToast(id);
    });
  });
};

export default renderToasts;
