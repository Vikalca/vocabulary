import { storage } from "./storage";

class Store {
  #modules;
  #state;
  #listeners;
  #currentModalCallback = null;
  static #ALLOWED_VIEWS = new Set(["library", "create", "study"]);

  constructor() {
    this.#modules = this.#hydrate();
    this.#state = {
      currentView: "library",
      selectedModule: this.#modules[0]?.id ?? null,
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

  #isValidModules(data) {
    if (!Array.isArray(data)) return false;

    return data.every((module) => {
      if (
        typeof module !== "object" ||
        module === null ||
        typeof module.id !== "string" ||
        typeof module.title !== "string" ||
        !Array.isArray(module.cards)
      ) {
        return false;
      }

      return module.cards.every(
        (card) =>
          typeof card === "object" &&
          card !== null &&
          typeof card.id === "string" &&
          typeof card.question === "string" &&
          typeof card.answer === "string",
      );
    });
  }

  #hydrate() {
    const parsedData = storage.load();
    if (!parsedData) return [];

    if (!this.#isValidModules(parsedData)) {
      console.warn("Invalid data structure in localStorage.");
      return [];
    }
    return parsedData;
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

  #notify(type) {
    this.#listeners.forEach((listener) => listener(type));
  }

  #persist() {
    try {
      storage.save(this.#modules);
    } catch (e) {
      this.addToast(
        "Failed to save data. Browser storage might be full.",
        "error",
      );
    }
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
    const exists = this.#modules.some((module) => module.id === id);

    if (!exists) return false;

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
    if (
      !payload ||
      typeof payload.title !== "string" ||
      !Array.isArray(payload.cards) ||
      payload.cards.length === 0
    ) {
      return false;
    }
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

    if (payload && payload.onConfirm) {
      this.#currentModalCallback = payload.onConfirm;
      const { onConfirm, ...safePayload } = payload;
      this.#state.modal.payload = safePayload;
    } else {
      this.#currentModalCallback = null;
      this.#state.modal.payload = payload;
    }

    this.#notify("modal");
  }
  confirmModalAction() {
    if (this.#currentModalCallback) {
      this.#currentModalCallback();
    }
    this.closeModal();
  }
  closeModal() {
    this.#state.modal.isOpen = false;
    this.#state.modal.type = null;
    this.#state.modal.payload = null;
    this.#currentModalCallback = null;
    this.#notify("modal");
  }
  addToast(message, type = "success") {
    const id = crypto.randomUUID();
    const newToast = {
      id,
      message,
      type,
    };
    this.#state.toasts.push(newToast);

    this.#notify("toasts");

    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  }

  removeToast(id) {
    this.#state.toasts = this.#state.toasts.filter((toast) => toast.id !== id);
    this.#notify("toasts");
  }
}

const store = new Store();

export default store;
