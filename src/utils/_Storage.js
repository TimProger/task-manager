export const _Storage = {
  set: (name, item) => {
    localStorage.setItem("u_" + name, JSON.stringify(item));
  },
  get: (name) => {
    const item = localStorage.getItem("u_" + name);

    if (item) {
      return JSON.parse(item);
    }
  },
  delete: (name) => {
    localStorage.removeItem("u_" + name);
  },
};