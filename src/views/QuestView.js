/**
 * QuestView Component
 * 5-Turn Hybrid AI Chat & 2-Choice Honorific Quiz Engine.
 * Instant failure on 1 wrong choice.
 * Badge unlock on 5/5 consecutive success.
 */

import { WORLDS_DATA } from '../data/initialData.js';
import { HONORIFIC_ERROR_TYPES } from '../data/honorificRules.js';
import { LOCATION_BADGE_MAP } from '../utils/helpers.js';
import { shuffleArray } from '../utils/shuffle.js';
import { storage } from '../firebase.js';
import { sound } from '../audio.js';

export function renderQuestView(container, user, { worldId, locationId, onQuestComplete, onQuestFail, showModal }) {
  const world = WORLDS_DATA.find(w => w.id === worldId);
  const location = world?.locations.find(l => l.id === locationId);

  // Fetch candidate questions from DB (Global + Teacher Custom for student's class)
  const candidateQuestions = storage.getQuestQuestions(worldId, locationId, user.classCode);
  
  // Pick up to 5 questions (or repeat shuffled if pool is smaller)
  let turnQuestions = shuffleArray(candidateQuestions);
  if (turnQuestions.length < 5) {
    while (turnQuestions.length < 5 && candidateQuestions.length > 0) {
      turnQuestions = turnQuestions.concat(shuffleArray(candidateQuestions));
    }
  }
  turnQuestions = turnQuestions.slice(0, 5);

  let currentTurn = 0; // 0 to 4 (representing turns 1 to 5)

  const renderTurn = () => {
    if (currentTurn >= 5) {
      handleSuccess();
      return;
    }

    const q = turnQuestions[currentTurn];
    
    // Prepare 2-choice options using Fisher-Yates Shuffle
    const options = shuffleArray([
      { text: q.correctAnswer, isCorrect: true },
      { text: q.wrongAnswer, isCorrect: false }
    ]);

    container.innerHTML = `
      <div class="quest-container">
        <div class="quest-header">
          <div>
            <span style="color: var(--accent-cyan); font-size: 0.85rem;">
              ${world.name} &gt; ${location.icon} ${location.name}
            </span>
            <h2 style="color: var(--accent-yellow); font-size: 1.3rem;">
              ${location.role}와의 5턴 대화
            </h2>
          </div>

          <div class="turn-indicator">
            Turn <span style="font-size: 1.4rem; font-weight: bold; color: var(--accent-green);">${currentTurn + 1}</span> / 5
          </div>
        </div>

        <!-- AI Dialogue Box -->
        <div class="chat-box">
          <div class="ai-character-profile">
            <div class="ai-avatar">${location.icon}</div>
            <div>
              <div style="color: var(--accent-yellow); font-weight: bold; font-size: 1rem;">
                ${q.aiRole || location.role}
              </div>
              <span style="color: var(--text-muted); font-size: 0.75rem;">대화 참여 중...</span>
            </div>
          </div>

          <div class="ai-dialogue-bubble">
            "${q.aiDialogue}"
          </div>
        </div>

        <!-- 2-Choice Options Layout (Side by Side Retro Cards) -->
        <div class="text-center style="margin-bottom: 8px;">
          <p style="color: var(--accent-cyan); font-size: 0.9rem;">
            💡 아래 2개 선택지 중 올바른 존댓말 표현을 선택하세요!
          </p>
        </div>

        <div class="quiz-options-container">
          ${options.map((opt, idx) => `
            <button class="choice-card" data-correct="${opt.isCorrect}" data-text="${opt.text}">
              <span style="margin-right: 8px; color: var(--accent-yellow); font-weight: bold;">${idx + 1}.</span>
              "${opt.text}"
            </button>
          `).join('')}
        </div>
      </div>
    `;

    bindTurnEvents(q);
  };

  const bindTurnEvents = (currentQuestion) => {
    container.querySelectorAll('.choice-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const isCorrect = e.currentTarget.dataset.correct === 'true';
        const userChoice = e.currentTarget.dataset.text;

        if (isCorrect) {
          sound.playCorrect();
          currentTurn++;
          renderTurn();
        } else {
          // Instant Failure Rule
          sound.playWrong();
          handleFailure(currentQuestion, userChoice);
        }
      });
    });
  };

  const handleFailure = (question, userChoice) => {
    const errInfo = HONORIFIC_ERROR_TYPES[question.errType] || {
      name: '높임표현 오류',
      tip: '올바른 높임표현을 선택해야 합니다.'
    };

    // Log student wrong answer to DB/Storage
    storage.logStudentWrongAnswer(user.studentId, {
      worldId,
      location: `${world.name} - ${location.name}`,
      userChoice,
      correctChoice: question.correctAnswer,
      feedback: question.explanation || errInfo.desc,
      errType: question.errType,
      timestamp: new Date().toISOString()
    });

    showModal(`
      <div class="text-center" style="padding: 10px;">
        <div style="font-size: 3.5rem; margin-bottom: 10px;">🚪💨</div>
        <h3 style="color: var(--accent-red); font-size: 1.4rem; margin-bottom: 10px;">
          AI 챗봇이 대화방을 나가버렸습니다! (미션 실패)
        </h3>
        <p style="color: var(--text-main); font-size: 0.95rem; margin-bottom: 16px;">
          잘못된 높임표현을 사용하여 대화가 중단되었습니다.
        </p>

        <div style="background: #140d2e; border: 2px solid var(--accent-red); padding: 14px; border-radius: 8px; font-size: 0.9rem; text-align: left; margin-bottom: 20px;">
          <div style="color: var(--accent-yellow); font-weight: bold; margin-bottom: 6px;">
            ⚠️ 오답 분석 요약: [${errInfo.name}]
          </div>
          <div style="color: #ffb7c5; margin-bottom: 4px;">❌ 내가 선택한 답변: "${userChoice}"</div>
          <div style="color: var(--accent-green); margin-bottom: 8px;">✅ 올바른 정답: "${question.correctAnswer}"</div>
          <div style="color: var(--accent-cyan); font-size: 0.85rem;">💡 힌트: ${question.explanation || errInfo.tip}</div>
        </div>

        <button id="btn-modal-fail-confirm" class="pixel-btn btn-danger" style="width: 100%;">
          🔄 로비로 돌아가기
        </button>
      </div>
    `);

    setTimeout(() => {
      document.querySelector('#btn-modal-fail-confirm')?.addEventListener('click', () => {
        onQuestFail();
      });
    }, 100);
  };

  const handleSuccess = () => {
    sound.playFanfare();
    const badgeInfo = LOCATION_BADGE_MAP[locationId] || { icon: '🎖️', name: '퀘스트 배지', example: '올바른 높임표현입니다.' };
    
    // Save badge to student
    storage.updateStudentBadges(user.studentId, locationId);

    showModal(`
      <div class="text-center" style="padding: 10px;">
        <div style="font-size: 4.5rem; margin-bottom: 10px; animation: bounce 1s infinite alternate;">${badgeInfo.icon}</div>
        <h3 style="color: var(--accent-yellow); font-size: 1.5rem; margin-bottom: 10px;">
          🎉 5턴 대화 미션 100점 달성!
        </h3>
        <p style="color: var(--accent-green); font-size: 1.1rem; font-weight: bold; margin-bottom: 16px;">
          '${badgeInfo.name}'을(를) 획득하셨습니다!
        </p>

        <div style="background: #140d2e; border: 2px solid var(--accent-green); padding: 14px; border-radius: 8px; font-size: 0.95rem; text-align: left; margin-bottom: 20px; color: #fff;">
          <span style="color: var(--accent-cyan); font-weight: bold;">📜 올바른 존댓말 활용 예문:</span>
          <p style="margin-top: 6px; color: var(--accent-green);">"${badgeInfo.example}"</p>
        </div>

        <button id="btn-modal-success-confirm" class="pixel-btn btn-success" style="width: 100%;">
          🏆 배지 수집함 확인하기 (로비)
        </button>
      </div>
    `);

    setTimeout(() => {
      document.querySelector('#btn-modal-success-confirm')?.addEventListener('click', () => {
        onQuestComplete();
      });
    }, 100);
  };

  renderTurn();
}
