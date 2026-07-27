/**
 * Main Application Engine for [맞춤법 어드벤처]
 * 100% Identical Mechanism & UI Match to https://99dan-two.vercel.app/ (GuGudan Adventure)
 * 
 * Features:
 * 1. 2 Training Minigames ONLY (훈련 1: 올바른 높임 표현, 훈련 2: 공손한 예절 표현).
 * 2. Boss Battle mixes questions ONLY from 훈련 1 and 훈련 2.
 * 3. Repeat on Wrong Answer in Training & Boss (stay on question until correct answer is selected!).
 */

// ==========================================
// 1. QUESTION DATA POOLS (훈련 1, 훈련 2)
// ==========================================

// 훈련 1: 올바른 높임 표현 스피드 레이스
const GAME1_QUESTIONS = [
  {
    prompt: "할머니께 식사를 권해드릴 때",
    sub: "올바른 높임 표현을 선택하세요!",
    correct: "할머니, 진지 잡수세요.",
    wrong: "할머니, 밥 드세요.",
    type: "SPECIAL_WORD"
  },
  {
    prompt: "선생님께 궁금한 점을 물어보려고 할 때",
    sub: "올바른 높임 표현을 선택하세요!",
    correct: "선생님, 여쭤볼 것이 있습니다.",
    wrong: "선생님, 물어볼 것이 있습니다.",
    type: "OBJECT_HONORIFIC"
  },
  {
    prompt: "어머니의 부재 상태를 다른 사람에게 말씀드릴 때",
    sub: "올바른 높임 표현을 선택하세요!",
    correct: "어머니께서는 집에 안 계십니다.",
    wrong: "어머니는 집에 없어요.",
    type: "SPECIAL_WORD"
  },
  {
    prompt: "어머니의 부재를 주체 높임 주어로 바르게 표현할 때",
    sub: "올바른 높임 표현을 선택하세요!",
    correct: "어머니께서는 집에 안 계십니다.",
    wrong: "어머니는 집에 안 계십니다.",
    type: "SUBJECT_HONORIFIC"
  },
  {
    prompt: "할아버지의 건강 상태를 여쭤볼 때",
    sub: "올바른 높임 표현을 선택하세요!",
    correct: "할아버지, 어디 편찮으신 곳은 없으신가요?",
    wrong: "할아버지, 어디 아픈 곳은 없으신가요?",
    type: "SPECIAL_WORD"
  },
  {
    prompt: "선생님께 공책을 전달해 드릴 때",
    sub: "올바른 높임 표현을 선택하세요!",
    correct: "선생님, 공책을 가져다 드릴게요.",
    wrong: "선생님, 공책을 가져다 주실게요.",
    type: "COMMAND_DIRECTION"
  },
  {
    prompt: "약봉투를 가리키며 말할 때",
    sub: "사물 높임 오류를 피하세요!",
    correct: "약봉투가 참 예쁘네요.",
    wrong: "약봉투가 참 예쁘셔요.",
    type: "THING_HONORIFIC"
  },
  {
    prompt: "자신의 아픈 곳을 의사 선생님께 말할 때",
    sub: "자신 높임 오류를 피하세요!",
    correct: "어제부터 제 배가 아팠어요.",
    wrong: "어제부터 제 배가 아프셨어요.",
    type: "SELF_HONORIFIC"
  }
];

// 훈련 2: 공손한 예절 표현 탐정
const GAME2_QUESTIONS = [
  {
    prompt: "쉬는시간에 친구 목소리가 너무 커서 시끄러울 때",
    sub: "상황에 적절한 배려의 말을 선택하세요!",
    correct: "조금만 조용히 이야기해줄 수 있을까?",
    wrong: "야, 너 목소리 너무 커서 시끄러워!",
    type: "COURTESY"
  },
  {
    prompt: "어머니께서 '아들, 와서 밥 먹어라!' 하실 때",
    sub: "공손한 대답을 선택하세요!",
    correct: "네, 엄마! 조금 있다가 먹어도 돼요?",
    wrong: "아 싫어! 나중에 먹을 거라고!",
    type: "COURTESY"
  },
  {
    prompt: "복도에서 지나가던 친구와 살짝 부딪혔을 때",
    sub: "공손한 표현을 선택하세요!",
    correct: "앗 미안해! 다친 곳은 없어?",
    wrong: "눈 안 보고 다니냐? 조심 좀 해!",
    type: "COURTESY"
  },
  {
    prompt: "선생님께서 무거운 짐을 들고 계실 때",
    sub: "공손하게 도와드릴 말을 선택하세요!",
    correct: "선생님, 제가 도와드릴까요?",
    wrong: "선생님, 혼자 들기 힘들어 보이네요.",
    type: "COURTESY"
  },
  {
    prompt: "친구에게 물건을 빌리고 싶을 때",
    sub: "공손하게 부탁하는 말을 선택하세요!",
    correct: "혹시 지우개 한 번만 빌려줄 수 있니?",
    wrong: "야, 지우개 빨리 내놔 봐!",
    type: "COURTESY"
  }
];

// ==========================================
// 2. AUDIO SYNTHESIZER (8-bit Web Audio)
// ==========================================
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }
  toggle() {
    this.muted = !this.muted;
    return this.muted;
  }
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);
    g.gain.setValueAtTime(0.1, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
    osc.connect(g); g.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.04);
  }
  playCorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    [523, 659, 783, 1046].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.06);
      g.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.06);
      g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.06 + 0.08);
      osc.connect(g); g.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.06);
      osc.stop(this.ctx.currentTime + i * 0.06 + 0.08);
    });
  }
  playWrong() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);
    g.gain.setValueAtTime(0.2, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(g); g.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.25);
  }
}
const sound = new SoundSynth();

// ==========================================
// 3. MAIN GAME CONTROLLER
// ==========================================
class AppEngine {
  constructor() {
    this.user = window.dbStorage.getUser();
    this.currentView = 'lobbyView';
    
    // Active Minigame State (25s)
    this.activeGameType = 1;
    this.gameTimer = null;
    this.gameTimeLeft = 25.0;
    this.gameScore = 0;
    this.gameGoldEarned = 0;
    this.gameCombo = 0;
    this.gameMaxCombo = 0;
    this.currentQuestion = null;

    // Active Boss Battle State (60s Time Attack)
    this.bossTimer = null;
    this.bossTimeLeft = 60.0;
    this.bossSolvedCount = 0;
    this.bossCombo = 0;
    this.bossCurrentQuestion = null;
  }

  init() {
    this.bindEvents();
    if (!this.user) {
      this.openModal('loginModal');
    } else {
      this.updateHeaderUI();
    }
  }

  updateHeaderUI() {
    if (!this.user) return;
    document.querySelector('#headerUserName').textContent = this.user.name || '익명';
    document.querySelector('#headerUserRoleBadge').textContent = this.user.role === 'teacher' ? '교사' : '학생';
    document.querySelector('#userGoldVal').textContent = this.user.gold || 0;

    const adminBtn = document.querySelector('#openAdminBtn');
    if (this.user.role === 'teacher') {
      adminBtn.classList.remove('hidden');
    } else {
      adminBtn.classList.add('hidden');
    }
  }

  switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const target = document.querySelector(`#${viewId}`);
    if (target) target.classList.add('active');
    this.currentView = viewId;
  }

  openModal(modalId) {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    const target = document.querySelector(`#${modalId}`);
    if (target) target.classList.add('active');
  }

  closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }

  // Helper shuffle
  shuffle(arr) {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  }

  // ==========================================
  // MINIGAME 25s PLAY ENGINE
  // ==========================================
  startMinigame(gameType) {
    this.activeGameType = gameType;
    this.gameTimeLeft = 25.0;
    this.gameScore = 0;
    this.gameGoldEarned = 0;
    this.gameCombo = 0;
    this.gameMaxCombo = 0;

    const titleMap = {
      1: '올바른 높임 표현 스피드 레이스',
      2: '공손한 예절 표현 탐정'
    };
    document.querySelector('#playGameTitle').textContent = titleMap[gameType] || '맞춤법 훈련';
    document.querySelector('#gameScoreText').textContent = '0개';
    document.querySelector('#gameGoldText').textContent = '+0 Gold';

    this.switchView('gamePlayView');
    this.nextMinigameQuestion();

    // Timer interval
    if (this.gameTimer) clearInterval(this.gameTimer);
    const timerProgress = document.querySelector('#gameTimerProgress');
    const timerText = document.querySelector('#gameTimerText');

    this.gameTimer = setInterval(() => {
      this.gameTimeLeft -= 0.1;
      if (this.gameTimeLeft <= 0) {
        this.gameTimeLeft = 0;
        clearInterval(this.gameTimer);
        this.finishMinigame();
      }
      timerText.textContent = `${this.gameTimeLeft.toFixed(1)}초`;
      timerProgress.style.width = `${(this.gameTimeLeft / 25.0) * 100}%`;
    }, 100);
  }

  nextMinigameQuestion() {
    const pool = this.activeGameType === 1 ? GAME1_QUESTIONS : GAME2_QUESTIONS;
    const q = pool[Math.floor(Math.random() * pool.length)];
    this.currentQuestion = q;

    document.querySelector('#questionPrompt').textContent = q.prompt;
    document.querySelector('#questionSubtext').textContent = q.sub;

    const choices = this.shuffle([
      { text: q.correct, isCorrect: true },
      { text: q.wrong, isCorrect: false }
    ]);

    const grid = document.querySelector('#answerOptionsGrid');
    grid.innerHTML = choices.map(c => `
      <button class="option-btn" data-correct="${c.isCorrect}">
        "${c.text}"
      </button>
    `).join('');

    grid.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const isCorrect = e.currentTarget.dataset.correct === 'true';
        this.handleMinigameAnswer(isCorrect, e.currentTarget);
      });
    });
  }

  handleMinigameAnswer(isCorrect, targetBtn) {
    if (isCorrect) {
      sound.playCorrect();
      this.gameScore++;
      this.gameGoldEarned++;
      this.gameCombo++;
      if (this.gameCombo > this.gameMaxCombo) this.gameMaxCombo = this.gameCombo;

      document.querySelector('#gameScoreText').textContent = `${this.gameScore}개`;
      document.querySelector('#gameGoldText').textContent = `+${this.gameGoldEarned} Gold`;
      this.nextMinigameQuestion();
    } else {
      // RULE: 훈련하기에서 문제 틀리면 맞힐 때까지 넘어가지 않는다!
      sound.playWrong();
      this.gameCombo = 0;
      if (targetBtn) {
        targetBtn.classList.add('wrong-shake');
        setTimeout(() => targetBtn.classList.remove('wrong-shake'), 400);
      }
      // Stay on current question!
    }
  }

  finishMinigame() {
    sound.playCorrect();

    if (this.user) {
      this.user.gold = (this.user.gold || 0) + this.gameGoldEarned;
      if (this.activeGameType === 1) this.user.game1Clears = (this.user.game1Clears || 0) + 1;
      if (this.activeGameType === 2) this.user.game2Clears = (this.user.game2Clears || 0) + 1;

      window.dbStorage.setUser(this.user);
      window.dbStorage.updateLeaderboard(this.user);
      this.updateHeaderUI();
    }

    document.querySelector('#resSolvedCount').textContent = `${this.gameScore}개`;
    document.querySelector('#resMaxCombo').textContent = `${this.gameMaxCombo} Combo`;
    document.querySelector('#resEarnedGold').textContent = `+${this.gameGoldEarned} Gold`;

    this.openModal('resultModal');
  }

  // ==========================================
  // BOSS BATTLE 60s TIME ATTACK ENGINE
  // ==========================================
  startBossBattle() {
    if (!this.user || (this.user.gold || 0) < 100) {
      alert('🪙 골드가 부족합니다! (필요 골드: 100 Gold)');
      return;
    }

    // Deduct 100 Gold
    this.user.gold -= 100;
    window.dbStorage.setUser(this.user);
    this.updateHeaderUI();

    this.bossTimeLeft = 60.0;
    this.bossSolvedCount = 0;
    this.bossCombo = 0;

    document.querySelector('#bossSolvedCount').textContent = '0';
    this.switchView('bossPlayView');
    this.nextBossQuestion();

    if (this.bossTimer) clearInterval(this.bossTimer);
    const bossTimerText = document.querySelector('#bossTimerText');
    const bossHpBar = document.querySelector('#bossHpBar');

    this.bossTimer = setInterval(() => {
      this.bossTimeLeft -= 0.1;
      if (this.bossTimeLeft <= 0) {
        this.bossTimeLeft = 0;
        clearInterval(this.bossTimer);
        this.finishBossBattle();
      }
      bossTimerText.textContent = `${this.bossTimeLeft.toFixed(1)}초`;
      bossHpBar.style.width = `${(this.bossTimeLeft / 60.0) * 100}%`;
    }, 100);
  }

  nextBossQuestion() {
    // Mix questions ONLY from 훈련 1 and 훈련 2
    const allPool = [...GAME1_QUESTIONS, ...GAME2_QUESTIONS];
    const q = allPool[Math.floor(Math.random() * allPool.length)];
    this.bossCurrentQuestion = q;

    document.querySelector('#bossQPrompt').textContent = `[${q.prompt}] -> "${q.sub}"`;

    const choices = this.shuffle([
      { text: q.correct, isCorrect: true },
      { text: q.wrong, isCorrect: false }
    ]);

    const grid = document.querySelector('#bossAnswersGrid');
    grid.innerHTML = choices.map(c => `
      <button class="option-btn" data-correct="${c.isCorrect}">
        "${c.text}"
      </button>
    `).join('');

    grid.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const isCorrect = e.currentTarget.dataset.correct === 'true';
        this.handleBossAnswer(isCorrect, e.currentTarget);
      });
    });
  }

  handleBossAnswer(isCorrect, targetBtn) {
    if (isCorrect) {
      sound.playCorrect();
      this.bossSolvedCount++;
      this.bossCombo++;
      document.querySelector('#bossSolvedCount').textContent = `${this.bossSolvedCount}`;

      // Floating damage text effect
      const floatLayer = document.querySelector('#damageFloatLayer');
      if (floatLayer) {
        const dmg = document.createElement('div');
        dmg.className = 'floating-damage';
        dmg.style.left = '50%';
        dmg.textContent = `🎯 HIT! +1`;
        floatLayer.appendChild(dmg);
        setTimeout(() => dmg.remove(), 800);
      }

      this.nextBossQuestion();
    } else {
      // RULE: 틀리면 맞을 때까지 넘어가지 않는다!
      sound.playWrong();
      this.bossCombo = 0;
      if (targetBtn) {
        targetBtn.classList.add('wrong-shake');
        setTimeout(() => targetBtn.classList.remove('wrong-shake'), 400);
      }
    }
  }

  finishBossBattle() {
    sound.playCorrect();

    if (this.user) {
      if (this.bossSolvedCount > (this.user.bossScore || 0)) {
        this.user.bossScore = this.bossSolvedCount;
      }
      window.dbStorage.setUser(this.user);
      window.dbStorage.updateLeaderboard(this.user);
      this.updateHeaderUI();
    }

    alert(`🎉 1분 마왕 타임어택 종료!\n\n⏱️ 1분 동안 맞힌 문제: ${this.bossSolvedCount}개!\n🏆 영웅의 전당에 랭킹이 등록되었습니다.`);
    this.switchView('lobbyView');
  }

  // ==========================================
  // HALL OF HEROES (LEADERBOARD)
  // ==========================================
  renderLeaderboard(tab = 'gold') {
    const board = window.dbStorage.getLeaderboard();
    const tbody = document.querySelector('#rankTableBody');
    if (!tbody) return;

    let sorted = [...board];
    if (tab === 'gold') sorted.sort((a, b) => (b.gold || 0) - (a.gold || 0));
    if (tab === 'minigames') sorted.sort((a, b) => ((b.game1||0)+(b.game2||0)) - ((a.game1||0)+(a.game2||0)));
    if (tab === 'boss') sorted.sort((a, b) => (b.bossScore || 0) - (a.bossScore || 0));
    if (tab === 'diligence') sorted.sort((a, b) => (b.gold || 0) - (a.gold || 0));

    tbody.innerHTML = sorted.slice(0, 20).map((item, idx) => `
      <tr>
        <td style="font-weight: bold; color: var(--accent-gold);">${idx + 1}위</td>
        <td>${item.name}</td>
        <td>${item.role || '학생'}</td>
        <td style="font-weight: bold;">
          ${tab === 'gold' ? `${item.gold} Gold` : ''}
          ${tab === 'minigames' ? `${(item.game1||0)+(item.game2||0)}회 클리어` : ''}
          ${tab === 'boss' ? `${item.bossScore||0}개 정답` : ''}
          ${tab === 'diligence' ? `${item.gold} P` : ''}
        </td>
      </tr>
    `).join('');
  }

  // ==========================================
  // TEACHER DASHBOARD
  // ==========================================
  renderTeacherDashboard() {
    const teacherClass = window.dbStorage.getClassByCode(this.user?.classCode || '363636');
    document.querySelector('#teacherAccountName').textContent = this.user?.name || '김선생님';
    document.querySelector('#teacherClassName').textContent = teacherClass?.name || '3학년 긍정열정반';
    document.querySelector('#teacherInviteCode').textContent = this.user?.classCode || '363636';

    const board = window.dbStorage.getLeaderboard();
    const tbody = document.querySelector('#studentLogsTableBody');
    if (tbody) {
      tbody.innerHTML = board.map(std => `
        <tr>
          <td style="font-weight: bold;">${std.name}</td>
          <td>${std.gold || 0} Gold</td>
          <td>${std.game1 || 0}회</td>
          <td>${std.game2 || 0}회</td>
          <td style="color: var(--accent-purple); font-weight: bold;">${std.bossScore || 0}개 정답</td>
          <td><button class="btn btn-outline btn-xs" onclick="app.showDiagnosticChart('${std.name}')">📊 취약 분석</button></td>
          <td><button class="btn btn-danger-soft btn-xs">초기화</button></td>
        </tr>
      `).join('');
    }
  }

  showDiagnosticChart(studentName) {
    document.querySelector('#chartStudentName').textContent = studentName;
    const container = document.querySelector('#chartBarsContainer');
    container.innerHTML = `
      <div style="padding: 20px; font-size: 0.95rem; line-height: 1.8;">
        <p><strong>[${studentName} 학생 맞춤법 취약 진단]</strong></p>
        <p>• 올바른 높임표현 (진지/계시다): <span style="color: var(--accent-green);">우수 (오답률 5%)</span></p>
        <p>• 공손한 예절 표현: <span style="color: var(--accent-purple);">양호 (오답률 10%)</span></p>
      </div>
    `;
    this.openModal('chartModal');
  }

  // ==========================================
  // EVENT BINDINGS
  // ==========================================
  bindEvents() {
    // Header navigation
    document.querySelector('#logoBtn')?.addEventListener('click', () => { sound.playClick(); this.switchView('lobbyView'); });
    document.querySelector('#navHomeBtn')?.addEventListener('click', () => { sound.playClick(); this.switchView('lobbyView'); });
    document.querySelector('#openHallBtn')?.addEventListener('click', () => { sound.playClick(); this.renderLeaderboard(); this.switchView('hallView'); });
    document.querySelector('#openAdminBtn')?.addEventListener('click', () => { sound.playClick(); this.renderTeacherDashboard(); this.switchView('adminView'); });
    document.querySelector('#soundToggleBtn')?.addEventListener('click', () => {
      const isMuted = sound.toggle();
      document.querySelector('#soundIcon').textContent = isMuted ? '🔇' : '🔊';
    });

    document.querySelector('#logoutBtn')?.addEventListener('click', () => {
      sound.playClick();
      window.dbStorage.clearUser();
      this.user = null;
      location.reload();
    });

    // Minigame play buttons
    document.querySelectorAll('.btn-game-play').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sound.playClick();
        const gameType = Number(e.currentTarget.dataset.game);
        this.startMinigame(gameType);
      });
    });

    // Result modal return home
    document.querySelector('#closeResultModalBtn')?.addEventListener('click', () => {
      sound.playClick();
      this.closeModals();
      this.switchView('lobbyView');
    });

    // Boss battle enter button
    document.querySelector('#enterBossBtn')?.addEventListener('click', () => {
      sound.playClick();
      const body = document.querySelector('#bossConfirmBody');
      body.innerHTML = `
        <p style="margin-bottom: 12px;">맞춤법 마왕 던전에 입장하시겠습니까?</p>
        <p style="color: var(--accent-gold); font-weight: bold;">필요 골드: 100 Gold (현재 보유: ${this.user?.gold || 0} Gold)</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px;">제한시간 1분 동안 훈련 1, 2 문제가 연속 출제됩니다!</p>
      `;
      this.openModal('bossConfirmModal');
    });

    document.querySelector('#bossCancelBtn')?.addEventListener('click', () => { sound.playClick(); this.closeModals(); });
    document.querySelector('#bossRealEnterBtn')?.addEventListener('click', () => {
      sound.playClick();
      this.closeModals();
      this.startBossBattle();
    });

    // Hall of Heroes tabs
    document.querySelectorAll('.hall-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sound.playClick();
        document.querySelectorAll('.hall-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const tab = e.currentTarget.dataset.tab;
        this.renderLeaderboard(tab);
      });
    });

    // Login modal role tabs
    document.querySelectorAll('.role-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sound.playClick();
        document.querySelectorAll('.role-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const role = e.currentTarget.dataset.role;

        document.querySelectorAll('.login-form-content').forEach(f => f.classList.remove('active'));
        if (role === 'student') document.querySelector('#studentLoginForm').classList.add('active');
        if (role === 'teacher') document.querySelector('#teacherLoginForm').classList.add('active');
        if (role === 'anon') document.querySelector('#anonLoginForm').classList.add('active');
      });
    });

    // Student Login
    document.querySelector('#studentLoginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      sound.playClick();
      const name = document.querySelector('#studentRealName').value.trim();
      const code = document.querySelector('#studentInviteInput').value.trim();

      this.user = {
        uid: `std_${Date.now()}`,
        name,
        role: 'student',
        classCode: code,
        classTitle: '3학년 1반',
        gold: 0,
        game1Clears: 0,
        game2Clears: 0,
        bossScore: 0
      };

      window.dbStorage.setUser(this.user);
      window.dbStorage.updateLeaderboard(this.user);
      this.closeModals();
      this.updateHeaderUI();
      this.switchView('lobbyView');
    });

    // Teacher Login / Create
    document.querySelector('#teacherLoginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      sound.playClick();
      const code = document.querySelector('#teacherCodeInput').value.trim();
      const name = document.querySelector('#teacherNameInput').value.trim() || '김선생님';

      window.dbStorage.createOrUpdateClass(code, '3학년 긍정열정반', name);

      this.user = {
        uid: `tch_${code}`,
        name,
        role: 'teacher',
        classCode: code,
        classTitle: '3학년 긍정열정반',
        gold: 1000,
        game1Clears: 0,
        game2Clears: 0,
        bossScore: 0
      };

      window.dbStorage.setUser(this.user);
      this.closeModals();
      this.updateHeaderUI();
      this.renderTeacherDashboard();
      this.switchView('adminView');
    });

    // Anon Login
    document.querySelector('#anonLoginStartBtn')?.addEventListener('click', () => {
      sound.playClick();
      this.user = {
        uid: `anon_${Math.random().toString(36).substring(2,6)}`,
        name: `익명${Math.floor(Math.random()*9000+1000)}`,
        role: 'student',
        classTitle: '익명반',
        gold: 50,
        game1Clears: 0,
        game2Clears: 0,
        bossScore: 0
      };
      window.dbStorage.setUser(this.user);
      this.closeModals();
      this.updateHeaderUI();
      this.switchView('lobbyView');
    });
  }
}

// Global App Instance
window.app = new AppEngine();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
