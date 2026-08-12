const API_BASE = "https://www.themealdb.com/api/json/v1/1";

export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strMealThumb: string;
};

export type Meal = MealSummary & {
  strInstructions: string | null;
  strTags: string | null;
  strYoutube: string | null;

  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
};

type MealDbResponse<T> = {
  meals: T[] | null;
};

async function fetchMealDb<T>(endpoint: string): Promise<T[]> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`TheMealDB request failed: ${response.status}`);
  }

  const data: MealDbResponse<T> = await response.json();

  return data.meals ?? [];
}

export async function searchRecipes(
  search?: string
): Promise<MealSummary[]> {
  const query = search?.trim().toLowerCase();

  if (!query || query === "chicken") {
    return fetchMealDb<MealSummary>("/search.php?s=chicken");
  }

  if (query === "dessert" || query === "desserts") {
    return fetchMealDb<MealSummary>("/filter.php?c=Dessert");
  }

  if (query === "breakfast") {
    return fetchMealDb<MealSummary>("/filter.php?c=Breakfast");
  }

  if (query === "pasta") {
    return fetchMealDb<MealSummary>("/filter.php?c=Pasta");
  }

  if (query === "vegetarian" || query === "healthy") {
    return fetchMealDb<MealSummary>("/filter.php?c=Vegetarian");
  }

  return fetchMealDb<MealSummary>(
    `/search.php?s=${encodeURIComponent(query)}`
  );
}

export async function getRecipe(id: string): Promise<Meal | null> {
  const meals = await fetchMealDb<Meal>(
    `/lookup.php?i=${encodeURIComponent(id)}`
  );

  return meals[0] ?? null;
}
