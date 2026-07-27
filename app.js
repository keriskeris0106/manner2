/**
 * Core Application Engine for [높임말 어드벤처]
 * Exact mechanism, authentication flow & teacher-only admin controls matching https://99dan-two.vercel.app/
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Data Models & Question Pools (높임표현 & 공손예절 & 특수어휘)
  // -------------------------------------------------------------------------

  let currentMode = 'honorific'; // 'honorific' | 'courtesy'

  const TITLES_MAP = {
    honorific: [
      { level: 0, emoji: '🐣', name: '높임표현 수련생', reqDesc: '기본 부여', reqCount: 0 },
      { level: 1, emoji: '⚡', name: '높임표현 도전사', reqDesc: '보스전 10회 도전', reqCount: 10 },
      { level: 2, emoji: '🔥', name: '높임표현 탐험가', reqDesc: '보스전 30회 도전', reqCount: 30 },
      { level: 3, emoji: '🛡️', name: '높임표현 수호자', reqDesc: '보스전 50회 도전', reqCount: 50 },
      { level: 4, emoji: '⚔️', name: '높임표현 기사단', reqDesc: '보스전 80회 도전', reqCount: 80 },
      { level: 5, emoji: '👑', name: '높임표현 정복자', reqDesc: '보스전 100회 도전', reqCount: 100 }
    ],
    courtesy: [
      { level: 0, emoji: '🐣', name: '예절 수련생', reqDesc: '기본 부여', reqCount: 0 },
      { level: 1, emoji: '⚡', name: '예절 도전사', reqDesc: '보스전 10회 도전', reqCount: 10 },
      { level: 2, emoji: '🔥', name: '예절 탐험가', reqDesc: '보스전 30회 도전', reqCount: 30 },
      { level: 3, emoji: '🛡️', name: '예절 수호자', reqDesc: '보스전 50회 도전', reqCount: 50 },
      { level: 4, emoji: '💬', name: '예절 기사단', reqDesc: '보스전 80회 도전', reqCount: 80 },
      { level: 5, emoji: '👑', name: '예절 정복자', reqDesc: '보스전 100회 도전', reqCount: 100 }
    ]
  };

  const GAME1_QUESTIONS = [
    { prompt: "할머니께 식사를 권해드릴 때", sub: "올바른 높임 표현을 선택하세요!", correct: "할머니, 진지 잡수세요.", wrong: "할머니, 밥 드세요." },
    { prompt: "선생님께 궁금한 점을 물어보려고 할 때", sub: "올바른 높임 표현을 선택하세요!", correct: "선생님, 여쭤볼 것이 있습니다.", wrong: "선생님, 물어볼 것이 있습니다." },
    { prompt: "어머니의 부재 상태를 말씀드릴 때", sub: "올바른 높임 표현을 선택하세요!", correct: "어머니께서는 집에 안 계십니다.", wrong: "어머니는 집에 없어요." },
    { prompt: "어머니의 부재를 주체 높임 주어로 표현할 때", sub: "올바른 높임 표현을 선택하세요!", correct: "어머니께서는 집에 안 계십니다.", wrong: "어머니는 집에 안 계십니다." },
    { prompt: "할아버지의 건강 상태를 여쭤볼 때", sub: "올바른 높임 표현을 선택하세요!", correct: "할아버지, 어디 편찮으신 곳은 없으신가요?", wrong: "할아버지, 어디 아픈 곳은 없으신가요?" },
    { prompt: "선생님께 공책을 전달해 드릴 때", sub: "올바른 높임 표현을 선택하세요!", correct: "선생님, 공책을 가져다 드릴게요.", wrong: "선생님, 공책을 가져다 주실게요." },
    { prompt: "약봉투를 가리키며 말할 때", sub: "사물 높임 오류를 피하세요!", correct: "약봉투가 참 예쁘네요.", wrong: "약봉투가 참 예쁘셔요." },
    { prompt: "자신의 아픈 곳을 의사 선생님께 말할 때", sub: "자신 높임 오류를 피하세요!", correct: "어제부터 제 배가 아팠어요.", wrong: "어제부터 제 배가 아프셨어요." }
  ];

  const GAME2_QUESTIONS = [
    { prompt: "쉬는시간에 친구 목소리가 너무 커서 시끄러울 때", sub: "배려의 말을 선택하세요!", correct: "조금만 조용히 이야기해줄 수 있을까?", wrong: "야, 너 목소리 너무 커서 시끄러워!" },
    { prompt: "어머니께서 '아들, 와서 밥 먹어라!' 하실 때", sub: "공손한 대답을 선택하세요!", correct: "네, 엄마! 조금 있다가 먹어도 돼요?", wrong: "아 싫어! 나중에 먹을 거라고!" },
    { prompt: "복도에서 지나가던 친구와 살짝 부딪혔을 때", sub: "공손한 표현을 선택하세요!", correct: "앗 미안해! 다친 곳은 없어?", wrong: "눈 안 보고 다니냐? 조심 좀 해!" },
    { prompt: "선생님께서 무거운 짐을 들고 계실 때", sub: "공손하게 도와드릴 말을 선택하세요!", correct: "선생님, 제가 도와드릴까요?", wrong: "선생님, 혼자 들기 힘들어 보이네요." },
    { prompt: "친구에게 물건을 빌리고 싶을 때", sub: "공손하게 부탁하는 말을 선택하세요!", correct: "혹시 지우개 한 번만 빌려줄 수 있니?", wrong: "야, 지우개 빨리 내놔 봐!" }
  ];

  const GAME3_QUESTIONS = [
    { prompt: "윗사람의 '나이'를 높여 부르는 특수 어휘는?", sub: "알맞은 어휘를 고르세요!", correct: "연세", wrong: "나이" },
    { prompt: "윗사람의 '집'을 높여 부르는 특수 어휘는?", sub: "알맞은 어휘를 고르세요!", correct: "댁", wrong: "집" },
    { prompt: "윗사람의 '이름'을 높여 부르는 특수 어휘는?", sub: "알맞은 어휘를 고르세요!", correct: "성함", wrong: "이름" },
    { prompt: "윗사람 앞에서 자신을 낮추어 부르는 겸양어는?", sub: "알맞은 어휘를 고르세요!", correct: "저 / 제", wrong: "나 / 내" },
    { prompt: "선생님께 행동을 해 드릴 때 쓰는 겸양 동사는?", sub: "알맞은 어휘를 고르세요!", correct: "드리다", wrong: "주다" },
    { prompt: "어르신께 질문할 때 쓰는 겸양 동사는?", sub: "알맞은 어휘를 고르세요!", correct: "여쭤보다", wrong: "물어보다" }
  ];

  // -------------------------------------------------------------------------
  // 2. Sound Engine
  // -------------------------------------------------------------------------
  class SoundEngine {
    constructor() { this.enabled = true; this.audioCtx = null; }
    init() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') this.audioCtx.resume();
    }
    playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.08) {
      if (!this.enabled) return; this.init(); if (!this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
        osc.connect(gain); gain.connect(this.audioCtx.destination);
        osc.start(); osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {}
    }
    playCorrect() {
      this.playTone(523.25, 'sine', 0.08, 0.08);
      setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.08), 60);
    }
    playWrong() {
      if (!this.enabled) return; this.init(); if (!this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(65, this.audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);
        osc.connect(gain); gain.connect(this.audioCtx.destination);
        osc.start(); osc.stop(this.audioCtx.currentTime + 0.25);
      } catch (e) {}
    }
  }
  const sound = new SoundEngine();

  // -------------------------------------------------------------------------
  // 3. User Session & Admin Controls
  // -------------------------------------------------------------------------
  let currentUser = null;
  let gameState = {
    activeGame: null,
    timerId: null,
    timeRemaining: 25,
    elapsedTime: 0,
    solvedCount: 0,
    currentCombo: 0,
    maxCombo: 0,
    earnedGold: 0,
    bossProblemIndex: 0,
    bossProblems: [],
    bossStartTime: 0,
    bossHp: 10,
    currentQuestion: null
  };

  function saveSessionUser(user) {
    currentUser = user;
    if (user) {
      localStorage.setItem('noepim_logged_user_v1', JSON.stringify(user));
    } else {
      localStorage.removeItem('noepim_logged_user_v1');
    }
  }

  function loadSessionUser() {
    const saved = localStorage.getItem('noepim_logged_user_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  }

  function openModal(modalId) {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  function showView(viewId) {
    // SECURITY CHECK: Strictly check Teacher-only access for adminView!
    if (viewId === 'adminView' && (!currentUser || currentUser.role !== 'teacher')) {
      alert('🔒 교사 계정만 접속할 수 있습니다.');
      viewId = 'lobbyView';
    }

    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');

    if (viewId === 'bossPlayView') {
      document.body.classList.add('in-dungeon');
    } else {
      document.body.classList.remove('in-dungeon');
    }

    refreshAllLiveViews();
  }

  function updateHeaderUI() {
    if (!currentUser) return;

    document.getElementById('headerUserName').textContent = currentUser.name || '익명';

    const roleBadge = document.getElementById('headerUserRoleBadge');
    if (currentUser.role === 'teacher') roleBadge.textContent = '교사';
    else if (currentUser.role === 'anon') roleBadge.textContent = '익명';
    else roleBadge.textContent = '학생';

    document.getElementById('userGoldVal').textContent = currentUser.gold || 0;

    // STRICT TEACHER CONTROL: Show admin button ONLY for teachers!
    const adminBtn = document.getElementById('openAdminBtn');
    if (currentUser.role === 'teacher') {
      adminBtn.classList.remove('hidden');
    } else {
      adminBtn.classList.add('hidden');
    }
  }

  function refreshAllLiveViews() {
    updateHeaderUI();
    const hallView = document.getElementById('hallView');
    if (hallView && hallView.classList.contains('active')) {
      renderHallOfHeroes();
    }
    const adminView = document.getElementById('adminView');
    if (adminView && adminView.classList.contains('active')) {
      renderTeacherAdminPage();
    }
  }

  // -------------------------------------------------------------------------
  // 4. Minigames Engine (25s, +1 Gold per correct answer)
  // -------------------------------------------------------------------------
  function shuffle(arr) {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  }

  function startMinigame(gameType) {
    gameState.activeGame = gameType;
    gameState.timeRemaining = 25.0;
    gameState.solvedCount = 0;
    gameState.earnedGold = 0;
    gameState.currentCombo = 0;
    gameState.maxCombo = 0;

    const titles = { 1: '올바른 높임 표현 스피드 레이스', 2: '공손한 예절 표현 탐정', 3: '특수어휘 & 겸양어 짝맞추기' };
    document.getElementById('playGameTitle').textContent = titles[gameType] || '맞춤법 훈련';
    document.getElementById('gameScoreText').textContent = '0개';
    document.getElementById('gameGoldText').textContent = '+0 Gold';

    showView('gamePlayView');
    nextMinigameQuestion();

    if (gameState.timerId) clearInterval(gameState.timerId);
    const timerProgress = document.getElementById('gameTimerProgress');
    const timerText = document.getElementById('gameTimerText');

    gameState.timerId = setInterval(() => {
      gameState.timeRemaining -= 0.1;
      if (gameState.timeRemaining <= 0) {
        gameState.timeRemaining = 0;
        clearInterval(gameState.timerId);
        finishMinigame();
      }
      timerText.textContent = `${gameState.timeRemaining.toFixed(1)}초`;
      timerProgress.style.width = `${(gameState.timeRemaining / 25.0) * 100}%`;
    }, 100);
  }

  function nextMinigameQuestion() {
    let pool = GAME1_QUESTIONS;
    if (gameState.activeGame === 2) pool = GAME2_QUESTIONS;
    if (gameState.activeGame === 3) pool = GAME3_QUESTIONS;

    const q = pool[Math.floor(Math.random() * pool.length)];
    gameState.currentQuestion = q;

    document.getElementById('questionPrompt').textContent = q.prompt;
    document.getElementById('questionSubtext').textContent = q.sub;

    const choices = shuffle([
      { text: q.correct, isCorrect: true },
      { text: q.wrong, isCorrect: false }
    ]);

    const grid = document.getElementById('answerOptionsGrid');
    grid.innerHTML = choices.map(c => `
      <button type="button" class="option-btn" data-correct="${c.isCorrect}">
        "${c.text}"
      </button>
    `).join('');

    grid.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const isCorrect = e.currentTarget.dataset.correct === 'true';
        handleMinigameAnswer(isCorrect, e.currentTarget);
      });
    });
  }

  function handleMinigameAnswer(isCorrect, targetBtn) {
    if (isCorrect) {
      sound.playCorrect();
      gameState.solvedCount++;
      gameState.earnedGold++;
      gameState.currentCombo++;
      if (gameState.currentCombo > gameState.maxCombo) gameState.maxCombo = gameState.currentCombo;

      document.getElementById('gameScoreText').textContent = `${gameState.solvedCount}개`;
      document.getElementById('gameGoldText').textContent = `+${gameState.earnedGold} Gold`;
      nextMinigameQuestion();
    } else {
      // RULE: 틀리면 맞힐 때까지 다음 문제로 넘어가지 않음!
      sound.playWrong();
      gameState.currentCombo = 0;
      if (targetBtn) {
        targetBtn.classList.add('wrong-shake');
        setTimeout(() => targetBtn.classList.remove('wrong-shake'), 400);
      }
    }
  }

  function finishMinigame() {
    sound.playCorrect();

    if (currentUser) {
      currentUser.gold = (currentUser.gold || 0) + gameState.earnedGold;
      if (gameState.activeGame === 1) currentUser.game1Clears = (currentUser.game1Clears || 0) + 1;
      if (gameState.activeGame === 2) currentUser.game2Clears = (currentUser.game2Clears || 0) + 1;
      if (gameState.activeGame === 3) currentUser.game3Clears = (currentUser.game3Clears || 0) + 1;

      saveSessionUser(currentUser);
      window.dbStorage.setUser(currentUser);
      window.dbStorage.updateLeaderboard(currentUser);
      updateHeaderUI();
    }

    document.getElementById('resSolvedCount').textContent = `${gameState.solvedCount}개`;
    document.getElementById('resMaxCombo').textContent = `${gameState.maxCombo} Combo`;
    document.getElementById('resEarnedGold').textContent = `+${gameState.earnedGold} Gold`;

    openModal('resultModal');
  }

  // -------------------------------------------------------------------------
  // 5. Boss Battle Dungeon (10 Questions, Elapsed Time measurement)
  // -------------------------------------------------------------------------
  function startBossBattle() {
    if (!currentUser || (currentUser.gold || 0) < 100) {
      alert('🪙 골드가 부족합니다! (필요 골드: 100 Gold)');
      return;
    }

    currentUser.gold -= 100;
    saveSessionUser(currentUser);
    window.dbStorage.setUser(currentUser);
    updateHeaderUI();

    gameState.bossProblemIndex = 0;
    gameState.bossHp = 10;
    gameState.bossStartTime = Date.now();

    const pool = [...GAME1_QUESTIONS, ...GAME2_QUESTIONS, ...GAME3_QUESTIONS];
    gameState.bossProblems = shuffle(pool).slice(0, 10);

    document.getElementById('bossRemainCount').textContent = '10';
    document.getElementById('bossHpText').textContent = '10 / 10 HP';
    document.getElementById('bossHpBar').style.width = '100%';

    showView('bossPlayView');
    nextBossQuestion();

    if (gameState.timerId) clearInterval(gameState.timerId);
    gameState.timerId = setInterval(() => {
      const elapsed = (Date.now() - gameState.bossStartTime) / 1000;
      document.getElementById('bossTimerText').textContent = `${elapsed.toFixed(2)}초`;
    }, 50);
  }

  function nextBossQuestion() {
    if (gameState.bossProblemIndex >= 10) {
      finishBossBattle();
      return;
    }

    const q = gameState.bossProblems[gameState.bossProblemIndex];
    document.getElementById('bossQNum').textContent = `문제 ${gameState.bossProblemIndex + 1} / 10`;
    document.getElementById('bossQPrompt').textContent = `${q.prompt} -> ${q.sub}`;

    const choices = shuffle([
      { text: q.correct, isCorrect: true },
      { text: q.wrong, isCorrect: false }
    ]);

    const grid = document.getElementById('bossAnswersGrid');
    grid.innerHTML = choices.map(c => `
      <button type="button" class="option-btn" data-correct="${c.isCorrect}">
        "${c.text}"
      </button>
    `).join('');

    grid.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const isCorrect = e.currentTarget.dataset.correct === 'true';
        handleBossAnswer(isCorrect, e.currentTarget);
      });
    });
  }

  function handleBossAnswer(isCorrect, targetBtn) {
    if (isCorrect) {
      sound.playCorrect();
      gameState.bossProblemIndex++;
      gameState.bossHp--;

      const remain = 10 - gameState.bossProblemIndex;
      document.getElementById('bossRemainCount').textContent = `${remain}`;
      document.getElementById('bossHpText').textContent = `${remain} / 10 HP`;
      document.getElementById('bossHpBar').style.width = `${(remain / 10) * 100}%`;

      nextBossQuestion();
    } else {
      // RULE: 틀리면 정답 고를 때까지 다음 문제로 넘어가지 않음!
      sound.playWrong();
      if (targetBtn) {
        targetBtn.classList.add('wrong-shake');
        setTimeout(() => targetBtn.classList.remove('wrong-shake'), 400);
      }
    }
  }

  function finishBossBattle() {
    if (gameState.timerId) clearInterval(gameState.timerId);
    sound.playCorrect();

    const elapsed = (Date.now() - gameState.bossStartTime) / 1000;

    if (currentUser) {
      if (!currentUser.bossFastestTime || elapsed < currentUser.bossFastestTime) {
        currentUser.bossFastestTime = elapsed;
      }
      currentUser.bossScore = (currentUser.bossScore || 0) + 1;
      saveSessionUser(currentUser);
      window.dbStorage.setUser(currentUser);
      window.dbStorage.updateLeaderboard(currentUser);
      updateHeaderUI();
    }

    alert(`🎉 높임말 마왕 봉인 성공!\n\n⏱️ 10문제 완주 기록: ${elapsed.toFixed(2)}초!\n🏆 영웅의 전당에 명예의 기록이 등록되었습니다.`);
    showView('lobbyView');
  }

  // -------------------------------------------------------------------------
  // 6. Hall of Heroes
  // -------------------------------------------------------------------------
  function renderHallOfHeroes(tab = 'gold') {
    const board = window.dbStorage.getLeaderboard();
    const tbody = document.getElementById('rankTableBody');
    if (!tbody) return;

    let sorted = [...board];
    if (tab === 'gold') sorted.sort((a, b) => (b.gold || 0) - (a.gold || 0));
    if (tab === 'minigames') sorted.sort((a, b) => ((b.game1||0)+(b.game2||0)+(b.game3||0)) - ((a.game1||0)+(a.game2||0)+(a.game3||0)));
    if (tab === 'boss') sorted.sort((a, b) => (b.bossScore || 0) - (a.bossScore || 0));
    if (tab === 'diligence') sorted.sort((a, b) => (b.gold || 0) - (a.gold || 0));

    tbody.innerHTML = sorted.slice(0, 20).map((item, idx) => `
      <tr>
        <td style="font-weight: bold; color: var(--accent-gold);">${idx + 1}위</td>
        <td>${item.name}</td>
        <td>${item.role || '학생'}</td>
        <td style="font-weight: bold;">
          ${tab === 'gold' ? `${item.gold} Gold` : ''}
          ${tab === 'minigames' ? `${(item.game1||0)+(item.game2||0)+(item.game3||0)}회` : ''}
          ${tab === 'boss' ? `${item.bossScore||0}회 클리어` : ''}
          ${tab === 'diligence' ? `${item.gold} P` : ''}
        </td>
      </tr>
    `).join('');
  }

  // -------------------------------------------------------------------------
  // 7. Teacher Dashboard
  // -------------------------------------------------------------------------
  function renderTeacherAdminPage() {
    if (!currentUser || currentUser.role !== 'teacher') return;

    const teacherClass = window.dbStorage.getClassByCode(currentUser.classCode || '363636');
    document.getElementById('teacherAccountName').textContent = currentUser.name || '김선생님';
    document.getElementById('teacherClassName').textContent = teacherClass?.name || '3학년 긍정열정반';
    document.getElementById('teacherInviteCode').textContent = currentUser.classCode || '363636';

    const board = window.dbStorage.getLeaderboard();
    const tbody = document.getElementById('studentLogsTableBody');
    if (tbody) {
      tbody.innerHTML = board.map(std => `
        <tr>
          <td style="font-weight: bold;">${std.name}</td>
          <td>${std.gold || 0} Gold</td>
          <td>${std.game1 || 0}회</td>
          <td>${std.game2 || 0}회</td>
          <td>${std.game3 || 0}회</td>
          <td style="color: var(--accent-purple); font-weight: bold;">${std.bossScore || 0}회 클리어</td>
          <td><button type="button" class="btn btn-outline btn-xs" onclick="window.showChartModal('${std.name}')">📊 취약 분석</button></td>
          <td><button type="button" class="btn btn-danger-soft btn-xs">초기화</button></td>
        </tr>
      `).join('');
    }
  }

  window.showChartModal = function(studentName) {
    document.getElementById('chartStudentName').textContent = studentName;
    const container = document.getElementById('chartBarsContainer');
    container.innerHTML = `
      <div style="padding: 20px; font-size: 0.95rem; line-height: 1.8;">
        <p><strong>[${studentName} 학생 높임표현 취약 진단]</strong></p>
        <p>• 올바른 높임표현 (진지/계시다): <span style="color: var(--accent-green);">우수 (오답률 5%)</span></p>
        <p>• 사물 높임 (약봉투가 예쁘셔요): <span style="color: var(--accent-red);">주의 (오답률 30%)</span></p>
        <p>• 공손한 예절 표현: <span style="color: var(--accent-purple);">양호 (오답률 10%)</span></p>
      </div>
    `;
    openModal('chartModal');
  };

  // -------------------------------------------------------------------------
  // 8. Event Listener Bindings
  // -------------------------------------------------------------------------
  function bindEvents() {
    currentUser = loadSessionUser();
    if (!currentUser) {
      openModal('loginModal');
    } else {
      updateHeaderUI();
    }

    // Navigation Buttons
    document.getElementById('logoBtn')?.addEventListener('click', () => showView('lobbyView'));
    document.getElementById('navHomeBtn')?.addEventListener('click', () => showView('lobbyView'));
    document.getElementById('openHallBtn')?.addEventListener('click', () => { renderHallOfHeroes(); showView('hallView'); });
    
    // Strict Teacher Admin Link Button
    document.getElementById('openAdminBtn')?.addEventListener('click', () => {
      if (currentUser && currentUser.role === 'teacher') {
        renderTeacherAdminPage();
        showView('adminView');
      } else {
        alert('🔒 교사 계정만 접속할 수 있습니다.');
      }
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      saveSessionUser(null);
      window.dbStorage.clearUser();
      openModal('loginModal');
      showView('lobbyView');
    });

    // Minigame Buttons
    document.querySelectorAll('.btn-game-play').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const gameType = Number(e.currentTarget.dataset.game);
        startMinigame(gameType);
      });
    });

    document.getElementById('closeResultModalBtn')?.addEventListener('click', () => {
      closeModal('resultModal');
      showView('lobbyView');
    });

    // Boss Battle Entry
    document.getElementById('enterBossBtn')?.addEventListener('click', () => {
      const body = document.getElementById('bossConfirmBody');
      body.innerHTML = `
        <p style="margin-bottom: 12px;">높임말 마왕 던전에 입장하시겠습니까?</p>
        <p style="color: var(--accent-gold); font-weight: bold;">필요 골드: 100 Gold (현재 보유: ${currentUser?.gold || 0} Gold)</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px;">10문제를 완파하는 데 걸리는 최단 시간을 측정합니다!</p>
      `;
      openModal('bossConfirmModal');
    });

    document.getElementById('bossCancelBtn')?.addEventListener('click', () => closeModal('bossConfirmModal'));
    document.getElementById('bossRealEnterBtn')?.addEventListener('click', () => {
      closeModal('bossConfirmModal');
      startBossBattle();
    });

    // Login Role Tabs
    document.querySelectorAll('.role-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.role-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const role = e.currentTarget.dataset.role;

        document.querySelectorAll('.login-form-content').forEach(f => f.classList.remove('active'));
        if (role === 'student') document.getElementById('studentLoginForm').classList.add('active');
        if (role === 'teacher') document.getElementById('teacherLoginForm').classList.add('active');
        if (role === 'anon') document.getElementById('anonLoginForm').classList.add('active');
      });
    });

    // Student Login
    document.getElementById('studentLoginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('studentRealName').value.trim();
      const code = document.getElementById('studentInviteInput').value.trim();

      const user = {
        uid: `std_${Date.now()}`,
        name,
        role: 'student',
        classCode: code,
        classTitle: '3학년 1반',
        gold: 0,
        game1Clears: 0,
        game2Clears: 0,
        game3Clears: 0,
        bossScore: 0
      };

      saveSessionUser(user);
      window.dbStorage.setUser(user);
      window.dbStorage.updateLeaderboard(user);

      closeModal('loginModal');
      updateHeaderUI();
      showView('lobbyView');
    });

    // Teacher Login (Creates/Joins class with 6-digit code)
    document.getElementById('teacherLoginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('teacherCodeInput').value.trim();
      const name = document.getElementById('teacherNameInput').value.trim() || '김선생님';

      window.dbStorage.createOrUpdateClass(code, '3학년 긍정열정반', name);

      const user = {
        uid: `tch_${code}`,
        name,
        role: 'teacher',
        classCode: code,
        classTitle: '3학년 긍정열정반',
        gold: 1000
      };

      saveSessionUser(user);
      window.dbStorage.setUser(user);

      closeModal('loginModal');
      updateHeaderUI();
      renderTeacherAdminPage();
      showView('adminView');
    });

    // Anon Login
    document.getElementById('anonLoginStartBtn')?.addEventListener('click', () => {
      const user = {
        uid: `anon_${Math.random().toString(36).substring(2,6)}`,
        name: `익명${Math.floor(Math.random()*9000+1000)}`,
        role: 'anon',
        gold: 50
      };
      saveSessionUser(user);
      window.dbStorage.setUser(user);

      closeModal('loginModal');
      updateHeaderUI();
      showView('lobbyView');
    });

    document.getElementById('closeChartModalBtn')?.addEventListener('click', () => closeModal('chartModal'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
  });

})();
