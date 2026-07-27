/**
 * LoginView Component
 * Explicit separate actions for Teacher Login vs Class Creation.
 * Any teacher can enter ANY 6-digit code to create their custom class!
 */

import { storage } from '../firebase.js';
import { sound } from '../audio.js';

export function renderLoginView(container, onLoginSuccess) {
  let activeTab = 'student'; // 'student' or 'teacher'
  let teacherMode = 'login'; // 'login' or 'create' for teacher tab

  const render = () => {
    container.innerHTML = `
      <div class="login-container">
        <div class="text-center mb-2">
          <h2 class="cosmic-main-title" style="font-size: 1.8rem;">
            🌌 존댓말 차원 탐험대
          </h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 4px;">
            올바른 높임표현으로 소통하는 멋진 탐험가가 되자!
          </p>
        </div>

        <div class="pixel-card">
          <div class="login-tabs">
            <button id="tab-student" class="tab-btn ${activeTab === 'student' ? 'active' : ''}">
              🎒 학생 접속
            </button>
            <button id="tab-teacher" class="tab-btn ${activeTab === 'teacher' ? 'active' : ''}">
              👩‍🏫 교사 전용
            </button>
          </div>

          <div id="login-form-body">
            ${activeTab === 'student' ? renderStudentForm() : renderTeacherSection()}
          </div>
        </div>
      </div>
    `;

    bindEvents();
  };

  const renderStudentForm = () => `
    <form id="form-student-login">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="form-group">
          <label>학년</label>
          <select id="std-grade" class="pixel-input" required>
            <option value="3" selected>3학년</option>
            <option value="4">4학년</option>
          </select>
        </div>
        <div class="form-group">
          <label>반</label>
          <input type="number" id="std-classnum" class="pixel-input" placeholder="예: 1" min="1" max="20" required value="1">
        </div>
      </div>

      <div class="form-group">
        <label>6자리 학급 초대 코드</label>
        <input type="text" id="std-code" class="pixel-input" placeholder="선생님이 알려주신 6자리 코드" maxlength="6" required value="363636">
      </div>

      <div class="form-group">
        <label>학생 실명</label>
        <input type="text" id="std-name" class="pixel-input" placeholder="이름을 입력하세요 (예: 홍길동)" required>
      </div>

      <div id="std-error-msg" class="code-check-msg text-red text-center"></div>

      <button type="submit" class="pixel-btn btn-gold" style="width: 100%; margin-top: 10px; font-size: 1.1rem;">
        🚀 탐험대 입장하기
      </button>
    </form>
  `;

  const renderTeacherSection = () => `
    <div>
      <div style="display: flex; gap: 10px; margin-bottom: 16px;">
        <button id="btn-tch-mode-login" class="pixel-btn ${teacherMode === 'login' ? 'btn-primary' : 'btn-outline'}" style="flex: 1; font-size: 0.9rem;">
          🔑 기존 클래스로 로그인
        </button>
        <button id="btn-tch-mode-create" class="pixel-btn ${teacherMode === 'create' ? 'btn-success' : 'btn-outline'}" style="flex: 1; font-size: 0.9rem;">
          ➕ 원하는 6자리 코드로 새 클래스 개설
        </button>
      </div>

      ${teacherMode === 'login' ? renderTeacherLoginForm() : renderTeacherCreateForm()}
    </div>
  `;

  const renderTeacherLoginForm = () => `
    <form id="form-teacher-login">
      <div class="form-group">
        <label>선생님의 6자리 학급 코드</label>
        <input type="text" id="tch-login-code" class="pixel-input" placeholder="개설한 6자리 숫자 입력" maxlength="6" required value="363636">
      </div>

      <div id="tch-login-error" class="code-check-msg text-red text-center"></div>

      <button type="submit" class="pixel-btn btn-primary" style="width: 100%; margin-top: 10px;">
        🔑 6자리 학급 코드로 로그인
      </button>
    </form>
  `;

  const renderTeacherCreateForm = () => `
    <form id="form-teacher-create">
      <div class="form-group">
        <label>원하는 6자리 학급 코드 입력 (선생님 지정)</label>
        <input type="text" id="tch-create-code" class="pixel-input" placeholder="원하는 숫자 6자리 입력 (예: 123456)" maxlength="6" required>
        <div id="create-code-msg" class="code-check-msg"></div>
      </div>

      <div class="form-group">
        <label>선생님 성함</label>
        <input type="text" id="tch-name" class="pixel-input" placeholder="예: 김선생님" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="form-group">
          <label>담당 학년</label>
          <select id="tch-grade" class="pixel-input">
            <option value="3" selected>3학년</option>
            <option value="4">4학년</option>
          </select>
        </div>
        <div class="form-group">
          <label>담당 반</label>
          <input type="number" id="tch-classnum" class="pixel-input" placeholder="예: 1" value="1" required>
        </div>
      </div>

      <div id="tch-create-error" class="code-check-msg text-red text-center"></div>

      <button type="submit" id="btn-submit-create" class="pixel-btn btn-success" style="width: 100%; margin-top: 10px;">
        ✨ 새로운 6자리 학급 클래스 개설
      </button>
    </form>
  `;

  const bindEvents = () => {
    // Tab switching
    container.querySelector('#tab-student')?.addEventListener('click', () => {
      sound.playClick();
      activeTab = 'student';
      render();
    });

    container.querySelector('#tab-teacher')?.addEventListener('click', () => {
      sound.playClick();
      activeTab = 'teacher';
      render();
    });

    // Teacher sub-mode switching
    container.querySelector('#btn-tch-mode-login')?.addEventListener('click', () => {
      sound.playClick();
      teacherMode = 'login';
      render();
    });

    container.querySelector('#btn-tch-mode-create')?.addEventListener('click', () => {
      sound.playClick();
      teacherMode = 'create';
      render();
    });

    // Student Login Submit
    const studentForm = container.querySelector('#form-student-login');
    if (studentForm) {
      studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playClick();
        const grade = container.querySelector('#std-grade').value;
        const classNum = container.querySelector('#std-classnum').value;
        const classCode = container.querySelector('#std-code').value.trim();
        const name = container.querySelector('#std-name').value.trim();

        const result = storage.verifyAndLoginStudent({ grade, classNum, classCode, name });
        if (result.success) {
          storage.saveSession(result.student);
          sound.playCorrect();
          onLoginSuccess(result.student);
        } else {
          sound.playWrong();
          const errDiv = container.querySelector('#std-error-msg');
          if (errDiv) errDiv.textContent = result.msg;
        }
      });
    }

    // Teacher Login Submit
    const teacherLoginForm = container.querySelector('#form-teacher-login');
    if (teacherLoginForm) {
      teacherLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playClick();
        const code = container.querySelector('#tch-login-code').value.trim();
        const teacher = storage.loginTeacher(code);
        if (teacher) {
          storage.saveSession(teacher);
          sound.playCorrect();
          onLoginSuccess(teacher);
        } else {
          sound.playWrong();
          const errDiv = container.querySelector('#tch-login-error');
          if (errDiv) errDiv.textContent = '❌ 해당 6자리 클래스 코드가 존재하지 않습니다. 먼저 클래스를 개설해 주세요.';
        }
      });
    }

    // Teacher Create Submit & Realtime Availability Check
    const createCodeInput = container.querySelector('#tch-create-code');
    const msgDiv = container.querySelector('#create-code-msg');

    if (createCodeInput) {
      createCodeInput.addEventListener('input', () => {
        const code = createCodeInput.value.trim();
        if (code.length === 6) {
          const res = storage.checkClassCodeAvailable(code);
          if (res.available) {
            msgDiv.className = 'code-check-msg text-green';
            msgDiv.textContent = res.msg;
          } else {
            msgDiv.className = 'code-check-msg text-red';
            msgDiv.textContent = res.msg;
          }
        } else {
          msgDiv.textContent = '';
        }
      });
    }

    const teacherCreateForm = container.querySelector('#form-teacher-create');
    if (teacherCreateForm) {
      teacherCreateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playClick();

        const code = createCodeInput.value.trim();
        const res = storage.checkClassCodeAvailable(code);
        if (!res.available) {
          sound.playWrong();
          const errDiv = container.querySelector('#tch-create-error');
          if (errDiv) errDiv.textContent = res.msg;
          return;
        }

        const name = container.querySelector('#tch-name').value.trim();
        const grade = container.querySelector('#tch-grade').value;
        const classNum = container.querySelector('#tch-classnum').value;

        const newTeacher = storage.registerTeacher({
          uid: `teacher_${code}`,
          name,
          grade,
          classNum,
          className: `${grade}학년 ${classNum}반 (${name})`,
          classCode: code,
          role: 'teacher'
        });

        storage.saveSession(newTeacher);
        sound.playCorrect();
        onLoginSuccess(newTeacher);
      });
    }
  };

  render();
}
