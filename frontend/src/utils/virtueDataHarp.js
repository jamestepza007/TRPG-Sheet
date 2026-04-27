
// ── Bound Weapon Enhancements ─────────────────────────────────────
// Source: Harpocrates Dossier 2.0 pp.64-68
export const BOUND_WEAPON_ENHANCEMENTS = [
  { name: 'Gentle Silence', cost: 1, prereq: null, description: 'Rolls to avoid detection while this weapon is unsheathed are never impossible.' },
  { name: 'Moon in The Winter', cost: 1, prereq: 'Gentle Silence', description: 'Rolls to avoid detection gain +1D when this weapon is unsheathed (Max +4D).' },
  { name: 'Grave Bearer', cost: 1, prereq: null, description: 'This weapon gains +1D to attack enemies with 2 or less segments remaining on their talisman.' },
  { name: 'Last Rites', cost: 1, prereq: 'Grave Bearer', description: 'When this weapon fills out the last slashes on an execution talisman, you relieve 2 stress.' },
  { name: 'Execution', cost: 0, prereq: 'Last Rites', description: 'You may permanently reduce your sin cap by 1 to add +2D to an attack with this weapon and make that attack supernatural.' },
  { name: 'Nullification Ritual', cost: 2, prereq: 'Execution', description: 'Killing a mundane being with this weapon prevents their body from being controlled or tampered with psychically after death.' },
  { name: 'Heavy Soul', cost: 2, prereq: null, description: "This weapon is hard to use by default if its CAT is equal to or higher than yours. It gains +1D on attacks to bludgeon, concuss, or create heavy impact." },
  { name: 'Envy', cost: 0, prereq: null, description: 'Gain the Agenda item: Steal.' },
  { name: 'Two-Headed Serpent', cost: 1, prereq: 'Envy', description: 'Once per mission when you attack with this weapon, roll the die pool twice, selecting the one with the highest number of successes.' },
  { name: 'Glitter', cost: 0, prereq: null, description: 'Gain stricture: You cannot take violent actions with this weapon with subtlety.' },
  { name: 'Mania', cost: 1, prereq: 'Glitter', description: 'Gain agenda item: Do something risky, regardless of the consequences.' },
  { name: 'Deluxe Deviant Death Monarch', cost: 1, prereq: 'Mania', description: 'For every injury you have, you may take 1 stress to add +1D to attacks made with this weapon.' },
  { name: 'Hungering', cost: 2, prereq: null, description: "This weapon gains +1D for any harmful or violent actions, ignoring the bonus die cap. At scene end if it hasn't killed a living being, take 1d3+2 stress." },
  { name: 'Menacing', cost: 1, prereq: null, description: 'Your authority score increases to +1D when this weapon is unsheathed (Max +4D).' },
  { name: 'Justicar', cost: 2, prereq: 'Menacing', description: 'Gain +1D on attacks during the execution scene. If you ever spare a host, take 6d6 sin.' },
  { name: "Heaven's Touch", cost: 3, prereq: null, description: 'This weapon gains +1D to attack binders or those who have defied the ethos of CAIN. Glows when a binder is nearby.' },
  { name: 'Deadweight', cost: 0, prereq: null, description: 'Gain the Agenda item: Die. At the start of each session, gain 1 pathos.' },
  { name: 'Nihility', cost: 1, prereq: 'Deadweight', description: 'You may take 1d3 stress and burn 1 pathos to add +1D to attack rolls made with this weapon.' },
  { name: 'Call of the Void', cost: 1, prereq: 'Nihility', description: 'You may take 1d3 stress and burn 1 pathos to add +1D to attack rolls made with this weapon, with additional escalating effects.' },
  { name: 'Sensitive', cost: 1, prereq: null, description: 'Gain agenda item: Remain untouched.' },
  { name: 'Spiked-Steel', cost: 2, prereq: 'Sensitive', description: 'Once per scene when you take stress from an adjacent foe, deal 1 slash to the attacker.' },
  { name: 'Iron Maiden', cost: 3, prereq: 'Spiked-Steel', description: 'While this weapon is drawn, take -1 stress from all sources.' },
  { name: 'Death Defier', cost: 2, prereq: null, description: 'While this weapon is drawn you take -1 stress when it is non-lethal.' },
  { name: 'Hate', cost: 0, prereq: null, description: 'Gain agenda item: Kill needlessly.' },
  { name: 'Vitriol', cost: 1, prereq: 'Hate', description: 'Attacks made with this weapon can be made at CAT+1 range and become hard when used this way.' },
  { name: 'Rot Unfurling', cost: 1, prereq: 'Vitriol', description: 'Once per mission you can take 1d3+2 sin to make any attack with this weapon supernatural.' },
  { name: 'Serrated', cost: 1, prereq: null, description: 'Attacks with this weapon against mundane beings with exposed skin can never be hard or impossible.' },
  { name: "Glutton's Bloodletter", cost: 1, prereq: 'Serrated', description: 'Any foe you attack with this weapon takes 1 slash on its talisman if the conflict scene ends without it being slain.' },
  { name: 'Gold-Plated', cost: 1, prereq: null, description: 'This weapon gains +1D to violent or harmful actions. Whenever you roll to attack you must pay 3 scrip. If you cannot pay the full amount, take 2d3+1 stress.' },
  { name: 'Explosive', cost: 2, prereq: null, description: 'You may take 1d3 stress when attacking to trigger an explosive blast. Gain or grant +1D to the next action that takes advantage of this.' },
  { name: 'Amorphous', cost: 0, prereq: null, description: 'This weapon may switch between being a melee weapon and a ranged weapon (close) at will.' },
  { name: 'Evolution', cost: 1, prereq: 'Amorphous', description: 'Once per scene you may gain 1 sin when you transform this weapon to gain +1D to your next action to inflict harm or violence with it.' },
];

// ── New Virtues (Harpocrates Dossier 2.0) ────────────────────────
export const VIRTUES_HARP = [
  {
    id: 'CHASTITY',
    name: 'Chastity',
    epithet: 'The Restraint',
    highBlasphemy: 'Iron Maiden',
    strictures: [
      'You cannot engage in immodest or indecent acts.',
      'You always roll 0d on actions that would cause you to touch skin with another exorcist or human.',
    ],
    abilities: [
      { level: 0, description: 'You can force humans to be unable to make skin contact with you, always hovering at least 2 inches away. You may do this once a mission and it lasts until rest.' },
      { level: 1, description: 'Gain the Iron Maiden blasphemy.' },
      { level: 2, description: 'Gain +1 customization for free at the start of each mission for your Iron Maiden.' },
      { level: 3, description: 'When using Iron Maiden and answering "yes" on all three questions, you summon it exactly where you want it. If using this offensively, it deals a number of slashes equal to your half CAT.' },
    ],
    blasphemyDesc: 'IRON MAIDEN — Instant. Spend all remaining psyche bursts (min 1) and all remaining KP. Answer yes/no: Did you spend at least 2 Psyche bursts? / Did you spend at least 3 KP? / Are you in an open area visible from sky? For every yes, pick one: Iron Maiden arrives in close distance / arrives within seconds / arrives without complications. Once donned it takes 4+half CAT stress before breaking. While worn: anything that would affect you affects Iron Maiden instead; cannot gain hooks or afflictions; you can still use blasphemy powers. Returns to orbit at scene end. Gains Customizations equal to half CAT chosen each mission.',
  },
  {
    id: 'SOBRIETY',
    name: 'Sobriety',
    epithet: 'The Resolute',
    highBlasphemy: 'Clarity / Lucidity of the Broken Mind',
    strictures: [
      'You cannot consume substances such as cigarettes, alcohol, or other inebriants.',
      'You always roll 0d on actions done out of avoiding immediate pain.',
    ],
    abilities: [
      { level: 0, description: 'You never upset another individual when turning them down: offers, substances, advances, or otherwise.' },
      { level: 1, description: 'Gain the Clarity power. You may use it once per mission.' },
      { level: 2, description: 'You gain the ability to borrow scrip from other exorcists. Once per mission, breaking your first stricture relieves 1 sin.' },
      { level: 3, description: 'You gain access to Lucidity of the Broken Mind. You may only activate it when you are on the brink of death and it persists afterwards as a permanent passive.' },
    ],
    blasphemyDesc: 'CLARITY — Charm, 1 scene. Only usable if you have 2+ injuries. Use ALL remaining psyche bursts (min 1). For the scene: roll an additional risk die against your actions taking only the highest; +1D on any action to avoid/defend/react to danger (breaks second stricture); automatically succeed on any roll to flee the conflict scene (breaks second stricture). When this power ends all actions become hard by default until next rest. While inebriated you cannot activate this power. Breaking your first stricture ends it early.\n\nLUCIDITY OF THE BROKEN MIND — Permanent. Gain +2 stress cap. When on the brink of death, take -3 stress from all sources. Suffering instant death while on brink prevents revival. Clarity also gains: a Foresight talisman with segments equal to injuries when activating Clarity; while active, slash once to have you or a reachable ally avoid any external harm reducing stress by 3. When fully slashed, Clarity ends early.',
  },
  {
    id: 'ABSOLUTION',
    name: 'Absolution',
    epithet: 'The Mourner',
    highBlasphemy: 'Guillotine',
    strictures: [
      'You cannot commit acts of cruelty or prolong suffering.',
      "You always roll 0d on actions that put civilians or innocents in harm's way.",
    ],
    abilities: [
      { level: 0, description: 'When someone tries to confess the truth to you, you can always hear it, regardless of distance, physical, or psychic barriers.' },
      { level: 1, description: 'Gain the Guillotine power. You may use it once per mission.' },
      { level: 2, description: 'You may take 2 non-lethal stress to gain +2D on any roll to connect to, empathize with, or get closer to any other individual.' },
      { level: 3, description: 'You may use Guillotine multiple times in a mission. For every time after the first you must sacrifice an existing limb of choice. If you have no more limbs to sacrifice, your body disappears after the blasphemy resolves. Make a new exorcist.' },
    ],
    blasphemyDesc: 'GUILLOTINE — Instant, CAT Range. Spend ALL remaining psyche bursts (min 1). Summon the CAT 5 sin Guillotine to a visible point in range, destroying an area equal to half CAT with ripping buzzsaws and destructive force. Roll PSYCHE to deal severe damage to one foe, and 1 slash to every other foe in the area. Add bonus dice per YES (max half CAT+3): Is your target the only sentient being in the area? / Do you feel empathy for the target? / Is half+ of execution talisman slashed? / Is your target grieving or experiencing loss? / Have all 3 trauma questions been answered (sins only)? / Do you plan on executing the sin (sins only)? For each YES, take 1 stress (or 3 stress to auto-succeed for the bonus die). For each NO, take 2 stress. Stress cannot kill you but can inflict injuries — for every injury, lose a digit. Actions with that hand/foot are hard for the rest of the mission.',
  },
];
