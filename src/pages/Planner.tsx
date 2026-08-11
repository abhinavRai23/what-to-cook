import { useState } from 'react';
import { Dices, CalendarDays } from 'lucide-react';
import TodayMenu from '../components/planner/TodayMenu';
import WeeklyPlanner from '../components/planner/WeeklyPlanner';
import SurpriseMe from '../components/planner/SurpriseMe';

export default function Planner() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'random'>('daily');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Meal Planner</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Generate menus intelligently based on your preferences and history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        <nav className="md:col-span-1 flex flex-row md:flex-col overflow-x-auto whitespace-nowrap hide-scrollbar space-x-2 md:space-x-0 md:space-y-2 bg-white dark:bg-slate-900 p-2 md:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`text-left px-3 py-2 text-sm md:px-4 md:py-3 md:text-base rounded-lg font-medium transition-colors ${activeTab === 'daily' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Today's Menu
          </button>
          <button 
            onClick={() => setActiveTab('weekly')}
            className={`text-left px-3 py-2 text-sm md:px-4 md:py-3 md:text-base rounded-lg font-medium transition-colors ${activeTab === 'weekly' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <CalendarDays className="inline w-4 h-4 mr-1.5 md:mr-2 mb-0.5"/>
            Weekly Planner
          </button>
          <button 
            onClick={() => setActiveTab('random')}
            className={`text-left px-3 py-2 text-sm md:px-4 md:py-3 md:text-base rounded-lg font-medium transition-colors ${activeTab === 'random' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Dices className="inline w-4 h-4 mr-1.5 md:mr-2 mb-0.5"/>
            Surprise Me
          </button>
        </nav>

        <div className="md:col-span-3">
          {activeTab === 'daily' && <TodayMenu />}
          {activeTab === 'weekly' && <WeeklyPlanner />}
          {activeTab === 'random' && <SurpriseMe />}
        </div>
      </div>
    </div>
  );
}
