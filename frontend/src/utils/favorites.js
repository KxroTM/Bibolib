const FAVORITES_KEY = 'favorites_books_v1';
const MAX_FAVORITES = 500;

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error('Failed to read favorites from localStorage', e);
    return [];
  }
}

export function saveFavorites(arr) {
  try {
    const toSave = Array.isArray(arr) ? arr.slice(0, MAX_FAVORITES) : [];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(toSave));
    // notify other listeners in the same window
    try { window.dispatchEvent(new Event('favorites_updated')); } catch (e) {}
    return true;
  } catch (e) {
    console.error('Failed to save favorites to localStorage', e);
    return false;
  }
}

export function isFavorited(bookId) {
  if (bookId == null) return false;
  const arr = getFavorites();
  return arr.includes(Number(bookId));
}

export function toggleFavorite(bookId) {
  if (bookId == null) return false;
  const id = Number(bookId);
  const arr = getFavorites();
  const idx = arr.indexOf(id);
  let newArr;
  let nowFavorited = false;

  if (idx === -1) {
    // add
    if (arr.length >= MAX_FAVORITES) {
      // do not add beyond limit
      return { success: false, favorited: false, reason: 'limit' };
    }
    newArr = [...arr, id];
    nowFavorited = true;
  } else {
    // remove
    newArr = arr.filter(x => x !== id);
    nowFavorited = false;
  }

  const saved = saveFavorites(newArr);
  return { success: saved, favorited: nowFavorited };
}

export function clearFavorites() {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    try { window.dispatchEvent(new Event('favorites_updated')); } catch (e) {}
    return true;
  } catch (e) {
    console.error('Failed to clear favorites', e);
    return false;
  }
}

export default {
  getFavorites,
  saveFavorites,
  isFavorited,
  toggleFavorite,
  clearFavorites,
};
