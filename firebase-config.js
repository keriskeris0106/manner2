/**
 * Firebase Config & LocalStorage Fallback Handler for [맞춤법 어드벤처]
 * Exact mechanism matching https://99dan-two.vercel.app/
 */

const STORAGE_KEYS = {
  USER: 'manner_adv_user',
  CLASS: 'manner_adv_classes',
  LEADERBOARD: 'manner_adv_leaderboard',
  LOGS: 'manner_adv_logs'
};

class StorageManager {
  constructor() {
    this.initDefaultData();
  }

  initDefaultData() {
    if (!localStorage.getItem(STORAGE_KEYS.CLASS)) {
      localStorage.setItem(STORAGE_KEYS.CLASS, JSON.stringify([
        {
          code: '363636',
          name: '3학년 긍정열정반',
          teacherName: '김선생님',
          createdAt: new Date().toISOString()
        }
      ]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD)) {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify([
        { id: '1', name: '김주아', role: '학생', classTitle: '3학년 1반', gold: 450, game1: 15, game2: 12, game3: 10, bossScore: 18 },
        { id: '2', name: '이도현', role: '학생', classTitle: '3학년 1반', gold: 380, game1: 12, game2: 10, game3: 8, bossScore: 15 },
        { id: '3', name: '박서준', role: '학생', classTitle: '3학년 1반', gold: 310, game1: 10, game2: 8, game3: 7, bossScore: 12 }
      ]));
    }
  }

  getUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  }

  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  clearUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  getClasses() {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASS);
    return raw ? JSON.parse(raw) : [];
  }

  getClassByCode(code) {
    return this.getClasses().find(c => c.code === code);
  }

  createOrUpdateClass(code, name, teacherName) {
    const classes = this.getClasses();
    let cls = classes.find(c => c.code === code);
    if (cls) {
      cls.name = name;
      cls.teacherName = teacherName;
    } else {
      cls = { code, name, teacherName, createdAt: new Date().toISOString() };
      classes.push(cls);
    }
    localStorage.setItem(STORAGE_KEYS.CLASS, JSON.stringify(classes));
    return cls;
  }

  getLeaderboard() {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    return raw ? JSON.parse(raw) : [];
  }

  updateLeaderboard(user) {
    const board = this.getLeaderboard();
    const idx = board.findIndex(b => b.name === user.name && b.classTitle === user.classTitle);
    const entry = {
      id: user.uid || `user_${Date.now()}`,
      name: user.name || '익명',
      role: user.role || '학생',
      classTitle: user.classTitle || '익명반',
      gold: user.gold || 0,
      game1: user.game1Clears || 0,
      game2: user.game2Clears || 0,
      game3: user.game3Clears || 0,
      bossScore: user.bossScore || 0
    };

    if (idx >= 0) {
      board[idx] = { ...board[idx], ...entry };
    } else {
      board.push(entry);
    }

    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(board));
  }
}

window.dbStorage = new StorageManager();
