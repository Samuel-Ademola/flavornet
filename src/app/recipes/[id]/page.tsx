import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe, type Meal } from "@/lib/recipes/api";

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

  return instructions
    .split(/\r?\n/)
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
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            FlavorNet
          </Link>

          <Link
            href="/#recipes"
            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            ← Back to recipes
          </Link>
        </div>
      </nav>

      <section className="bg-[#fffaf5] px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="overflow-hidden rounded-3xl bg-gray-100 shadow-sm">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="h-[360px] w-full object-cover sm:h-[480px]"
              />
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                {recipe.strCategory && (
                  <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-700">
                    {recipe.strCategory}
                  </span>
                )}

                {recipe.strArea && (
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                    {recipe.strArea} cuisine
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                {recipe.strMeal}
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                Discover how to prepare this delicious recipe with
                step-by-step instructions and a complete ingredient list.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#ingredients"
                  className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                >
                  View ingredients
                </a>

                {recipe.strYoutube && (
                  <a
                    href={recipe.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                  >
                    ▶ Watch video
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
            <aside id="ingredients">
              <div className="sticky top-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
                  What you'll need
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                  Ingredients
                </h2>

                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white">
                  {ingredients.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {ingredients.map((item, index) => (
                        <li
                          key={`${item.ingredient}-${index}`}
                          className="flex items-start justify-between gap-4 px-5 py-4"
                        >
                          <span className="font-medium text-gray-800">
                            {item.ingredient}
                          </span>

                          {item.measure && (
                            <span className="shrink-0 text-right text-sm text-gray-500">
                              {item.measure}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="p-5 text-sm text-gray-500">
                      Ingredients are not available for this recipe.
                    </p>
                  )}
                </div>
              </div>
            </aside>

            <div>
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
                      key={index}
                      className="flex gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                        {index + 1}
                      </div>

                      <p className="pt-1 text-base leading-7 text-gray-600">
                        {step}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-gray-50 p-6 text-gray-600">
                    Instructions are not available for this recipe.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {recipe.strYoutube && (
        <section className="bg-gray-50 px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
                Watch and cook
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Follow along with the video
              </h2>
            </div>

            <div className="aspect-video overflow-hidden rounded-3xl bg-gray-900 shadow-lg">
              <iframe
                src={recipe.strYoutube
                  .replace("watch?v=", "embed/")
                  .split("&")[0]}
                title={`${recipe.strMeal} cooking video`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gray-900 px-8 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to cook?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            Explore more recipes and find your next favorite meal.
          </p>

          <Link
            href="/#recipes"
            className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            Explore more recipes
          </Link>
        </div>
      </section>

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