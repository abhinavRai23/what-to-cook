import { HashRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Recipes from './pages/Recipes.tsx';
import Planner from './pages/Planner.tsx';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="planner" element={<Planner />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
