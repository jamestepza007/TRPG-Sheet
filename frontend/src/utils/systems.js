export const SYSTEMS = {
  DUNGEON_WORLD: {
    id: 'DUNGEON_WORLD',
    name: 'Dungeon World',
    shortName: 'DW',
    theme: 'fantasy',
    accentColor: '#c9a84c',
    bgColor: '#1a0f0a',
    fontFamily: "'Cinzel', serif",
    defaultDice: '2d6',
    stats: [
      { key: 'STR', label: 'Strength', min: 1, max: 30 },
      { key: 'DEX', label: 'Dexterity', min: 1, max: 30 },
      { key: 'CON', label: 'Constitution', min: 1, max: 30 },
      { key: 'INT', label: 'Intelligence', min: 1, max: 30 },
      { key: 'WIS', label: 'Wisdom', min: 1, max: 30 },
      { key: 'CHA', label: 'Charisma', min: 1, max: 30 },
    ],
    getModifier: (score) => {
      if (score <= 3)  return -3;
      if (score <= 5)  return -2;
      if (score <= 8)  return -1;
      if (score <= 12) return 0;
      if (score <= 15) return 1;
      if (score <= 17) return 2;
      if (score <= 19) return 3;
      if (score <= 21) return 4;
      if (score <= 23) return 5;
      if (score <= 25) return 6;
      if (score <= 27) return 7;
      if (score <= 29) return 8;
      return 9;
    },
    rollResult: (total) => {
      if (total >= 10) return { label: '10+ Strong Hit', color: '#4ade80', type: 'success' };
      if (total >= 7)  return { label: '7-9 Partial Hit', color: '#facc15', type: 'partial' };
      return { label: '6- Miss', color: '#f87171', type: 'fail' };
    },
    getMaxXP: (level) => (parseInt(level) || 1) + 7,
  },

  CAIN: {
    id: 'CAIN',
    name: 'CAIN',
    shortName: 'CAIN',
    theme: 'cain',
    accentColor: '#2a2a2a',
    bgColor: '#f5f0e8',
    fontFamily: "'Courier New', monospace",
    defaultDice: '2d6',
    // No traditional stats — uses skills + CAT
    stats: [],
    getModifier: () => 0,
    rollResult: (successes) => {
      if (successes >= 1) return { label: 'SUCCESS (4+)', color: '#1a1a1a', type: 'success' };
      return { label: 'NO SUCCESSES', color: '#8b0000', type: 'fail' };
    },
    // CAIN skills (10 total, each 0-3 dots, max 2 at level 3)
    skills: [
      { key: 'FORCE', label: 'FORCE' },
      { key: 'CONDITIONING', label: 'CONDITIONING' },
      { key: 'COORDINATION', label: 'COORDINATION' },
      { key: 'COVERT', label: 'COVERT' },
      { key: 'INTERFACING', label: 'INTERFACING' },
      { key: 'INVESTIGATION', label: 'INVESTIGATION' },
      { key: 'SURVEILLANCE', label: 'SURVEILLANCE' },
      { key: 'NEGOTIATION', label: 'NEGOTIATION' },
      { key: 'AUTHORITY', label: 'AUTHORITY' },
      { key: 'CONNECTION', label: 'CONNECTION' },
    ],
    // CAT levels
    catLevels: [
      { level: 1, label: 'I', missions: 0 },
      { level: 2, label: 'II', missions: 1 },
      { level: 3, label: 'III', missions: 2 },
      { level: 4, label: 'IV', missions: 4 },
      { level: 5, label: 'V', missions: 7 },
    ],
    getPsyche: (cat) => Math.ceil(cat / 2),
    getDefaultSheet: () => ({
      // Identity
      name: '', xid: '', agnd: '', blsph: '', sx: '', ht: '', wt: '', hair: '', eyes: '',
      portrait: '',
      // CAT
      cat: 1, missionsSurvived: 0,
      // Execution (starts 6, -1 per injury)
      executionMax: 6,
      // Skills (0-3 each)
      FORCE: 0, CONDITIONING: 0, COORDINATION: 0, COVERT: 0,
      INTERFACING: 0, INVESTIGATION: 0, SURVEILLANCE: 0,
      NEGOTIATION: 0, AUTHORITY: 0, CONNECTION: 0,
      skillImprovements: 0,
      // Psyche burst (3 circles)
      psycheBurst: 0,
      // Injuries (5 circles)
      injuries: 0,
      // Hooks (3 hooks, each with name + slashes 0-4)
      hooks: [
        { name: '', slashes: 0 },
        { name: '', slashes: 0 },
        { name: '', slashes: 0 },
      ],
      // Sin
      sinBoxes: 0,       // filled sin boxes (max 9 typically)
      sinBoxesCrossed: 0, // permanently crossed out
      sinMarks: [],       // text descriptions of sin marks
      // Afflictions
      afflictions: '',
      // Kit
      kitPoints: 0,
      kitDescription: `SERVICE WEAPONS (2 KP): CAT 0\nISSUE UNIFORM (0 KP)\nNOTEBOOK, PEN (1 KP)\nMATCHBOOK, HANDKERCHIEF (1 KP)`,
      scrip: 0,
      // Agenda
      agendaDescription: '',
      agendaItems: '',
      agendaAbilities: '',
      // Blasphemy
      blasphemyDescription: '',
      blasphemyPassive: '',
      observedPowers: ['', '', '', ''],
      // Abilities (max 5)
      abilities: ['', '', '', '', ''],
      // XP & Advances
      xp: 0,
      advances: 0,
      // Notes
      notes: '',
    }),
  },
};

export const getSystem = (id) => SYSTEMS[id];
export const systemList = Object.values(SYSTEMS);
