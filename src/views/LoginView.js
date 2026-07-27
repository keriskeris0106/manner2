/**
 * LoginView Component
 * Handles Teacher Signup/Login with Real-time 6-digit Code check
 * and Student 3-Part Verification Login.
 */

import { storage } from '../firebase.js';
import { sound } from '../audio.js';

export function renderLoginView(container, onLoginSuccess) {
  let activeTab = 'student'; // 'student' or 'teacher'

  const render = () => {
    container.innerHTML = `
      <div class="login-container">
        <div class="text-center mb-2">
          <h2 style="color: var(--accent-yellow); font-size: 1.8rem; text-shadow: 2px 2px 0 #000;">
            🌌 존댓말 차원 탐험대
          </h2>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 6px;">
            초등 3학년 올바른 높임표현 레트로 게이미피케이션
          </p>
        </div>

        <div class="pixel-card">
          <div class="login-tabs">
            <button id="tab-student" class="tab-btn ${activeTab === 'student' ? 'active' : ''}">
              🎒 학생 접속
            </button>
            <button id="tab-teacher" class="tab-btn ${activeTab === 'teacher' ? 'active' : ''}">
              👩‍🏫 교사 접속
            </button>
          </div>

          <div id="login-form-body">
            ${activeTab === 'student' ? renderStudentForm() : renderTeacherForm()}
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
        <input type="text" id="std-code" class="pixel-input" placeholder="예: 363636" maxlength="6" required value="363636">
      </div>

      <div class="form-group">
        <label>학생 실명</label>
        <input type="text" id="std-name" class="pixel-input" placeholder="이름을 입력하세요" required>
      </div>

      <div id="std-error-msg" class="code-check-msg text-red text-center"></div>

      <button type="submit" class="pixel-btn btn-primary" style="width: 100%; margin-top: 10px;">
        🚀 탐험대 입장하기
      </button>
    </form>
  `;

  const renderTeacherForm = () => `
    <form id="form-teacher-login">
      <div class="form-group">
        <label>선생님 6자리 학급 코드</label>
        <input type="text" id="tch-code" class="pixel-input" placeholder="숫자 6자리 입력 (예: 363636)" maxlength="6" required value="363636">
        <div id="code-realtime-msg" class="code-check-msg"></div>
      </div>

      <div id="teacher-extra-fields" class="hidden">
        <div class="form-group">
          <label>선생님 성함</label>
          <input type="text" id="tch-name" class="pixel-input" placeholder="예: 김선생님">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>담당 학년</label>
            <select id="tch-grade" class="pixel-input">
              <option value="3" selected>3학년</option>
            </select>
          </div>
          <div class="form-group">
            <label>담당 반</label>
            <input type="number" id="tch-classnum" class="pixel-input" placeholder="예: 1" value="1">
          </div>
        </div>
      </div>

      <div id="tch-error-msg" class="code-check-msg text-red text-center"></div>

      <button type="submit" id="btn-tch-submit" class="pixel-btn btn-success" style="width: 100%; margin-top: 10px;">
        👩‍🏫 교사 대시보드 로그인 / 클래스 생성
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

    // Student Login submit
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

    // Teacher Code Real-time check
    const tchCodeInput = container.querySelector('#tch-code');
    const msgDiv = container.querySelector('#code-realtime-msg');
    const extraFields = container.querySelector('#teacher-extra-fields');
    let isNewCode = false;

    if (tchCodeInput) {
      const checkCode = () => {
        const code = tchCodeInput.value.trim();
        if (code.length === 6) {
          const res = storage.checkClassCodeAvailable(code);
          if (res.available) {
            msgDiv.className = 'code-check-msg text-green';
            msgDiv.textContent = res.msg;
            extraFields.classList.remove('hidden');
            isNewCode = true;
          } else {
            msgDiv.className = 'code-check-msg text-yellow';
            msgDiv.textContent = 'ℹ️ 등록된 6자리 클래스 코드입니다. 바로 로그인 가능합니다.';
            extraFields.classList.add('hidden');
            isNewCode = false;
          }
        } else {
          msgDiv.textContent = '';
          extraFields.classList.add('hidden');
          isNewCode = false;
        }
      };

      tchCodeInput.addEventListener('input', checkCode);
      checkCode(); // Initial run
    }

    // Teacher Login/Signup Submit
    const teacherForm = container.querySelector('#form-teacher-login');
    if (teacherForm) {
      teacherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playClick();
        const code = tchCodeInput.value.trim();
        if (code.length !== 6) {
          sound.playWrong();
          return;
        }

        let teacher = storage.loginTeacher(code);
        if (!teacher && isNewCode) {
          const name = container.querySelector('#tch-name').value.trim() || '선생님';
          const grade = container.querySelector('#tch-grade').value || '3';
          const classNum = container.querySelector('#tch-classnum').value || '1';
          teacher = storage.registerTeacher({
            uid: `teacher_${code}`,
            name,
            grade,
            classNum,
            className: `${grade}학년 ${classNum}반`,
            classCode: code,
            role: 'teacher'
          });
        }

        if (teacher) {
          storage.saveSession(teacher);
          sound.playCorrect();
          onLoginSuccess(teacher);
        } else {
          sound.playWrong();
          const errDiv = container.querySelector('#tch-error-msg');
          if (errDiv) errDiv.textContent = '선생님 로그인에 실패했습니다. 코드를 확인해 주세요.';
        }
      });
    }
  };

  render();
}
