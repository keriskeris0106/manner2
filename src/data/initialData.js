/**
 * Initial Presets & Data Pool for [존댓말 차원 탐험대]
 * All AI dialogues model 100% grammatically correct and polite Korean honorifics.
 */

export const WORLDS_DATA = [
  {
    id: 1,
    name: '월드 1: 시끌벅적 우리 마을',
    desc: '일상 생활 장소에서 올바른 존댓말로 대화해보세요!',
    icon: '🏡',
    bg: '#1e1438',
    locations: [
      { id: 'W1_HOSPITAL', name: '병원', role: '간호사/의사', icon: '🏥' },
      { id: 'W1_MART', name: '마트', role: '점원/할아버지', icon: '🛒' },
      { id: 'W1_SCHOOL', name: '학교', role: '선생님/교장선생님', icon: '🏫' },
      { id: 'W1_RESTAURANT', name: '식당', role: '주방장/어르신', icon: '🍲' },
      { id: 'W1_POST', name: '우체국', role: '우체부 아저씨', icon: '📮' },
      { id: 'W1_POLICE', name: '경찰서', role: '경찰관', icon: '🚨' },
      { id: 'W1_FIRE', name: '소방서', role: '소방관', icon: '🚒' },
      { id: 'W1_LIBRARY', name: '도서관', role: '사서 선생님', icon: '📚' },
      { id: 'W1_BANK', name: '은행', role: '행원', icon: '🪙' },
      { id: 'W1_BUS', name: '버스정류장', role: '버스 기사님/어르신', icon: '🚌' }
    ]
  },
  {
    id: 2,
    name: '월드 2: 신비한 동화 월드',
    desc: '전래동화 속 인물들을 만나 올바른 존댓말로 대화해보세요!',
    icon: '🏰',
    bg: '#14253a',
    locations: [
      { id: 'W2_HEUNGBU', name: '흥부전', role: '흥부', icon: '🪺' },
      { id: 'W2_RABBIT', name: '토끼전', role: '자라/용왕님', icon: '🐢' },
      { id: 'W2_FAIRY', name: '선녀와 나무꾼', role: '선녀/나무꾼', icon: '🪽' },
      { id: 'W2_KONGJWI', name: '콩쥐팥쥐', role: '콩쥐/계모', icon: '🪓' },
      { id: 'W2_FART', name: '방귀쟁이 며느리', role: '시아버님', icon: '💨' },
      { id: 'W2_SHIMCHONG', name: '심청전', role: '심봉사', icon: '🪷' },
      { id: 'W2_GOLD_AXE', name: '금도끼 은도끼', role: '산신령', icon: '🪓' },
      { id: 'W2_SUN_MOON', name: '해와 달이 된 오누이', role: '어머니', icon: '🐯' },
      { id: 'W2_LUMP', name: '혹부리 영감', role: '도깨비', icon: '🎵' },
      { id: 'W2_MAGPIE', name: '은혜 갚은 까치', role: '선비님', icon: '🔔' }
    ]
  },
  {
    id: 3,
    name: '월드 3: 차원 대통합',
    desc: '동화 인물과 현대 마을이 뒤섞인 차원! (월드 1, 2 배지 100% 완료 시 해금)',
    icon: '🌀',
    bg: '#31103f',
    unlockReq: '월드 1과 월드 2의 모든 배지를 100% 획득해야 입장할 수 있습니다.',
    locations: [
      { id: 'W3_FUTURE_DRAGON', name: '미래 병원에 온 용왕님', role: '용왕님', icon: '🐉' },
      { id: 'W3_MART_ZARA', name: '마트에 온 자라', role: '자라', icon: '🪼' },
      { id: 'W3_SCHOOL_DEER', name: '학교에 온 사슴', role: '사슴', icon: '🦌' },
      { id: 'W3_REST_SIM', name: '식당에 온 심봉사', role: '심봉사', icon: '🍚' },
      { id: 'W3_POST_GOBLIN', name: '우체국에 온 도깨비', role: '도깨비', icon: '👹' },
      { id: 'W3_POLICE_FAIRY', name: '경찰서에 온 선녀', role: '선녀', icon: '👑' },
      { id: 'W3_FIRE_TIGER', name: '소방서에 온 호랑이', role: '호랑이', icon: '🔥' },
      { id: 'W3_LIB_KONGJWI', name: '도서관에 온 콩쥐', role: '콩쥐', icon: '📖' },
      { id: 'W3_BANK_NOLBU', name: '은행에 온 놀부', role: '놀부', icon: '💰' },
      { id: 'W3_BUS_MAGPIE', name: '버스에 탄 까치', role: '까치', icon: '⚡' }
    ]
  }
];

/**
 * Pre-populated 2-Choice Database Questions.
 * Note: AI dialogues strictly model 100% correct, polite Korean honorifics!
 * Student choices have 100% identical sentence structure except for the targeted honorific point.
 */
export const PRESET_QUEST_DATABASE = [
  // --- WORLD 1: HOSPITAL ---
  {
    id: 'q_w1_hosp_1',
    worldId: 1,
    locationId: 'W1_HOSPITAL',
    classCode: 'GLOBAL',
    aiRole: '간호사',
    aiDialogue: '환자분, 지어드리신 약봉투가 여기 있습니다. 복용법을 안내해 드릴까요?',
    correctAnswer: '우와, 약봉투가 예뻐요.',
    wrongAnswer: '우와, 약봉투가 예쁘셔요.',
    errType: 'THING_HONORIFIC',
    explanation: '약봉투는 사물이므로 높임 어미 "-시-"를 사용하지 않습니다.'
  },
  {
    id: 'q_w1_hosp_2',
    worldId: 1,
    locationId: 'W1_HOSPITAL',
    classCode: 'GLOBAL',
    aiRole: '간호사',
    aiDialogue: '환자분, 다음 진료 순서입니다. 진료실로 들어오세요.',
    correctAnswer: '네, 지금 들어가겠습니다.',
    wrongAnswer: '네, 지금 들어가시겠습니다.',
    errType: 'COMMAND_DIRECTION',
    explanation: '자신이 할 행동에는 상대방 높임 어미 "-시-"를 붙이지 않습니다.'
  },
  {
    id: 'q_w1_hosp_3',
    worldId: 1,
    locationId: 'W1_HOSPITAL',
    classCode: 'GLOBAL',
    aiRole: '의사 선생님',
    aiDialogue: '어디가 불편해서 진찰을 받으러 오셨나요?',
    correctAnswer: '어제부터 제 배가 아팠어요.',
    wrongAnswer: '어제부터 제 배가 아프셨어요.',
    errType: 'SELF_HONORIFIC',
    explanation: '자신의 몸(배)에는 높임표현 "-시-"를 붙이지 않습니다.'
  },

  // --- WORLD 1: MART ---
  {
    id: 'q_w1_mart_1',
    worldId: 1,
    locationId: 'W1_MART',
    classCode: 'GLOBAL',
    aiRole: '할아버지 어르신',
    aiDialogue: '학생, 내가 눈이 침침해서 그런데 이 두부의 유통기한을 읽어줄 수 있겠나?',
    correctAnswer: '할아버지, 2026년까지라고 적혀 있어요.',
    wrongAnswer: '할아버지, 2026년까지라고 적혀 계세요.',
    errType: 'SPECIAL_WORD',
    explanation: '유통기한 글자는 사물이므로 "계시다"를 쓰지 않습니다.'
  },
  {
    id: 'q_w1_mart_2',
    worldId: 1,
    locationId: 'W1_MART',
    classCode: 'GLOBAL',
    aiRole: '마트 점원',
    aiDialogue: '손님, 찾으시는 신선한 우유는 저쪽 냉장고에 있습니다.',
    correctAnswer: '이 우유가 더 신선하네요.',
    wrongAnswer: '이 우유가 더 신선하시네요.',
    errType: 'THING_HONORIFIC',
    explanation: '우유는 사물이므로 "-시-"를 붙이지 않습니다.'
  },

  // --- WORLD 1: SCHOOL ---
  {
    id: 'q_w1_sch_1',
    worldId: 1,
    locationId: 'W1_SCHOOL',
    classCode: 'GLOBAL',
    aiRole: '선생님',
    aiDialogue: '우리 반장, 교장선생님께서 지금 어디 계시는지 아니?',
    correctAnswer: '네, 교장선생님께서는 교장실에 계십니다.',
    wrongAnswer: '네, 교장선생님께서는 교장실에 있으십니다.',
    errType: 'SPECIAL_WORD',
    explanation: '윗사람의 위치에는 "있으시다"가 아닌 특수 어휘 "계시다"를 사용합니다.'
  },
  {
    id: 'q_w1_sch_2',
    worldId: 1,
    locationId: 'W1_SCHOOL',
    classCode: 'GLOBAL',
    aiRole: '선생님',
    aiDialogue: '숙제를 완성한 학생은 교탁 앞으로 가져오세요.',
    correctAnswer: '선생님, 제가 공책을 가져다 드릴게요.',
    wrongAnswer: '선생님, 제가 공책을 가져다 주실게요.',
    errType: 'OBJECT_HONORIFIC',
    explanation: '선생님께 제출할 때는 "주다" 대신 "드리다"를 씁니다.'
  },

  // --- WORLD 2: HEUNGBU ---
  {
    id: 'q_w2_hb_1',
    worldId: 2,
    locationId: 'W2_HEUNGBU',
    classCode: 'GLOBAL',
    aiRole: '흥부님',
    aiDialogue: '제비야, 먼 길을 오느라 배가 고플 텐데 음식이라도 먹고 가렴.',
    correctAnswer: '감사합니다. 흥부님께서도 진지 잡수세요.',
    wrongAnswer: '감사합니다. 흥부님께서도 진지 먹으세요.',
    errType: 'SPECIAL_WORD',
    explanation: '윗사람이 음식을 드시는 것은 "먹다"가 아닌 특수 어휘 "잡수시다"를 씁니다.'
  },
  {
    id: 'q_w2_hb_2',
    worldId: 2,
    locationId: 'W2_HEUNGBU',
    classCode: 'GLOBAL',
    aiRole: '흥부님',
    aiDialogue: '아이고, 착한 제비야. 다리가 부러졌는데 어찌할 방도가 없구나.',
    correctAnswer: '흥부님, 제가 다리를 고쳐 드릴게요.',
    wrongAnswer: '흥부님, 내가 다리를 고쳐 드릴게요.',
    errType: 'SELF_HONORIFIC',
    explanation: '윗사람 앞에서는 자신을 낮추어 "제"라고 말합니다.'
  },

  // --- WORLD 2: GOLD AXE ---
  {
    id: 'q_w2_ga_1',
    worldId: 2,
    locationId: 'W2_GOLD_AXE',
    classCode: 'GLOBAL',
    aiRole: '산신령님',
    aiDialogue: '이 번쩍이는 금도끼가 정녕 네 도끼냐?',
    correctAnswer: '아닙니다. 제 도끼는 저 낡은 쇠도끼입니다.',
    wrongAnswer: '아닙니다. 제 도끼는 저 낡은 쇠도끼이십니다.',
    errType: 'THING_HONORIFIC',
    explanation: '쇠도끼는 사물이므로 "-이십니다"로 높이지 않습니다.'
  },

  // --- WORLD 3: FUTURE DRAGON ---
  {
    id: 'q_w3_fd_1',
    worldId: 3,
    locationId: 'W3_FUTURE_DRAGON',
    classCode: 'GLOBAL',
    aiRole: '용왕님',
    aiDialogue: '의사 양반! 머리가 몹시 아프고 열이 나는구나.',
    correctAnswer: '열이 나시나요? 이쪽으로 와서 누우세요.',
    wrongAnswer: '열이 나시나요? 이쪽으로 와서 누우실게요.',
    errType: 'COMMAND_DIRECTION',
    explanation: '지시 권유할 때 어색한 "-실게요" 어미를 오용하지 않습니다.'
  },
  {
    id: 'q_w3_fd_2',
    worldId: 3,
    locationId: 'W3_FUTURE_DRAGON',
    classCode: 'GLOBAL',
    aiRole: '용왕님',
    aiDialogue: '이 처방 약을 먹으면 내 지병이 씻은 듯 낫는단 말이냐?',
    correctAnswer: '네, 어디가 편찮으신지 자세히 알려주세요.',
    wrongAnswer: '네, 어디가 아프신지 자세히 알려주세요.',
    errType: 'SPECIAL_WORD',
    explanation: '윗사람의 편찮으신 상태는 "아프시다"보다 특수 어휘 "편찮으시다"가 정제된 높임 표현입니다.'
  }
];

/**
 * Banmal Monster Dungeon Initial Preset Pool
 */
export const INITIAL_DUNGEON_QUESTS = [
  {
    id: 'dq_1',
    classCode: 'GLOBAL',
    monsterAttack: '할아버지 밥 먹어!',
    correctBlocks: ['할아버지께서', '진지를', '잡수십니다.'],
    trapBlocks: ['할아버지가', '밥을', '드십니다.'],
    errType: 'SPECIAL_WORD',
    explanation: '할아버지께는 "께서", "진지", "잡수십니다."를 사용하여 조합합니다.'
  },
  {
    id: 'dq_2',
    classCode: 'GLOBAL',
    monsterAttack: '선생님한테 책 줘!',
    correctBlocks: ['선생님께', '책을', '드립니다.'],
    trapBlocks: ['선생님한테', '책을', '줍니다.'],
    errType: 'OBJECT_HONORIFIC',
    explanation: '윗사람에게는 "께", "드립니다."를 조합해야 방어할 수 있습니다.'
  },
  {
    id: 'dq_3',
    classCode: 'GLOBAL',
    monsterAttack: '할머니 집에 있어!',
    correctBlocks: ['할머니께서', '댁에', '계십니다.'],
    trapBlocks: ['할머니가', '집에', '있으십니다.'],
    errType: 'SPECIAL_WORD',
    explanation: '집->댁, 있다->계시다 특수어휘를 조합하여 문장을 완성하세요.'
  },
  {
    id: 'dq_4',
    classCode: 'GLOBAL',
    monsterAttack: '약봉투 예쁘셔!',
    correctBlocks: ['약봉투가', '아주', '예쁩니다.'],
    trapBlocks: ['약봉투가', '아주', '예쁘십니다.'],
    errType: 'THING_HONORIFIC',
    explanation: '사물인 약봉투에는 "-시-"를 붙이지 않습니다.'
  }
];
