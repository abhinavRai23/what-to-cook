import { useState, useEffect } from 'react';
import { useStore } from '../../hooks/useStore';
import { getConstraints, generateMealsWithSide } from '../../utils/generators';
import type { Recipe } from '../../types';
import { RefreshCw, CalendarDays, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addDays, format, startOfWeek } from 'date-fns';

export default function WeeklyPlanner() {
  const { recipes, history } = useStore();
  const [weeklyPlan, setWeeklyPlan] = useState<Record<string, Recipe>>({});

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({length: 7}).map((_, i) => {
    const d = addDays(weekStart, i);
    return {
      dateStr: format(d, 'yyyy-MM-dd'),
      label: format(d, 'EEE'),
      fullLabel: format(d, 'EEEE, MMM d')
    };
  });

  const handleGenerateWeekly = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start Monday
    const newPlan: Record<string, Recipe> = {};
    
    // To avoid repetition within the same generation, we'll keep a temporary history map
    const tempHistory = { ...history };
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(start, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const b = generateMealsWithSide(recipes, tempHistory, 1, { mealType: 'breakfast' });
      if (b.length > 0) {
        newPlan[`${dateStr}-breakfast`] = b[0];
        const ids = (b[0] as any)._baseIds || [b[0].id];
        ids.forEach((id: string) => {
          if (!tempHistory[id]) tempHistory[id] = [];
          tempHistory[id].push(new Date().toISOString());
        });
      }
      
      const l = generateMealsWithSide(recipes, tempHistory, 1, { mealType: 'lunch' });
      if (l.length > 0) {
        newPlan[`${dateStr}-lunch`] = l[0];
        const ids = (l[0] as any)._baseIds || [l[0].id];
        ids.forEach((id: string) => {
          if (!tempHistory[id]) tempHistory[id] = [];
          tempHistory[id].push(new Date().toISOString());
        });
      }
      
      const constraints = l[0] ? getConstraints(l[0]) : {};
      const d = generateMealsWithSide(recipes, tempHistory, 1, { mealType: 'dinner', ...constraints });
      if (d.length > 0) {
        newPlan[`${dateStr}-dinner`] = d[0];
        const ids = (d[0] as any)._baseIds || [d[0].id];
        ids.forEach((id: string) => {
          if (!tempHistory[id]) tempHistory[id] = [];
          tempHistory[id].push(new Date().toISOString());
        });
      }
    }
    
    setWeeklyPlan(newPlan);
  };

  const handleRegenerateSingleMeal = (dateStr: string, meal: string) => {
    const res = generateMealsWithSide(recipes, history, 1, { mealType: meal });
    if (res.length > 0) {
      setWeeklyPlan(prev => ({ ...prev, [`${dateStr}-${meal}`]: res[0] }));
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Weekly Meal Plan", 14, 15);
    
    // Rows = Days (Mon-Sun)
    // Cols = Day, Breakfast, Lunch, Dinner
    const tableData = weekDays.map(day => {
      const b = weeklyPlan[`${day.dateStr}-breakfast`]?.name || 'Not planned';
      const l = weeklyPlan[`${day.dateStr}-lunch`]?.name || 'Not planned';
      const d = weeklyPlan[`${day.dateStr}-dinner`]?.name || 'Not planned';
      return [day.label, b, l, d];
    });

    autoTable(doc, {
      head: [['Day', 'Breakfast', 'Lunch', 'Dinner']],
      body: tableData,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save('weekly-plan.pdf');
  };

  useEffect(() => {
    if (Object.keys(weeklyPlan).length === 0 && recipes.length > 0) {
      handleGenerateWeekly();
    }
  }, [recipes.length]);

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          Weekly Planner
        </h2>
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <button 
            onClick={downloadPDF}
            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-indigo-200 dark:border-slate-700 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="whitespace-nowrap">Download PDF</span>
          </button>
          <button 
            onClick={handleGenerateWeekly}
            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="whitespace-nowrap">Generate Week</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px] md:min-w-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b border-slate-200 dark:border-slate-800 font-medium text-slate-500 dark:text-slate-400 w-20 text-sm">Day</th>
              {['breakfast', 'lunch', 'dinner'].map(meal => (
                <th key={meal} className="p-2 border-b border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100 text-center capitalize text-sm">
                  {meal}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekDays.map(day => (
              <tr key={day.dateStr} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                <td className="p-2 font-semibold text-slate-600 dark:text-slate-300 text-sm">{day.label}</td>
                {['breakfast', 'lunch', 'dinner'].map(meal => {
                  const recipe = weeklyPlan[`${day.dateStr}-${meal}`];
                  return (
                    <td key={meal} className="p-1.5 border-l border-slate-100 dark:border-slate-800/50 w-1/3 align-top">
                      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-md p-1.5 md:p-2 h-full flex flex-col justify-between group">
                        {recipe ? (
                          <>
                            <span className="text-xs md:text-base font-medium text-slate-800 dark:text-slate-200 leading-tight mb-1 md:mb-2 block">{recipe.name}</span>
                            <button 
                              onClick={() => handleRegenerateSingleMeal(day.dateStr, meal)}
                              className="text-[11px] md:text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            >
                              <RefreshCw className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" /> <span className="hidden md:inline">Regenerate</span>
                            </button>
                          </>
                        ) : (
                          <div className="text-xs md:text-sm text-slate-400 dark:text-slate-500 text-center py-2 md:py-4">Empty</div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
