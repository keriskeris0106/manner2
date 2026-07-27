/**
 * Honorific Rules Definition Taxonomy for 3rd Grade Elementary Korean
 */

export const HONORIFIC_ERROR_TYPES = {
  THING_HONORIFIC: {
    code: 'THING_HONORIFIC',
    name: '사물 높임 오류',
    desc: '사람이 아닌 사물, 상태, 포장물 등을 잘못 높이는 표현입니다. (예: 약봉투가 예쁘셔요 -> 예뻐요 / 우유가 신선하시네요 -> 신선하네요)',
    tip: '사물에는 "-시-"를 붙이지 않습니다.'
  },
  SPECIAL_WORD: {
    code: 'SPECIAL_WORD',
    name: '특수 어휘 미사용/오용',
    desc: '윗사람에게 써야 하는 전용 높임 어휘(진지, 잡수시다, 계시다, 드리다, 편찮으시다 등)를 놓친 표현입니다.',
    tip: '밥->진지, 먹다->잡수시다, 있다->계시다, 주다->드리다, 아프다->편찮으시다'
  },
  SUBJECT_HONORIFIC: {
    code: 'SUBJECT_HONORIFIC',
    name: '주체 높임 오류',
    desc: '문장의 주어(행동의 주체인 윗사람)를 높이지 않거나 잘못 높인 표현입니다. (예: 은/는 대신 께서 사용)',
    tip: '주어가 윗사람일 때는 "께서", 서술어에 "-시-"를 사용합니다.'
  },
  OBJECT_HONORIFIC: {
    code: 'OBJECT_HONORIFIC',
    name: '객체 높임 오류',
    desc: '행동을 받는 대상(윗사람)에게 "에게/한테" 대신 "께", "주다" 대신 "드리다"를 쓰지 않은 표현입니다.',
    tip: '윗사람 대상에게는 "께", "드리다"를 사용합니다.'
  },
  SELF_HONORIFIC: {
    code: 'SELF_HONORIFIC',
    name: '자신 높임/겸양어 오류',
    desc: '자기 자신이나 자기 신체를 윗사람 앞에서 잘못 높인 표현입니다. (예: 제 배가 아프셨어요 -> 아팠어요 / 내가 -> 제가)',
    tip: '자신의 행동이나 신체에는 높임표현 "-시-"를 붙이지 않으며 자신을 낮출 땐 "저/제"를 씁니다.'
  },
  COMMAND_DIRECTION: {
    code: 'COMMAND_DIRECTION',
    name: '지시/권유 표현 오류',
    desc: '자신이 할 행동에 상대방 높임 어미 "-실게요/오실게요"를 잘못 붙이는 표현입니다. (예: 제가 들어가시겠습니다 -> 들어가겠습니다)',
    tip: '내가 할 행동에는 "-실게요"를 붙이지 않습니다.'
  }
};
