"use client";

import { useEffect, useState } from "react";
import {
  addFavorite,
  isFavorite,
  removeFavorite,
} from "@/lib/favorites/storage";
import type { MealSummary } from "@/lib/recipes/api";

type FavoriteButtonProps = {
  recipe: MealSummary;
  compact?: boolean;
  onToggle?: (favorite: boolean) => void;
};

export default function FavoriteButton({
  recipe,
  compact = false,
  onToggle,
}: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(recipe.idMeal));
  }, [recipe.idMeal]);

  function handleToggle() {
    const nextFavorite = !favorite;

    if (nextFavorite) {
      addFavorite(recipe);
    } else {
      removeFavorite(recipe.idMeal);
    }

    setFavorite(nextFavorite);
    onToggle?.(nextFavorite);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleToggle();
        }}
        aria-pressed={favorite}
        aria-label={
          favorite
            ? `Remove ${recipe.strMeal} from favorites`
            : `Add ${recipe.strMeal} to favorites`
        }
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl shadow-sm backdrop-blur transition hover:scale-105"
      >
        {favorite ? "♥" : "♡"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleToggle();
        }}
      aria-pressed={favorite}
      className={
        favorite
          ? "inline-flex items-center rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          : "inline-flex items-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
      }
    >
      <span className="mr-2 text-lg">
        {favorite ? "♥" : "♡"}
      </span>

      {favorite ? "Saved to Favorites" : "Save to Favorites"}
    </button>
  );
}


