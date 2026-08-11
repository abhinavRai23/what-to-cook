import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Calendar, ChefHat, Home, Book, Plus, Moon, Sun } from 'lucide-react';
import { cn } from '../../utils/cn';
import AddRecipeModal from '../AddRecipeModal';

export default function AppLayout() {
  const location = useLocation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Planner', path: '/planner', icon: Calendar },
    { name: 'Recipes', path: '/recipes', icon: Book }
  ];

  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0 md:pl-64">
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center p-2 text-xs font-medium transition-colors",
                location.pathname === item.path ? "text-orange-600 dark:text-orange-500" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <item.icon className="w-6 h-6 mb-1" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex flex-col items-center p-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
          >
            <Plus className="w-6 h-6 mb-1" />
            Add
          </button>
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center p-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-6 h-6 mb-1" /> : <Moon className="w-6 h-6 mb-1" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col transition-colors duration-300">
        <div className="p-6 flex items-center gap-3 text-orange-600 dark:text-orange-500">
          <ChefHat className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Desi Kitchen</span>
        </div>
        <div className="flex-1 px-4 py-2 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-500"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-700 dark:hover:text-orange-500 transition-colors w-full text-left"
          >
            <Plus className="w-5 h-5" />
            Add Recipe
          </button>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full text-left"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 md:p-8">
        <Outlet />
      </main>

      {isAddModalOpen && (
        <AddRecipeModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}
