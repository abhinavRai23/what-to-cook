import { useEffect, useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Clock, RefreshCw } from 'lucide-react';
import { generateMealsWithSide } from '../utils/generators';
import type { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';

export default function Home() {
  const { recipes, history } = useStore();
  const [suggestions, setSuggestions] = useState<{ recipes: Recipe[], mealType: string }>({ recipes: [], mealType: '' });

  const getMealTypeByTime = () => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const time = hour + minute / 60;

    if (time < 10.5) return 'breakfast';
    if (time < 14) return 'lunch';
    if (time < 16.5) return 'snack';
    return 'dinner';
  };

  const generateSuggestion = () => {
    const mealType = getMealTypeByTime();
    const results = generateMealsWithSide(recipes, history, 3, { mealType });
    setSuggestions({ recipes: results, mealType });
  };

  useEffect(() => {
    if (recipes.length > 0) {
      generateSuggestion();
    }
  }, [recipes]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">What's for meal today?</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">Stop thinking. Start cooking with {recipes.length} recipes.</p>
      </header>

      {/* Time Based Suggestion */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-100 rounded-full opacity-30 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Clock className="w-5 h-5 shrink-0" />
              <span className="font-semibold capitalize text-sm tracking-wider">SUGGESTED FOR {suggestions.mealType}</span>
            </div>
          </div>

          <button
            onClick={generateSuggestion}
            className="inline-flex justify-center items-center gap-2 w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg font-semibold border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow hover:border-slate-300 dark:hover:border-slate-600 whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            Shuffle again
          </button>
        </div>

        <div className="relative z-10">
          {suggestions.recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {suggestions.recipes.map((r, i) => (
                <RecipeCard key={`${r.id}-${i}`} recipe={r} />
              ))}
            </div>
          ) : (
            <div className="text-slate-500 italic py-4">Not enough recipes to generate suggestions.</div>
          )}
        </div>
      </section>
    </div>
  );
}
