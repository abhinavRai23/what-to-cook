import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export default function RecipeCard({ recipe, className = '' }: RecipeCardProps) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{recipe.name}</h3>
        {recipe.userAdded && (
          <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-full">
            User Added
          </span>
        )}
      </div>
      
      {recipe.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{recipe.description}</p>
      )}

      <div className="space-y-3 mt-auto pt-4">
        {/* Metadata Row */}
        <div className="flex flex-wrap gap-2 text-xs">
          {recipe.categories.map(c => (
            <span key={c} className="bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 px-2.5 py-1 rounded-md font-medium">
              {c.replace('-', ' ')}
            </span>
          ))}
          {recipe.seasons.map(s => (
            <span key={s} className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md font-medium capitalize">
              {s.replace('-', ' ')}
            </span>
          ))}
          {recipe.regions?.map(r => (
            <span key={r} className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md font-medium">
              {r}
            </span>
          ))}
        </div>

        {/* Meal Types */}
        <div className="flex gap-2">
          {recipe.mealTypes.map(m => (
            <span key={m} className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              [{m}]
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
