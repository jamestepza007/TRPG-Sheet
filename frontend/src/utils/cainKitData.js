// ── CAIN Kit Items Data ───────────────────────────────────────────

export const KIT_CATEGORIES = [
  {
    id: 'aesthetics',
    name: 'AESTHETICS',
    color: '#8888aa',
    items: [
      { code: '', name: 'Service Uniform', cost: 0, kp: 0, desc: 'Free standard issue service uniform, including sash, shoes, and buckle for cape. Not tailored to fit. Shoes are recycled.' },
      { code: '', name: 'Issue Uniform', cost: 1, kp: 0, desc: 'Issue Cassock or habit. Tailored to fit. Made of very fine material, comfortable. Includes optional head or face coverings for modesty.' },
      { code: '', name: 'Comfortable Shoes', cost: 1, kp: 0, desc: 'Shoes sized to fit. Production based on availability.' },
      { code: '', name: 'Suit', cost: 3, kp: 0, desc: 'High quality tailored suit. Only available to CAT 2+ exorcists.' },
      { code: '', name: 'Casual Wear', cost: 4, kp: 0, desc: 'Sanctioned casual wear that can bypass CAIN dress restrictions when off-duty. Strictly not for mission wear. Only available to CAT 3+ exorcists.' },
      { code: '', name: 'Formalwear', cost: 6, kp: 0, tag: 'Conspicuous', desc: 'Sanctioned formalwear for organization events. Finely tailored. Not approved for field use. Includes allowances for jewelry. Only available for CAT 2+ exorcists.' },
      { code: '', name: '"Well" Overcoat', cost: 4, kp: 0, desc: 'Overcoat that fits over all uniforms. Weather resistant, tailored and extremely high quality. Some customization options. Available only to CAT 4+ exorcists.' },
      { code: '', name: 'Dress Uniform', cost: 3, kp: 0, desc: 'Formal uniform including half cape, originally for ceremonial event wear. Available only to CAT 3+ exorcists.' },
    ]
  },
  {
    id: 'comfort',
    name: 'COMFORT / CAREER',
    color: '#aa8844',
    items: [
      { code: '', name: 'Living Quarters Expansion', cost: 6, kp: 0, desc: 'Kitchenette, choice of two pieces of furniture. Window. Gain the benefits of resting, once, without passing the hour during a mission.' },
      { code: '', name: 'Private Room', cost: 8, kp: 0, desc: 'Room available only for CAT 3+ exorcists. +1 max stress.' },
      { code: '', name: 'Visitation Rights', cost: 12, kp: 0, desc: 'Expanded leave rights to visit potential family or relations, under observation. +1 max injury.' },
      { code: '', name: 'Relaxed Grooming Guidelines', cost: 6, kp: 0, desc: 'Allows for different hairstyles that exceed CASTLE restrictions and makes small allowances for jewelry or makeup. CAT 3+ exorcists only. +2 sin overflow cap.' },
      { code: '', name: 'Improved Meal Plan', cost: 4, kp: 0, desc: '+1 max KP.' },
      { code: '', name: 'Sanctioned Indulgences', cost: 1, kp: 0, tag: 'Consumable', desc: 'Small personal indulgences. Cigarettes, coffee, candy, chewing gum, spending money. Use to roll an extra resting die when resting.' },
      { code: '', name: 'Leave of Absence', cost: 15, kp: 0, desc: 'You are allowed one week off a year with some travel allowances. +1 max stress, +1 KP, and +1 sin overflow cap.' },
      { code: '', name: 'Pieces of Silver', cost: 44, kp: 0, desc: 'You are permitted to retire from exorcism. You may work at CAIN in an administrative capacity for the rest of your life.' },
    ]
  },
  {
    id: 'possessions',
    name: 'POSSESSIONS',
    color: '#668844',
    items: [
      { code: 'N55', name: 'Cell Phone', cost: 1, kp: 0, desc: 'Personal cell phone. Pay 3 scrip instead to have one with more options and internet browsing available.' },
      { code: 'N70', name: 'Cash Card', cost: 1, kp: 0, desc: 'Card that works with most currencies with pre-loaded allowance for mundane world purchases. Never enough to buy anything major.' },
      { code: 'K4', name: 'Clerical Kit', cost: 4, kp: 1, tag: 'Focus', desc: 'Official kit of exorcists performing clerical or research duties. Pull out: Hard copy of a SEER archive almanac (2 KP), good quality eyeglasses, a few good pens, thick binder, local area history notes.' },
      { code: 'K8', name: 'Cleaner Kit', cost: 4, kp: 1, tag: 'Conspicuous', desc: 'Official kit for cleaning up aftermath of hunts. Pull out: Stain and waterproof overalls, goggles, gas mask, heavy gloves, antitoxin (2 KP, 1 charge).' },
      { code: 'N/a', name: 'Delinquent Kit', cost: 3, kp: 1, desc: 'Unsanctioned, mostly black market. Pull out: Pocket knife, lighter, boot knife, pack of various cigarettes, hair pins, hair grease.' },
      { code: 'KS9', name: 'Driver Kit', cost: 6, kp: 1, tag: 'Conspicuous', desc: 'Allocated with approval. Good quality driving gloves (1KP) and access to a car on missions. The car has a 10 talisman for harm, fits four people. If totaled, docked 2 scrip.' },
    ]
  },
  {
    id: 'kits',
    name: 'KITS (EQUIPMENT)',
    color: '#446688',
    items: [
      { code: '', name: 'Field Kit', cost: 4, kp: 1, tag: 'Conspicuous', desc: 'Official kit for field monitoring work. Pull out: Waterproof notebook, all-weather cape, good boots, survival food, tent and sleeping bag (3 KP), optical scope.' },
      { code: '', name: 'Junk Kit', cost: 3, kp: 1, tag: 'Conspicuous', desc: 'Scrounged in parts. Pull out: Rubber bands, wiring kit, good pen, chewing gum, screwdriver, tape, c-clamps, crowbar, dented toolbox.' },
      { code: '', name: 'Monitor Kit', cost: 4, kp: 1, desc: 'Official kit for working as monitors in storage facilities. Pull out: Two way radio, heavy duty flashlight, shock baton, cuff, flash bang grenade (2 KP).' },
      { code: '', name: 'Morgue Kit', cost: 4, kp: 1, tag: 'Focus', desc: 'Official kit for forensic work. Pull out: Tweezers, compact magnifying scope, scalpel, sample collector, compact breathing mask, wet wipes.' },
      { code: '', name: 'Porter Kit', cost: 4, kp: 1, tag: 'Conspicuous', desc: 'Official kit for junior exorcists working as porters. Pull out: Sturdy backpack, foldable ladder, pitons, ice pick, 30ft cord, flashlight.' },
      { code: '', name: 'Study Kit', cost: 3, kp: 1, desc: 'Official kit for students continuing education while on-job. Pull out: Electronic dictionary, translation guide, local map, pencil case, notebook, textbook (3 KP).' },
      { code: '', name: 'Warden Kit', cost: 3, kp: 1, desc: 'Official kit for junior exorcists working as door watchmen. Pull out: Holy text (2 KP), prayer beads, standard issue great dagger, suicide pill, scented oil, antique censer.' },
    ]
  },
  {
    id: 'occult',
    name: 'OCCULT / MEDICAL',
    color: '#884444',
    items: [
      { code: '', name: 'Qlippoth', cost: 2, kp: 1, tag: 'Consumable', desc: 'Cursed fruit of the Ymir tree. Crush to regain 3 psyche burst.' },
      { code: '', name: 'Green Herb', cost: 2, kp: 1, tag: 'Consumable, Focus', desc: 'Consume to heal 1d3 stress.' },
      { code: '', name: 'Red Herb', cost: 2, kp: 2, tag: 'Consumable, Focus', desc: 'Consume to heal 2d3+1 stress.' },
      { code: '', name: 'Adrenal Pill', cost: 2, kp: 1, tag: 'Consumable', desc: 'Consume to heal 2d3 stress, then reduce max stress by 1 for the rest of the mission. Can be used while under duress.' },
      { code: '', name: 'Seed of the Ymir Tree', cost: 4, kp: 3, tag: 'Consumable', desc: 'During a rest, you can spend two resting dice to heal an injury, removing it.' },
      { code: '', name: 'Black Blood Medicine', cost: 4, kp: 2, tag: 'Consumable', desc: 'Consume on a dead exorcist that died in the same scene and has a relatively intact body to revive them. They come back with 2 injuries. All actions are hard until a rest.' },
      { code: '', name: 'White Body', cost: 2, kp: 1, tag: 'Consumable', desc: 'Condensed sinusoid of a large sin. May break to clear an affliction.' },
      { code: '', name: 'Black Body', cost: 3, kp: 1, tag: 'Consumable', desc: 'Condensed sinusoid of a large sin. Can be broken to lower sin by 3d3, but permanently lowers sin overflow cap by 1.' },
      { code: '', name: 'Cursed Salt', cost: 2, kp: 1, tag: 'Consumable', desc: 'When spread over a room sized area, prevents humans from entering until pressure increases.' },
      { code: '', name: 'Ambrosia', cost: 4, kp: 2, tag: 'Consumable', desc: 'Consume to gain 1 max and current psyche burst. Effect does not stack and lasts until the mission is over.' },
    ]
  },
  {
    id: 'mnemosyne',
    name: 'MNEMOSYNE AUXILIARY',
    color: '#6644aa',
    items: [
      { code: '', name: 'Anti-Meme 3X', cost: 2, kp: 1, tag: 'Consumable', desc: 'Upon injection, take -1 stress from BOOGEYMAN\'s reactions and are immune to her memory wiping effects until the end of the mission.' },
      { code: '', name: 'Timeline-Anchored Note & Pencil', cost: 2, kp: 1, tag: 'Consumable', desc: 'A sheet of paper and corresponding pencil that resists reality and memory altering effects. Information written on this note cannot be changed or removed in any way.' },
      { code: '', name: 'Anti-Meme Weapon Abutment', cost: 4, kp: 0, desc: 'A thin piece of glass like substance which can be permanently added to ammunition. Grants the weapon +2 CAT against threats flagged by the Mnemosyne division.' },
      { code: '', name: 'Physic-Assisted Surgery & Neuroplasticity Therapy', cost: 3, kp: 0, desc: 'Allows you to remove the affliction Severed Nervous System. Also increases your stress cap by +1 but only once.' },
    ]
  },
];

export default KIT_CATEGORIES;
