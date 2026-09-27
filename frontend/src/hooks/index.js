import { useState, useEffect, useRef } from 'react';

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
  const initialValueRef = useRef(initialValue);
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  useEffect(() => {
    const syncValue = () => {
      try {
        const item = localStorage.getItem(key);
        setStored(item ? JSON.parse(item) : initialValueRef.current);
      } catch { setStored(initialValueRef.current); }
    };
    const syncAcrossTabs = (event) => {
      if (event.key === key) syncValue();
    };

    window.addEventListener(`voyago:storage:${key}`, syncValue);
    window.addEventListener('storage', syncAcrossTabs);
    return () => {
      window.removeEventListener(`voyago:storage:${key}`, syncValue);
      window.removeEventListener('storage', syncAcrossTabs);
    };
  }, [key]);

  const setValue = (value) => {
    let current = initialValueRef.current;
    try {
      const item = localStorage.getItem(key);
      current = item ? JSON.parse(item) : initialValueRef.current;
    } catch { /* Keep the initial value when storage is unavailable. */ }

    const val = value instanceof Function ? value(current) : value;
    localStorage.setItem(key, JSON.stringify(val));
    setStored(val);
    window.dispatchEvent(new Event(`voyago:storage:${key}`));
  };
  return [stored, setValue];
};

/**
 * useWishlist – manage wishlist ids in localStorage.
 */
export const useWishlist = () => {
  const [wishlist, setWishlist] = useLocalStorage('voyago_wishlist', []);
  const normalizeId = (id) => String(id);

  const isWishlisted = (id) => wishlist.some((item) => normalizeId(item) === normalizeId(id));

  const toggleWishlist = (id) => {
    const normalizedId = normalizeId(id);
    setWishlist((prev) => {
      const safePrev = Array.isArray(prev) ? prev.map((item) => String(item)) : [];
      return safePrev.includes(normalizedId)
        ? safePrev.filter((x) => x !== normalizedId)
        : [...safePrev, normalizedId];
    });
  };

  return { wishlist: Array.isArray(wishlist) ? wishlist.map(String) : [], isWishlisted, toggleWishlist };
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
