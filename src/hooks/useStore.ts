import { useState, useEffect } from 'react';
import type { Recipe, Category, MenuHistory, MealPlanItem } from '../types';
import defaultRecipes from '../data/recipes.json';
import defaultCategories from '../data/categories.json';

// Basic state management with localStorage
export function useStore() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [history, setHistory] = useState<MenuHistory>({});
  const [weeklyPlan, setWeeklyPlan] = useState<MealPlanItem[]>([]);

  useEffect(() => {
    // Load from local storage or use defaults
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    } else {
      setRecipes(defaultRecipes as Recipe[]);
    }

    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(defaultCategories as Category[]);
    }

    const storedHistory = localStorage.getItem('menuHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }

    const storedPlan = localStorage.getItem('weeklyPlan');
    if (storedPlan) {
      setWeeklyPlan(JSON.parse(storedPlan));
    }
  }, []);

  const addRecipe = (newRecipe: Recipe) => {
    const updated = [...recipes, newRecipe];
    setRecipes(updated);
    localStorage.setItem('recipes', JSON.stringify(updated));
  };

  const addCategory = (newCategory: Category) => {
    const updated = [...categories, newCategory];
    setCategories(updated);
    localStorage.setItem('categories', JSON.stringify(updated));
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    localStorage.setItem('categories', JSON.stringify(updated));
    // Also remove from recipes
    const updatedRecipes = recipes.map(r => ({
      ...r,
      categories: r.categories.filter(c => c !== id)
    }));
    setRecipes(updatedRecipes);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
  };

  const saveHistory = (newHistory: MenuHistory) => {
    setHistory(newHistory);
    localStorage.setItem('menuHistory', JSON.stringify(newHistory));
  };

  const updateWeeklyPlan = (plan: MealPlanItem[]) => {
    setWeeklyPlan(plan);
    localStorage.setItem('weeklyPlan', JSON.stringify(plan));
  };

  return {
    recipes,
    categories,
    history,
    weeklyPlan,
    addRecipe,
    addCategory,
    deleteCategory,
    saveHistory,
    updateWeeklyPlan,
  };
}
