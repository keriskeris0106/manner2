/**
 * TeacherView Component
 * Teacher Dashboard for Student Roster, Honorific Error Analytics,
 * Wrong Answer Logs, and Class-Scoped Custom Question & Dungeon Builder.
 */

import { storage } from '../firebase.js';
import { HONORIFIC_ERROR_TYPES } from '../data/honorificRules.js';
import { WORLDS_DATA } from '../data/initialData.js';
import { sound } from '../audio.js';

export function renderTeacherView(container, teacherUser, { onExitTeacher, showModal }) {
  let activeTab = 'roster'; // 'roster', 'analytics', 'logs', 'custom'

  const classStudents = storage.getStudentsByClass(teacherUser.classCode);

  const render = () => {
    container.innerHTML = `
      <div class="teacher-dashboard">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #140d2e; padding: 14px 20px; border: 2px solid var(--pixel-border-color); border-radius: 8px;">
          <div>
            <span style="color: var(--accent-cyan); font-size: 0.85rem;">
              👩‍🏫 교사 전용 관리 대시보드
            </span>
            <h2 style="color: var(--accent-yellow); font-size: 1.4rem;">
              ${teacherUser.className || teacherUser.name} (초대 코드: <span style="color: var(--accent-green);">${teacherUser.classCode}</span>)
            </h2>
          </div>

          <button id="btn-teacher-exit" class="pixel-btn btn-xs btn-outline">
            🏠 메인 로비 이동
          </button>
        </div>

        <!-- Dashboard Sub-Tabs -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button id="tab-roster" class="pixel-btn ${activeTab === 'roster' ? 'btn-primary' : 'btn-outline'} btn-xs">
            👨‍🎓 학급 학생 목록 (${classStudents.length}명)
          </button>
          <button id="tab-analytics" class="pixel-btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-outline'} btn-xs">
            📊 높임표현 취약 유형 진단
          </button>
          <button id="tab-logs" class="pixel-btn ${activeTab === 'logs' ? 'btn-primary' : 'btn-outline'} btn-xs">
            📝 학생 오답 기록 로그
          </button>
          <button id="tab-custom" class="pixel-btn ${activeTab === 'custom' ? 'btn-success' : 'btn-outline'} btn-xs">
            ➕ 학급 맞춤 예시문/던전 출제
          </button>
        </div>

        <div class="pixel-card">
          ${renderTabContent()}
        </div>
      </div>
    `;

    bindEvents();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'roster':
        return renderRosterTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'logs':
        return renderLogsTab();
      case 'custom':
        return renderCustomBuilderTab();
      default:
        return renderRosterTab();
    }
  };

  const renderRosterTab = () => `
    <h3 class="pixel-card-title">👨‍🎓 학급 학생 수집 및 배지 현황</h3>
    ${classStudents.length === 0 ? `
      <p style="color: var(--text-muted); padding: 20px 0;">아직 이 클래스에 접속한 학생이 없습니다. 학생들에게 6자리 학급 초대 코드를 전달해 주세요.</p>
    ` : `
      <div style="overflow-x: auto; margin-top: 12px;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--pixel-border-color); color: var(--accent-cyan);">
              <th style="padding: 10px;">학생 이름</th>
              <th style="padding: 10px;">학년/반</th>
              <th style="padding: 10px;">획득 배지 수</th>
              <th style="padding: 10px;">주요 오답 발생</th>
            </tr>
          </thead>
          <tbody>
            ${classStudents.map(std => {
              const totalWrong = Object.values(std.errorStats || {}).reduce((a, b) => a + b, 0);
              return `
                <tr style="border-bottom: 1px dashed rgba(255,255,255,0.1);">
                  <td style="padding: 10px; font-weight: bold; color: var(--accent-yellow);">${std.name}</td>
                  <td style="padding: 10px;">${std.grade}학년 ${std.classNum}반</td>
                  <td style="padding: 10px;">
                    <span style="color: var(--accent-green); font-weight: bold;">${(std.earnedBadges || []).length}</span> 개 배지
                  </td>
                  <td style="padding: 10px; color: ${totalWrong > 0 ? 'var(--accent-red)' : 'var(--text-muted)'};">
                    ${totalWrong > 0 ? `총 ${totalWrong}회 오답` : '오답 없음 (우수)'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;

  const renderAnalyticsTab = () => {
    const combinedStats = {};
    classStudents.forEach(std => {
      Object.entries(std.errorStats || {}).forEach(([type, count]) => {
        combinedStats[type] = (combinedStats[type] || 0) + count;
      });
    });

    return `
      <h3 class="pixel-card-title">📊 우리 반 높임표현 취약 유형 진단</h3>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">
        학생들이 대화 미션에서 가장 자주 틀린 높임표현 오류 유형입니다.
      </p>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${Object.keys(HONORIFIC_ERROR_TYPES).map(typeKey => {
          const typeInfo = HONORIFIC_ERROR_TYPES[typeKey];
          const count = combinedStats[typeKey] || 0;
          return `
            <div style="background: #140d2e; border: 1px solid var(--pixel-border-color); padding: 12px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: var(--accent-yellow); font-weight: bold;">${typeInfo.name}</span>
                <span style="color: var(--accent-red); font-weight: bold;">${count} 회 발생</span>
              </div>
              <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 8px;">${typeInfo.desc}</p>
              <div style="background: #000; height: 10px; border-radius: 5px; overflow: hidden;">
                <div style="background: var(--accent-red); height: 100%; width: ${Math.min(count * 15, 100)}%;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  };

  const renderLogsTab = () => {
    const allLogs = [];
    classStudents.forEach(std => {
      (std.wrongLogs || []).forEach(log => {
        allLogs.push({ ...log, studentName: std.name });
      });
    });

    allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return `
      <h3 class="pixel-card-title">📝 학생 실시간 오답 기록 로그</h3>
      ${allLogs.length === 0 ? `
        <p style="color: var(--text-muted); padding: 20px 0;">기록된 오답 로그가 없습니다.</p>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto;">
          ${allLogs.map(log => `
            <div style="background: #140d2e; border: 1px solid var(--pixel-border-color); padding: 12px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.85rem;">
                <span style="color: var(--accent-yellow); font-weight: bold;">${log.studentName} 학생 (${log.location})</span>
                <span style="color: var(--text-muted);">${new Date(log.timestamp).toLocaleDateString()}</span>
              </div>
              <div style="color: #ffb7c5; font-size: 0.9rem;">❌ 선택한 오답: "${log.userChoice}"</div>
              <div style="color: var(--accent-green); font-size: 0.9rem;">✅ 올바른 정답: "${log.correctChoice}"</div>
              <div style="color: var(--accent-cyan); font-size: 0.8rem; margin-top: 4px;">💡 ${log.feedback}</div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  };

  const renderCustomBuilderTab = () => `
    <h3 class="pixel-card-title">➕ 학급 전용 예시문 & 던전 문제 출제</h3>
    <p style="color: var(--accent-green); font-size: 0.85rem; margin-bottom: 16px;">
      🔒 여기서 추가한 예시문은 오직 <strong>선생님의 학급 코드(${teacherUser.classCode}) 학생들에게만 최우선 출제</strong>됩니다.
    </p>

    <form id="form-custom-question">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="form-group">
          <label>적용 월드</label>
          <select id="cq-world" class="pixel-input">
            <option value="1" selected>월드 1: 시끌벅적 우리 마을</option>
            <option value="2">월드 2: 신비한 동화 월드</option>
            <option value="3">월드 3: 차원 대통합</option>
          </select>
        </div>
        <div class="form-group">
          <label>세부 장소 선택</label>
          <select id="cq-location" class="pixel-input">
            <option value="W1_HOSPITAL" selected>병원</option>
            <option value="W1_MART">마트</option>
            <option value="W1_SCHOOL">학교</option>
            <option value="W1_RESTAURANT">식당</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>AI 대화 상황 대사</label>
        <input type="text" id="cq-ai-text" class="pixel-input" placeholder="예: 손님, 찾으시는 우유는 저쪽에 있으십니다." required>
      </div>

      <div style="background: rgba(76,201,240,0.1); border: 1px dashed var(--accent-cyan); padding: 10px; border-radius: 6px; margin-bottom: 12px; font-size: 0.8rem; color: var(--accent-cyan);">
        💡 원칙: 정답과 오답 선택지는 문장 구조와 단어를 100% 동일하게 작성하고, 오직 높임표현 부분만 다르게 입력해야 합니다!
      </div>

      <div class="form-group">
        <label style="color: var(--accent-green);">✅ 올바른 정답 선택지</label>
        <input type="text" id="cq-correct" class="pixel-input" placeholder="예: 이 우유가 더 신선하네요." required>
      </div>

      <div class="form-group">
        <label style="color: var(--accent-red);">❌ 오답 선택지 (높임 어미 오용)</label>
        <input type="text" id="cq-wrong" class="pixel-input" placeholder="예: 이 우유가 더 신선하시네요." required>
      </div>

      <div class="form-group">
        <label>오류 유형 분류</label>
        <select id="cq-errtype" class="pixel-input">
          ${Object.entries(HONORIFIC_ERROR_TYPES).map(([k, v]) => `
            <option value="${k}">${v.name}</option>
          `).join('')}
        </select>
      </div>

      <button type="submit" class="pixel-btn btn-success" style="width: 100%; margin-top: 10px;">
        💾 학급 맞춤 예시문 저장 및 연동하기
      </button>
    </form>
  `;

  const bindEvents = () => {
    container.querySelector('#btn-teacher-exit')?.addEventListener('click', () => {
      sound.playClick();
      onExitTeacher();
    });

    // Sub-tabs
    container.querySelector('#tab-roster')?.addEventListener('click', () => { activeTab = 'roster'; render(); });
    container.querySelector('#tab-analytics')?.addEventListener('click', () => { activeTab = 'analytics'; render(); });
    container.querySelector('#tab-logs')?.addEventListener('click', () => { activeTab = 'logs'; render(); });
    container.querySelector('#tab-custom')?.addEventListener('click', () => { activeTab = 'custom'; render(); });

    // Dynamic Location dropdown update based on World selection in Custom form
    const worldSelect = container.querySelector('#cq-world');
    const locSelect = container.querySelector('#cq-location');
    if (worldSelect && locSelect) {
      worldSelect.addEventListener('change', () => {
        const wId = Number(worldSelect.value);
        const targetWorld = WORLDS_DATA.find(w => w.id === wId);
        if (targetWorld) {
          locSelect.innerHTML = targetWorld.locations.map(loc => `
            <option value="${loc.id}">${loc.name}</option>
          `).join('');
        }
      });
    }

    // Submit Custom Question Form
    const customForm = container.querySelector('#form-custom-question');
    if (customForm) {
      customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playClick();

        const worldId = Number(container.querySelector('#cq-world').value);
        const locationId = container.querySelector('#cq-location').value;
        const aiDialogue = container.querySelector('#cq-ai-text').value.trim();
        const correctAnswer = container.querySelector('#cq-correct').value.trim();
        const wrongAnswer = container.querySelector('#cq-wrong').value.trim();
        const errType = container.querySelector('#cq-errtype').value;

        storage.addCustomQuestQuestion({
          worldId,
          locationId,
          classCode: teacherUser.classCode, // Scoped to this teacher's class!
          aiRole: '선생님 생성 NPC',
          aiDialogue,
          correctAnswer,
          wrongAnswer,
          errType,
          explanation: `${HONORIFIC_ERROR_TYPES[errType]?.name || '높임표현 오류'}에 주의해야 합니다.`
        });

        sound.playCorrect();
        showModal(`
          <div class="text-center" style="padding: 10px;">
            <div style="font-size: 3rem; margin-bottom: 8px;">✅🎉</div>
            <h3 style="color: var(--accent-green); font-size: 1.3rem; margin-bottom: 8px;">
              학급 맞춤 예시문이 정상 등록되었습니다!
            </h3>
            <p style="color: var(--text-main); font-size: 0.9rem;">
              선생님의 학급(${teacherUser.classCode}) 학생들이 퀘스트를 진행할 때 최우선으로 출제됩니다.
            </p>
          </div>
        `);
      });
    }
  };

  render();
}
