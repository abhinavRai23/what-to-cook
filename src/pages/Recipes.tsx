import { useState, useMemo } from 'react';
import { useStore } from '../hooks/useStore';
import RecipeCard from '../components/RecipeCard';
import CustomSelect from '../components/CustomSelect';
import { Search } from 'lucide-react';

export default function Recipes() {
  const { recipes, categories } = useStore();
  const [search, setSearch] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                            (r.description?.toLowerCase().includes(search.toLowerCase()) || false);
      const matchesMeal = selectedMeal ? r.mealTypes.includes(selectedMeal) : true;
      const matchesSeason = selectedSeason ? r.seasons.includes(selectedSeason) : true;
      const matchesCategory = selectedCategory ? r.categories.includes(selectedCategory) : true;
      return matchesSearch && matchesMeal && matchesSeason && matchesCategory;
    });
  }, [recipes, search, selectedMeal, selectedSeason, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recipe Database</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{recipes.length} total recipes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input 
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            value={selectedMeal}
            onChange={(val) => setSelectedMeal(val as string)}
            options={[
              { label: 'All Meals', value: '' },
              { label: 'Breakfast', value: 'breakfast' },
              { label: 'Lunch', value: 'lunch' },
              { label: 'Dinner', value: 'dinner' }
            ]}
          />
          
          <CustomSelect
            value={selectedSeason}
            onChange={(val) => setSelectedSeason(val as string)}
            options={[
              { label: 'Any Season', value: '' },
              { label: 'Summer', value: 'summer' },
              { label: 'Winter', value: 'winter' },
              { label: 'Monsoon', value: 'monsoon' },
              { label: 'Spring', value: 'spring' },
              { label: 'Year-Round (All Season)', value: 'all-season' }
            ]}
          />

          <CustomSelect
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val as string)}
            options={[
              { label: 'All Categories', value: '' },
              ...categories.map(c => ({ label: c.name, value: c.id }))
            ]}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">No recipes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
