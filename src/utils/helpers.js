/**
 * Helper utility functions for 존댓말 차원 탐험대
 */

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Badge Icons mapping per location ID
export const LOCATION_BADGE_MAP = {
  // World 1
  'W1_HOSPITAL': { icon: '🏥', name: '청진기 배지', example: '할머니께서는 의사 선생님께 진찰을 받으셨습니다.' },
  'W1_MART': { icon: '🛒', name: '장바구니 배지', example: '할아버지, 유통기한은 2026년까지라고 적혀 있어요.' },
  'W1_SCHOOL': { icon: '🏫', name: '참잘했어요 배지', example: '선생님, 제가 공책을 가져다 드릴게요.' },
  'W1_RESTAURANT': { icon: '🍲', name: '진지 배지', example: '할머니께서는 맛있는 진지를 잡수셨습니다.' },
  'W1_POST': { icon: '📮', name: '우체통 배지', example: '우체부 아저씨께 편지를 전달해 드렸습니다.' },
  'W1_POLICE': { icon: '🚨', name: '포돌이 배지', example: '경찰관 아저씨, 길을 가르쳐 주셔서 감사합니다.' },
  'W1_FIRE': { icon: '🚒', name: '소방관 배지', example: '소방관님께서 위험에 처한 시민을 구하셨습니다.' },
  'W1_LIBRARY': { icon: '📚', name: '지식 배지', example: '사서 선생님, 이 책은 어디에 있나요?' },
  'W1_BANK': { icon: '🪙', name: '저금통 배지', example: '행원 누나, 통장을 개설하러 왔습니다.' },
  'W1_BUS': { icon: '🚌', name: '버스 배지', example: '어르신, 여기 자리에 앉으세요.' },

  // World 2
  'W2_HEUNGBU': { icon: '🪺', name: '박씨 배지', example: '흥부님, 제가 다리를 고쳐 드릴게요.' },
  'W2_RABBIT': { icon: '🐢', name: '별주부 배지', example: '용왕님께서는 간이 몹시 필요하십니다.' },
  'W2_FAIRY': { icon: '🪽', name: '날개옷 배지', example: '선녀님, 날개옷은 여기에 있습니다.' },
  'W2_KONGJWI': { icon: '🪓', name: '두꺼비 배지', example: '어머니, 제가 밑 빠진 독을 채워 드릴게요.' },
  'W2_FART': { icon: '💨', name: '배나무 배지', example: '시아버님, 조심히 비키세요.' },
  'W2_SHIMCHONG': { icon: '🪷', name: '인당수 배지', example: '아버지, 눈을 뜨고 저를 보세요.' },
  'W2_GOLD_AXE': { icon: '🪓', name: '산신령 배지', example: '산신령님, 저에게 큰 상을 주셔서 감사합니다.' },
  'W2_SUN_MOON': { icon: '🐯', name: '동아줄 배지', example: '어머니께서 떡을 주시러 오셨습니다.' },
  'W2_LUMP': { icon: '🎵', name: '혹부리 배지', example: '도깨비님, 제 혹을 가져가세요.' },
  'W2_MAGPIE': { icon: '🔔', name: '종소리 배지', example: '선비님, 목숨을 건져 주셔서 감사합니다.' },

  // World 3
  'W3_FUTURE_DRAGON': { icon: '🐉', name: '미래용왕 배지', example: '용왕님, 어디가 편찮으신지 알려주세요.' },
  'W3_MART_ZARA': { icon: '🪼', name: '수산물 배지', example: '전복은 저쪽 수산물 코너에 있습니다.' },
  'W3_SCHOOL_DEER': { icon: '🦌', name: '차원사슴 배지', example: '사슴님께서 교실로 들어오셨습니다.' },
  'W3_REST_SIM': { icon: '🍚', name: '심봉사 배지', example: '심봉사 어르신, 진지 잡수세요.' },
  'W3_POST_GOBLIN': { icon: '👹', name: '방망이 배지', example: '도깨비님께 편지를 전해 드렸습니다.' },
  'W3_POLICE_FAIRY': { icon: '👑', name: '차원선녀 배지', example: '선녀님께서 조서를 작성하셨습니다.' },
  'W3_FIRE_TIGER': { icon: '🔥', name: '불호랑이 배지', example: '호랑이님, 안전하게 탈출하세요.' },
  'W3_LIB_KONGJWI': { icon: '📖', name: '스마트 배지', example: '콩쥐님께서 동화책을 읽으십니다.' },
  'W3_BANK_NOLBU': { icon: '💰', name: '황금 배지', example: '놀부님께서 예금을 신청하셨습니다.' },
  'W3_BUS_MAGPIE': { icon: '⚡', name: '차원통합 마스터 배지', example: '차원 대통합을 모두 정복하셨습니다!' }
};
