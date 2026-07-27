/**
 * LobbyView Component
 * Renders Badge collection box with icon tooltips/modals,
 * 3 World selection maps (World 3 unlocked when W1 & W2 100% completed),
 * and Banmal Monster Dungeon mode entry.
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

  container.innerHTML = `
    <div class="lobby-container">
      <div class="lobby-header">
        <div>
          <h2 style="color: var(--accent-yellow); font-size: 1.5rem;">
            🗺️ 차원 맵 로비
          </h2>
          <p style="color: var(--text-muted); font-size: 0.85rem;">
            원하는 월드와 장소를 선택하여 5턴 대화 미션에 도전하세요!
          </p>
        </div>

        <button id="btn-enter-dungeon" class="pixel-btn btn-warning">
          🛡️ 반말 몬스터 던전 (서바이벌)
        </button>
      </div>

      <!-- Badge Collection Box (Icon-Only Rendering) -->
      <div class="badge-box-container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="color: var(--accent-cyan); font-size: 1rem; display: flex; align-items: center; gap: 6px;">
            🎖️ 내가 수집한 배지 상자
          </h3>
          <span style="font-size: 0.85rem; color: var(--text-muted);">
            총 ${earnedBadges.length} 개 수집함
          </span>
        </div>

        <div class="badge-grid" id="badge-grid">
          ${renderBadgesGrid(earnedBadges)}
        </div>
      </div>

      <!-- 3 Worlds Cards -->
      <div class="worlds-container">
        ${WORLDS_DATA.map(world => renderWorldCard(world, user, isWorld3Unlocked, earnedBadges)).join('')}
      </div>
    </div>
  `;

  bindEvents();

  function renderBadgesGrid(badges) {
    if (!badges || badges.length === 0) {
      return `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 10px;">아직 수집한 배지가 없습니다. 퀘스트에 성공하여 배지를 모아보세요!</p>`;
    }

    return badges.map(badgeId => {
      const info = LOCATION_BADGE_MAP[badgeId] || { icon: '🎖️', name: '퀘스트 배지', example: '올바른 높임표현입니다.' };
      return `
        <div class="badge-item" data-badge-id="${badgeId}" title="${info.name}">
          ${info.icon}
        </div>
      `;
    }).join('');
  }

  function renderWorldCard(world, user, isW3Unlocked, badges) {
    const isW3 = world.id === 3;
    const isLocked = isW3 && !isW3Unlocked;

    return `
      <div class="world-card ${isLocked ? 'locked' : ''}">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="world-icon">${world.icon}</span>
            ${isLocked ? '<span class="pixel-btn btn-xs btn-danger">🔒 잠김</span>' : '<span class="pixel-btn btn-xs btn-success">✅ 탐험 가능</span>'}
          </div>

          <h3 style="color: var(--accent-yellow); font-size: 1.2rem; margin-top: 6px;">
            ${world.name}
          </h3>
          <p style="color: var(--text-muted); font-size: 0.8rem; margin: 6px 0;">
            ${world.desc}
          </p>

          ${isLocked ? `
            <div style="background: rgba(239, 71, 111, 0.15); border: 1px dashed var(--accent-red); padding: 8px; border-radius: 4px; font-size: 0.75rem; color: #ffb7c5; margin-top: 10px;">
              ⚠️ 해금 조건: 월드 1, 2의 모든 배지를 100% 수집해야 해금됩니다!
              <br>(월드1: ${w1CompletedCount}/${w1Locations.length}, 월드2: ${w2CompletedCount}/${w2Locations.length})
            </div>
          ` : ''}
        </div>

        <div class="locations-grid">
          ${world.locations.map(loc => {
            const isCompleted = badges.includes(loc.id);
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
  }

  function bindEvents() {
    // Dungeon entry button
    container.querySelector('#btn-enter-dungeon')?.addEventListener('click', () => {
      sound.playClick();
      onEnterDungeon();
    });

    // Location selection
    container.querySelectorAll('.location-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const worldId = e.currentTarget.dataset.worldId;
        const locationId = e.currentTarget.dataset.locationId;
        if (worldId && locationId) {
          sound.playClick();
          onSelectLocation(Number(worldId), locationId);
        }
      });
    });

    // Badge click detail modal
    container.querySelectorAll('.badge-item').forEach(item => {
      item.addEventListener('click', () => {
        const badgeId = item.dataset.badgeId;
        const info = LOCATION_BADGE_MAP[badgeId];
        if (info) {
          sound.playClick();
          showModal(`
            <div class="text-center">
              <div style="font-size: 4rem; margin-bottom: 10px;">${info.icon}</div>
              <h3 style="color: var(--accent-yellow); font-size: 1.3rem; margin-bottom: 12px;">
                ${info.name}
              </h3>
              <div style="background: #140d2e; border: 2px solid var(--pixel-border-color); padding: 16px; border-radius: 8px; font-size: 1.05rem; line-height: 1.6; text-align: left; color: #fff;">
                <span style="color: var(--accent-cyan); font-weight: bold;">📜 올바른 존댓말 활용 예문:</span>
                <p style="margin-top: 8px; color: var(--accent-green);">"${info.example}"</p>
              </div>
            </div>
          `);
        }
      });
    });
  }
}
