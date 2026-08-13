import type { MealSummary } from "@/lib/recipes/api";

const FAVORITES_KEY = "flavornet-favorites";

export function getFavorites(): MealSummary[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(FAVORITES_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as MealSummary[];
  } catch (error) {
    console.error("Failed to load favorites:", error);
    return [];
  }
}

export function isFavorite(idMeal: string): boolean {
  return getFavorites().some((meal) => meal.idMeal === idMeal);
}

export function addFavorite(meal: MealSummary): void {
  const favorites = getFavorites();

  if (favorites.some((item) => item.idMeal === meal.idMeal)) {
    return;
  }

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify([...favorites, meal])
  );
}

export function removeFavorite(idMeal: string): void {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter(
    (meal) => meal.idMeal !== idMeal
  );

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(updatedFavorites)
  );
}