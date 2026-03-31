// 청첩장 데이터 설정 - 이 파일만 수정하면 됩니다

export const config = {
  groom: {
    name: '임희도',
    father: '아버지 성함',
    mother: '어머니 성함',
    phone: '010-0000-0000',
    account: {
      bank: '은행명',
      number: '000-000-000000',
      holder: '임희도',
    },
    fatherAccount: {
      bank: '은행명',
      number: '000-000-000000',
      holder: '아버지 성함',
    },
    motherAccount: {
      bank: '은행명',
      number: '000-000-000000',
      holder: '어머니 성함',
    },
    kakaopay: '',
    photo: '/mobile-wedding/boy.jpeg',
    intro: '신랑 소개글을 입력해주세요.',
    playlist: '',
  },
  bride: {
    name: '임찬희',
    father: '아버지 성함',
    mother: '어머니 성함',
    phone: '010-0000-0000',
    account: {
      bank: '은행명',
      number: '000-000-000000',
      holder: '임찬희',
    },
    fatherAccount: {
      bank: '은행명',
      number: '000-000-000000',
      holder: '아버지 성함',
    },
    motherAccount: {
      bank: '은행명',
      number: '000-000-000000',
      holder: '어머니 성함',
    },
    kakaopay: '',
    photo: '/mobile-wedding/girl.png',
    intro: '신부 소개글을 입력해주세요.',
  },

  wedding: {
    date: '2026-08-02',
    dateDisplay: '2026년 08월 02일 일요일 오전 11시',
    time: '11:00',
    dayOfWeek: '일요일',
    venue: '삼성전자 서초사옥',
    hall: '',
    address: '서울특별시 서초구 서초대로74길 11',
    lat: 37.4953,
    lng: 127.0135,
  },

  greeting: `인사말을 입력해주세요.`,

  gallery: [
    { id: 1, src: '', alt: '웨딩 사진 1' },
    { id: 2, src: '', alt: '웨딩 사진 2' },
    { id: 3, src: '', alt: '웨딩 사진 3' },
    { id: 4, src: '', alt: '웨딩 사진 4' },
    { id: 5, src: '', alt: '웨딩 사진 5' },
    { id: 6, src: '', alt: '웨딩 사진 6' },
    { id: 7, src: '', alt: '웨딩 사진 7' },
    { id: 8, src: '', alt: '웨딩 사진 8' },
    { id: 9, src: '', alt: '웨딩 사진 9' },
  ],

  menu: {
    western: [
      '메뉴 항목 1',
      '메뉴 항목 2',
      '메뉴 항목 3',
    ],
    chinese: [
      '메뉴 항목 1',
      '메뉴 항목 2',
      '메뉴 항목 3',
    ],
  },

  transport: [
    { label: '지하철', description: '교통 안내를 입력해주세요' },
  ],

  kakao: {
    jsKey: '',
  },
} as const;
