import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VariablesList = () => {
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json')
      .then(res => res.json())
      .then(data => {
        setVariables(data.Results);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Загрузка справочника...</div>;

  return (
    <div className="variables-page">
      <h1>Справочник переменных</h1>
      <ul className="variables-list">
        {variables.map(element => (
          <li key={element.ID} className="variable-item">
            <Link to={`/variables/${element.ID}`}>
              <strong>{element.Name}</strong>
            </Link>
            
            {/* Динамическая вёрстка: теги из API (<b>, <br> и др.) теперь будут работать */}
            <div 
              className="variable-description"
              dangerouslySetInnerHTML={{ __html: element.Description || "Описание отсутствует" }} 
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VariablesList;