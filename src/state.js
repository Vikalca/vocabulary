const appState = {
  currentView: "library", // library | study | create
  selectedModule: null,
  currentIndex: 0,
  showAnswer: false,
  mode: "flashcard", // flashcard | learn
};
const state = { ...appState };

export default state;
