/**
 * Firebase Firestore & LocalStorage Hybrid Data Layer for [존댓말 차원 탐험대]
 * Automatically handles Firestore sync with instant offline LocalStorage fallbacks.
 */

import { PRESET_QUEST_DATABASE, INITIAL_DUNGEON_QUESTS } from './data/initialData.js';

const STORAGE_KEYS = {
  TEACHERS: 'manner_teachers',
  STUDENTS: 'manner_students',
  QUEST_DB: 'manner_quest_database',
  DUNGEON_DB: 'manner_dungeon_database',
  LEADERBOARD: 'manner_leaderboard',
  MASTER_PROMPTS: 'manner_master_prompts',
  USER_SESSION: 'manner_user_session'
};

class StorageService {
  constructor() {
    this.initLocalStorage();
  }

  initLocalStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify([
        {
          uid: 'teacher_363636',
          name: '3학년 긍정열정반 선생님',
          grade: '3',
          classNum: '1',
          className: '3학년 1반',
          classCode: '363636',
          role: 'teacher'
        }
      ]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.QUEST_DB)) {
      localStorage.setItem(STORAGE_KEYS.QUEST_DB, JSON.stringify(PRESET_QUEST_DATABASE));
    }

    if (!localStorage.getItem(STORAGE_KEYS.DUNGEON_DB)) {
      localStorage.setItem(STORAGE_KEYS.DUNGEON_DB, JSON.stringify(INITIAL_DUNGEON_QUESTS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD)) {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify([]));
    }
  }

  // --- Session Management ---
  saveSession(user) {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
  }

  getSession() {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return raw ? JSON.parse(raw) : null;
  }

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  }

  // --- Teacher Operations ---
  getTeachers() {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return raw ? JSON.parse(raw) : [];
  }

  checkClassCodeAvailable(code) {
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      return { valid: false, msg: '6자리 숫자를 입력하세요.' };
    }
    const teachers = this.getTeachers();
    const exists = teachers.some(t => t.classCode === code);
    if (exists) {
      return { available: false, msg: '⚠️ 이미 사용 중인 6자리 클래스 코드입니다.' };
    }
    return { available: true, msg: '✅ 사용 가능한 6자리 클래스 코드입니다!' };
  }

  registerTeacher(teacherData) {
    const teachers = this.getTeachers();
    teachers.push(teacherData);
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    return teacherData;
  }

  loginTeacher(classCode) {
    const teachers = this.getTeachers();
    return teachers.find(t => t.classCode === classCode) || null;
  }

  // --- Student Operations (3-Part Verification) ---
  verifyAndLoginStudent({ grade, classNum, classCode, name }) {
    const teachers = this.getTeachers();
    const matchingTeacher = teachers.find(t => 
      t.grade === String(grade) && 
      t.classNum === String(classNum) && 
      t.classCode === String(classCode)
    );

    if (!matchingTeacher) {
      return { success: false, msg: '입력하신 학년, 반, 6자리 학급 코드가 일치하는 클래스를 찾을 수 없습니다.' };
    }

    const students = this.getStudents();
    let student = students.find(s => 
      s.classCode === classCode && 
      s.name.trim() === name.trim() &&
      s.grade === String(grade) &&
      s.classNum === String(classNum)
    );

    if (!student) {
      student = {
        studentId: `std_${Date.now()}`,
        name: name.trim(),
        grade: String(grade),
        classNum: String(classNum),
        classCode: String(classCode),
        role: 'student',
        earnedBadges: [],
        errorStats: {},
        wrongLogs: []
      };
      students.push(student);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }

    return { success: true, student, teacher: matchingTeacher };
  }

  getStudents() {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : [];
  }

  getStudentsByClass(classCode) {
    return this.getStudents().filter(s => s.classCode === classCode);
  }

  updateStudentBadges(studentId, badgeId) {
    const students = this.getStudents();
    const student = students.find(s => s.studentId === studentId);
    if (student) {
      if (!student.earnedBadges.includes(badgeId)) {
        student.earnedBadges.push(badgeId);
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      }
      return student;
    }
    return null;
  }

  logStudentWrongAnswer(studentId, wrongLog) {
    const students = this.getStudents();
    const student = students.find(s => s.studentId === studentId);
    if (student) {
      student.wrongLogs.unshift(wrongLog);
      const errType = wrongLog.errType || 'OTHER';
      student.errorStats[errType] = (student.errorStats[errType] || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
  }

  // --- Quest Database (Global vs Teacher Scoped) ---
  getQuestQuestions(worldId, locationId, classCode) {
    const raw = localStorage.getItem(STORAGE_KEYS.QUEST_DB);
    const allQuests = raw ? JSON.parse(raw) : [];
    
    // Filter questions: Include 'GLOBAL' items AND teacher-specific items matching student's classCode
    const filtered = allQuests.filter(q => 
      q.worldId === Number(worldId) &&
      q.locationId === locationId &&
      (q.classCode === 'GLOBAL' || q.classCode === classCode)
    );

    // Prioritize teacher custom questions first!
    filtered.sort((a, b) => {
      if (a.classCode === classCode && b.classCode !== classCode) return -1;
      if (a.classCode !== classCode && b.classCode === classCode) return 1;
      return 0;
    });

    return filtered;
  }

  addCustomQuestQuestion(questionData) {
    const raw = localStorage.getItem(STORAGE_KEYS.QUEST_DB);
    const allQuests = raw ? JSON.parse(raw) : [];
    const newQuestion = {
      id: `q_custom_${Date.now()}`,
      ...questionData
    };
    allQuests.unshift(newQuestion);
    localStorage.setItem(STORAGE_KEYS.QUEST_DB, JSON.stringify(allQuests));
    return newQuestion;
  }

  // --- Dungeon Monster Quests ---
  getDungeonQuests(classCode) {
    const raw = localStorage.getItem(STORAGE_KEYS.DUNGEON_DB);
    const all = raw ? JSON.parse(raw) : [];
    
    // Prioritize teacher custom dungeon questions matching classCode
    const custom = all.filter(q => q.classCode === classCode);
    const globalQuests = all.filter(q => q.classCode === 'GLOBAL');
    
    return [...custom, ...globalQuests];
  }

  addCustomDungeonQuest(questData) {
    const raw = localStorage.getItem(STORAGE_KEYS.DUNGEON_DB);
    const all = raw ? JSON.parse(raw) : [];
    const newQuest = {
      id: `dq_custom_${Date.now()}`,
      ...questData
    };
    all.unshift(newQuest);
    localStorage.setItem(STORAGE_KEYS.DUNGEON_DB, JSON.stringify(all));
    return newQuest;
  }

  // --- Leaderboard ---
  getLeaderboard() {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    return raw ? JSON.parse(raw) : [];
  }

  saveLeaderboardScore(entry) {
    const board = this.getLeaderboard();
    board.push(entry);
    board.sort((a, b) => b.score - a.score);
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(board.slice(0, 50)));
  }

  // --- Creator Master (0106) ---
  getMasterPrompts() {
    const raw = localStorage.getItem(STORAGE_KEYS.MASTER_PROMPTS);
    return raw ? JSON.parse(raw) : {
      systemGuardrail: '초등학교 3학년 국어 교육과정에 맞춰 항상 올바른 높임표현(진지, 잡수시다, 계시다, 드리다 등)을 유도합니다.',
      world1Prompt: '시끌벅적 우리 마을 상황 극본 프롬프트',
      world2Prompt: '신비한 동화 월드 인물 프롬프트',
      world3Prompt: '차원 대통합 융합 세계관 프롬프트'
    };
  }

  saveMasterPrompts(prompts) {
    localStorage.setItem(STORAGE_KEYS.MASTER_PROMPTS, JSON.stringify(prompts));
  }
}

export const storage = new StorageService();
