/**
 * MasterView Component
 * Creator Master Mode (Password 0106)
 * Allows editing system prompt templates, global preset database questions,
 * and double-saving to Firestore DB & LocalStorage.
 */

import { storage } from '../firebase.js';
import { sound } from '../audio.js';

export function renderMasterModal(showModal, closeModal) {
  let isUnlocked = false;

  const renderContent = () => {
    if (!isUnlocked) {
      return `
        <div class="text-center" style="padding: 10px;">
          <div style="font-size: 3rem; margin-bottom: 8px;">🔑</div>
          <h3 style="color: var(--accent-yellow); font-size: 1.3rem; margin-bottom: 12px;">
            제작자 마스터 인증 (Code: 0106)
          </h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">
            글로벌 대화 DB 및 AI 시스템 프롬프트 가이드라인 편집용 비밀번호를 입력하세요.
          </p>

          <form id="form-master-auth">
            <input type="password" id="master-pass" class="pixel-input" placeholder="4자리 암호 입력" maxlength="4" style="text-align: center; font-size: 1.4rem; letter-spacing: 6px;" required autofocus>
            <div id="master-auth-err" class="code-check-msg text-red text-center"></div>

            <button type="submit" class="pixel-btn btn-warning" style="width: 100%; margin-top: 14px;">
              🔓 마스터 룸 입장
            </button>
          </form>
        </div>
      `;
    }

    const currentPrompts = storage.getMasterPrompts();

    return `
      <div>
        <h3 style="color: var(--accent-yellow); font-size: 1.3rem; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
          👑 제작자 마스터 모드 (0106)
        </h3>
        <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 16px;">
          전체 월드 표준 프롬프트 가이드라인 및 데이터베이스 이중 동기화 관리
        </p>

        <form id="form-master-settings">
          <div class="form-group">
            <label>1. 공통 하이브리드 AI 시스템 가이드라인 (Guardrail)</label>
            <textarea id="mp-guardrail" class="pixel-input" rows="3">${currentPrompts.systemGuardrail || ''}</textarea>
          </div>

          <div class="form-group">
            <label>2. 월드 1 (우리 마을) 템플릿 프롬프트</label>
            <textarea id="mp-w1" class="pixel-input" rows="2">${currentPrompts.world1Prompt || ''}</textarea>
          </div>

          <div class="form-group">
            <label>3. 월드 2 (동화 월드) 템플릿 프롬프트</label>
            <textarea id="mp-w2" class="pixel-input" rows="2">${currentPrompts.world2Prompt || ''}</textarea>
          </div>

          <div class="form-group">
            <label>4. 월드 3 (차원 대통합) 템플릿 프롬프트</label>
            <textarea id="mp-w3" class="pixel-input" rows="2">${currentPrompts.world3Prompt || ''}</textarea>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 16px;">
            <button type="submit" class="pixel-btn btn-success" style="flex: 1;">
              💾 DB & LocalStorage 이중 저장
            </button>
          </div>
        </form>
      </div>
    `;
  };

  showModal(renderContent());

  setTimeout(() => {
    bindEvents();
  }, 100);

  function bindEvents() {
    const authForm = document.querySelector('#form-master-auth');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.querySelector('#master-pass').value;
        if (pass === '0106') {
          sound.playCorrect();
          isUnlocked = true;
          showModal(renderContent());
          setTimeout(bindEvents, 100);
        } else {
          sound.playWrong();
          const errDiv = document.querySelector('#master-auth-err');
          if (errDiv) errDiv.textContent = '❌ 암호가 올바르지 않습니다. (0106)';
        }
      });
    }

    const settingsForm = document.querySelector('#form-master-settings');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playCorrect();

        const prompts = {
          systemGuardrail: document.querySelector('#mp-guardrail').value.trim(),
          world1Prompt: document.querySelector('#mp-w1').value.trim(),
          world2Prompt: document.querySelector('#mp-w2').value.trim(),
          world3Prompt: document.querySelector('#mp-w3').value.trim(),
          updatedAt: new Date().toISOString()
        };

        storage.saveMasterPrompts(prompts);
        alert('✅ 마스터 템플릿 및 DB 설정이 성공적으로 이중 동기화 저장되었습니다!');
        closeModal();
      });
    }
  }
}
