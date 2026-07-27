/**
 * Initial Presets & Data Pool for [존댓말 차원 탐험대]
 * Includes 3 Worlds (30 Locations total) & Pre-populated 2-Choice Database Questions.
 */

export const WORLDS_DATA = [
  {
    id: 1,
    name: '월드 1: 시끌벅적 우리 마을',
    desc: '일상 생활 장소에서 사용하는 올바른 존댓말을 배워보세요!',
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
 * Note: Sentences are 100% identical in structure and vocabulary except for the honorific point!
 */
export const PRESET_QUEST_DATABASE = [
  // --- WORLD 1: HOSPITAL ---
  {
    id: 'q_w1_hosp_1',
    worldId: 1,
    locationId: 'W1_HOSPITAL',
    classCode: 'GLOBAL',
    aiRole: '간호사',
    aiDialogue: '환자분, 약봉투 여기 있으십니다.',
    correctAnswer: '우와, 약봉투가 예뻐요.',
    wrongAnswer: '우와, 약봉투가 예쁘셔요.',
    errType: 'THING_HONORIFIC',
    explanation: '약봉투는 사람이 아닌 사물이므로 높임 어미 "-시-"를 사용하지 않습니다.'
  },
  {
    id: 'q_w1_hosp_2',
    worldId: 1,
    locationId: 'W1_HOSPITAL',
    classCode: 'GLOBAL',
    aiRole: '간호사',
    aiDialogue: '환자분, 이제 진료실로 들어오실게요.',
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
    aiRole: '의사',
    aiDialogue: '어디가 아파서 왔니?',
    correctAnswer: '어제부터 제 배가 아팠어요.',
    wrongAnswer: '어제부터 제 배가 아프셨어요.',
    errType: 'SELF_HONORIFIC',
    explanation: '자기 자신이나 자신의 몸(배)에는 높임표현 "-시-"를 붙이지 않습니다.'
  },
  {
    id: 'q_w1_hosp_4',
    worldId: 1,
    locationId: 'W1_HOSPITAL',
    classCode: 'GLOBAL',
    aiRole: '의사',
    aiDialogue: '할머니께 처방전을 전달해 드리렴.',
    correctAnswer: '네, 제가 할머니께 전해 드릴게요.',
    wrongAnswer: '네, 내가 할머니께 전해 드릴게요.',
    errType: 'SELF_HONORIFIC',
    explanation: '윗사람 앞에서는 "내"가 아닌 자신을 낮추는 "제"를 사용해야 합니다.'
  },
  {
    id: 'q_w1_hosp_5',
    worldId: 1,
    locationId: 'W1_HOSPITAL',
    classCode: 'GLOBAL',
    aiRole: '간호사',
    aiDialogue: '할머니, 주사 맞으실 차례입니다.',
    correctAnswer: '할머니, 제가 손을 잡아 드릴게요.',
    wrongAnswer: '할머니, 제가 손을 잡아 주실게요.',
    errType: 'OBJECT_HONORIFIC',
    explanation: '윗사람에게 행하는 도움 행동에는 "주다" 대신 "드리다"를 씁니다.'
  },

  // --- WORLD 1: MART ---
  {
    id: 'q_w1_mart_1',
    worldId: 1,
    locationId: 'W1_MART',
    classCode: 'GLOBAL',
    aiRole: '할아버지',
    aiDialogue: '학생, 내가 눈이 침침해서 그런데 이 두부는 유통기한이 언제까지로 적혀 있나?',
    correctAnswer: '할아버지, 2026년까지라고 적혀 있어요.',
    wrongAnswer: '할아버지, 2026년까지라고 적혀 계세요.',
    errType: 'SPECIAL_WORD',
    explanation: '유통기한 글자는 높임 대상이 아니므로 "계시다"를 쓸 수 없습니다.'
  },
  {
    id: 'q_w1_mart_2',
    worldId: 1,
    locationId: 'W1_MART',
    classCode: 'GLOBAL',
    aiRole: '점원',
    aiDialogue: '손님, 찾으시는 우유는 저쪽 냉장고에 있으십니다.',
    correctAnswer: '이 우유가 더 신선하네요.',
    wrongAnswer: '이 우유가 더 신선하시네요.',
    errType: 'THING_HONORIFIC',
    explanation: '우유는 사물이므로 높임 어미 "-시-"를 붙이면 사물 높임 오류가 됩니다.'
  },
  {
    id: 'q_w1_mart_3',
    worldId: 1,
    locationId: 'W1_MART',
    classCode: 'GLOBAL',
    aiRole: '점원',
    aiDialogue: '계산 도와드리겠습니다.',
    correctAnswer: '선생님, 이 장바구니를 받아 주세요.',
    wrongAnswer: '선생님, 이 장바구니를 받아 주실게요.',
    errType: 'COMMAND_DIRECTION',
    explanation: '상대방에게 요청할 때는 "-실게요"가 아닌 올바른 정중 표현을 사용합니다.'
  },
  {
    id: 'q_w1_mart_4',
    worldId: 1,
    locationId: 'W1_MART',
    classCode: 'GLOBAL',
    aiRole: '할머니',
    aiDialogue: '얘야, 사과가 참 빨갛고 맛있어 보이는구나.',
    correctAnswer: '할머니, 제가 사과 하나를 담아 드릴게요.',
    wrongAnswer: '할머니, 제가 사과 하나를 담아 주실게요.',
    errType: 'OBJECT_HONORIFIC',
    explanation: '윗사람인 할머니께 행동할 때는 "드리다"가 바른 표현입니다.'
  },
  {
    id: 'q_w1_mart_5',
    worldId: 1,
    locationId: 'W1_MART',
    classCode: 'GLOBAL',
    aiRole: '점원',
    aiDialogue: '영수증 필요하신가요?',
    correctAnswer: '아니요, 영수증은 버려 주세요.',
    wrongAnswer: '아니요, 영수증은 버려 주실게요.',
    errType: 'COMMAND_DIRECTION',
    explanation: '부탁하거나 요구할 때 불필요한 "-실게요"를 오용하지 않습니다.'
  },

  // --- WORLD 1: SCHOOL ---
  {
    id: 'q_w1_sch_1',
    worldId: 1,
    locationId: 'W1_SCHOOL',
    classCode: 'GLOBAL',
    aiRole: '선생님',
    aiDialogue: '우리 반장, 교장선생님 지금 어디 계시는지 아니?',
    correctAnswer: '네, 교장선생님께서는 교장실에 계십니다.',
    wrongAnswer: '네, 교장선생님께서는 교장실에 있으십니다.',
    errType: 'SPECIAL_WORD',
    explanation: '윗사람이 특정 장소에 있는 것은 "있으시다"가 아닌 특수 어휘 "계시다"를 씁니다.'
  },
  {
    id: 'q_w1_sch_2',
    worldId: 1,
    locationId: 'W1_SCHOOL',
    classCode: 'GLOBAL',
    aiRole: '선생님',
    aiDialogue: '숙제 다 한 사람은 선생님한테 공책을 가져오렴.',
    correctAnswer: '선생님, 제가 공책을 가져다 드릴게요.',
    wrongAnswer: '선생님, 제가 공책을 가져다 주실게요.',
    errType: 'OBJECT_HONORIFIC',
    explanation: '선생님께 드릴 때는 "주다"가 아닌 "드리다"를 씁니다.'
  },
  {
    id: 'q_w1_sch_3',
    worldId: 1,
    locationId: 'W1_SCHOOL',
    classCode: 'GLOBAL',
    aiRole: '교장선생님',
    aiDialogue: '오늘 발표를 참 잘하는구나!',
    correctAnswer: '칭찬해 주셔서 감사합니다.',
    wrongAnswer: '칭찬해 주셔서 감사하시겠습니다.',
    errType: 'COMMAND_DIRECTION',
    explanation: '감사의 표현을 할 때 자신의 감정에 "-시-"를 높여 붙이지 않습니다.'
  },
  {
    id: 'q_w1_sch_4',
    worldId: 1,
    locationId: 'W1_SCHOOL',
    classCode: 'GLOBAL',
    aiRole: '선생님',
    aiDialogue: '어제 담임 선생님께 말씀드렸니?',
    correctAnswer: '네, 제가 어제 선생님께 여쭤보았습니다.',
    wrongAnswer: '네, 내가 어제 선생님께 여쭤보았습니다.',
    errType: 'SELF_HONORIFIC',
    explanation: '선생님 앞에서는 자신을 낮춰 "제"나 "저"라고 해야 합니다.'
  },
  {
    id: 'q_w1_sch_5',
    worldId: 1,
    locationId: 'W1_SCHOOL',
    classCode: 'GLOBAL',
    aiRole: '선생님',
    aiDialogue: '청소 도구함이 깨끗해졌구나.',
    correctAnswer: '저희가 깨끗하게 정돈했습니다.',
    wrongAnswer: '우리들이 깨끗하게 정돈하셨습니다.',
    errType: 'SELF_HONORIFIC',
    explanation: '자신들의 행동에는 "-시-"를 붙여 높이지 않습니다.'
  },

  // --- WORLD 2: HEUNGBU ---
  {
    id: 'q_w2_hb_1',
    worldId: 2,
    locationId: 'W2_HEUNGBU',
    classCode: 'GLOBAL',
    aiRole: '흥부',
    aiDialogue: '제비야, 배가 고플 텐데 밥이라도 먹고 가렴.',
    correctAnswer: '감사합니다. 흥부님께서도 진지 잡수세요.',
    wrongAnswer: '감사합니다. 흥부님께서도 진지 먹으세요.',
    errType: 'SPECIAL_WORD',
    explanation: '윗사람이 밥을 먹는 행동은 "먹다"가 아니라 특수 어휘 "잡수시다/드시다"를 써야 합니다.'
  },
  {
    id: 'q_w2_hb_2',
    worldId: 2,
    locationId: 'W2_HEUNGBU',
    classCode: 'GLOBAL',
    aiRole: '흥부',
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
    aiRole: '산신령',
    aiDialogue: '이 번쩍이는 금도끼가 네 도끼냐?',
    correctAnswer: '아닙니다. 제 도끼는 저 낡은 쇠도끼입니다.',
    wrongAnswer: '아닙니다. 제 도끼는 저 낡은 쇠도끼이십니다.',
    errType: 'THING_HONORIFIC',
    explanation: '쇠도끼는 사물이므로 "-이십니다"로 높이지 않습니다.'
  },
  {
    id: 'q_w2_ga_2',
    worldId: 2,
    locationId: 'W2_GOLD_AXE',
    classCode: 'GLOBAL',
    aiRole: '산신령',
    aiDialogue: '허허, 참으로 정직한 나무꾼이로구나. 상을 주마.',
    correctAnswer: '산신령님, 저에게 큰 상을 주셔서 감사합니다.',
    wrongAnswer: '산신령님, 나에게 큰 상을 주셔서 감사합니다.',
    errType: 'SELF_HONORIFIC',
    explanation: '산신령님(윗사람) 앞에서는 "나" 대신 겸양 표현 "저"를 써야 합니다.'
  },

  // --- WORLD 3: FUTURE DRAGON ---
  {
    id: 'q_w3_fd_1',
    worldId: 3,
    locationId: 'W3_FUTURE_DRAGON',
    classCode: 'GLOBAL',
    aiRole: '용왕님',
    aiDialogue: '의사 양반! 짐의 머리가 몹시 아프고 열이 나는구나.',
    correctAnswer: '열이 나시나요? 이쪽으로 와서 누우세요.',
    wrongAnswer: '열이 나시나요? 이쪽으로 와서 누우실게요.',
    errType: 'COMMAND_DIRECTION',
    explanation: '상대방에게 권유나 지시할 때 어색한 "-실게요" 어미를 지양합니다.'
  },
  {
    id: 'q_w3_fd_2',
    worldId: 3,
    locationId: 'W3_FUTURE_DRAGON',
    classCode: 'GLOBAL',
    aiRole: '용왕님',
    aiDialogue: '이 약을 먹으면 내 병이 씻은 듯 낫는단 말이냐?',
    correctAnswer: '네, 어디가 편찮으신지 자세히 알려주세요.',
    wrongAnswer: '네, 어디가 아프신지 자세히 알려주세요.',
    errType: 'SPECIAL_WORD',
    explanation: '윗사람이 아픈 상태는 "아프시다"보다 특수 어휘 "편찮으시다"가 정제된 높임 표현입니다.'
  },

  // --- WORLD 3: MART ZARA ---
  {
    id: 'q_w3_mz_1',
    worldId: 3,
    locationId: 'W3_MART_ZARA',
    classCode: 'GLOBAL',
    aiRole: '자라',
    aiDialogue: '이보시오! 우리 용왕님께 바칠 싱싱한 전복은 대체 어디에 있단 말이오?',
    correctAnswer: '전복은 저쪽 수산물 코너에 있습니다.',
    wrongAnswer: '전복은 저쪽 수산물 코너에 계십니다.',
    errType: 'THING_HONORIFIC',
    explanation: '전복은 사물이므로 "계시다"로 높이지 않습니다.'
  },
  {
    id: 'q_w3_mz_2',
    worldId: 3,
    locationId: 'W3_MART_ZARA',
    classCode: 'GLOBAL',
    aiRole: '자라',
    aiDialogue: '전복 값이 왜 이리 비싼 것이오? 깎아주시오!',
    correctAnswer: '손님, 계산은 저쪽 계산대에서 하셔야 합니다.',
    wrongAnswer: '손님, 계산은 저쪽 계산대에서 해야 합니다.',
    errType: 'SUBJECT_HONORIFIC',
    explanation: '손님(윗사람)의 행동에는 주체 높임 표현 "-셔야 합니다"를 사용해야 합니다.'
  }
];

/**
 * Banmal Monster Dungeon Initial Preset Pool
 * Blocks format: Subject + Object/Complement + Predicate (with period .)
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
