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
  // Future systems: CAIN, etc.
};

export const getSystem = (id) => SYSTEMS[id];
export const systemList = Object.values(SYSTEMS);
