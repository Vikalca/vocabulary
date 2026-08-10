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

  if (type === "CONFIRM_DELETE" && payload) {
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <h2>Delete module</h2>
                <p>Are you sure you want to delete module "${escapeHtml(payload.title)}"?</p>
                <div class="modal-actions">
                    <button class="btn btn-cancel">Cancel</button>
                    <button class="btn btn-delete">Delete</button>
                </div>
            </div>
        </div>`;
  }

  const cancelBtn = document.querySelector(".btn-cancel");
  const deleteBtn = document.querySelector(".btn-delete");
  const overlay = document.querySelector(".modal-overlay");

  cancelBtn.addEventListener("click", () => {
    store.closeModal();
  });

  deleteBtn.addEventListener("click", () => {
    store.deleteModule(payload.id);
    store.closeModal();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      store.closeModal();
    }
  });
};

escapeHtml();
export default renderModal;
