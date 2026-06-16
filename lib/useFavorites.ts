"use client";

import { useEffect, useMemo, useState } from "react";

const FAVORITES_STORAGE_KEY = "allure:favorites";

function persistFavoriteIds(favoriteIds: number[]) {
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  } catch {
    // Favorites should still update visually if browser storage is unavailable.
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) {
        setReady(true);
        return;
      }

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const ids = parsed
          .map((item) => Number(item))
          .filter((item) => Number.isInteger(item));
        setFavoriteIds(ids);
      }
    } catch {
      setFavoriteIds([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    persistFavoriteIds(favoriteIds);
  }, [favoriteIds, ready]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  function toggleFavorite(productId: number) {
    setFavoriteIds((prev) => {
      if (prev.includes(productId)) {
        const nextIds = prev.filter((id) => id !== productId);
        persistFavoriteIds(nextIds);
        return nextIds;
      }
      const nextIds = [...prev, productId];
      persistFavoriteIds(nextIds);
      return nextIds;
    });
  }

  function isFavorite(productId: number) {
    return favoriteSet.has(productId);
  }

  return {
    ready,
    favoriteIds,
    favoriteSet,
    toggleFavorite,
    isFavorite,
  };
}
