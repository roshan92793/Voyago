import { useState, useEffect } from 'react';

/**
 * useDebounce – delays updating the value until `delay` ms pass without changes.
 */
export const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

/**
 * useLocalStorage – synced localStorage state.
 */
export const useLocalStorage = (key, initialValue) => {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });
  const setValue = (value) => {
    const val = value instanceof Function ? value(stored) : value;
    setStored(val);
    localStorage.setItem(key, JSON.stringify(val));
  };
  return [stored, setValue];
};

/**
 * useWishlist – manage wishlist ids in localStorage.
 */
export const useWishlist = () => {
  const [wishlist, setWishlist] = useLocalStorage('voyago_wishlist', []);
  const isWishlisted = (id) => wishlist.includes(id);
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  return { wishlist, isWishlisted, toggleWishlist };
};

/**
 * useScrollPosition – returns current scroll Y.
 */
export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handle = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);
  return scrollY;
};

/**
 * useMediaQuery
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
};
