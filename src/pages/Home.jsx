import { useState } from 'react';

function Home() {
  const [vin, setVin] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const tableHeaders = ['Характеристика (Variable)', 'Значение (Value)'];

  // Валидация
  const validateVin = (value) => {
    const cleanValue = value.trim();
    if (!cleanValue) return "Поле не может быть пустым";
    if (cleanValue.length !== 17) return `VIN должен содержать ровно 17 символов (у вас ${cleanValue.length})`;
    if (!/^[a-zA-Z0-9]+$/.test(cleanValue)) return "Разрешены только латинские буквы и цифры";
    return "";
  };

  // Функция декодирования
  async function decodeVin(vinCode) {
    const validationError = validateVin(vinCode);
    
    if (validationError) {
      setError(validationError);
      setResults(null);
      return;
    }

    setError('');
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vinCode.trim()}?format=json`);
      const data = await response.json();
      
      const filledResults = data.Results.filter(element => 
        element.Value && 
        element.Value !== "" && 
        element.Value !== "null" &&
        element.Variable !== "Error Code"
      );
      
      setResults(filledResults);

      setHistory(prev => {
        const cleanVin = vinCode.trim();
        const cleanHistory = prev.filter(element => element !== cleanVin);
        return [cleanVin, ...cleanHistory].slice(0, 3);
      });
    } catch (err) {
      setError("Ошибка соединения с API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home-page">
      <h1>Декодер VIN</h1>
      
      <form onSubmit={(e) => { e.preventDefault(); decodeVin(vin); }} className="vin-form">
        <input 
          type="text" 
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Введите VIN (напр. 1FTFW1CT5DFC10312)"
          maxLength={17} 
          style={{ textTransform: 'uppercase' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Расшифровать'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {history.length > 0 && (
        <div className="history-section">
          <div className="history-title">История (последние 3):</div>
          <div className="history-list">
            {history.map((element) => (
              <button 
                key={element} 
                className="history-btn" 
                onClick={() => { setVin(element); decodeVin(element); }}
              >
              
                {element}
              </button>
            ))}
          </div>
        </div>
      )}

      {results && (
        <div className="results-section">
          <div className="results-grid">
            <div className="grid-header">
              {tableHeaders.map((header) => (
                <div key={header} className="header-cell">{header}</div>
              ))}
            </div>
            <div className="grid-body">
              {results.map((element, index) => (
                <div key={index} className="grid-row">
                  <div className="grid-cell label">{element.Variable}</div>
                  <div className="grid-cell value">{element.Value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;