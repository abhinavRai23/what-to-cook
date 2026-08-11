export interface Recipe {
  id: string;
  name: string;
  description?: string;
  mealTypes: string[];
  categories: string[];
  seasons: string[];
  regions?: string[];
  vegetarian: boolean;
  difficulty?: "easy" | "medium" | "hard";
  source?: string[];
  userAdded: boolean;
}

export interface Category {
  id: string;
  name: string;
  userCreated?: boolean;
}

export interface Season {
  id: string;
  name: string;
}

export interface MealType {
  id: string;
  name: string;
}

export interface MealPlanItem {
  id: string;
  date: string; // ISO date string
  mealType: string; // breakfast, lunch, dinner
  recipeId: string;
}

export interface MenuHistory {
  [recipeId: string]: string[]; // array of ISO date strings when this was cooked
}
