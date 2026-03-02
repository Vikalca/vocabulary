const loadModules = () => {
  try {
    const savedModules = localStorage.getItem("modules");
    return savedModules ? JSON.parse(savedModules) : null;
  } catch (e) {
    console.error("Failed to load modules from localStorage:", e);
    return null;
  }
};

const saveModules = (mods) => {
  try {
    localStorage.setItem("modules", JSON.stringify(mods));
  } catch (e) {
    console.error("Failed to save modules to localStorage:", e);
  }
};

export { loadModules, saveModules };
