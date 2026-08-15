import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe, type Meal } from "@/lib/recipes/api";
import FavoriteButton from "@/components/FavoriteButton";

type RecipePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getIngredients(recipe: Meal) {
  const ingredients: {
    ingredient: string;
    measure: string;
  }[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Meal];
    const measure = recipe[`strMeasure${i}` as keyof Meal];

    if (typeof ingredient === "string" && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: typeof measure === "string" ? measure.trim() : "",
      });
    }
  }

  return ingredients;
}

function getInstructions(instructions: string | null) {
  if (!instructions) {
    return [];
  }

  const text = instructions
    .replace(/\r/g, "\n")
    .replace(/\n+/g, "\n")
    .trim();

  const paragraphs = text
    .split("\n")
    .map((step) => step.trim())
    .filter(Boolean);

  if (paragraphs.length > 1) {
    return paragraphs;
  }

  return text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((step) => step.trim())
    .filter(Boolean);
}

export default async function RecipePage({
  params,
}: RecipePageProps) {
  const { id } = await params;

  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  const ingredients = getIngredients(recipe);
  const instructions = getInstructions(recipe.strInstructions);

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
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
              className="text-sm font-medium text-gray-600 transition hover:text-orange-600"
            >
              Favorites
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
          >
            <span aria-hidden="true">←</span>
            Back to recipes
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#fffaf5] px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Image */}
            <div className="overflow-hidden rounded-3xl bg-gray-100 shadow-sm">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>

            {/* Recipe information */}
            <div>
              <div className="flex flex-wrap gap-3">
                {recipe.strCategory && (
                  <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
                    {recipe.strCategory}
                  </span>
                )}

                {recipe.strArea && (
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-600 shadow-sm">
                    {recipe.strArea} cuisine
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {recipe.strMeal}
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
                A delicious{" "}
                {recipe.strCategory?.toLowerCase() || "recipe"}
                {recipe.strArea
                  ? ` inspired by ${recipe.strArea} cuisine`
                  : ""}
                .
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <FavoriteButton recipe={recipe} />

                <Link
                  href="/favorites"
                  className="inline-flex items-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-400 hover:bg-gray-50"
                >
                  View Favorites
                </Link>

                {recipe.strYoutube && (
                  <a
                    href={recipe.strYoutube}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-400 hover:bg-gray-50"
                  >
                    Watch video
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe content */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Ingredients */}
            <aside>
              <div className="sticky top-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
                  What you need
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                  Ingredients
                </h2>

                <div className="mt-7 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  {ingredients.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {ingredients.map((item, index) => (
                        <div
                          key={`${item.ingredient}-${index}`}
                          className="flex items-start justify-between gap-6 px-5 py-4"
                        >
                          <span className="font-medium text-gray-800">
                            {item.ingredient}
                          </span>

                          <span className="shrink-0 text-right text-sm text-gray-500">
                            {item.measure || "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="px-5 py-6 text-sm text-gray-500">
                      Ingredients are not available for this recipe.
                    </p>
                  )}
                </div>
              </div>
            </aside>

            {/* Instructions */}
            <article>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
                Let's cook
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Instructions
              </h2>

              <div className="mt-8 space-y-6">
                {instructions.length > 0 ? (
                  instructions.map((step, index) => (
                    <div
                      key={`${index}-${step.slice(0, 20)}`}
                      className="flex gap-5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                        {index + 1}
                      </div>

                      <div className="pt-1">
                        <p className="text-lg leading-8 text-gray-700">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                    <p className="text-gray-600">
                      Cooking instructions are not available for this recipe.
                    </p>
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            Keep exploring
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Hungry for something else?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Discover more recipes and find your next favorite meal.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              Explore recipes
            </Link>

            <Link
              href="/favorites"
              className="rounded-full border border-gray-300 bg-white px-7 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
            >
              View favorites
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white px-6 py-8">
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
