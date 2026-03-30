// 청첩장 데이터 설정 - 디자인/기획 확정 후 이 파일만 수정하면 됩니다

export const config = {
  // 신랑 & 신부 정보
  groom: {
    name: '김신랑',
    englishName: 'Groom',
    father: '김아버지',
    mother: '김어머니',
    phone: '010-1234-5678',
    account: {
      bank: '국민은행',
      number: '123-456-789012',
      holder: '김신랑',
    },
    fatherAccount: {
      bank: '신한은행',
      number: '110-123-456789',
      holder: '김아버지',
    },
    motherAccount: {
      bank: '우리은행',
      number: '1002-123-456789',
      holder: '김어머니',
    },
  },
  bride: {
    name: '이신부',
    englishName: 'Bride',
    father: '이아버지',
    mother: '이어머니',
    phone: '010-9876-5432',
    account: {
      bank: '카카오뱅크',
      number: '3333-12-3456789',
      holder: '이신부',
    },
    fatherAccount: {
      bank: '하나은행',
      number: '123-456789-01234',
      holder: '이아버지',
    },
    motherAccount: {
      bank: '농협은행',
      number: '302-1234-5678-01',
      holder: '이어머니',
    },
  },

  // 결혼식 정보
  wedding: {
    date: '2025-11-15',
    time: '14:00',
    dayOfWeek: '토요일',
    venue: '더채플앳청담',
    hall: '그랜드볼룸 3층',
    address: '서울특별시 강남구 청담동 123-45',
    lat: 37.5246,
    lng: 127.0478,
  },

  // 인사말
  greeting: `서로 다른 길을 걸어온 두 사람이\n같은 곳을 바라보며\n함께 걸어가려 합니다.\n\n소중한 분들을 모시고\n사랑의 약속을 하려 합니다.\n\n바쁘시더라도 오셔서\n축복해 주시면 감사하겠습니다.`,

  // 갤러리 이미지 (플레이스홀더)
  gallery: [
    { id: 1, src: '', alt: '웨딩 사진 1' },
    { id: 2, src: '', alt: '웨딩 사진 2' },
    { id: 3, src: '', alt: '웨딩 사진 3' },
    { id: 4, src: '', alt: '웨딩 사진 4' },
    { id: 5, src: '', alt: '웨딩 사진 5' },
  ],

  // 교통 안내
  transport: [
    { label: '지하철', description: '2호선 청담역 3번 출구 도보 5분' },
    { label: '버스', description: '472, 3422번 청담사거리 하차' },
    { label: '주차', description: '건물 지하주차장 이용 (2시간 무료)' },
  ],

  // 카카오톡 공유
  kakao: {
    jsKey: '', // 카카오 JavaScript 키
  },
} as const;
