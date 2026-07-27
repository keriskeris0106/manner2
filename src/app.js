/**
 * Main Application Entry Point for [존댓말 차원 탐험대]
 * SPA Routing, State Management & Event Orchestration
 */

import { storage } from './firebase.js';
import { sound } from './audio.js';
import { renderLoginView } from './views/LoginView.js';
import { renderLobbyView } from './views/LobbyView.js';
import { renderQuestView } from './views/QuestView.js';
import { renderDungeonView } from './views/DungeonView.js';
import { renderTeacherView } from './views/TeacherView.js';
import { renderMasterModal } from './views/MasterView.js';

class App {
  constructor() {
    this.viewContainer = document.querySelector('#app-view');
    this.modalOverlay = document.querySelector('#modal-overlay');
    this.modalBody = document.querySelector('#modal-body');
    this.modalClose = document.querySelector('#modal-close');
    
    this.currentUser = storage.getSession();
    this.currentView = this.currentUser ? (this.currentUser.role === 'teacher' ? 'teacher' : 'lobby') : 'login';
    this.currentQuestParams = null; // { worldId, locationId }
  }

  init() {
    this.bindGnbEvents();
    this.bindModalEvents();
    this.render();
  }

  // Render GNB Header state
  updateGnb() {
    const userNameEl = document.querySelector('#gnb-user-name');
    const exitBtn = document.querySelector('#btn-exit-game');

    if (this.currentUser) {
      if (this.currentUser.role === 'teacher') {
        userNameEl.textContent = `👩‍🏫 ${this.currentUser.name} (${this.currentUser.classCode})`;
      } else {
        const badgeCount = (this.currentUser.earnedBadges || []).length;
        userNameEl.textContent = `🎒 ${this.currentUser.name} (배지 ${badgeCount}개)`;
      }
      exitBtn.classList.remove('hidden');
    } else {
      userNameEl.textContent = '로그인 필요';
      exitBtn.classList.add('hidden');
    }
  }

  bindGnbEvents() {
    // Sound toggle
    const soundBtn = document.querySelector('#btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        soundBtn.textContent = isMuted ? '🔇' : '🔊';
      });
    }

    // Exit Game button
    const exitBtn = document.querySelector('#btn-exit-game');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        sound.playClick();
        if (confirm('게임을 종료하고 로그인 화면으로 이동하시겠습니까?')) {
          storage.clearSession();
          this.currentUser = null;
          this.currentView = 'login';
          this.render();
        }
      });
    }

    // Master 0106 button
    const masterBtn = document.querySelector('#btn-master-trigger');
    if (masterBtn) {
      masterBtn.addEventListener('click', () => {
        sound.playClick();
        renderMasterModal(
          (content) => this.showModal(content),
          () => this.closeModal()
        );
      });
    }
  }

  // Global Modal Overlay Controls
  showModal(contentHtml) {
    this.modalBody.innerHTML = contentHtml;
    this.modalOverlay.classList.remove('hidden');
  }

  closeModal() {
    this.modalOverlay.classList.add('hidden');
    this.modalBody.innerHTML = '';
  }

  bindModalEvents() {
    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => {
        sound.playClick();
        this.closeModal();
      });
    }

    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) {
        this.closeModal();
      }
    });
  }

  // SPA View Router
  render() {
    this.updateGnb();

    switch (this.currentView) {
      case 'login':
        renderLoginView(this.viewContainer, (user) => {
          this.currentUser = user;
          this.currentView = user.role === 'teacher' ? 'teacher' : 'lobby';
          this.render();
        });
        break;

      case 'lobby':
        renderLobbyView(this.viewContainer, this.currentUser, {
          onSelectLocation: (worldId, locationId) => {
            this.currentQuestParams = { worldId, locationId };
            this.currentView = 'quest';
            this.render();
          },
          onEnterDungeon: () => {
            this.currentView = 'dungeon';
            this.render();
          },
          showModal: (html) => this.showModal(html)
        });
        break;

      case 'quest':
        if (!this.currentQuestParams) {
          this.currentView = 'lobby';
          this.render();
          return;
        }
        renderQuestView(this.viewContainer, this.currentUser, {
          worldId: this.currentQuestParams.worldId,
          locationId: this.currentQuestParams.locationId,
          onQuestComplete: () => {
            this.closeModal();
            // Refresh student user data session
            this.currentUser = storage.getSession();
            this.currentView = 'lobby';
            this.render();
          },
          onQuestFail: () => {
            this.closeModal();
            this.currentView = 'lobby';
            this.render();
          },
          showModal: (html) => this.showModal(html)
        });
        break;

      case 'dungeon':
        renderDungeonView(this.viewContainer, this.currentUser, {
          onExitDungeon: () => {
            this.closeModal();
            this.currentView = 'lobby';
            this.render();
          },
          showModal: (html) => this.showModal(html)
        });
        break;

      case 'teacher':
        renderTeacherView(this.viewContainer, this.currentUser, {
          onExitTeacher: () => {
            this.currentView = 'lobby';
            this.render();
          },
          showModal: (html) => this.showModal(html)
        });
        break;

      default:
        this.currentView = 'login';
        this.render();
        break;
    }
  }
}

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
