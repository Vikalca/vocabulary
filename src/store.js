class Store {
  #modules;
  #state;
  #listeners;
  static #ALLOWED_VIEWS = new Set(["library", "create", "study"]);

  constructor() {
    this.#modules = this.#hydrate();
    this.#state = {
      currentView: "library",
      selectedModule: null,
      currentIndex: 0,
      modal: {
        isOpen: false,
        type: null,
        payload: null,
      },
      toasts: [],
    };
    this.#listeners = new Set();
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
  }

  setCurrentView(view) {
    if (!Store.#ALLOWED_VIEWS.has(view)) {
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
  #getSelectedCardsCount() {
    const selectedId = this.#state.selectedModule;
    if (!selectedId) return 0;

    const activeModule = this.#modules.find((m) => m.id === selectedId);
    return activeModule?.cards?.length ?? 0;
  }
  nextCard() {
    const cardsCount = this.#getSelectedCardsCount();
    if (cardsCount === 0) return;

    this.#state.currentIndex = (this.#state.currentIndex + 1) % cardsCount;

    this.#notify();
  }

  prevCard() {
    const cardsCount = this.#getSelectedCardsCount();
    if (cardsCount === 0) return;

    this.#state.currentIndex =
      (this.#state.currentIndex - 1 + cardsCount) % cardsCount;

    this.#notify();
  }
  openModal(type, payload) {
    this.#state.modal.isOpen = true;
    this.#state.modal.type = type;
    this.#state.modal.payload = payload;

    this.#notify();
  }
  closeModal() {
    this.#state.modal.isOpen = false;
    this.#state.modal.type = null;
    this.#state.modal.payload = null;
    this.#notify();
  }
  addToast(message, type = "success") {
    const id = crypto.randomUUID();
    const newToast = {
      id,
      message,
      type,
    };
    this.#state.toasts.push(newToast);

    this.#notify();

    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  }

  removeToast(id) {
    this.#state.toasts = this.#state.toasts.filter((toast) => toast.id !== id);
    this.#notify();
  }
}

const store = new Store();

export default store;
