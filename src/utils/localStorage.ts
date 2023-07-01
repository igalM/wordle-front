export const getItem = (key: string) => localStorage.getItem(key);
export const setItem = <T,>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));
export const removeItem = (key: string) => localStorage.removeItem(key);