export const storage = {
  load() {
    try {
      const saved = localStorage.getItem("modules");
      if (!saved) return null;

      return JSON.parse(saved);
    } catch (e) {
      console.error("Storage load error:", e);
      return null;
    }
  },
  save(data) {
    try {
      localStorage.setItem("modules", JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Storage save error:", e);
      throw new Error("QUOTA_EXCEEDED");
    }
  },
};
