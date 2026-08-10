import store from "../store.js";
import { escapeHtml } from "../escapeHTML.js";

const renderCreate = () => {
  const createContainer = document.querySelector(".create-container");
  if (!createContainer) return;

  createContainer.innerHTML = `
    <h2>Create New Vocabulary Module</h2>
    <form id="create-form" class="create-form" autocomplete="off">
      <input type="text" id="module-title" placeholder="Module Title" required />

      <div class="card-inputs">
        <input type="text" id="card-question" placeholder="Card Question" required />
        <input type="text" id="card-answer" placeholder="Card Answer" required />
      </div>
      
      <div class="row actions">
        <button type="button" class="primary" id="add-card">Add Card</button>
        <button type="button" id="save-module">Save Module</button>
        <button type="button" class="ghost" id="reset-draft">Reset</button>
      </div>

      <p class="muted">* After adding cards, click "Save Module" to save your new vocabulary module.</p>
      
      <ul class="draft-list" id="draft-list"></ul>
    </form>
  `;

  let draftCards = [];

  const form = document.getElementById("create-form");
  const titleInput = document.getElementById("module-title");
  const questionInput = document.getElementById("card-question");
  const answerInput = document.getElementById("card-answer");
  const draftList = document.getElementById("draft-list");
  const saveBtn = document.getElementById("save-module");
  const resetBtn = document.getElementById("reset-draft");

  const renderDraft = () => {
    if (draftCards.length === 0) {
      draftList.innerHTML = "<p class='muted'>No cards added yet.</p>";
      return;
    }
    draftList.innerHTML = draftCards
      .map(
        (card, index) => `
        <li class="draft-item">
          <div class="draft-text"> 
            <strong>${index + 1} ${escapeHtml(card.question)}</strong> 
            <div class="muted"> ${escapeHtml(card.answer)} </div>
          </div>
        <button type="button" class="ghost small" data-index="${index}">✖</button>
      </li>`,
      )
      .join("");
    draftList.querySelectorAll("button[data-index]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"), 10);
        draftCards.splice(index, 1);
        renderDraft();
      });
    });
  };

  form.addEventListener("click", (e) => {
    if (e.target.id !== "add-card") return;
    e.preventDefault();
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    if (!question || !answer) return;

    draftCards.push({ id: crypto.randomUUID(), question, answer });
    renderDraft();

    questionInput.value = "";
    answerInput.value = "";
    questionInput.focus();
  });

  saveBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    if (!title) {
      store.addToast("Please enter a module title.", "error");
      titleInput.focus();
      return;
    }
    if (draftCards.length === 0) {
      store.addToast(
        "Please add at least one card to save the module.",
        "error",
      );
      questionInput.focus();
      return;
    }

    const newModule = {
      title,
      cards: draftCards,
    };

    store.addModule(newModule);
    store.addToast(`Module "${title}" successfully created!`, "success");
    store.setCurrentView("study");
  });

  resetBtn.addEventListener("click", () => {
    const confirmed = confirm(
      "Are you sure you want to reset the form? All unsaved data will be lost.",
    );
    if (!confirmed) return;
    draftCards = [];
    titleInput.value = "";
    questionInput.value = "";
    answerInput.value = "";
    renderDraft();
  });

  renderDraft();
};

export default renderCreate;
