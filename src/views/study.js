import store from "../store.js";
import { escapeHtml } from "../escapeHTML.js";

const renderStudy = () => {
  const modules = store.getModules();
  const state = store.getState();
  const studyContainer = document.querySelector(".study-container");
  if (!studyContainer) return;

  const selectedModule =
    modules.find((m) => m.id === state.selectedModule) ?? modules[0] ?? null;
  if (!selectedModule) {
    studyContainer.innerHTML = `
    <h2>Study Vocabulary</h2>
    <p>No module selected. Please select a module from the library.</p>
    <button type="button" class="primary" id="go-library">Back to Library</button>`;
    document.getElementById("go-library").addEventListener("click", () => {
      store.setCurrentView("library");
    });
    return;
  }

  const { cards } = selectedModule;

  if (cards.length === 0) {
    studyContainer.innerHTML = `
    <h2>Study Vocabulary</h2>
    <p>The selected module "${escapeHtml(selectedModule.title)}" has no cards. Please add cards to the module or select a different module.</p>
    <button type="button" class="primary" id="go-library">Back to Library</button>`;
    document.getElementById("go-library").addEventListener("click", () => {
      store.setCurrentView("library");
    });
    return;
  }

  if (state.currentIndex < 0) state.currentIndex = 0;
  if (state.currentIndex >= cards.length) state.currentIndex = 0;

  const currentCard = cards[state.currentIndex];

  studyContainer.innerHTML = `
    <div class="study-header">
      <h2>Study Vocabulary</h2>
      <div class="study-sub">
        <span class="badge">${escapeHtml(selectedModule.title)}</span>
        <button class="ghost" id="back-library" type="button">Library</button>
      </div>
    </div>

    <div class="card-container">
      <div class="card" id="card" role="button" aria-label="Flashcard (click to flip)" tabindex="0">
        <div class="card-face card-front">
          <p class="card-text front-text">${escapeHtml(currentCard.question)}</p>
        </div>
        <div class="card-face card-back">
          <p class="card-text back-text">${escapeHtml(currentCard.answer)}</p>
        </div>
      </div>
    </div>

    <div class="controls">
      <button type="button" id="prev"><</button>
      <span class="info" id="card-info">${state.currentIndex + 1}/${cards.length}</span>
      <button type="button" id="next">></button>
    </div>
  `;

  studyContainer
    .querySelector("#back-library")
    .addEventListener("click", () => {
      store.setCurrentView("library");
    });

  const card = document.getElementById("card");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");

  const handleFlip = () => {
    card.classList.toggle("flip");
  };

  card.addEventListener("click", handleFlip);

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  });
  prev.addEventListener("click", () => {
    store.prevCard();
    document.getElementById("card")?.focus();
  });

  next.addEventListener("click", () => {
    store.nextCard();
    document.getElementById("card")?.focus();
  });
};

export default renderStudy;
