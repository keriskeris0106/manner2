/**
 * DungeonView Component
 * Banmal Monster Survival Dungeon (어절 블록 조합 방어 게임)
 * Features Subject + Object/Complement + Predicate (with period .) block assembly.
 * Prioritizes teacher custom questions for class students.
 */

import { storage } from '../firebase.js';
import { shuffleArray } from '../utils/shuffle.js';
import { sound } from '../audio.js';

export function renderDungeonView(container, user, { onExitDungeon, showModal }) {
  const questPool = storage.getDungeonQuests(user.classCode);
  let questions = shuffleArray(questPool);
  let currentIndex = 0;
  let score = 0;
  let hearts = 3;
  let selectedBlocks = [];

  const renderStage = () => {
    if (hearts <= 0) {
      handleGameOver();
      return;
    }

    if (currentIndex >= questions.length) {
      // Loop or victory condition
      questions = shuffleArray(questPool);
      currentIndex = 0;
    }

    const currentQ = questions[currentIndex];
    
    // Mix correct blocks + trap blocks into a randomized pool
    const allBlocksPool = shuffleArray([...currentQ.correctBlocks, ...currentQ.trapBlocks]);

    container.innerHTML = `
      <div class="dungeon-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <button id="btn-dungeon-exit" class="pixel-btn btn-xs btn-outline">
            ⬅️ 로비로 탈출
          </button>
          
          <div style="font-size: 1.2rem;">
            ❤️ 하트: ${'❤️'.repeat(hearts)}${'🖤'.repeat(3 - hearts)}
          </div>

          <div style="font-size: 1.1rem; color: var(--accent-yellow); font-weight: bold;">
            🏆 방어 점수: <span style="font-size: 1.4rem;">${score}</span> 점
          </div>
        </div>

        <!-- Monster Stage -->
        <div class="monster-stage">
          <div class="monster-avatar">👿</div>
          <div class="monster-speech">
            " 👾 반말 공격: ${currentQ.monsterAttack} "
          </div>
        </div>

        <!-- Selected Sentence Slot Zone -->
        <div class="text-center" style="margin-bottom: 6px;">
          <p style="color: var(--accent-cyan); font-size: 0.85rem;">
            👇 아래 어절 조각을 순서대로 클릭하여 올바른 존댓말 문장을 조립하세요!
          </p>
        </div>

        <div class="answer-slot-zone" id="selected-slots">
          ${renderSelectedSlots()}
        </div>

        <!-- Available Word Blocks Pool -->
        <div class="blocks-pool-zone" id="blocks-pool">
          ${allBlocksPool.map((b, idx) => {
            const isUsed = selectedBlocks.includes(b);
            const isPredicate = b.endsWith('.');
            return `
              <button 
                class="word-block ${isPredicate ? 'predicate-block' : ''} ${isUsed ? 'hidden' : ''}" 
                data-block="${b}"
              >
                ${b}
              </button>
            `;
          }).join('')}
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 20px;">
          <button id="btn-reset-blocks" class="pixel-btn btn-outline btn-xs">
            🔄 블록 다시 선택
          </button>
          <button id="btn-submit-blocks" class="pixel-btn btn-success" style="padding: 10px 24px;">
            🛡️ 몬스터 공격 방어하기!
          </button>
        </div>
      </div>
    `;

    bindEvents(currentQ);
  };

  const renderSelectedSlots = () => {
    if (selectedBlocks.length === 0) {
      return `<span style="color: var(--text-muted); font-size: 0.9rem;">(여기에 조립된 어절 블록이 들어옵니다)</span>`;
    }
    return selectedBlocks.map((b, idx) => `
      <span class="word-block" style="background: var(--accent-green); color: #000; border-color: #000;" data-idx="${idx}">
        ${b}
      </span>
    `).join('');
  };

  const bindEvents = (currentQ) => {
    // Exit button
    container.querySelector('#btn-dungeon-exit')?.addEventListener('click', () => {
      sound.playClick();
      onExitDungeon();
    });

    // Word Block Click (Select)
    container.querySelectorAll('#blocks-pool .word-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const block = e.currentTarget.dataset.block;
        if (block && !selectedBlocks.includes(block)) {
          sound.playClick();
          selectedBlocks.push(block);
          container.querySelector('#selected-slots').innerHTML = renderSelectedSlots();
          e.currentTarget.classList.add('hidden');
        }
      });
    });

    // Reset Blocks Button
    container.querySelector('#btn-reset-blocks')?.addEventListener('click', () => {
      sound.playClick();
      selectedBlocks = [];
      renderStage();
    });

    // Submit / Defense Attack Button
    container.querySelector('#btn-submit-blocks')?.addEventListener('click', () => {
      if (selectedBlocks.length === 0) return;

      const isExactMatch = 
        selectedBlocks.length === currentQ.correctBlocks.length &&
        selectedBlocks.every((val, idx) => val === currentQ.correctBlocks[idx]);

      if (isExactMatch) {
        sound.playCorrect();
        score += 10;
        selectedBlocks = [];
        currentIndex++;
        renderStage();
      } else {
        sound.playWrong();
        hearts--;
        selectedBlocks = [];
        showModal(`
          <div class="text-center" style="padding: 10px;">
            <div style="font-size: 3rem; margin-bottom: 8px;">💥💔</div>
            <h3 style="color: var(--accent-red); font-size: 1.3rem; margin-bottom: 8px;">
              방어 실패! (하트 -1)
            </h3>
            <p style="color: var(--text-main); font-size: 0.9rem; margin-bottom: 12px;">
              올바른 어절 순서 및 존댓말 표현이 아닙니다.
            </p>
            <div style="background: #140d2e; border: 2px solid var(--accent-green); padding: 12px; border-radius: 6px; font-size: 0.95rem; text-align: left;">
              <span style="color: var(--accent-yellow);">✅ 올바른 방어 문장 조합:</span>
              <div style="color: var(--accent-green); font-size: 1.1rem; font-weight: bold; margin-top: 6px;">
                "${currentQ.correctBlocks.join(' ')}"
              </div>
            </div>
            <button id="btn-modal-dungeon-retry" class="pixel-btn btn-warning" style="width: 100%; margin-top: 16px;">
              🛡️ 다시 도전하기
            </button>
          </div>
        `);

        setTimeout(() => {
          document.querySelector('#btn-modal-dungeon-retry')?.addEventListener('click', () => {
            renderStage();
          });
        }, 100);
      }
    });
  };

  const handleGameOver = () => {
    sound.playWrong();

    // Save leaderboard entry
    storage.saveLeaderboardScore({
      studentId: user.studentId || 'guest',
      name: user.name || '학생',
      classTitle: `${user.grade || '3'}학년 ${user.classNum || '1'}반`,
      score,
      title: score >= 50 ? '🛡️ 전설의 존댓말 던전 수호자' : '🛡️ 신입 존댓말 방어대원',
      updatedAt: new Date().toISOString()
    });

    showModal(`
      <div class="text-center" style="padding: 10px;">
        <div style="font-size: 4rem; margin-bottom: 8px;">💀</div>
        <h3 style="color: var(--accent-red); font-size: 1.4rem; margin-bottom: 8px;">
          몬스터 던전 서바이벌 종료!
        </h3>
        <p style="color: var(--accent-yellow); font-size: 1.2rem; font-weight: bold; margin-bottom: 16px;">
          최종 누적 점수: ${score} 점
        </p>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">
          명예의 전당 (리더보드)에 내 기록이 등록되었습니다.
        </p>

        <button id="btn-modal-dungeon-end" class="pixel-btn btn-primary" style="width: 100%;">
          🏠 로비로 돌아가기
        </button>
      </div>
    `);

    setTimeout(() => {
      document.querySelector('#btn-modal-dungeon-end')?.addEventListener('click', () => {
        onExitDungeon();
      });
    }, 100);
  };

  renderStage();
}
