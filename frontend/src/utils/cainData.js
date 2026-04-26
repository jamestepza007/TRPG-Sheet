// ── CAIN Agendas & Blasphemies Data ──────────────────────────────
// Extracted from CAIN 1.2 rulebook pages 46-77

export const AGENDAS = [
  {
    id: 'BEAST',
    name: 'BEAST',
    items: '► Get into a fight\n► Hold Back',
    abilities: [
      { name: 'Insects!!!', description: 'You have +1D when inflicting harm or violence against human opponents.' },
      { name: "I'll take you down with me", description: 'Regain 1d3 psyche burst when you take an injury, fill out a hook, or take affliction.' },
      { name: 'Rule of Nature', description: 'When you inflict violence with an action, if you roll two or more 6s, the action inflicts 1 more slash on any talismans and you regain 1 psyche burst.' },
      { name: 'Red Muscle', description: 'You can take 2 nonlethal stress to gain +1D on any violent or forceful roll.' },
      { name: 'Bare Teeth', description: "While you have two or more injuries or afflictions, it is no longer hard to use mundane capabilities against supernatural forces and your human physical abilities are at 1/2 CAT instead of CAT 0." },
    ],
  },
  {
    id: 'DOOMED',
    name: 'DOOMED',
    items: '► Demonstrate your humanity\n► Demonstrate your distance from humanity',
    abilities: [
      { name: 'Xenoflesh', description: "Discard '1's rolled for gaining Sin." },
      { name: "Humanity's Last Breath", description: 'Pick a sin mark you have. Evolve that Sin mark. It no longer modifies resistance rolls.' },
      { name: 'Quickening', description: 'When you gain 2 or more Sin as part of an action, your action also gains +1D.' },
      { name: 'Sympathetic Mutation', description: 'You may take 1d3 sin to grant an ally the benefits of any sin mark ability you have for one scene. Their body is infected by a lesser version of it that dissipates when the scene is over.' },
      { name: 'Metamorphosis', description: 'Between missions or when resting, you can gain 1 sin to re-roll the ability of one of your sin marks. If you roll an ability you already have, choose one instead.' },
    ],
    note: 'You may only pick this agenda if you have a sin mark. If it\'s your first agenda, you may start with a sin mark of your choice (still roll 1d6 for ability).',
  },
  {
    id: 'FIREBUG',
    name: 'FIREBUG',
    items: '► Solve Problems Creatively\n► Take the simple solution',
    abilities: [
      { name: 'Jack!', description: 'At the start of a mission, choose a skill you have at 0. You can improve it to 1 for the duration of this mission only.' },
      { name: 'Always a way', description: "If there isn't an entrance or exit into a place, you can find one. You can always get through, but (Admin picks one): it's dangerous or risky, it'll only fit one person, you'll have to leave something or someone behind." },
      { name: 'Oilfinger', description: 'You start a mission with 1d3+1 extra Kit Points.' },
      { name: 'Extra Parts', description: 'You can mark 1 KP for +1D on any roll that involves fixing, crafting, breaking, or modifying devices or machines.' },
      { name: 'Weak Spot', description: 'When an ally performs violent or forceful action, you can grant them +1D on their action, and +1 slash on any talismans on success. You have one use of this ability, which resets when you rest, and a roll can only benefit from this once.' },
    ],
  },
  {
    id: 'GUARDIAN',
    name: 'GUARDIAN',
    items: '► Protect your people\n► Leave nobody behind',
    abilities: [
      { name: 'Iron Wall', description: 'When you defend someone close to you in a conflict scene, you can choose to divert any consequences taken by your target on to you instead of its usual effects. The second time or more you use this in the same scene, you take 1d3 nonlethal stress first.' },
      { name: 'The Excessive Agony of Moving Forward', description: 'Erase 1 stress when the hour passes if you have more than 3.' },
      { name: 'Castle', description: 'When any ally takes an injury, you erase 1 stress and gain +1D on your next action.' },
      { name: 'Centerweight', description: 'When resting, allies that spend resting dice can set the results of their dice to yours instead.' },
      { name: 'Painkiller', description: 'Your maximum stress is no longer reduced by taking injuries.' },
    ],
  },
  {
    id: 'HARDLINE',
    name: 'HARDLINE',
    items: '► Follow Orders\n► Disobey Orders',
    abilities: [
      { name: 'Black Suit', description: 'Gain +1D on actions to lead, intimidate, or give orders to mundane humans.' },
      { name: 'Mea Culpa', description: 'The first time in a hunt you take an injury or an affliction, relieve 1d3+1 sin.' },
      { name: 'Eliminate the Stain', description: "Gain +1D on all actions against sins that have half or less of their execution clock remaining." },
      { name: 'Single Minded', description: 'You can only be affected by one affliction maximum (you can choose which to discard and keep).' },
      { name: 'By the Book', description: "Once a hunt, when you witness or find evidence of a sin's Domain, you can force the Admin to show you the exact rules text of that Domain." },
    ],
  },
  {
    id: 'LONER',
    name: 'LONER',
    items: '► Demonstrate your superior skill\n► Let the mask slip',
    abilities: [
      { name: 'Dust to Dust', description: 'Stress no longer rolls over when you take an injury (excess is lost).' },
      { name: 'Silent Strike', description: 'Gain +1D on forceful actions taken against targets who are unaware of your presence.' },
      { name: "I'll do it myself", description: "Once a scene, when someone fails a roll, you can step in to help them, as long as you are able. You gain 1d3+1 nonlethal stress, but roll 1D and add it to the total roll, which could cause it to succeed." },
      { name: 'Rook', description: 'When you successfully set up an ally, you can take 1 nonlethal stress to set up another ally of your choice with the same action.' },
      { name: "It's Nothing", description: "You can ignore taking an injury by saying 'It's Nothing'. Gain a hook 'It's Nothing'. This hook fills up any time you say 'It's Nothing' as well as the normal ways. When the hook fills out, you collapse and suffer instant death, which you cannot ignore. If you end a mission with this hook, you gain a permanent cosmetic scar." },
    ],
  },
  {
    id: 'MACHINE',
    name: 'MACHINE',
    items: '► Put the work before your own needs\n► Take a break',
    abilities: [
      { name: 'The Work', description: "You can choose to gain +1D on any roll. If you do, take 1 stress for each time you've used this ability this mission (including this one). You can't use this ability for the remainder of the hunt if you rest." },
      { name: 'Brain Burst', description: 'When investigating or researching something, you can take 1 nonlethal stress to re-roll one die on your action roll. The re-roll is final.' },
      { name: 'Second Wind', description: 'The first time pressure fills up over half, relieve all stress.' },
      { name: 'Overtime', description: 'You can gain +1D on all actions to investigate, analyze, or gather information for the duration of a scene, but you lose the use of this ability and all other activities are hard until you rest.' },
      { name: 'Neat Little Universe', description: "Twice a hunt, you can tick any talisman on your sheet or an ally's up or down by 1." },
    ],
    note: 'A character can only take this agenda if they are well and truly dead. You get its ability for free.',
  },
  {
    id: 'SEEKER',
    name: 'SEEKER',
    items: '► Uncover hidden or uncomfortable truths about the world.\n► Uncover hidden or uncomfortable truths about yourself.',
    abilities: [
      { name: 'Psyche Jewel', description: "When you or an ally answers a Sin's trauma question, regain 1 psyche burst, recover 1 sin, and erase 1 stress." },
      { name: 'Alienation', description: 'Your sin overflow cap increases by +3.' },
      { name: 'Rapture', description: 'You erase 1 stress when you gain an affliction, injury, or hook.' },
      { name: 'Larval', description: 'If you end a mission at 7 or higher sin, gain 1 xp. If you suffer sin overflow, gain 1 xp.' },
      { name: 'Unveil', description: "You can ask the Admin about a character present 'What is this person afraid of?'. Gain +1D when you act on the answers for the rest of the scene, then lose the use of this ability until you rest." },
    ],
  },
  {
    id: 'TEMPERANCE',
    name: 'TEMPERANCE',
    items: '► Put people before the mission\n► Harm someone intentionally',
    abilities: [
      { name: 'Healer', description: 'When you rest, gain an extra resting die. This die can only be spent by an ally.' },
      { name: 'Focused', description: 'You can use a blasphemy that affects only you or your allies without spending psyche burst, and it gains +1 CAT. Then lose the use of this ability until you rest.' },
      { name: 'Savior Complex', description: 'Gain +1D on actions to directly prevent or avoid harm to humans.' },
      { name: 'Care', description: 'Twice a hunt, you can roll and apply a resting die to yourself or another nearby ally without resting.' },
      { name: 'Gentleness', description: 'For one scene, you may take 1 less stress when you take stress. This ability breaks if you take any forceful or harmful action. Then lose the use of this ability until you rest.' },
    ],
  },
  {
    id: 'TORCH',
    name: 'TORCH',
    items: '► Lead from the front\n► Let another take the lead',
    abilities: [
      { name: 'Joy Luck', description: "Wind Thrower: When you roll for any action, it's never hard." },
      { name: 'Hot Blooded', description: 'Your first action in a conflict scene gains +1D and inflicts +1 more slash on any talismans.' },
      { name: 'Font of Power', description: 'Once a hunt, you may gain 1d3 psyche bursts, which could put you over your maximum. Until you rest, you can no longer spend psyche bursts, but allies can spend your psyche bursts as their own.' },
      { name: 'Recollect', description: 'At the end of a session, you can describe something another character did that impressed you during that session, and give that character 1 xp. Characters can only gain this xp once if targeted by this ability multiple times.' },
      { name: 'Strive', description: 'Once a hunt, you can make a complete re-roll of any action you or an ally just took, taking the second result as final.' },
    ],
  },
  {
    id: 'SHADOW',
    name: 'SHADOW',
    items: '► Outshine your rival\n► Let your rival outshine you',
    abilities: [
      { name: 'Catch Up', description: 'If your rival has less stress than you when pressure increases, erase 1 stress. If they have more psyche bursts, regain 1 psyche burst.' },
      { name: 'Synchronize', description: 'When you set up your rival, you take 1 nonlethal stress and +1D on the action to set up.' },
      { name: "You Can't Die Now", description: 'If your rival would take an injury or suffer instant death, you can take 2d3 stress to allow them to ignore it (if at max stress, they go to 1 stress under maximum). Then, lose the use of this ability until you rest.' },
      { name: 'Shadow Seed', description: 'Choose a blasphemy power your rival has. You can use that power this hunt, but only at max CAT 0.' },
      { name: 'Pincer Technique', description: 'When you participate in teamwork with your rival, you take 1 nonlethal stress, but can also re-roll one of the dice once, taking the second result as final.' },
    ],
    note: 'When you pick this agenda, choose another character to be your rival (the feeling doesn\'t have to be mutual). As long as you have this agenda, you must choose who your rival is.',
  },
  {
    id: 'SORCERER',
    name: 'SORCERER',
    items: '► Demonstrate flashy displays of power\n► Invite catastrophe',
    abilities: [
      { name: 'Perfect Technique', description: 'Pick a blasphemy. Once a hunt, you can increase the CAT of that blasphemy by +1 temporarily for an entire scene, or for two rounds if it\'s a conflict scene.' },
      { name: 'Cantrip', description: 'Pick a blasphemy ability. You can use it three times a hunt without spending a psyche burst, but all parameters are at a max of CAT 0 if used this way.' },
      { name: 'Finishing Move', description: 'Pick a blasphemy power. You can increase the dice and CAT of that power by +1 the next time you use it, but you then cannot use any blasphemies again and all actions are hard. Both these effects end when you rest.' },
      { name: 'Mimic technique', description: 'Pick a power from any Blasphemy, without having taken that blasphemy. It doesn\'t change your xp or sin overflow caps.' },
      { name: 'Weave', description: 'When you use a blasphemy, you may increase the CAT of the next blasphemy used by an ally by +1, and grant it +1D on any rolls. Then lose the use of this ability until you rest.' },
    ],
  },
  {
    id: 'SURVIVOR',
    name: 'SURVIVOR',
    items: '► Survive\n► Will to Live: +1 max stress. 1 in 6 chance of ignoring instant death (roll 1d6)',
    abilities: [],
    note: 'Once taken, a character can only swap out of this agenda by spending two advances. Get its ability for free.',
  },
  {
    id: 'BIRDSONG',
    name: 'BIRDSONG',
    items: '► Get someone to do your bidding\n► Do something selfless',
    abilities: [
      { name: 'Codependency', description: 'When someone sets you up, you can trade 1 stress around (from you to them, or vice versa).' },
      { name: 'Spiral', description: 'You can always tell if someone is lying to you, though not the nature of the lie.' },
      { name: 'Strings', description: "When you rest with a consenting partner, you can spend quality time with them (the nature of which is up to them). If they choose to do so, you both add +1 to all your resting results. However, until you next rest, you can force them to participate in teamwork with you or set you up once." },
      { name: 'White Fiber', description: "You can take 2 nonlethal stress to gain +1D on any roll to lie or manipulate someone. This stress cannot inflict an injury on you." },
      { name: 'Fascination', description: "You can declare your fascination with another character in the group at the start of any hunt. When that character rolls a 6 on risk, you lose 1 stress. When they roll a 1, you gain 1 nonlethal stress." },
    ],
  },
  {
    id: 'CUSTOM',
    name: '✏ Custom',
    items: '',
    abilities: [],
  },
];

export const BLASPHEMIES = [
  {
    id: 'TENSION',
    name: 'I. TENSION',
    description: 'Project powerful fields of force to block, cut, or entrap.',
    passive: { name: 'Iron Soul', description: "When you would fill up your execution talisman and gain an injury, roll 1d6. On a 4+, go to 1 stress under maximum instead and ignore any excess, then lose the use of this passive until you rest." },
    powers: [
      { name: 'Aegis', description: 'Instant, Short. Once a scene, when you or a visible ally in short range of you would mark stress from external harm, you can intervene by answering questions. For each \'yes\' answer, roll 1d6. For every 2+ rolled reduce stress suffered by 1, and for every 6 rolled reduce it by 2. If an ally gains an injury in the same scene, regain the use of this power.' },
      { name: 'Stasis', description: 'Curse, 1 scene, Short. With a gesture, you can lock yourself or a CAT sized group of humans or exorcists in a tension cage, paralyzing them. Once trapped, your target is locked in, unable to move or act for the scene, and is immune to all harm and effects from the outside.' },
      { name: 'Severance', description: 'Instant, Short. You can project a tension force over any edge, and use it as a cutting implement. Roll PSYCHE to cut an object or opponent up to CAT size, only spending a psyche burst on success. +1D if striking to protect another person. +1D against immobile objects or opponents.' },
      { name: 'Malleate', description: 'Transmute, Until rest, Adjacent. You can invert and infuse a tension field to make an area of nonliving matter incredibly pliable and soft. The size affected is by CAT. Choose: Rubber, Mud, or Liquid.' },
      { name: 'Fortress', description: 'Summon, Until rest, Short. Once a scene, you can create a spot tension field with a size determined by up to CAT that appears as a large plane of shimmering force, invisible to humans. It is as hard as a solid object and prevents all living and nonliving matter and energy from crossing it. Has a 2+CAT talisman for its durability.' },
    ],
  },
  {
    id: 'ARDENCE',
    name: 'II. ARDENCE',
    description: 'Manipulate potential energy into furious destruction.',
    passive: { name: 'Inner Furnace', description: 'You can take an Unstable Power hook as part of using any Ardence power to increase the CAT of the power up to +2. When the hook fills up, you burn up from the inside, gaining an injury and ending the hook.' },
    powers: [
      { name: 'Fury', description: 'Instant, Long. You can create a fierce blast of destructive energy at a location in range with a blast area up to CAT. Roll PSYCHE, gaining +1D for each \'yes\' answer to: Are you willing to cause indiscriminate harm? / Are you willing to let your anger control the outcome?' },
      { name: 'Void', description: 'Instant, Short. You create a flash vacuum by burning the air away, affecting an area up to CAT. Choose effect: Weak (sucks in loose objects), Medium (throws humans/exorcists off feet), or Strong (affects sins and vehicles up to CAT size).' },
      { name: 'Hell', description: 'Transmute, Adjacent, Until Rest. You may dump energy into the ground and anything touching it in an area determined by CAT+2. Choose hot or cold. Choose: Simmer (discomfort), Poach (major discomfort, hazardous), or Boil (deadly to humans).' },
      { name: 'Sabre', description: 'Instant, CAT range. Release a blast of energy in a highly destructive beam. The beam goes in a straight line a range equal to CAT, piercing through walls effortlessly. For every \'6\' result rolled, inflicts 1 extra slash on a talisman, but you also take 1 stress.' },
      { name: 'Storm', description: 'Transmute, Extreme, Whole Mission. You can send potential energy into the atmosphere, affecting a microclimate in an area equal to CAT+2 (max CAT 7). Spend psyche bursts to add effects: Clear, Rain, Cold, Fog, or Gale.' },
    ],
  },
  {
    id: 'FLUX',
    name: 'III. FLUX',
    description: 'Tap into the ebb and flow of time.',
    passive: { name: 'Steal Time', description: 'Once a mission, you can re-roll all your resting dice for yourself or an ally, taking the second result as final.' },
    powers: [
      { name: 'Reversal', description: 'Adjacent, Instant. By touching an object up to CAT size, you can reverse its passage through time for the last hour. This could physically move the object, revert damage, etc.' },
      { name: 'Stop', description: 'Transmute, Instant, Self. Spend up to three psyche bursts to stop local time in an area around you equal to CAT. Roll 1d6 per psyche burst — that is how many seconds you have. Then, gain temporal instability.' },
      { name: 'Quickening', description: 'Instant, Adjacent. You can accelerate natural healing: immediately heal 1d3 stress on yourself or another target. You may heal a CAT sized group of dying or injured humans in short range. Then, gain temporal instability.' },
      { name: 'Schism', description: 'Transmute, Instant, 1 scene. You can create a bubble of altered time equal to CAT area, opening a window into one day in the past or future. The bubble\'s alternate timeline changes don\'t affect the present.' },
      { name: 'Stutter', description: 'Instant, Short. You can briefly reverse time to alter causality for any action roll made by you or an ally in CAT range. Re-roll the action roll completely, taking the second result as final. Gain temporal instability.' },
    ],
  },
  {
    id: 'VECTOR',
    name: 'IV. VECTOR',
    description: 'Imbue anything you touch with a strong burst of velocity.',
    passive: { name: 'Brake', description: 'Automatically remove velocity from all projectiles that would hit you, taking -1 stress from them.' },
    powers: [
      { name: 'Fling', description: 'Adjacent, Instant. With a touch, imbue velocity into yourself or another object or being and send it flying. The combined size and range must equal your CAT+2 or less. You can alternately remove all velocity from an object of CAT+2 size.' },
      { name: 'Lift', description: 'Charm, Self, 1 scene. You reverse gravity\'s effect on yourself and a CAT sized group of exorcists or humans. Affected gain: run/walk/climb vertical surfaces, slow fall at will, and glide a distance equal to CAT range.' },
      { name: 'Current', description: 'Transmute, Until rest, CAT+2 range. You create a persistent Vector force in an area that lasts until you rest. It creates a line that goes about CAT+2 range and covers about the width of a street, pushing constantly in one direction.' },
      { name: 'Bullet', description: 'Instant, CAT+1 range. You can imbue strong bursts of velocity into the air at your fingertips, creating pressurized air bullets that hit with extreme force. Roll PSYCHE. +1D from elevated position. +1D to disarm, distract, or disable.' },
      { name: 'Finesse', description: 'Instant, CAT range. You may use this power to finely manipulate threads of force to perform fine motor skills you could perform with your hands at CAT range. Roll PSYCHE OR a relevant skill. +1D on the action.' },
    ],
  },
  {
    id: 'GATE',
    name: 'V. GATE',
    description: 'Manipulate space as a sculptor works with clay.',
    passive: { name: 'Pocket', description: 'You can fit a compressed tear in space into a piece of clothing. You gain +1 KP. You can stow or retrieve items inside your pocket, which can hold items worth up to 3 KP total.' },
    powers: [
      { name: 'Tear', description: 'Summon, Until rest. You create two points in CAT range connected by a slash in the fabric of reality. Objects, beings, and forces up to ½ CAT in size can freely move through the tear for the duration, and momentum is preserved.' },
      { name: 'Pinch', description: 'Instant, special range. You choose a single living being or object you can see. Roll PSYCHE if target is unwilling. On at least one success, you pinch space to move your target right next to you. They ignore all physical obstructions.' },
      { name: 'Bloom', description: 'Summon, Short, 1 scene. By splitting space in creative ways, you create a number of controllable duplicates of any of your limbs or hands equal to CAT+1 on any surfaces in short range, emerging from a tear in space.' },
      { name: 'Transmission', description: 'Instant, CAT+2 range. Instantly move to any other area in CAT+2 range. However, the Admin asks you questions about familiarity, visibility, and calm — rolling 1d6 per \'no\' answer.' },
      { name: 'Maze', description: 'Transmute, Self, CAT area. You rearrange an area equal to CAT around you, causing rearrangement of human-built structures. Create/remove doors, add corridors, change gravity direction, make rooms larger or smaller, or rearrange furniture.' },
    ],
  },
  {
    id: 'SMOTHER',
    name: 'VI. SMOTHER',
    description: 'Suppress innate properties of things, like friction, sound, or light.',
    passive: { name: 'Absentia', description: 'You can improve the CAT of any of your Smother powers by +2 when you use them (max CAT 7). However, when you do, gain the Absentia Hook. If it fills up, you take an injury, black out, and are missing a body part.' },
    powers: [
      { name: 'Hollow', description: 'Charm, Adjacent, Until rest. You temporarily remove weight from a single object, human, or exorcist, giving them the total weight of 1 lb if heavier. The size must be CAT or lower.' },
      { name: 'Abstract', description: 'Transmute, Short, 1 scene. With a gesture, you remove recognizable properties of CAT+1 number of distinct tools, vehicles, windows, doors, or objects. They can no longer be used for their intended purpose and no one can recognize them.' },
      { name: 'Smooth', description: 'Transmute, Short, 1 scene. You temporarily remove almost all friction from a CAT sized group of humans or exorcists, or an area up to CAT. The area becomes incredibly slippery.' },
      { name: 'Dark Age', description: 'Charm, Self, Until Rest. You produce a strong field disabling simple human advancements from working in CAT area. Choose up to three to suppress: Electricity, Internet, Combustion engines, Running Water, Door handles/zippers, Open fires.' },
      { name: 'Blind', description: 'Transmute, Adjacent, 1 scene. An number of objects or living beings equal to CAT, or location of a size up to CAT you touch ceases producing sound, reflecting light, or both for the scene.' },
    ],
  },
  {
    id: 'WHISPER',
    name: 'VII. WHISPER',
    description: 'Your shadow talks to you. It knows the future.',
    passive: { name: 'Shadow', description: 'You harbor a separate being (your Shadow) that follows you everywhere. It is intangible and invisible to everyone. It can range in about short range from you and can pass through walls. It retreats into your body in bright light. Talking to it telepathically causes 1 stress after any interaction ends.' },
    powers: [
      { name: 'Omen', description: 'Instant, Self. Ask your shadow \'What will happen if I X\'. The shadow gives a brief impression of the future. Gain +1D when you or an ally next acts on the answer. Pre-roll the risk die before you take the action.' },
      { name: 'Shiver', description: 'Charm, Self, 1 scene. When looking for a human, sin, exorcist, location, or object, you send a psychic pulse out to CAT range. While your target is in range, you feel a strong sense of cold. If your target is in short range, you also gain +1D on any rolls to track or locate them.' },
      { name: 'Dissect', description: 'Instant, CAT range. Examine a human or exorcist you can see, roll PSYCHE, and ask your shadow questions about them. They answer truthfully in a max of three words each: Is this person lying? / Main emotion? / Where from? / Where going next?' },
      { name: 'Precognition', description: 'Instant, Self. When the Admin is describing a scene or you are about to take action, you can \'flash back\'. Make an action roll in the past, where you had a vision of the present moment. This could change the situation or alter present details, or set up yourself or any ally.' },
      { name: 'Omnipresence', description: 'Instant, CAT+2 range. When an ally is in a scene you\'re not in and they are in CAT+2 range, you can walk in on the scene, having predicted it. Roll PSYCHE and choose per success: not followed, hidden, enter without harm, or have a useful tool.' },
    ],
  },
  {
    id: 'EDIT',
    name: 'VIII. EDIT',
    description: 'Change yourself, the world, or others by pulling from different possible realities.',
    passive: { name: 'Mimic', description: 'You can alter minor things about your appearance when resting: body features like height and weight, aesthetics like facial features/skin/hair/gender, and age (13-88). You always look faintly similar, like a distant relative. Your clothes always change to fit you.' },
    powers: [
      { name: 'Uniform', description: 'Charm, Self, Until Rest. You make a brief edit of yourself (needs privacy). This power makes you officially part of any profession or group with more than 5 members, with any necessary uniform, equipment, id cards, memberships, etc.' },
      { name: 'Absurd', description: 'Curse, Short, 1 scene. You swap a CAT amount of humans or exorcists with a different version of themselves from an alternate timeline. Must roll PSYCHE for hostile targets. This can change: what the target is wearing (not holding in hand), and physical appearances.' },
      { name: 'Utility', description: 'Until Rest, Short. When you need any mundane object, tool, or vehicle that could fit in a small room, you can cause it to appear on a surface in range without spending KP. However, the Admin chooses one (or two if rare/dangerous) drawback.' },
      { name: 'Copy', description: 'Summon, Adjacent, 1 scene. You create a temporary, exact copy of a human or exorcist: a doppelganger with simple intelligence. You may give it simple instructions of one or two sentences. It dissolves into pale sludge when the scene ends, or if touched by anyone except you.' },
      { name: 'Filter', description: 'Transmute, Adjacent, 1 scene. You produce a strong field affecting all matter in a small room. In this area you gain +1D to examine its contents and can: make matter transparent or opaque, change lighting, move objects and \'pin\' them in space, or safely dissect/reassemble loose inanimate objects.' },
    ],
  },
  {
    id: 'BIND',
    name: 'IX. BIND',
    description: 'Bind weak sins to your service and use them as servants or weapons.',
    passive: { name: 'Sin Binding', description: 'You have the forbidden ability to bind Sins. You have the obedient essence of a minor sin bound to you. It can follow you, follow simple orders, and uses your skills (CAT 0). It can understand language but cannot speak and is invisible to humans.' },
    powers: [
      { name: 'Horde Spirit', description: 'Self, 1 scene. You can spend a psyche burst to empower your sin for one scene. On next traversal/movement action it gets +1D. You can transform it into a vehicle or rideable creature of up to CAT size, or it can glide a short distance with passengers.' },
      { name: 'Forbidden Spirit', description: 'Self, Instant. You can spend a psyche burst to empower your sin for one action. Once this scene it can ignore any stress taken. The action gains +1D and causes monstrous transformation — it becomes CAT+1 size and can move/lift/strike/throw objects of equal size.' },
      { name: 'Hunter Spirit', description: 'Self, 1 scene. You can spend a psyche burst to empower your sin for one scene on tracking or observation. It gains +1D. It can separate to extreme range, fly, see and smell extremely well, see in the dark and thermal spectrum. You can use its senses instead of your own.' },
      { name: 'Surrender', description: 'Charm, Self, until rest. You can temporarily fuse your sin to your body. Lose the use of your bound sin for the duration. Immediately manifest a temporary sin mark and roll for the ability, which you gain until you end this ability early or rest.' },
      { name: 'Prison', description: 'Summon, adjacent, Until Rest. You create an area drawn as a large circle (up to CAT area), choosing either a regular prison (Sins can\'t leave) or inverse prison (Sins can\'t enter). Has a 3+CAT talisman for durability.' },
    ],
  },
  {
    id: 'JAUNT',
    name: 'X. JAUNT',
    description: 'Separate body and soul, perception and flesh.',
    passive: { name: 'Ghostwire', description: 'You can join your mind telepathically with a number of other willing people you touch equal to CAT. While within long distance of each other, you can talk telepathically, and sense each other\'s ambient emotional state.' },
    powers: [
      { name: 'Possession', description: 'Curse, Short, 1 scene. You can shunt your perception out of your body to possess a human, animal, or corpse you can see. Your real body is insensate and defenseless. For humans and animals, you cannot force the target to harm itself.' },
      { name: 'Geist', description: 'Self, 1 scene. You shunt your perception out of your body and roam for CAT+2 range as purely psychic energy. You can fly at CAT speed, are invisible to non-psychics, and may pass through walls. You cannot interact with or be affected by the physical world.' },
      { name: 'Threads', description: 'Charm, Self, Until rest. You can sense the unseen world of traces of grace. You gain: ability to see living beings through walls for CAT range, see traces sins and exorcists leave, and +1D on actions to track/locate. However, you effectively cannot see non-living matter while active.' },
      { name: 'Desecrate', description: 'Summon, Adjacent, Instant. You can force a semblance of life into the corpses of up to CAT humans or exorcists by touching them on the eyes. You may ask the corpses three questions total, after which the effect ends.' },
      { name: 'Passenger', description: 'Curse, extreme range, 1 scene. You choose up to ½ CAT willing people in extreme range. You pull their psychic presence into your body. Their bodies become limp and insensate. They now share control of your body with you, including all senses.' },
    ],
  },
  {
    id: 'PALACE',
    name: 'XI. PALACE',
    description: 'The contents of your mind are a tangible place you can visit.',
    passive: { name: 'Sanctum', description: 'You and allies you rest with can enter your psychic palace while resting. This improves the resting rolls of yourself and up to one ally of your choice resting with you by +1. The palace is a mental projection, a dream space that takes the form of a large home, residence, or mansion.' },
    powers: [
      { name: 'Library', description: 'Instant, Self. This power does not take a psyche burst. Your palace has a library of information from the psychic gestalt. When gathering information, you can gain +1D on the roll by accessing this library. However, the Admin rolls 1d6 for each: Is information rare? / Forbidden? / Pertinent to a powerful group?' },
      { name: 'Cellar', description: 'Charm, Infinite range, Instant. You can simulate situations inside your palace before putting them into practice. You can use this power and roll to set up a number of allies equal to ½ CAT even if you are not physically present.' },
      { name: 'Foyer', description: 'Summon. Your palace has a tulpa (a psychic servant/butler). You can summon them to: aid you on research/crafting/investigation granting +1D, or briefly manifest outside your palace in short range as a real person with roughly CAT 0 capabilities.' },
      { name: 'Parlor', description: '1 scene, Investigation area. Choose one person or up to a CAT sized group and speak their real name aloud. You can bring yourself and their psychic shadow inside your palace, no matter where they are.' },
      { name: 'Bar', description: 'Self, 1/scene. This power does not take a psyche burst. You can open any closed door to your actual, physical bar instead of the room you would expect. When you rest in your bar, roll 1d3+1 and spend charges: 1 charge: Erase 1 stress. 2 charges: Untick 1 tick on all hooks. 3 charges: Remove an injury.' },
    ],
  },
  {
    id: 'SYMPATHY',
    name: 'XII. SYMPATHY',
    description: 'Pull on the innate connections to human tools or objects.',
    passive: { name: 'Resonance', description: 'At the start of the mission, roll on the resonance table (1d3, then 1d6). When making an action roll using an item you are resonant with, you gain a +1D bonus. You can spend a psyche burst any time to roll an additional resonance. Keep up to three at a time.' },
    powers: [
      { name: 'Amplify', description: 'Summon, Adjacent, 1 scene. You can expand the mundane properties of a regular non-weapon item to extreme levels. Touch a mundane object up to CAT size. For the scene, you automatically have resonance with it, and its properties are enhanced to extreme levels (up to your CAT in scale).' },
      { name: 'Bond', description: 'Self, 1 scene. You bond with an item in one or both hands. You are now resonant with it. You can use it as a mundane cutting/bludgeoning weapon. The item becomes virtually indestructible. You can cause the item to recall to your hand from short distance.' },
      { name: 'Diplomacy', description: 'Instant, Short. You make a simple request of an object as if it was a person, or ask it a simple yes or no question. For example: ask a door to open/hold shut, a computer to turn off or find information, or a car to turn on without a key.' },
      { name: 'Psychometry', description: 'Instant, Adjacent. You can touch objects to remotely view their memories for a number of days equal to your CAT. Roll PSYCHE, then ask a question plus one per success: Where has it been? / Who has touched it? / What has it been used for? / What else is it connected to?' },
      { name: 'Alliance', description: 'Summon, Short, 1 scene. An object up to CAT size in short range can now take action to set up an ally, rolling 1d6 (or PSYCHE if you are resonant with it). Allies have to be able to interact with or use the object to gain its benefits.' },
    ],
  },
  {
    id: 'CUSTOM',
    name: '✏ Custom',
    description: '',
    passive: null,
    powers: [],
  },
];

export const getAllBlasphemyPowers = () => {
  const all = [];
  BLASPHEMIES.forEach(b => {
    if (b.id === 'CUSTOM') return;
    b.powers.forEach(p => {
      all.push({ ...p, blasphemy: b.name, blasphemyId: b.id });
    });
  });
  return all;
};
