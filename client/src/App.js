import React, { useState } from 'react';

function App() {
  const [region, setRegion] = useState('');
  const [results, setResults] = useState([]);

  const searchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: region }),
      });

      const data = await response.json();
      console.log('받은 데이터:', data); // 확인용
      setResults(data); // ✅ documents가 아닌 배열 그 자체
    } catch (error) {
      console.error('검색 중 에러:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📍 지역 기반 맛집 검색기</h1>

      <input
        type="text"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        placeholder="예: 강남, 홍대, 종로"
        style={{ padding: '0.5rem', marginRight: '1rem', width: '200px' }}
      />

      <button onClick={searchRestaurants} style={{ padding: '0.5rem 1rem' }}>
        맛집 검색
      </button>

      <ul style={{ marginTop: '2rem', listStyle: 'none', padding: 0 }}>
        {Array.isArray(results) && results.length === 0 && (
          <li>🔍 검색 결과가 없습니다.</li>
        )}

        {Array.isArray(results) &&
          results.map((place, index) => (
            <li key={index} style={{ marginBottom: '1rem' }}>
              <strong>{place.place_name}</strong><br />
              📍 {place.address_name}<br />
              ☎️ {place.phone || '전화번호 없음'}
              <hr />
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
