"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getFavorites,
  removeFavorite,
} from "@/lib/favorites/storage";

type Meal = {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strMealThumb: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Meal[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function handleRemoveFavorite(idMeal: string) {
    removeFavorite(idMeal);

    setFavorites((current) =>
      current.filter((meal) => meal.idMeal !== idMeal)
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-20 items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              FlavorNet
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                Recipes
              </Link>

              <Link
                href="/favorites"
                className="text-sm font-semibold text-orange-600"
              >
                Favorites
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#fffaf5] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            Your collection
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Favorite recipes
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
            Keep the recipes you love in one place so they are always ready
            when you want to cook.
          </p>
        </div>
      </section>

      {/* Favorites */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {favorites.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-gray-50 px-6 py-16 text-center">
              <div className="text-5xl text-gray-400">♡</div>

              <h2 className="mt-5 text-2xl font-bold text-gray-900">
                No favorites yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-gray-500">
                When you find a recipe you love, tap the heart to save it
                here.
              </p>

              <Link
                href="/#recipes"
                className="mt-8 inline-flex rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Explore recipes
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {favorites.length}{" "}
                  {favorites.length === 1 ? "recipe" : "recipes"} saved
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.map((meal) => (
                  <div
                    key={meal.idMeal}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative">
                      <Link href={`/recipes/${meal.idMeal}`}>
                        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                          <img
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveFavorite(meal.idMeal)
                        }
                        aria-label={`Remove ${meal.strMeal} from favorites`}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl text-red-500 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
                      >
                        ♥
                      </button>
                    </div>

                    <div className="p-6">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-600">
                        {meal.strCategory || "Recipe"}
                      </p>

                      <Link href={`/recipes/${meal.idMeal}`}>
                        <h2 className="text-xl font-semibold text-gray-900 transition hover:text-orange-600">
                          {meal.strMeal}
                        </h2>
                      </Link>

                      <p className="mt-3 text-sm text-gray-500">
                        {meal.strArea
                          ? `${meal.strArea} cuisine`
                          : "Delicious recipe"}
                      </p>

                      <Link
                        href={`/recipes/${meal.idMeal}`}
                        className="mt-5 inline-flex text-sm font-semibold text-gray-900 transition hover:text-orange-600"
                      >
                        View recipe →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-gray-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} FlavorNet. All rights reserved.
          </p>

          <Link
            href="/"
            className="transition hover:text-gray-900"
          >
            FlavorNet
          </Link>
        </div>
      </footer>
    </main>
  );
}
