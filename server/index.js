const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;

// ✅ 당신의 실제 카카오 REST API 키
const KAKAO_API_KEY = 'deee9a6f35a8e3531da237728bc74c95';

app.use(cors());
app.use(express.json());

app.post('/api/search', async (req, res) => {
  const { keyword } = req.body;
  console.log('🔍 사용자 입력:', keyword); // 입력 확인용 로그

  try {
    // ✅ 이 줄이 누락되었거나 오타났을 가능성 높음
    const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`
      },
      params: {
        query: `${keyword} 맛집`
      }
    });

    console.log('📦 카카오 응답:', response.data);
    res.json(response.data.documents);
  } catch (error) {
    console.error('❌ 카카오 API 요청 실패:', error.message);
    res.status(500).json({ error: '검색 실패' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
