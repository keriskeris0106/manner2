/**
 * Core Application Engine for [높임말 어드벤처]
 * 100% Exact Copy of 99/app.js Architecture (Gugudan Adventure Core Engine v36)
 * Adapted for Korean Honorifics & Courtesy (높임표현 & 공손예절)
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Data Models & Constants
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

  const BOSS_ENTRY_GOLD = 100;
  const REWARD_GOLD_PER_PROBLEM = 1;

  let registeredClasses = {};
  let registeredTeachersMap = {};
  let allPlayersMap = {};
  let sampleClassStudents = [];
  let isLoggingInProgress = false;

  // Firebase Firestore Reference
  let db = null;
  if (typeof firebase !== 'undefined' && firebase.firestore) {
    try {
      db = firebase.firestore();
      console.log("🔥 [Firestore Engine v36] Cloud Database connected!");
    } catch (e) {
      console.warn("Firestore connection warning:", e);
    }
  }

  async function ensureFirebaseAuth() {
    if (typeof firebase === 'undefined' || !firebase.auth) return null;
    if (firebase.auth().currentUser) {
      return firebase.auth().currentUser;
    }
    try {
      const anonRes = await firebase.auth().signInAnonymously();
      console.log("🔥 [Firebase Auth] Signed in anonymously:", anonRes.user.uid);
      return anonRes.user;
    } catch (e) {
      console.warn("Firebase anon auth error:", e);
      return null;
    }
  }

  // -------------------------------------------------------------------------
  // 2. Sound Engine
  // -------------------------------------------------------------------------
  class SoundEngine {
    constructor() {
      this.enabled = true;
      this.audioCtx = null;
    }

    init() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.08) {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;

      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {}
    }

    playCorrect() {
      this.playTone(523.25, 'sine', 0.08, 0.08);
      setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.08), 60);
    }

    playWrong() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;

      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(65, this.audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.25);
      } catch (e) {}
    }

    playCombo(count) {
      const baseFreq = 450 + Math.min(count, 15) * 30;
      this.playTone(baseFreq, 'sine', 0.08, 0.08);
    }

    playHit() {
      this.playTone(120, 'sine', 0.12, 0.15);
    }

    playVictory() {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.12), idx * 100);
      });
    }
  }

  const sound = new SoundEngine();

  // -------------------------------------------------------------------------
  // 3. Application State Management
  // -------------------------------------------------------------------------
  let currentUser = null;
  let navigationHistory = ['lobbyView'];

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

  function getUserModeData(user, mode = currentMode) {
    if (!user) {
      return {
        currentGold: 0, totalGold: 0, totalSolved: 0, weeklySolved: 0, bossCount: 0, bossFastestTime: null, gameClears: [0, 0], todayClears: [0, 0], lastActiveDate: '', weakTableErrors: {}, titleIndex: 0
      };
    }
    if (!user.modeData) {
      user.modeData = {
        honorific: { currentGold: user.currentGold || 0, totalGold: user.totalGold || 0, totalSolved: user.totalSolved || 0, weeklySolved: user.weeklySolved || 0, bossCount: user.bossCount || 0, bossFastestTime: user.bossFastestTime || null, gameClears: user.gameClears || [0, 0], todayClears: user.todayClears || [0, 0], lastActiveDate: '', weakTableErrors: {}, titleIndex: user.titleIndex || 0 },
        courtesy: { currentGold: 0, totalGold: 0, totalSolved: 0, weeklySolved: 0, bossCount: 0, bossFastestTime: null, gameClears: [0, 0], todayClears: [0, 0], lastActiveDate: '', weakTableErrors: {}, titleIndex: 0 }
      };
    }
    if (!user.modeData[mode]) {
      user.modeData[mode] = { currentGold: 0, totalGold: 0, totalSolved: 0, weeklySolved: 0, bossCount: 0, bossFastestTime: null, gameClears: [0, 0], todayClears: [0, 0], lastActiveDate: '', weakTableErrors: {}, titleIndex: 0 };
    }

    const modeObj = user.modeData[mode];
    user.currentGold = modeObj.currentGold;
    user.totalGold = modeObj.totalGold;
    user.totalSolved = modeObj.totalSolved;
    user.weeklySolved = modeObj.weeklySolved;
    user.bossCount = modeObj.bossCount;
    user.bossFastestTime = modeObj.bossFastestTime;
    user.gameClears = modeObj.gameClears;
    user.todayClears = modeObj.todayClears;
    user.lastActiveDate = modeObj.lastActiveDate;
    user.titleIndex = modeObj.titleIndex;
    return modeObj;
  }

  function getTodayKSTDateString() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const kst = new Date(utc + (9 * 3600000));
    return `${kst.getFullYear()}-${String(kst.getMonth() + 1).padStart(2, '0')}-${String(kst.getDate()).padStart(2, '0')}`;
  }

  function generateRandomAnonCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 4; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    return res;
  }

  function getStudentDisplayName(user) {
    if (!user) return '익명';
    if (user.role === 'anon') return `${user.name}`;
    if (user.role === 'student') {
      const classNameStr = user.className || '미설정';
      return `${user.name} (${classNameStr})`;
    }
    return user.name;
  }

  function getFullUserTitleString(user, mode = currentMode) {
    const mData = getUserModeData(user, mode);
    const titlesList = TITLES_MAP[mode] || TITLES_MAP.honorific;
    const titleObj = titlesList[mData.titleIndex || 0] || titlesList[0];
    return `${titleObj.emoji} ${getStudentDisplayName(user)}`;
  }

  function saveSessionUser(user) {
    currentUser = user;
    if (user) {
      if (currentUser.role !== 'teacher' && currentUser.role !== 'superadmin') {
        getUserModeData(currentUser, currentMode);
      }
      localStorage.setItem('noepim_logged_user_v36', JSON.stringify(user));
    } else {
      localStorage.removeItem('noepim_logged_user_v36');
    }
  }

  function loadSessionUser() {
    const saved = localStorage.getItem('noepim_logged_user_v36');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && u.role !== 'teacher' && u.role !== 'superadmin') {
          getUserModeData(u, currentMode);
        }
        return u;
      } catch (e) {}
    }
    return null;
  }

  function loadStorageData() {
    const saved = localStorage.getItem('noepim_adventure_data_v36');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        sampleClassStudents = parsed.students || [];
        if (parsed.classes) registeredClasses = parsed.classes;
        if (parsed.teachers) registeredTeachersMap = parsed.teachers;
        if (parsed.players) allPlayersMap = parsed.players;
      } catch (e) {}
    }
    if (!sampleClassStudents) sampleClassStudents = [];
    if (!allPlayersMap) allPlayersMap = {};
    if (!registeredClasses) registeredClasses = {};
    if (!registeredTeachersMap) registeredTeachersMap = {};

    sampleClassStudents.forEach(s => getUserModeData(s, currentMode));
    Object.values(allPlayersMap).forEach(p => getUserModeData(p, currentMode));
  }

  function saveStorageData() {
    const payload = {
      students: sampleClassStudents,
      classes: registeredClasses,
      teachers: registeredTeachersMap,
      players: allPlayersMap,
      lastUpdated: Date.now()
    };
    localStorage.setItem('noepim_adventure_data_v36', JSON.stringify(payload));
    refreshAllLiveViews();
  }

  async function syncToFirestore(collectionName, docId, dataObj) {
    if (!db) return;
    try {
      await ensureFirebaseAuth();
      await db.collection(collectionName).doc(docId).set(dataObj, { merge: true });
    } catch (e) {}
  }

  function initFirestoreRealtimeListeners() {
    if (!db) return;
    db.collection('classes').onSnapshot((snapshot) => {
      snapshot.forEach(doc => {
        const data = doc.data();
        registeredClasses[doc.id] = data;
      });
      saveStorageData();
    });

    db.collection('students').onSnapshot((snapshot) => {
      snapshot.forEach(doc => {
        const data = doc.data();
        getUserModeData(data, currentMode);
        allPlayersMap[data.id] = data;
        const idx = sampleClassStudents.findIndex(s => s.id === data.id);
        if (idx >= 0) sampleClassStudents[idx] = data;
        else sampleClassStudents.push(data);
      });
      saveStorageData();
    });
  }

  async function saveUserDataInList(user) {
    if (!user || user.role === 'teacher' || user.role === 'superadmin') return;
    getUserModeData(user, currentMode);
    allPlayersMap[user.id] = user;
    if (user.role === 'student') {
      const idx = sampleClassStudents.findIndex(s => s.id === user.id);
      if (idx >= 0) sampleClassStudents[idx] = user;
      else sampleClassStudents.push(user);
      await syncToFirestore('students', user.id, user);
    } else if (user.role === 'anon') {
      await syncToFirestore('students', user.id, user);
    }
    saveStorageData();
  }

  function refreshAllLiveViews() {
    updateHeaderUI();
    const adminView = document.getElementById('adminView');
    if (adminView && adminView.classList.contains('active')) {
      renderTeacherAdminPage();
    }
    const hallView = document.getElementById('hallView');
    if (hallView && hallView.classList.contains('active')) {
      const activeTabEl = document.querySelector('.hall-tab-btn.active');
      const activeTab = activeTabEl ? activeTabEl.dataset.tab : 'gold';
      renderHallOfHeroes(activeTab);
    }
  }

  function openModal(modalId) {
    if (isLoggingInProgress && modalId === 'loginModal') return;
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    const logoIcon = document.getElementById('headerLogoIcon');
    const logoText = document.getElementById('headerLogoText');
    if (logoIcon) logoIcon.textContent = mode === 'courtesy' ? '💬' : '⚔️';
    if (logoText) logoText.textContent = '높임말 어드벤처';

    if (currentUser) getUserModeData(currentUser, currentMode);
    refreshAllLiveViews();
  }

  function showView(viewId) {
    // STRICT SECURITY CHECK: Block non-teachers from adminView!
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
    if (currentUser.role !== 'teacher' && currentUser.role !== 'superadmin') {
      const mData = getUserModeData(currentUser, currentMode);
      const titlesList = TITLES_MAP[currentMode] || TITLES_MAP.honorific;
      const titleObj = titlesList[mData.titleIndex || 0] || titlesList[0];
      document.getElementById('headerUserTitleEmoji').textContent = titleObj.emoji;
      document.getElementById('headerUserTitleName').textContent = titleObj.name;
      document.getElementById('userGoldVal').textContent = mData.currentGold || 0;
    } else {
      document.getElementById('headerUserTitleEmoji').textContent = '👩‍🏫';
      document.getElementById('headerUserTitleName').textContent = '교사';
      document.getElementById('userGoldVal').textContent = '999';
    }

    document.getElementById('headerUserName').textContent = getStudentDisplayName(currentUser);
    const roleBadge = document.getElementById('headerUserRoleBadge');
    if (currentUser.role === 'teacher') roleBadge.textContent = '교사';
    else if (currentUser.role === 'anon') roleBadge.textContent = '익명';
    else roleBadge.textContent = '학생';

    // Show admin button ONLY to teachers!
    const adminBtn = document.getElementById('openAdminBtn');
    if (currentUser.role === 'teacher') {
      adminBtn.classList.remove('hidden');
    } else {
      adminBtn.classList.add('hidden');
    }
  }

  // -------------------------------------------------------------------------
  // 4. Minigame 25s Play Engine
  // -------------------------------------------------------------------------
  function shuffle(arr) {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  }

  function startMiniGame(gameType) {
    gameState.activeGame = gameType;
    gameState.timeRemaining = 25.0;
    gameState.solvedCount = 0;
    gameState.earnedGold = 0;
    gameState.currentCombo = 0;
    gameState.maxCombo = 0;

    const titles = { 1: '올바른 높임 표현 스피드 레이스', 2: '공손한 예절 표현 탐정' };
    document.getElementById('playGameTitle').textContent = titles[gameType] || '높임말 훈련';
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
        finishMiniGame();
      }
      timerText.textContent = `${gameState.timeRemaining.toFixed(1)}초`;
      timerProgress.style.width = `${(gameState.timeRemaining / 25.0) * 100}%`;
    }, 100);
  }

  function nextMinigameQuestion() {
    const pool = gameState.activeGame === 1 ? GAME1_QUESTIONS : GAME2_QUESTIONS;
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
      // RULE: 틀리면 정답 고를 때까지 넘어가지 않음!
      sound.playWrong();
      gameState.currentCombo = 0;
      if (targetBtn) {
        targetBtn.classList.add('wrong-shake');
        setTimeout(() => targetBtn.classList.remove('wrong-shake'), 400);
      }
    }
  }

  function finishMiniGame() {
    sound.playCorrect();

    if (currentUser) {
      const mData = getUserModeData(currentUser, currentMode);
      mData.currentGold = (mData.currentGold || 0) + gameState.earnedGold;
      mData.totalGold = (mData.totalGold || 0) + gameState.earnedGold;
      
      const gameIdx = gameState.activeGame - 1;
      if (!mData.gameClears) mData.gameClears = [0, 0];
      mData.gameClears[gameIdx] = (mData.gameClears[gameIdx] || 0) + 1;

      saveSessionUser(currentUser);
      saveUserDataInList(currentUser);
    }

    document.getElementById('resSolvedCount').textContent = `${gameState.solvedCount}개`;
    document.getElementById('resMaxCombo').textContent = `${gameState.maxCombo} Combo`;
    document.getElementById('resEarnedGold').textContent = `+${gameState.earnedGold} Gold`;

    openModal('resultModal');
  }

  // -------------------------------------------------------------------------
  // 5. Boss Battle Dungeon (10 Questions Elapsed Time)
  // -------------------------------------------------------------------------
  function requestBossEntry() {
    if (!currentUser) return;
    const mData = getUserModeData(currentUser, currentMode);
    if ((mData.currentGold || 0) < BOSS_ENTRY_GOLD) {
      alert(`🪙 골드가 부족합니다! (필요 골드: ${BOSS_ENTRY_GOLD} Gold)`);
      return;
    }

    mData.currentGold -= BOSS_ENTRY_GOLD;
    mData.bossCount = (mData.bossCount || 0) + 1;

    saveSessionUser(currentUser);
    saveUserDataInList(currentUser);

    startBossBattle();
  }

  function startBossBattle() {
    gameState.bossProblemIndex = 0;
    gameState.bossHp = 10;
    gameState.bossStartTime = Date.now();

    const pool = [...GAME1_QUESTIONS, ...GAME2_QUESTIONS];
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
    document.getElementById('bossQPrompt').textContent = `${q.prompt} -> "${q.sub}"`;

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
    sound.playVictory();

    const elapsed = (Date.now() - gameState.bossStartTime) / 1000;

    if (currentUser) {
      const mData = getUserModeData(currentUser, currentMode);
      if (!mData.bossFastestTime || elapsed < mData.bossFastestTime) {
        mData.bossFastestTime = elapsed;
      }
      saveSessionUser(currentUser);
      saveUserDataInList(currentUser);
    }

    alert(`🎉 높임말 마왕 봉인 성공!\n\n⏱️ 10문제 완주 기록: ${elapsed.toFixed(2)}초!\n🏆 영웅의 전당에 명예의 기록이 등록되었습니다.`);
    showView('lobbyView');
  }

  // -------------------------------------------------------------------------
  // 6. Hall of Heroes (Exact 99/app.js Implementation)
  // -------------------------------------------------------------------------
  function renderHallOfHeroes(activeTab = 'gold') {
    document.querySelectorAll('.hall-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === activeTab);
    });

    const singleWrapper = document.getElementById('hallSingleWrapper');
    const tripleWrapper = document.getElementById('hallTripleWrapper');

    if (activeTab === 'minigames') {
      singleWrapper.classList.add('hidden');
      tripleWrapper.classList.remove('hidden');
      renderHallTripleGrid();
    } else {
      singleWrapper.classList.remove('hidden');
      tripleWrapper.classList.add('hidden');
      renderHallSingleTable(activeTab);
    }
  }

  function calculateJointRanks(list, getValueFn, isAscending = false) {
    if (!list || list.length === 0) return [];

    const sorted = [...list].sort((a, b) => {
      const valA = getValueFn(a);
      const valB = getValueFn(b);
      return isAscending ? valA - valB : valB - valA;
    });

    let currentRank = 1;
    let result = [];

    for (let i = 0; i < sorted.length; i++) {
      if (i > 0) {
        const prevVal = getValueFn(sorted[i - 1]);
        const currVal = getValueFn(sorted[i]);
        if (currVal !== prevVal) {
          currentRank = i + 1;
        }
      }
      result.push({
        user: sorted[i],
        rankNum: currentRank,
        rankDisplay: `${currentRank}위`
      });
    }

    return result;
  }

  function renderHallSingleTable(activeTab) {
    const tbody = document.getElementById('rankTableBody');
    tbody.innerHTML = '';

    const allUsers = Object.values(allPlayersMap);
    const activeList = allUsers.filter(u => {
      const mData = getUserModeData(u, currentMode);
      if (activeTab === 'gold') return (mData.totalGold || 0) > 0;
      if (activeTab === 'boss') return mData.bossFastestTime !== null;
      if (activeTab === 'diligence') return (mData.totalGold || 0) > 0;
      return true;
    });

    const getValFn = u => {
      const mData = getUserModeData(u, currentMode);
      if (activeTab === 'gold') return mData.totalGold || 0;
      if (activeTab === 'boss') return mData.bossFastestTime || 99999;
      if (activeTab === 'diligence') return mData.totalGold || 0;
      return 0;
    };

    const isAscending = (activeTab === 'boss');
    const rankedList = calculateJointRanks(activeList, getValFn, isAscending);
    const top20Ranked = rankedList.filter(item => item.rankNum <= 20);

    if (top20Ranked.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:24px; color:var(--text-muted);">기록이 없습니다. 첫 번째 영웅이 되어보세요!</td></tr>`;
      return;
    }

    top20Ranked.forEach((item) => {
      const u = item.user;
      const mData = getUserModeData(u, currentMode);
      const tr = document.createElement('tr');

      const isMyRow = currentUser && (u.id === currentUser.id);
      if (isMyRow) tr.className = 'my-row-highlight';

      let scoreStr = '';
      if (activeTab === 'gold') scoreStr = `${mData.totalGold || 0} Gold`;
      if (activeTab === 'boss') scoreStr = mData.bossFastestTime ? `${mData.bossFastestTime}초` : '-';
      if (activeTab === 'diligence') scoreStr = `${mData.totalGold || 0} P`;

      tr.innerHTML = `
        <td><strong>${item.rankDisplay}</strong></td>
        <td>${getFullUserTitleString(u, currentMode)} ${isMyRow ? '📍(나)' : ''}</td>
        <td>${u.role === 'teacher' ? '교사' : (u.role === 'anon' ? '익명' : '학생')}</td>
        <td><strong>${scoreStr}</strong></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderHallTripleGrid() {
    [1, 2].forEach(gameId => {
      const gameIdx = gameId - 1;
      const tbody = document.getElementById(`miniRankBody${gameId}`);
      if (!tbody) return;
      tbody.innerHTML = '';

      const allUsers = Object.values(allPlayersMap);
      const activeList = allUsers.filter(u => {
        const mData = getUserModeData(u, currentMode);
        return (mData.gameClears && mData.gameClears[gameIdx] > 0);
      });

      const getClearVal = u => {
        const mData = getUserModeData(u, currentMode);
        return (mData.gameClears && mData.gameClears[gameIdx]) || 0;
      };

      const rankedList = calculateJointRanks(activeList, getClearVal);
      const top5Ranked = rankedList.filter(item => item.rankNum <= 5);

      if (top5Ranked.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:16px; color:var(--text-muted);">기록 없음</td></tr>`;
      } else {
        top5Ranked.forEach((item) => {
          const u = item.user;
          const count = getClearVal(u);
          const tr = document.createElement('tr');
          const isMyRow = currentUser && (u.id === currentUser.id);
          if (isMyRow) tr.className = 'my-row-highlight';

          tr.innerHTML = `
            <td><strong>${item.rankDisplay}</strong></td>
            <td style="font-size: 0.85rem;">${getFullUserTitleString(u, currentMode)} ${isMyRow ? '📍(나)' : ''}</td>
            <td><strong>${count}회</strong></td>
          `;
          tbody.appendChild(tr);
        });
      }

      if (currentUser && currentUser.role !== 'teacher' && currentUser.role !== 'superadmin') {
        const myCount = getClearVal(currentUser);
        const myRankValEl = document.getElementById(`myMiniRankVal${gameId}`);
        if (myCount > 0) {
          const myItem = rankedList.find(item => item.user.id === currentUser.id);
          const rankStr = myItem ? (myItem.rankNum <= 5 ? myItem.rankDisplay : '6위 이하') : '6위 이하';
          if (myRankValEl) myRankValEl.textContent = `${rankStr} (${myCount}회)`;
        } else {
          if (myRankValEl) myRankValEl.textContent = `기록 없음 (0회)`;
        }
      }
    });
  }

  // -------------------------------------------------------------------------
  // 7. Teacher Dashboard & 6-Digit Class Code Auth
  // -------------------------------------------------------------------------
  async function loginTeacherByClassCode(inviteCode, teacherCustomName = '') {
    const cleanCode = inviteCode.replace(/[^0-9]/g, '').trim();
    if (!cleanCode || cleanCode.length !== 6) {
      alert('올바른 6자리 숫자 학급 코드를 입력해 주세요.');
      return;
    }

    isLoggingInProgress = true;
    await ensureFirebaseAuth();

    let teacherRecord = registeredClasses[cleanCode];
    if (db) {
      try {
        const docSnap = await db.collection('classes').doc(cleanCode).get();
        if (docSnap.exists) teacherRecord = docSnap.data();
      } catch (err) {}
    }

    const tName = teacherCustomName.trim() || (teacherRecord && teacherRecord.teacherName) || `선생님(${cleanCode})`;

    if (!teacherRecord) {
      teacherRecord = { inviteCode: cleanCode, teacherName: tName, className: '', createdAt: Date.now(), updatedAt: Date.now() };
    } else {
      if (teacherCustomName.trim()) teacherRecord.teacherName = teacherCustomName.trim();
      teacherRecord.updatedAt = Date.now();
    }

    registeredClasses[cleanCode] = teacherRecord;
    await syncToFirestore('classes', cleanCode, teacherRecord);
    saveStorageData();

    const teacherUser = {
      id: `teacher_${cleanCode}`,
      name: teacherRecord.teacherName,
      role: 'teacher',
      inviteCode: cleanCode,
      className: teacherRecord.className || '',
      titleIndex: 5,
      totalGold: 999,
      currentGold: 999
    };

    saveSessionUser(teacherUser);
    closeModal('loginModal');
    isLoggingInProgress = false;
    updateHeaderUI();
    showView('adminView');
  }

  function renderTeacherAdminPage() {
    if (!currentUser || currentUser.role !== 'teacher') return;

    document.getElementById('teacherAccountName').textContent = currentUser.name;
    document.getElementById('teacherClassName').textContent = currentUser.className || '학반 정보 미설정 (학반 정보 변경을 클릭하세요)';
    document.getElementById('teacherInviteCode').textContent = currentUser.inviteCode;

    let matchingStudents = sampleClassStudents.filter(std => std.inviteCode === currentUser.inviteCode);
    const sortedStudents = [...matchingStudents].sort((a, b) => a.name.localeCompare(b.name, 'ko'));

    const tbody = document.getElementById('studentLogsTableBody');
    tbody.innerHTML = '';

    if (sortedStudents.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">
            아직 내 학반(초대코드: ${currentUser.inviteCode})에 등록된 학생이 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    sortedStudents.forEach(std => {
      const stdData = getUserModeData(std, currentMode);
      const totalClears = stdData.gameClears || [0, 0];
      const bossCount = stdData.bossCount || 0;
      const bossTimeStr = stdData.bossFastestTime ? `${stdData.bossFastestTime}초` : '-';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${std.name}</strong></td>
        <td><strong>🪙 ${stdData.currentGold || 0} (${stdData.totalGold || 0})</strong></td>
        <td><strong>0 (${totalClears[0] || 0})</strong></td>
        <td><strong>0 (${totalClears[1] || 0})</strong></td>
        <td>⚔️ ${bossCount}회 (${bossTimeStr})</td>
        <td><button type="button" class="btn btn-outline btn-sm view-chart-btn" data-id="${std.id}">분석</button></td>
        <td><button type="button" class="btn btn-danger-soft btn-sm remove-student-btn" data-id="${std.id}" data-name="${std.name}">제거</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // -------------------------------------------------------------------------
  // 8. Event Listener Initialization
  // -------------------------------------------------------------------------
  function initApp() {
    loadStorageData();
    initFirestoreRealtimeListeners();
    ensureFirebaseAuth();

    const activeSession = loadSessionUser();
    if (activeSession) {
      currentUser = activeSession;
      closeModal('loginModal');
      updateHeaderUI();
      showView('lobbyView');
    } else {
      openModal('loginModal');
      showView('lobbyView');
    }

    // Navigation & Buttons
    document.getElementById('logoBtn').addEventListener('click', () => showView('lobbyView'));
    document.getElementById('navHomeBtn').addEventListener('click', () => showView('lobbyView'));
    document.getElementById('logoutBtn').addEventListener('click', () => {
      saveSessionUser(null);
      openModal('loginModal');
      showView('lobbyView');
    });

    document.getElementById('openAdminBtn').addEventListener('click', () => {
      if (currentUser && currentUser.role === 'teacher') {
        renderTeacherAdminPage();
        showView('adminView');
      } else {
        alert('🔒 교사 계정만 접속할 수 있습니다.');
      }
    });

    document.getElementById('openHallBtn').addEventListener('click', () => {
      renderHallOfHeroes('gold');
      showView('hallView');
    });

    document.querySelectorAll('.hall-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        renderHallOfHeroes(e.target.dataset.tab);
      });
    });

    document.querySelectorAll('.btn-game-play').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const gameType = parseInt(e.currentTarget.dataset.game);
        startMiniGame(gameType);
      });
    });

    document.getElementById('enterBossBtn').addEventListener('click', () => requestBossEntry());

    // Role Tabs
    const roleTabs = document.querySelectorAll('.role-tab-btn');
    roleTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        roleTabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const role = e.currentTarget.dataset.role;
        document.getElementById('studentLoginForm').classList.toggle('active', role === 'student');
        document.getElementById('teacherLoginForm').classList.toggle('active', role === 'teacher');
        document.getElementById('anonLoginForm').classList.toggle('active', role === 'anon');
      });
    });

    // Student Login
    document.getElementById('studentLoginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('studentRealName').value.trim();
      const invite = document.getElementById('studentInviteInput').value.trim();

      let classInfo = registeredClasses[invite];
      if (!classInfo && db) {
        try {
          const docSnap = await db.collection('classes').doc(invite).get();
          if (docSnap.exists) classInfo = docSnap.data();
        } catch (err) {}
      }

      if (!classInfo) {
        alert('⛔ 없는 학급 코드입니다. 선생님의 6자리 학급 코드를 확인해주세요.');
        return;
      }

      const studentUser = {
        id: `${invite}_${encodeURIComponent(name)}`,
        name,
        role: 'student',
        className: classInfo.className || '3학년반',
        inviteCode: invite
      };

      getUserModeData(studentUser, currentMode);
      await saveUserDataInList(studentUser);
      saveSessionUser(studentUser);
      closeModal('loginModal');
      updateHeaderUI();
      showView('lobbyView');
    });

    // Teacher Login
    document.getElementById('teacherLoginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = document.getElementById('teacherCodeInput').value.trim();
      const tName = document.getElementById('teacherNameInput').value.trim();
      await loginTeacherByClassCode(code, tName);
    });

    // Anon Login
    document.getElementById('anonLoginStartBtn').addEventListener('click', async () => {
      const randomCode = generateRandomAnonCode();
      const anonUser = { id: `anon_${randomCode}`, name: `익명${randomCode}`, role: 'anon' };
      getUserModeData(anonUser, currentMode);
      await saveUserDataInList(anonUser);
      saveSessionUser(anonUser);
      closeModal('loginModal');
      updateHeaderUI();
      showView('lobbyView');
    });

    document.getElementById('closeResultModalBtn').addEventListener('click', () => {
      closeModal('resultModal');
      showView('lobbyView');
    });

    document.getElementById('soundToggleBtn').addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      document.getElementById('soundIcon').textContent = sound.enabled ? '🔊' : '🔇';
    });
  }

  document.addEventListener('DOMContentLoaded', initApp);

})();
