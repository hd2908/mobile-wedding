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
    intro: '초록빛 싱그러움이 가득한 여름,\n곁에 있을 때 가장 나다워지는 사람과\n평생을 함께하기로 했습니다.\n\n시원한 나무 그늘처럼 서로에게 편안한 쉼이 되고,\n청량한 여름빛처럼 서로를 밝혀주는\n가정을 꾸려가겠습니다.\n\n기쁜 마음으로 오시어 함께 축복해 주시면\n평생 소중히 간직하겠습니다.',
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
    intro: '초록빛 싱그러움이 가득한 여름,\n곁에 있을 때 가장 나다워지는 사람과\n평생을 함께하기로 했습니다.\n\n시원한 나무 그늘처럼 서로에게 편안한 쉼이 되고,\n청량한 여름빛처럼 서로를 밝혀주는\n가정을 꾸려가겠습니다.\n\n기쁜 마음으로 오시어 함께 축복해 주시면\n평생 소중히 간직하겠습니다.',
  },

  wedding: {
    date: '2026-08-02',
    dateDisplay: '2026년 08월 02일 일요일 오전 11시',
    time: '11:00',
    dayOfWeek: '일요일',
    venue: '삼성전자 서초사옥',
    hall: '',
    address: '서울특별시 서초구 서초대로74길 11 5F',
    lat: 37.4966083,
    lng: 127.0269028,
  },


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
    '2호선 / 신분당선을 이용하시는 분들은 강남역 8번 출구에서 서초사옥 연결 통로를 통해 5층으로 올라오시면 됩니다.',
    '버스를 이용하시는 분들은 강남역 정류장에서 하차 후 도보 약 3분 거리입니다.',
  ],

  kakao: {
    jsKey: 'c8bdc122c15ea375e589f513a3cb84f4',
  },
} as const;
