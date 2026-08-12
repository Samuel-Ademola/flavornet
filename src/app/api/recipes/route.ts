import { NextRequest, NextResponse } from "next/server";
import { searchRecipes } from "@/lib/recipes/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? undefined;

    const meals = await searchRecipes(search);

    return NextResponse.json({
      meals,
    });
  } catch (error) {
    console.error("Recipe API error:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch recipes",
      },
      {
        status: 500,
      }
    );
  }
}
