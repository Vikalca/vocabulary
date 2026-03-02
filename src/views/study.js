import { modules } from "../data.js";
import state from "../state.js";

const renderStudy = () => {
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
      document.dispatchEvent(
        new CustomEvent("app:navigate", { detail: { view: "library" } }),
      );
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
      document.dispatchEvent(
        new CustomEvent("app:navigate", { detail: { view: "library" } }),
      );
    });
    return;
  }

  if (state.currentIndex < 0) state.currentIndex = 0;
  if (state.currentIndex >= cards.length) state.currentIndex = 0;

  studyContainer.innerHTML = `
    <div class="study-header">
      <h2>Study Vocabulary</h2>
      <div class="study-sub">
        <span class="badge">${escapeHtml(selectedModule.title)}</span>
        <button class="ghost" id="back-library" type="button">Library</button>
      </div>
    </div>

    <div class="card-container">
      <div class="card" id="card" aria-label="Flashcard (click to flip)" role="button" tabindex="0">
        <div class="card-face card-front">
          <p class="card-text front-text"></p>
        </div>
        <div class="card-face card-back">
          <p class="card-text back-text"></p>
        </div>
      </div>
    </div>

    <div class="controls">
      <button type="button" id="prev"><</button>
      <span class="info" id="card-info"></span>
      <button type="button" id="next">></button>
    </div>
  `;

  studyContainer
    .querySelector("#back-library")
    .addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("app:navigate", { detail: { view: "library" } }),
      );
    });

  const frontText = document.querySelector(".front-text");
  const backText = document.querySelector(".back-text");
  const card = document.getElementById("card");
  const prev = document.getElementById("prev");
  const info = document.getElementById("card-info");
  const next = document.getElementById("next");

  const flip = () => {
    state.showAnswer = !state.showAnswer;
    showCard();
  };

  card.addEventListener("click", flip);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  });

  prev.addEventListener("click", () => {
    state.currentIndex = (state.currentIndex - 1 + cards.length) % cards.length;
    state.showAnswer = false;
    showCard();
  });

  next.addEventListener("click", () => {
    state.currentIndex = (state.currentIndex + 1) % cards.length;
    state.showAnswer = false;
    showCard();
  });

  showCard();

  function showCard() {
    const currentCard = cards[state.currentIndex];

    frontText.textContent = currentCard.question;
    backText.textContent = currentCard.answer;

    if (state.showAnswer) {
      card.classList.add("flip");
    } else {
      card.classList.remove("flip");
    }

    info.textContent = `${state.currentIndex + 1}/${cards.length}`;
  }
};

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default renderStudy;
