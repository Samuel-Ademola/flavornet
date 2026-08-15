import { NextResponse } from "next/server";
import { getRandomRecipe } from "@/lib/recipes/api";

export async function GET() {
  try {
    const recipe = await getRandomRecipe();

    if (!recipe) {
      return NextResponse.json(
        { error: "No random recipe found" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Random recipe API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch random recipe" },
      { status: 500 }
    );
  }
}
