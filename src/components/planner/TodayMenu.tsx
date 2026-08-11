import { useState, useEffect } from 'react';
import { useStore } from '../../hooks/useStore';
import { getConstraints, generateMealsWithSide } from '../../utils/generators';
import type { Recipe } from '../../types';
import { RefreshCw } from 'lucide-react';
import RecipeCard from '../RecipeCard';

export default function TodayMenu() {
  const { recipes, history } = useStore();
  const [dailyMenu, setDailyMenu] = useState<{breakfast?: Recipe, lunch?: Recipe, dinner?: Recipe}>({});

  const handleGenerateDaily = () => {
    const tempHistory = { ...history };
    
    const b = generateMealsWithSide(recipes, tempHistory, 1, { mealType: 'breakfast' });
    if (b.length > 0) {
      const ids = (b[0] as any)._baseIds || [b[0].id];
      ids.forEach((id: string) => {
        if (!tempHistory[id]) tempHistory[id] = [];
        tempHistory[id].push(new Date().toISOString());
      });
    }

    const l = generateMealsWithSide(recipes, tempHistory, 1, { mealType: 'lunch' });
    if (l.length > 0) {
      const ids = (l[0] as any)._baseIds || [l[0].id];
      ids.forEach((id: string) => {
        if (!tempHistory[id]) tempHistory[id] = [];
        tempHistory[id].push(new Date().toISOString());
      });
    }
    
    const constraints = l[0] ? getConstraints(l[0]) : {};
    const d = generateMealsWithSide(recipes, tempHistory, 1, { mealType: 'dinner', ...constraints });
    
    setDailyMenu({
      breakfast: b[0],
      lunch: l[0],
      dinner: d[0]
    });
  };

  useEffect(() => {
    if (!dailyMenu.breakfast && recipes.length > 0) {
      handleGenerateDaily();
    }
  }, [recipes.length]);

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Today's Menu</h2>
        <button 
          onClick={handleGenerateDaily}
          className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-500/30 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Generate Full Day
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {['breakfast', 'lunch', 'dinner'].map((meal) => {
          const recipe = dailyMenu[meal as keyof typeof dailyMenu];
          return (
            <div key={meal} className="flex flex-col h-full group">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 dark:bg-orange-500"></div>
                <h3 className="text-sm font-bold tracking-wider uppercase text-slate-600 dark:text-slate-300">{meal}</h3>
              </div>
              
              <div className="flex-1 flex flex-col">
                {recipe ? (
                  <RecipeCard recipe={recipe} className="h-full border-slate-200/60 dark:border-slate-700/60 shadow-none hover:shadow-md transition-shadow hover:border-orange-200 dark:hover:border-orange-500/30" />
                ) : (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 flex-1 bg-slate-50/50 dark:bg-slate-800/20">
                    Not generated yet
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
