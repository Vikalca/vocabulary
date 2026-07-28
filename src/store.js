class Store {
  #modules;
  #state;
  #listeners;

  constructor() {
    this.#modules = this.#hydrate();
    this.#state = {
      currentView: "library",
      selectedModule: null,
      currentIndex: 0,
      showAnswer: false,
      mode: "flashcard",
    };
    this.#listeners = new Set();
    const VIEWS = new Set(["library", "create", "study"]);
  }

  #hydrate() {
    try {
      const saved = localStorage.getItem("modules");
      if (!saved) return [];

      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse localStorage:", e);
      localStorage.removeItem("modules");
      return [];
    }
  }

  getModules() {
    return structuredClone(this.#modules);
  }

  getState() {
    return structuredClone(this.#state);
  }

  subscribe(callback) {
    this.#listeners.add(callback);

    return () => {
      this.#listeners.delete(callback);
    };
  }

  #notify() {
    this.#listeners.forEach((listener) => listener());
  }

  #persist() {
    localStorage.setItem("modules", JSON.stringify(this.#modules));
  }

  #resetStudyState(moduleId) {
    this.#state.selectedModule = moduleId ?? null;
    this.#state.currentIndex = 0;
    this.#state.showAnswer = false;
  }

  setCurrentView(view) {
    if (!VIEWS.has(view)) {
      throw new Error(`Unknown view: ${view}`);
    }
    this.#state.currentView = view;
    this.#notify();
  }

  selectModule(id) {
    this.#resetStudyState(id);
    this.#notify();
  }

  deleteModule(id) {
    const idx = this.#modules.findIndex((m) => m.id === id);
    if (idx === -1) return false;

    this.#modules.splice(idx, 1);
    this.#persist();

    if (this.#state.selectedModule === id) {
      this.#resetStudyState(this.#modules[0]?.id);
    }

    this.#notify();
    return true;
  }

  addModule(payload) {
    const payloadID = crypto.randomUUID();
    const newModule = {
      id: payloadID,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    this.#modules.push(newModule);

    this.#persist();
    this.#resetStudyState(newModule.id);
    this.#notify();
  }
  flipCard() {
    this.#state.showAnswer = !this.#state.showAnswer;
    this.#notify();
  }

  nextCard() {
    this.#state.currentIndex++;
    this.#state.showAnswer = false;
    this.#notify();
  }

  prevCard() {
    if (this.#state.currentIndex > 0) {
      this.#state.currentIndex--;
    }
    this.#state.showAnswer = false;
    this.#notify();
  }
}

const store = new Store();

export default store;
