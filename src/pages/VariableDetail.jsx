import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const VariableDetail = () => {
  const { id } = useParams();
  const [variable, setVariable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json')
      .then(res => res.json())
      .then(data => {
        // Ищем конкретную переменную по ID
        const matches = data.Results.filter(v => v.ID.toString() === id);
        if (matches.length > 0) {
          setVariable(matches[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!variable) return <div className="error-message">Переменная не найдена</div>;

  return (
    <div className="detail-page">
      <Link to="/variables" className="back-link">← Назад к списку</Link>
      
      <div className="detail-card">
        <h1>{variable.Name}</h1>
        
        <div className="detail-info">
          <p><strong>ID:</strong> {variable.ID}</p>
          <p><strong>Группа:</strong> {variable.GroupName || "Не указана"}</p>
        </div>

        <hr />

        <p><strong>Описание:</strong></p>
        
        {/* Выводим описание динамически. 
            Используем <div> вместо <p>, так как внутри могут быть свои параграфы */}
        <div 
          className="description-content"
          dangerouslySetInnerHTML={{ __html: variable.Description || "Описание отсутствует" }} 
        />
      </div>
    </div>
  );
};

export default VariableDetail;