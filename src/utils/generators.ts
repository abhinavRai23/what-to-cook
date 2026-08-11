import type { Recipe, MenuHistory } from '../types';
import { differenceInDays, parseISO } from 'date-fns';

export function getWeightedRandomRecipes(
  recipes: Recipe[], 
  history: MenuHistory, 
  count: number,
  criteria?: { mealType?: string, season?: string, excludeCategories?: string[], excludeKeywords?: string[] }
): Recipe[] {
  // Filter by criteria first
  let candidates = recipes;
  if (criteria?.mealType) {
    candidates = candidates.filter(r => r.mealTypes.includes(criteria.mealType!));
  }
  if (criteria?.season && criteria.season !== 'all-season') {
    candidates = candidates.filter(r => r.seasons.includes(criteria.season!) || r.seasons.includes('all-season'));
  }
  
  // Apply hard category exclusions (e.g. no two dals in one day)
  if (criteria?.excludeCategories && criteria.excludeCategories.length > 0) {
    candidates = candidates.filter(r => !r.categories.some(c => criteria.excludeCategories!.includes(c)));
  }
  
  // Apply softer keyword exclusions (e.g. no two aloo dishes in one day)
  if (criteria?.excludeKeywords && criteria.excludeKeywords.length > 0) {
    const strictCandidates = candidates.filter(r => {
      const searchString = (r.id + ' ' + r.name).toLowerCase();
      return !criteria.excludeKeywords!.some(kw => searchString.includes(kw.toLowerCase()));
    });
    // Fallback if we accidentally filtered out everything
    if (strictCandidates.length > 0) {
      candidates = strictCandidates;
    }
  }

  if (candidates.length === 0) return [];

  // Calculate weights based on history
  const now = new Date();
  
  const weightedCandidates = candidates.map(recipe => {
    let weight = 100; // default max weight
    
    const dates = history[recipe.id];
    if (dates && dates.length > 0) {
      // Sort to get most recent
      const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      const mostRecent = parseISO(sortedDates[0]);
      const diffDays = differenceInDays(now, mostRecent);
      
      const isRaita = recipe.categories.includes('raita');
      if (diffDays < 3) {
        weight = isRaita ? 30 : 0; // Don't repeat mains within 3 days, but allow raitas
      } else if (diffDays >= 3 && diffDays <= 7) {
        weight = isRaita ? 60 : 20; // Low probability if eaten in last week
      } else {
        weight = 100; // Normal probability if older than a week
      }
    }
    
    return { recipe, weight };
  }).filter(c => c.weight > 0);

  // If we filtered out too many due to weight = 0, just use all candidates and ignore history to avoid infinite loops or empty results
  let pool = weightedCandidates.length >= count ? weightedCandidates : candidates.map(c => ({ recipe: c, weight: 1 }));
  
  const selected: Recipe[] = [];
  
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) break;
    
    // Total weight
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let randomVal = Math.random() * totalWeight;
    
    let chosenIndex = 0;
    for (let j = 0; j < pool.length; j++) {
      randomVal -= pool[j].weight;
      if (randomVal <= 0) {
        chosenIndex = j;
        break;
      }
    }
    
    selected.push(pool[chosenIndex].recipe);
    // Remove chosen from pool so it's not selected again in this batch
    pool.splice(chosenIndex, 1);
  }
  
  return selected;
};

const VEG_KEYWORDS = ['aloo', 'gobi', 'matar', 'bhindi', 'baingan', 'lauki', 'kaddu', 'palak', 'methi', 'mooli', 'chole', 'rajma', 'chana', 'soya', 'mushroom'];

export const getConstraints = (recipe?: Recipe) => {
  if (!recipe) return {};
  
  const excludeCategories: string[] = [];
  if (recipe.categories.includes('paneer')) excludeCategories.push('paneer');
  if (recipe.categories.includes('dal')) excludeCategories.push('dal');
  
  const excludeKeywords: string[] = [];
  const searchString = (recipe.id + ' ' + recipe.name).toLowerCase();
  VEG_KEYWORDS.forEach(kw => {
    if (searchString.includes(kw)) {
      excludeKeywords.push(kw);
    }
  });

  return { excludeCategories, excludeKeywords };
};

export const generateMealsWithSide = (
  recipes: Recipe[], 
  history: Record<string, string[]>, 
  count: number, 
  criteria: { mealType?: string, season?: string, excludeCategories?: string[], excludeKeywords?: string[] }
): Recipe[] => {
  const isLunch = criteria.mealType === 'lunch';
  
  const mainRecipes = recipes.filter(r => !r.categories.includes('raita'));
  const mainResults = getWeightedRandomRecipes(mainRecipes, history, count, criteria);
  
  if (mainResults.length === 0) return [];

  if (isLunch) {
    const sideRecipes = recipes.filter(r => r.categories.includes('raita'));
    const sideResults = getWeightedRandomRecipes(sideRecipes, history, count, { mealType: 'lunch', season: criteria.season });
    
    return mainResults.map((main, index) => {
      const side = sideResults[index % sideResults.length];
      if (!side) return main;
      return {
        ...main,
        id: `${main.id}+${side.id}`,
        name: `${main.name} + ${side.name}`,
        description: `${main.description} Served with ${side.name}.`,
        _baseIds: [main.id, side.id]
      } as Recipe & { _baseIds?: string[] };
    });
  }
  
  return mainResults.map(m => ({ ...m, _baseIds: [m.id] })) as (Recipe & { _baseIds?: string[] })[];
};
