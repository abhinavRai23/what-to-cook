import { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { generateMealsWithSide } from '../../utils/generators';
import type { Recipe } from '../../types';
import { Dices } from 'lucide-react';
import RecipeCard from '../RecipeCard';
import CustomSelect from '../CustomSelect';

export default function SurpriseMe() {
  const { recipes, history } = useStore();
  const [randomMeal, setRandomMeal] = useState('lunch');
  const [randomSeason, setRandomSeason] = useState('all-season');
  const [randomCount, setRandomCount] = useState(6);
  const [randomResults, setRandomResults] = useState<Recipe[]>([]);

  const handleGenerateRandom = () => {
    const res = generateMealsWithSide(recipes, history, randomCount, { 
      mealType: randomMeal, 
      season: randomSeason !== 'all-season' ? randomSeason : undefined 
    });
    setRandomResults(res);
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Dices className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        Surprise Me
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CustomSelect
          value={randomMeal}
          onChange={(val) => setRandomMeal(val as string)}
          colorTheme="blue"
          options={[
            { label: 'Breakfast', value: 'breakfast' },
            { label: 'Lunch', value: 'lunch' },
            { label: 'Dinner', value: 'dinner' }
          ]}
        />

        <CustomSelect
          value={randomSeason}
          onChange={(val) => setRandomSeason(val as string)}
          colorTheme="blue"
          options={[
            { label: 'Any Season', value: 'all-season' },
            { label: 'Summer', value: 'summer' },
            { label: 'Winter', value: 'winter' },
            { label: 'Monsoon', value: 'monsoon' }
          ]}
        />

        <CustomSelect
          value={randomCount}
          onChange={(val) => setRandomCount(Number(val))}
          colorTheme="blue"
          options={[
            { label: '3 Options', value: 3 },
            { label: '5 Options', value: 5 },
            { label: '6 Options', value: 6 },
            { label: '7 Options', value: 7 }
          ]}
        />

        <button 
          onClick={handleGenerateRandom}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2.5 rounded-lg transition-colors"
        >
          Generate Options
        </button>
      </div>

      {randomResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {randomResults.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </section>
  );
}
