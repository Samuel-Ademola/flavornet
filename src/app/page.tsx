"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";


type Meal = {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strMealThumb: string;
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function searchRecipes(query: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/recipes?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();

      setMeals(data.meals ?? []);
    } catch (err) {
      console.error(err);
      setError("Unable to load recipes. Please try again.");
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchRecipes("");


  }, []);

  function handleSearch() {
    const query = searchQuery.trim();

    if (!query) {
      searchRecipes("chicken");
      return;
    }

    searchRecipes(query);

    document
      .getElementById("recipes")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function handlePopularSearch(query: string) {
    setSearchQuery(query);
    searchRecipes(query);

    document
      .getElementById("recipes")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSurpriseMe() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/recipes/random");

      if (!response.ok) {
        throw new Error("Failed to fetch random recipe");
      }

      const recipe = await response.json();

      if (!recipe?.idMeal) {
        throw new Error("No random recipe found");
      }

      window.location.href = `/recipes/${recipe.idMeal}`;
    } catch (err) {
      console.error(err);
      setError("Unable to load a random recipe. Please try again.");
      setLoading(false);
    }
  }


  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
<nav className="border-b border-gray-200 bg-white">
  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex min-h-16 items-center justify-between py-3 sm:min-h-20 sm:py-0">
      {/* Logo */}
      <Link
        href="/"
        className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl"
        onClick={() => {
          window.history.replaceState(null, "", "/");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        FlavorNet
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden items-center gap-8 md:flex">
        <a
          href="#recipes"
          className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          Recipes
        </a>

        <a
          href="#categories"
          className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          Categories
        </a>

        <a
          href="#about"
          className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          About
        </a>

        <Link
          href="/favorites"
          className="text-sm font-medium text-gray-600 transition hover:text-orange-600"
        >
          ♥ Favorites
        </Link>

        <a
          href="#recipes"
          className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Explore Recipes
        </a>
      </div>

      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
      >
        {menuOpen ? "✕" : "☰"}
      </button>
    </div>

    {/* Mobile Navigation */}
    {menuOpen && (
      <div className="border-t border-gray-100 py-4 md:hidden">
        <div className="flex flex-col gap-2">
          <a
            href="#recipes"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Recipes
          </a>

          <a
            href="#categories"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Categories
          </a>

          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            About
          </a>

          {/* Mobile Favorites */}
          <Link
            href="/favorites"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50"
          >
            Favorites
          </Link>

          <a
            href="#recipes"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full bg-gray-900 px-5 py-3 text-center text-sm font-medium text-white hover:bg-gray-700"
          >
            Explore Recipes
          </a>
        </div>
      </div>
    )}
  </div>
</nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#fffaf5]">
        <div className="mx-auto flex min-h-[560px] w-full max-w-7xl items-center px-4 py-14 sm:min-h-[620px] sm:px-6 sm:py-20 lg:min-h-[650px] lg:px-8">
          <div className="mx-auto w-full max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600 sm:mb-5 sm:text-sm sm:tracking-[0.2em]">
              Discover your next favorite meal
            </p>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Delicious recipes,
              <br />
              made for <span className="text-orange-600">real life.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl">
              Find simple, inspiring recipes for every craving, occasion, and
              skill level. Discover something delicious and make it your own.
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-3 sm:mt-10">
              <div className="flex flex-1 items-center rounded-full border border-gray-200 bg-white px-5 shadow-sm">
                <span className="mr-3 text-gray-400">⌕</span>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="Search recipes, ingredients, or dishes..."
                  className="w-full bg-transparent py-4 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>              <div className="grid w-full grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                  className="rounded-full bg-gray-900 px-7 py-4 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Searching..." : "Search Recipes"}
                </button>

                <button
                  type="button"
                  onClick={handleSurpriseMe}
                  disabled={loading}
                  className="rounded-full border border-gray-300 bg-white px-7 py-4 text-sm font-semibold text-gray-900 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  🎲 Surprise Me
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
              <span>Popular:</span>

              {["pasta", "chicken", "breakfast", "dessert"].map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => handlePopularSearch(query)}
                  className="rounded-full bg-white px-4 py-2 capitalize shadow-sm transition hover:shadow-md"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recipes */}
      <section id="recipes" className="border-t border-gray-100 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
                Fresh inspiration
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                {searchQuery
                  ? `Recipes for "${searchQuery}"`
                  : "Featured recipes"}
              </h2>

              <p className="mt-3 max-w-xl text-gray-600">
                Discover real recipes with ingredients, instructions, and
                beautiful food photography.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handlePopularSearch("chicken")}
              className="text-sm font-semibold text-gray-900 transition hover:text-gray-500"
            >
              Refresh recipes →
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="aspect-[4/3] animate-pulse bg-gray-200" />

                  <div className="space-y-3 p-6">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center">
              <h3 className="break-words text-lg font-semibold text-gray-900 sm:text-xl">
                Something went wrong
              </h3>

              <p className="mt-2 text-gray-600">{error}</p>

              <button
                type="button"
                onClick={() => searchRecipes(searchQuery || "chicken")}
                className="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && meals.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-12 text-center">
              <h3 className="break-words text-lg font-semibold text-gray-900 sm:text-xl">
                No recipes found
              </h3>

              <p className="mt-2 text-gray-500">
                Try searching for pasta, chicken, rice, beef, dessert, or
                another dish.
              </p>
            </div>
          )}

          {/* Recipe Cards */}
          {!loading && !error && meals.length > 0 && (
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <Link
                  key={meal.idMeal}
                  href={`/recipes/${meal.idMeal}`}
                  className="group relative block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Favorite Button */}
                  <FavoriteButton
                    recipe={meal}
                    compact
                    onToggle={() => {}}
                  />

                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-600">
                      {meal.strCategory || "Recipe"}
                    </p>

                    <h3 className="break-words text-lg font-semibold text-gray-900 sm:text-xl">
                      {meal.strMeal}
                    </h3>

                    <p className="mt-3 text-sm text-gray-500">
                      {meal.strArea
                        ? `${meal.strArea} cuisine`
                        : "Delicious recipe"}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        View recipe
                      </span>

                      <span className="text-lg text-gray-400 transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
              Browse by category
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              What are you craving?
            </h2>

            <p className="mt-3 max-w-xl text-gray-600">
              Explore recipes based on what you're in the mood for.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              ["🍗", "Chicken", "chicken"],
              ["🥗", "Healthy", "healthy"],
              ["🥞", "Breakfast", "breakfast"],
              ["🍰", "Desserts", "dessert"],
              ["🍝", "Pasta", "pasta"],
            ].map(([emoji, title, query]) => (
              <button
                key={title}
                type="button"
                onClick={() => handlePopularSearch(query)}
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 text-4xl">{emoji}</div>

                <h3 className="font-semibold text-gray-900">{title}</h3>

                <p className="mt-1 text-xs text-gray-500">
                  Explore recipes
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
                Why FlavorNet
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Good food shouldn't feel complicated.
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                FlavorNet helps you discover recipes that fit real life.
                Whether you're cooking a quick weeknight dinner, trying
                something new, or preparing a meal for people you love,
                we've got something for you.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
                alt="Person preparing a meal in a kitchen"
                className="h-[450px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <Link
                href="/"
                className="text-xl font-bold tracking-tight text-gray-900"
              >
                FlavorNet
              </Link>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Discover. Cook. Enjoy.
                <br />
                Simple recipes for real life.
              </p>
            </div>

            <div className="flex gap-12">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Explore
                </h3>

                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href="#recipes"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Recipes
                  </a>

                  <a
                    href="#categories"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Categories
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  FlavorNet
                </h3>

                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href="#about"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    About
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} FlavorNet. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
















