import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import VariablesList from './pages/VariablesList';
import VariableDetail from './pages/VariableDetail';
import './App.css';

function App() {
  return (
    <div className="container">
      <nav className="nav">
        <Link to="/" className="nav-link">Главная (VIN Decoder)</Link>
        <Link to="/variables" className="nav-link">Справочник переменных</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/variables" element={<VariablesList />} />
          <Route path="/variables/:id" element={<VariableDetail />} />
        </Routes>
      </main>
    
    </div>
  );
}
export default App;