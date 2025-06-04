import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // ✅ 반드시 존재해야 함

function App() {
  const [region, setRegion] = useState('');
  const [results, setResults] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const mapRef = useRef(null);

  const categoryOptions = ['한식', '중식', '일식', '양식', '분식', '카페'];

  const searchRestaurants = async () => {
    try {
      const response = await fetch('https://my-foodmap.onrender.com/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: region }),
      });

      const data = await response.json();
      console.log('받은 데이터:', data);
      setResults(data);
      setSelectedPlace(null); // 검색 시 선택 초기화
    } catch (error) {
      console.error('검색 중 에러:', error);
    }
  };

  // ✅ 지도 표시 (선택된 장소가 없으면 서울시청 중심)
  useEffect(() => {
    if (window.kakao && window.kakao.maps && mapRef.current) {
      const container = mapRef.current;

      const center = selectedPlace
        ? new window.kakao.maps.LatLng(selectedPlace.y, selectedPlace.x)
        : new window.kakao.maps.LatLng(37.5662952, 126.9779451); // 서울시청 좌표

      const options = {
        center,
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);

      // ✅ 선택된 장소가 있을 경우에만 마커 표시
      if (selectedPlace) {
        const markerPosition = new window.kakao.maps.LatLng(selectedPlace.y, selectedPlace.x);
        new window.kakao.maps.Marker({
          map,
          position: markerPosition,
          title: selectedPlace.place_name,
        });
      }
    }
  }, [selectedPlace]);

  const filteredResults = results.filter(place => {
    const hasPhone = place.phone && place.phone.trim() !== '';
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some(cat => place.category_name?.includes(cat));
    return hasPhone && categoryMatch;
  });

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📍 지역별 맛집 검색기</h1>

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

      {/* ✅ 체크박스 UI */}
      <div style={{ marginTop: '1rem' }}>
        <p>음식점 유형 선택:</p>
        {categoryOptions.map((category) => (
          <label key={category} style={{ marginRight: '1rem' }}>
            <input
              type="checkbox"
              value={category}
              checked={selectedCategories.includes(category)}
              onChange={(e) => {
                const value = e.target.value;
                if (e.target.checked) {
                  setSelectedCategories([...selectedCategories, value]);
                } else {
                  setSelectedCategories(selectedCategories.filter(c => c !== value));
                }
              }}
            />
            {category}
          </label>
        ))}
      </div>

      {/* ✅ 지도 (서울시청 기본 중심, 반응형 높이) */}
      <div ref={mapRef} className="map-container"></div>

      {/* ✅ 결과 렌더링 */}
      <ul style={{ marginTop: '2rem', listStyle: 'none', padding: 0 }}>
        {filteredResults.length === 0 && (
          <li>🔍 조건에 맞는 맛집이 없습니다.</li>
        )}

        {filteredResults.map((place, index) => (
          <li
            key={index}
            onClick={() => setSelectedPlace(place)}
            style={{
              marginBottom: '1rem',
              cursor: 'pointer',
              backgroundColor: selectedPlace?.id === place.id ? '#f0f0f0' : 'white',
              padding: '0.5rem',
              borderRadius: '8px'
            }}
          >
            <strong>{place.place_name}</strong><br />
            📍 {place.address_name}<br />
            ☎️ {place.phone}<br />
            🔗 <a href={place.place_url} target="_blank" rel="noopener noreferrer">
              {place.place_name} 바로가기
            </a>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
