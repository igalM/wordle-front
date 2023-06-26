export default function useLocalStorage() {

    const getItem = (key: string) => localStorage.getItem(key);

    const setItem = <T,>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));

    const removeItem = (key: string) => localStorage.removeItem(key);

    return { getItem, setItem, removeItem };
}