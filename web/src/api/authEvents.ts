// Barramento simples para comunicar eventos de auth sem depender do contexto React
const listeners: Array<() => void> = [];

export const authEvents = {
  onUnauthorized: (fn: () => void) => {
    listeners.push(fn);
    return () => {
      const i = listeners.indexOf(fn);
      if (i > -1) listeners.splice(i, 1);
    };
  },
  emit: () => listeners.forEach((fn) => fn()),
};