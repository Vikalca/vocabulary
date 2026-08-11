import store from "../store.js";
import { escapeHtml } from "../escapeHTML.js";

const renderModal = () => {
  const modal = document.getElementById("modal-root");
  if (!modal) return;

  const state = store.getState();

  if (!state.modal.isOpen) {
    modal.innerHTML = "";
    return;
  }

  const { type, payload } = state.modal;

  if (type === "CONFIRM_ACTION" && payload) {
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <h2>${escapeHtml(payload.title)}</h2>
                <p>${escapeHtml(payload.message)}</p>
                <div class="modal-actions">
                    <button class="btn btn-cancel">Cancel</button>
                    <button class="btn btn-confirm">Yes</button>
                </div>
            </div>
        </div>`;

    const cancelBtn = modal.querySelector(".btn-cancel");
    const confirmBtn = modal.querySelector(".btn-confirm");
    const overlay = modal.querySelector(".modal-overlay");

    cancelBtn.addEventListener("click", () => {
      store.closeModal();
    });

    confirmBtn.addEventListener("click", () => {
      store.confirmModalAction();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        store.closeModal();
      }
    });
  }
};

export default renderModal;
