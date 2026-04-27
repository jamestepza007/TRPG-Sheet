// ── CAIN Virtue Bond Abilities ───────────────────────────────────
// Source: Games for Freaks Issue 1 (October 2024)

export const VIRTUES = [
  {
    id: 'JUSTICE',
    name: 'Justice',
    epithet: 'The Executioner',
    highBlasphemy: 'Law',
    strictures: [
      'You cannot ignore orders from a superior.',
      'Always roll 0d on any action that would break the law.',
    ],
    abilities: [
      { level: 0, description: 'Gain an extra xp trigger: Did you uphold the dogma of CAIN?' },
      { level: 1, description: 'Gain the Law blasphemy. You can use it once a mission.' },
      { level: 2, description: 'If you executed a sin rather than sparing it, then lower sin by 1 after halving it. If you spared a sin or failed to execute it, increase sin by 1d3 after halving it instead.' },
      { level: 3, description: 'You always gain the last effect of Law for free (make something specific less hard or risky).' },
    ],
    blasphemyDesc: 'Transmute, Adjacent, 1 Scene. You set a rule of physical reality that affects everything in a circular area around you (the Court), with a radius equal to CAT. Spend all remaining psyche bursts (min 1), fill in: "In the Court, ____ is/are _____" using the Terms of Law. Then choose one effect: grant up to three +1D to allies / instantly kill all humans in the area / slash a talisman by rolling PSYCHE (+1D, +1 slash on success) / make something specific less hard or risky.',
  },
  {
    id: 'FAITH',
    name: 'Faith',
    epithet: 'The Timid',
    highBlasphemy: 'Null / Immaculate Defiance of Heaven',
    strictures: [
      'You cannot harm anyone or anything.',
      'Always roll 0d on actions that would be considered impolite.',
    ],
    abilities: [
      { level: 0, description: 'Once a mission, if you are able to eat sweets, you can relieve 1 sin.' },
      { level: 1, description: 'You gain the Null blasphemy. You can use it once a mission.' },
      { level: 2, description: 'Sin overflow only reduces your sin overflow cap by 1 instead of 2.' },
      { level: 3, description: 'When you so choose, your Null Blasphemy becomes the Immaculate Defiance of Heaven. This choice is irreversible.' },
    ],
    blasphemyDesc: 'NULL — Instant, Charm, 1 scene. Spend all remaining psyche bursts (min 1). For the scene, you become completely immune to psychic phenomena and afflictions (suppressed). You cannot use or be affected by any blasphemy other than this one. Cannot be ended early.\n\nIMMACULATE DEFIANCE OF HEAVEN — Permanent. Same as Null but permanent: no blasphemies, sin resets to 0, spend 1d3 stress instead of psyche burst for +1D on any action, fighting sins with mundane abilities is no longer hard (mundane abilities at ½ CAT), +1 max injury, lifespan extends by 10d10 years.',
  },
  {
    id: 'CHARITY',
    name: 'Charity',
    epithet: 'The Twins',
    highBlasphemy: 'Entwine',
    strictures: [
      'When possible, you must participate in teamwork or set up.',
      'You roll 0d when trying to hide, stealth, or avoid notice.',
    ],
    abilities: [
      { level: 0, description: 'You can engage in telepathy with any single exorcist you have skin to skin contact with.' },
      { level: 1, description: 'Gain the Entwine blasphemy.' },
      { level: 2, description: 'At the start of a mission, you can pick an agenda ability from any other party member. For the rest of the mission, you can use this agenda ability as your own.' },
      { level: 3, description: 'Powers that target \'self\' can now target any exorcist you are Entwined with.' },
    ],
    blasphemyDesc: 'ENTWINE — Instant, 1 mission. Without spending a psyche burst, choose another willing exorcist. For the mission: stress/psyche bursts can be assigned to either person; you can telepathically communicate at extreme distance; you feel each other\'s strong emotions reflexively. However: afflictions/hooks affect both; sin gained by either affects both; if either suffers sin overflow or instant death, the blasphemy breaks. After the mission, both physical appearances change to match each other (each chooses a feature to share).',
  },
  {
    id: 'FORTITUDE',
    name: 'Fortitude',
    epithet: 'The Disaster',
    highBlasphemy: 'Strength',
    strictures: [
      'You cannot pass up the opportunity to get into a fight.',
      'Roll 0d on actions that would require talk instead of action.',
    ],
    abilities: [
      { level: 0, description: 'You never roll 0d for inflicting harm or violence (always roll at least 1d).' },
      { level: 1, description: 'Any amount of harm you inflict is instantly fatal to humans.' },
      { level: 2, description: 'You gain the Strength blasphemy. You can use it safely once a mission. If you use it a second time, when the scene ends, you rip apart from the inside and suffer instant death.' },
      { level: 3, description: 'You can safely use Strength a second time.' },
    ],
    blasphemyDesc: 'STRENGTH — Charm, 1 scene. Spend all remaining psyche bursts (min 1). For the scene, your mundane physical abilities are equal to CAT and fighting sins with mundane forces is no longer hard. You can push any physical action to CAT+2 by gaining 2d3 stress (may inflict injury). All weapons break after use unless tempered (1 scrip per weapon between missions). At scene end, you take an injury and become comatose until your group rests.',
  },
  {
    id: 'HOPE',
    name: 'Hope',
    epithet: 'The Dreamer',
    highBlasphemy: 'Veil',
    strictures: [
      'You cannot take actions that would be loud or attract attention.',
      'You roll 0d for set up actions.',
    ],
    abilities: [
      { level: 0, description: 'Once a mission, you can re-roll any action taken in stealth or to avoid notice, taking the second result as final.' },
      { level: 1, description: 'Gain the Veil blasphemy. You can use it once a mission.' },
      { level: 2, description: 'Mundane humans always forget you were there if you are out of sight for 77 seconds or more. You cannot turn this ability off.' },
      { level: 3, description: 'You can use Veil to erase memory for longer periods (up to full reset, with escalating costs).' },
    ],
    blasphemyDesc: 'VEIL — Instant, long. Spend all remaining psyche bursts to instantly erase the memory of a mass of humans/exorcists in CAT range. They become insensate for 11 seconds (ally acts on opening: +1D). They then forget everything they saw and heard for the last 77 seconds. At bond III, can extend duration: up to 10 min (1d3+1 stress) / up to 1 hour (+1d3+1 sin) / up to 10 hours (+lose an important memory) / up to 1 day (+lower sin overflow cap by 2) / up to 10 days (+forget your name, change agendas) / full reset (you cease to exist in everyone\'s memory — make a new character).',
  },
  {
    id: 'PRUDENCE',
    name: 'Prudence',
    epithet: 'The Negotiator',
    highBlasphemy: 'Shake',
    strictures: [
      'You must honor all deals and promises.',
      'Roll 0d when choosing violence over negotiation.',
    ],
    abilities: [
      { level: 0, description: 'When you shake hands with a willing human on a deal or promise, if someone breaks it, they suffer instant death. This applies to you, and both you and your target are aware of the effects.' },
      { level: 1, description: 'Gain the Shake blasphemy. You can use it once a mission.' },
      { level: 2, description: 'Your rank 0 ability now applies to exorcists and sins.' },
      { level: 3, description: 'You can use Shake once again during a mission, but if you do, the GM picks the game.' },
    ],
    blasphemyDesc: 'SHAKE — (See PDF for full description of Shake blasphemy effects.)',
  },
];
