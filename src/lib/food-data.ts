import fs from "fs";
import path from "path";

export interface Restaurant {
  name: string;
  location: string;
}

export interface FoodEntry {
  id: number;
  name: string;
  nameEn: string;
  country: string;
  coverImage: string;
  ingredients: string[];
  description: string;
  restaurants: Restaurant[];
}

function parseFoodFile(filePath: string): FoodEntry {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  let id = 0;
  let name = "";
  let nameEn = "";
  let country = "";
  let imageName = "";
  let ingredients: string[] = [];
  let description = "";
  let restaurants: Restaurant[] = [];

  let currentSection: "none" | "ingredients" | "restaurants" = "none";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("- ")) {
      const value = trimmed.slice(2);
      if (currentSection === "ingredients") {
        ingredients.push(value);
      } else if (currentSection === "restaurants") {
        const parts = value.split(" | ");
        restaurants.push({
          name: parts[0].trim(),
          location: parts[1]?.trim() ?? "",
        });
      }
      continue;
    }

    const colonIndex = trimmed.indexOf(": ");
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    const val = trimmed.slice(colonIndex + 2).trim();

    currentSection = "none";

    switch (key) {
      case "Id":
        id = parseInt(val, 10);
        break;
      case "Name":
        name = val;
        break;
      case "English Name":
        nameEn = val;
        break;
      case "Country":
        country = val;
        break;
      case "Ingredients":
        currentSection = "ingredients";
        break;
      case "Notes":
        description = val;
        break;
      case "Recommended Restaurants":
        currentSection = "restaurants";
        break;
      case "Image Name":
        imageName = val;
        break;
    }
  }

  return {
    id,
    name,
    nameEn,
    country,
    coverImage: `/images/food/${imageName}.jpg`,
    ingredients,
    description,
    restaurants,
  };
}

export function getFoodData(): FoodEntry[] {
  const docsDir = path.join(process.cwd(), "public/docs/food");

  if (!fs.existsSync(docsDir)) {
    return [];
  }

  const files = fs
    .readdirSync(docsDir)
    .filter((f) => f.startsWith("food") && f.endsWith(".txt"))
    .sort();

  return files.map((f) => parseFoodFile(path.join(docsDir, f)));
}
