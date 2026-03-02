import { modules } from "../data.js";
import state from "../state.js";
import { saveModules } from "../storage.js";
import deleteIcon from "../assets/icons/Delete.svg";

const renderLibrary = () => {
  const libraryContainer = document.querySelector(".library-container");
  if (!libraryContainer) return;

  const selectedId = state.selectedModule ?? modules[0]?.id ?? null;
  if (state.selectedModule == null && selectedId != null)
    state.selectedModule = selectedId;

  libraryContainer.innerHTML = `
    <h2>Your library</h2>

    ${
      modules.length
        ? `<ul class="module-list">
            ${modules
              .map(
                (m) => `
              <li class="module-item ${m.id === selectedId ? "selected" : ""}" data-id="${m.id}" role="button" tabindex="0" data-action="open">
                <div class="module-meta">
                  <div class="module-title">${escapeHtml(m.title)}</div>
                  <div class="module-sub">${m.cards.length} word(s)</div>
                </div>
                <div class="module-actions">
                  <button class="delete-module-btn" type="button" data-action="delete" data-id="${m.id}"><img src="${deleteIcon}" alt="Delete"></button>
                </div>
              </li>
            `,
              )
              .join("")}
          </ul>`
        : `<p class="muted">Your library is empty. Create your first set and start building your vocabulary.</p>`
    }
  `;

  libraryContainer
    .querySelector("#go-create")
    ?.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("app:navigate", { detail: { view: "create" } }),
      );
    });

  libraryContainer
    .querySelector(".module-list")
    ?.addEventListener("click", (e) => {
      const btn = e.target.closest(
        "button[data-action=delete], li.module-item[data-action=open]",
      );
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      const id = Number(btn.getAttribute("data-id"));
      if (!id) return;

      if (action === "open") {
        state.selectedModule = id;
        state.currentIndex = 0;
        state.showAnswer = false;
        document.dispatchEvent(
          new CustomEvent("app:navigate", { detail: { view: "study" } }),
        );
        return;
      }

      if (action === "delete") {
        const idx = modules.findIndex((m) => m.id === id);
        if (idx === -1) return;

        const ok = confirm(`Delete module "${modules[idx].title}"?`);
        if (!ok) return;

        modules.splice(idx, 1);
        saveModules(modules);

        if (state.selectedModule === id) {
          state.selectedModule = modules[0]?.id ?? null;
          state.currentIndex = 0;
          state.showAnswer = false;
        }

        renderLibrary();
      }
    });
};

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default renderLibrary;
