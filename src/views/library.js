import store from "../store.js";
import deleteIcon from "../assets/icons/Delete.svg";
import { escapeHtml } from "../escapeHTML.js";

const renderLibrary = () => {
  const libraryContainer = document.querySelector(".library-container");
  if (!libraryContainer) return;

  const modules = store.getModules();
  const state = store.getState();

  const selectedId = state.selectedModule ?? modules[0]?.id ?? null;

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
      store.setCurrentView("create");
    });

  libraryContainer
    .querySelector(".module-list")
    ?.addEventListener("click", (e) => {
      const btn = e.target.closest(
        "button[data-action=delete], li.module-item[data-action=open]",
      );
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      if (!id) return;

      if (action === "open") {
        store.selectModule(id);
        store.setCurrentView("study");
        return;
      }

      if (action === "delete") {
        const moduleToDelete = modules.find((m) => m.id === id);
        if (!moduleToDelete) return;

        store.openModal("CONFIRM_DELETE", {
          id: moduleToDelete.id,
          title: moduleToDelete.title,
        });
      }
    });
};

export default renderLibrary;
