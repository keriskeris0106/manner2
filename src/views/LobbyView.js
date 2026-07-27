/**
 * LobbyView Component
 * Matched layout with User's Uploaded Reference UI Image.
 * Features Floating Islands, Side Widgets (Missions, Leaderboard, Class Code, Explorer speech),
 * Top Status Bar (Level, Gold, Gems, Hearts), and Instant Badge Verification.
 */

import { WORLDS_DATA } from '../data/initialData.js';
import { LOCATION_BADGE_MAP } from '../utils/helpers.js';
import { storage } from '../firebase.js';
import { sound } from '../audio.js';

export function renderLobbyView(container, user, { onSelectLocation, onEnterDungeon, showModal }) {
  const earnedBadges = user.earnedBadges || [];

  // Calculate World 1 & World 2 completion
  const w1Locations = WORLDS_DATA[0].locations.map(l => l.id);
  const w2Locations = WORLDS_DATA[1].locations.map(l => l.id);
  
  const w1CompletedCount = w1Locations.filter(id => earnedBadges.includes(id)).length;
  const w2CompletedCount = w2Locations.filter(id => earnedBadges.includes(id)).length;
  
  const isWorld3Unlocked = (w1CompletedCount === w1Locations.length) && (w2CompletedCount === w2Locations.length);

  // Leaderboard data
  const leaderboard = storage.getLeaderboard();

  container.innerHTML = `
    <div style="width: 100%;">
      <!-- Top Status & Currency Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="top-profile-badge">
            <div class="avatar-img-box">🧑‍🚀</div>
            <div class="player-level-info">
              <span class="player-title-text">${user.name || '탐험대원'} (${user.grade || '3'}학년)</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 0.7rem; color: var(--accent-yellow);">Lv.7</span>
                <div class="exp-bar-mini"><div class="exp-fill"></div></div>
              </div>
            </div>
          </div>

          <div class="top-currency-container">
            <div class="currency-chip">🪙 1250</div>
            <div class="currency-chip">💎 80</div>
            <div class="currency-chip" style="color: var(--accent-red);">❤️ 5 <span style="font-size: 0.7rem; color: #fff;">MAX</span></div>
          </div>
        </div>

        <!-- Top Right Utility Buttons -->
        <div style="display: flex; gap: 8px;">
          <button id="btn-top-guide" class="pixel-btn btn-outline btn-xs">📖 가이드</button>
          <button id="btn-top-leaderboard" class="pixel-btn btn-outline btn-xs">🏆 명예의 전당</button>
          <button id="btn-top-badges" class="pixel-btn btn-gold btn-xs" style="font-weight: bold;">
            🎖️ 배지 수집함 (${earnedBadges.length}개)
          </button>
        </div>
      </div>

      <!-- Main Mockup 3-Column Layout -->
      <div class="mockup-lobby-layout">
        <!-- LEFT SIDE PANEL -->
        <div class="side-panel">
          <!-- Widget: 오늘의 미션 -->
          <div class="widget-box">
            <div class="widget-title">📜 오늘의 미션</div>
            <p style="font-size: 0.85rem; color: #fff; margin-bottom: 6px;">
              학교에서 선생님께 존댓말로 인사하기
            </p>
            <div class="progress-bar-box">
              <div class="progress-fill" style="width: 100%;"></div>
              <span>1 / 1</span>
            </div>
            <div style="margin-top: 6px; font-size: 0.75rem; color: var(--accent-yellow);">
              보상: 🪙 x 20
            </div>
          </div>

          <!-- Widget: 공지사항 -->
          <div class="widget-box">
            <div class="widget-title">📢 공지사항</div>
            <ul style="font-size: 0.8rem; color: var(--text-muted); list-style: none; padding-left: 0;">
              <li style="margin-bottom: 4px;">• 신규 월드 3 오픈!</li>
              <li style="margin-bottom: 4px;">• 주말 경험치 2배 이벤트!</li>
              <li>• 명예의 전당 업데이트!</li>
            </ul>
          </div>

          <!-- Bottom Left Explorer Character Speech -->
          <div class="character-speech-widget">
            <div class="char-avatar">🧑‍🚀🤖</div>
            <div class="speech-bubble">
              "안녕, 탐험가!<br>우리 함께 존댓말 차원을 탐험해볼까?"
            </div>
          </div>
        </div>

        <!-- CENTER PANEL (Title & World Islands) -->
        <div>
          <!-- Cosmic Title Banner -->
          <div class="center-title-banner">
            <h1 class="cosmic-main-title">존댓말 차원 탐험대</h1>
            <div class="cosmic-sub-title">✨ 올바른 높임표현으로 소통하는 멋진 탐험가가 되자! ✨</div>
          </div>

          <!-- World Floating Islands -->
          <div class="floating-islands-row">
            <!-- World 1 Island -->
            <div class="island-card" id="island-w1">
              <div class="island-badge-number">1</div>
              <div class="island-art">🏡</div>
              <div class="island-title">시끌벅적 우리 마을</div>
              <div class="progress-bar-box">
                <div class="progress-fill" style="width: ${(w1CompletedCount / w1Locations.length) * 100}%;"></div>
                <span>${Math.round((w1CompletedCount / w1Locations.length) * 100)}%</span>
              </div>
            </div>

            <!-- World 2 Island -->
            <div class="island-card" id="island-w2">
              <div class="island-badge-number">2</div>
              <div class="island-art">🏰</div>
              <div class="island-title">신비한 동화 월드</div>
              <div class="progress-bar-box">
                <div class="progress-fill" style="width: ${(w2CompletedCount / w2Locations.length) * 100}%;"></div>
                <span>${Math.round((w2CompletedCount / w2Locations.length) * 100)}%</span>
              </div>
            </div>

            <!-- World 3 Island (Locked condition) -->
            <div class="island-card ${isWorld3Unlocked ? '' : 'locked'}" id="island-w3">
              <div class="island-badge-number">3</div>
              <div class="island-art">${isWorld3Unlocked ? '🌀' : '🔒'}</div>
              <div class="island-title">차원 대통합</div>
              <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">
                ${isWorld3Unlocked ? '탐험 가능!' : '월드 1, 2 배지 100% 획득 시 해금'}
              </div>
            </div>
          </div>

          <!-- Center Action Area (Big Start Button + Bottom Icon Bar) -->
          <div class="center-action-area">
            <button id="btn-main-start" class="btn-big-start">
              🚩 탐험 시작하기
            </button>

            <div class="bottom-icon-bar">
              <button id="btn-action-dungeon" class="pixel-btn btn-primary btn-xs">
                ⚔️ 어절 블록 서바이벌
              </button>
              <button id="btn-action-dict" class="pixel-btn btn-outline btn-xs">
                📖 단어 도감
              </button>
              <button id="btn-action-grammar" class="pixel-btn btn-outline btn-xs">
                💬 높임표현 사전
              </button>
              <button id="btn-action-quests" class="pixel-btn btn-outline btn-xs">
                📜 퀘스트
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDE PANEL -->
        <div class="side-panel">
          <!-- Widget: 명예의 탐험대원 -->
          <div class="widget-box">
            <div class="widget-title">👑 명예의 탐험대원</div>
            <div style="font-size: 0.8rem; display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between;">
                <span>🥇 김주아</span>
                <span style="color: var(--accent-yellow); font-weight: bold;">12,850</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>🥈 이도현</span>
                <span style="color: var(--accent-yellow); font-weight: bold;">11,230</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>🥉 박서준</span>
                <span style="color: var(--accent-yellow); font-weight: bold;">9,870</span>
              </div>
              <div style="border-top: 1px dashed rgba(255,255,255,0.15); margin-top: 4px; padding-top: 4px; display: flex; justify-content: space-between; color: var(--accent-cyan);">
                <span>내 순위 (15위)</span>
                <span>3,400</span>
              </div>
            </div>
          </div>

          <!-- Widget: 우리 반 코드 -->
          <div class="widget-box text-center">
            <div class="widget-title" style="justify-content: center;">🛡️ 우리 반 코드</div>
            <div style="background: #0d071d; border: 2px solid var(--accent-cyan); border-radius: 6px; padding: 10px; font-size: 1.4rem; font-weight: 900; letter-spacing: 4px; color: var(--accent-cyan); margin: 8px 0;">
              ${user.classCode || '363636'}
            </div>
            <button id="btn-copy-code" class="pixel-btn btn-primary btn-xs" style="width: 100%;">
              코드 정보 확인
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  bindEvents();

  function openWorldSelectionModal() {
    showModal(`
      <div>
        <h3 style="color: var(--accent-yellow); font-size: 1.3rem; margin-bottom: 12px;">
          🗺️ 탐험할 월드와 장소를 선택하세요!
        </h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${WORLDS_DATA.map(world => {
            const isW3 = world.id === 3;
            const isLocked = isW3 && !isWorld3Unlocked;
            return `
              <div style="background: #140d2e; border: 2px solid var(--pixel-border-color); padding: 14px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-weight: bold; color: var(--accent-yellow);">${world.name}</span>
                  ${isLocked ? '<span style="color: var(--accent-red); font-size: 0.8rem;">🔒 잠김</span>' : '<span style="color: var(--accent-green); font-size: 0.8rem;">✅ 탐험 가능</span>'}
                </div>

                <div class="locations-grid">
                  ${world.locations.map(loc => {
                    const isCompleted = earnedBadges.includes(loc.id);
                    const badgeIcon = LOCATION_BADGE_MAP[loc.id]?.icon || '✨';
                    return `
                      <button 
                        class="location-btn ${isCompleted ? 'completed' : ''}" 
                        data-world-id="${world.id}" 
                        data-location-id="${loc.id}"
                        ${isLocked ? 'disabled' : ''}
                      >
                        <span>${loc.icon} ${loc.name}</span>
                        <span>${isCompleted ? badgeIcon : '➡️'}</span>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `);

    setTimeout(() => {
      document.querySelectorAll('.location-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const wId = e.currentTarget.dataset.worldId;
          const locId = e.currentTarget.dataset.locationId;
          if (wId && locId) {
            sound.playClick();
            onSelectLocation(Number(wId), locId);
          }
        });
      });
    }, 100);
  }

  function openBadgeDrawerModal() {
    showModal(`
      <div class="text-center">
        <h3 style="color: var(--accent-yellow); font-size: 1.3rem; margin-bottom: 8px;">
          🎖️ 수집한 배지 상자 (${earnedBadges.length}개)
        </h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">
          배지를 클릭하면 올바른 존댓말 활용 예문을 즉시 확인할 수 있습니다!
        </p>

        <div class="badge-grid" style="justify-content: center;">
          ${earnedBadges.length === 0 ? `
            <p style="color: var(--text-muted); padding: 20px;">아직 획득한 배지가 없습니다. 퀘스트를 완료하여 배지를 수집해 보세요!</p>
          ` : earnedBadges.map(bId => {
            const info = LOCATION_BADGE_MAP[bId] || { icon: '🎖️', name: '배지', example: '존댓말 예문입니다.' };
            return `
              <div class="badge-item" data-badge-id="${bId}" title="${info.name}">
                ${info.icon}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `);

    setTimeout(() => {
      document.querySelectorAll('.badge-item').forEach(item => {
        item.addEventListener('click', () => {
          const bId = item.dataset.badgeId;
          const info = LOCATION_BADGE_MAP[bId];
          if (info) {
            sound.playClick();
            alert(`[${info.name}]\n📜 예문: "${info.example}"`);
          }
        });
      });
    }, 100);
  }

  function bindEvents() {
    // Start Journey button & Island clicks
    container.querySelector('#btn-main-start')?.addEventListener('click', () => {
      sound.playClick();
      openWorldSelectionModal();
    });

    container.querySelector('#island-w1')?.addEventListener('click', openWorldSelectionModal);
    container.querySelector('#island-w2')?.addEventListener('click', openWorldSelectionModal);
    container.querySelector('#island-w3')?.addEventListener('click', () => {
      if (!isWorld3Unlocked) {
        sound.playWrong();
        alert('🔒 월드 1, 2의 모든 배지를 100% 획득해야 해금됩니다!');
      } else {
        openWorldSelectionModal();
      }
    });

    // Dungeon & Bottom action buttons
    container.querySelector('#btn-action-dungeon')?.addEventListener('click', () => {
      sound.playClick();
      onEnterDungeon();
    });

    // Instant Badge check buttons
    container.querySelector('#btn-top-badges')?.addEventListener('click', () => {
      sound.playClick();
      openBadgeDrawerModal();
    });

    container.querySelector('#btn-top-guide')?.addEventListener('click', () => {
      sound.playClick();
      alert('📖 가이드: 5턴 대화 중 올바른 높임표현 2지선다를 선택하여 배지를 수집하세요!');
    });

    container.querySelector('#btn-top-leaderboard')?.addEventListener('click', () => {
      sound.playClick();
      alert('🏆 명예의 전당: 반말 몬스터 던전 수호자 순위표입니다.');
    });

    container.querySelector('#btn-copy-code')?.addEventListener('click', () => {
      sound.playClick();
      alert(`🛡️ 우리 반 6자리 코드: [ ${user.classCode || '363636'} ]`);
    });
  }
}
