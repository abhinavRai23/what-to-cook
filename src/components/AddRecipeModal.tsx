import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import type { Recipe } from '../types';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function AddRecipeModal({ onClose }: Props) {
  const { categories, addRecipe } = useStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedMeals.length === 0) return;

    const newRecipe: Recipe = {
      id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name,
      description: description || undefined,
      mealTypes: selectedMeals,
      categories: selectedCategories,
      seasons: selectedSeasons.length > 0 ? selectedSeasons : ['all-season'],
      vegetarian: true,
      userAdded: true
    };

    addRecipe(newRecipe);
    onClose();
  };

  const toggleArrayItem = (item: string, array: string[], setArray: (val: string[]) => void) => {
    if (array.includes(item)) setArray(array.filter(i => i !== item));
    else setArray([...array, item]);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-transparent dark:border-slate-800 shadow-xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Add Recipe</h2>
          <button onClick={onClose} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recipe Name *</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="e.g. Matar Paneer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                rows={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meal Types *</label>
            <div className="flex gap-2 flex-wrap">
              {['breakfast', 'lunch', 'snack', 'dinner'].map(m => (
                <label key={m} className="flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 has-[:checked]:bg-orange-50 dark:has-[:checked]:bg-orange-500/10 has-[:checked]:border-orange-500 dark:has-[:checked]:border-orange-500">
                  <input 
                    type="checkbox" 
                    checked={selectedMeals.includes(m)}
                    onChange={() => toggleArrayItem(m, selectedMeals, setSelectedMeals)}
                    className="accent-orange-600"
                  />
                  <span className="text-sm capitalize">{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Seasons</label>
            <div className="flex flex-wrap gap-2">
              {['summer', 'winter', 'monsoon', 'spring', 'all-season'].map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-500/10 has-[:checked]:border-blue-500 dark:has-[:checked]:border-blue-500">
                  <input 
                    type="checkbox" 
                    checked={selectedSeasons.includes(s)}
                    onChange={() => toggleArrayItem(s, selectedSeasons, setSelectedSeasons)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm capitalize">{s.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-500/10 has-[:checked]:border-emerald-500 dark:has-[:checked]:border-emerald-500">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(c.id)}
                    onChange={() => toggleArrayItem(c.id, selectedCategories, setSelectedCategories)}
                    className="accent-emerald-600"
                  />
                  <span className="text-sm">{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
            <button type="submit" disabled={!name || selectedMeals.length === 0} className="px-4 py-2 font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50">Save Recipe</button>
          </div>
        </form>
      </div>
    </div>
  );
}
