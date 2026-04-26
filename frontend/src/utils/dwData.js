// ── Dungeon World Class Data ──────────────────────────────────────
// Extracted from official DW character sheets

export const DW_CLASSES = [
  // ─────────────────────────────────────────────
  {
    id: 'BARBARIAN',
    name: 'Barbarian',
    hp: '8+Constitution',
    damage: 'd10',
    load: '8+STR',
    startingMoves: `► Full Plate And Packing Steel (choose one)
You ignore the clumsy tag on armor you wear.

► Unencumbered, Unharmed (choose one)
So long as you are below your Load and neither wear armor nor carry a shield, take +1 armor.

► The Upper Hand [always]
You take +1 ongoing to last breath rolls. When you take your last breath, on a 7–9 you make an offer to Death in return for your life. If Death accepts he will return you to life. If not, you die.

► What Are You Waiting For? [always]
When you cry out a challenge to your enemies, roll+Con. • On a 10+ they treat you as the most obvious threat to be dealt with and ignore your companions, take +2 damage ongoing against them. • On a 7–9 only a few (the weakest or most foolhardy among them) fall prey to your taunting.

► Herculean Appetites [always]
Others may content themselves with just a taste of wine, or dominion over a servant or two, but you want more. Choose two appetites if you would roll for a move, instead of rolling 2d6 you roll 1d6+1d8. If the d6 is the higher die of the pair, the GM will also introduce a complication or danger that comes about due to your heedless pursuits.
• Pure destruction
• Power over others
• Mortal pleasures
• Conquest
• Riches and property
• Fame and glory

► Musclebound [always]
While you wield a weapon it gains the forceful and messy tags.`,
    gear: `Dungeon Rations (5 uses, 1 weight)
Dagger (hand, 1 weight)
Some Token of where you've travelled or where you're from.

Choose your weapon:
□ Axe (close, 1 weight)
□ Two-handed Sword (close, +1 damage, 2 weight)

Choose one:
□ Adventuring Gear (5 uses, 1 weight) and Dungeon Rations (5 uses, ration, 1 weight)
□ Chainmail (1 armor, worn, 1 weight)`,
    advancedMoves: [
      { tier: '2-10', name: 'Still Hungry', description: 'Choose an additional appetite.' },
      { tier: '2-10', name: 'Appetite For Destruction', description: 'Take a move from the Fighter, Bard, or Thief class list. You may not take multiclass moves from those classes.' },
      { tier: '2-10', name: 'My Love For You Is Like A Truck', description: 'When you perform a feat of strength, name someone present whom you have impressed and take +1 forward to parley with them.' },
      { tier: '2-10', name: 'What Is Best In Life', description: "At the end of a session, if during this session you have crushed your enemies, seen them driven before you, or have heard the lamentations of their kinfolk mark XP." },
      { tier: '2-10', name: 'Wide-Wanderer', description: "You've travelled the wide world over. When you arrive someplace ask the GM about any important traditions, rituals, and so on, they'll tell you what you need to know." },
      { tier: '2-10', name: 'Usurper', description: 'When you prove yourself superior to a person in power, take +1 forward with their followers, underlings, and hangers on.' },
      { tier: '2-10', name: 'Khan Of Khans', description: 'Your hirelings always accept the gratuitous fulfillment of one of your appetites as payment.' },
      { tier: '2-10', name: 'Samson', description: 'You may take a debility to immediately break free of any physical or mental restraint.' },
      { tier: '2-10', name: 'Smash!', description: 'When you Hack & Slash, on a 12+ deal your damage and choose something physical your target has (a weapon, their position, a limb): they lose it.' },
      { tier: '2-10', name: 'Indestructible Hunger', description: 'When you take damage you can choose to take -1 ongoing until you sate one of your appetites instead of taking the damage. If you already have this penalty you cannot choose this option.' },
      { tier: '2-10', name: 'Eye For Weakness', description: 'When you Discern Realities add "What here is weak or vulnerable?" to the list of questions you can ask.' },
      { tier: '2-10', name: 'On The Move', description: 'When you defy a danger caused by movement (maybe falling off a narrow bridge or rushing past an armed guard) take +1.' },
      { tier: '6-10', name: 'A Good Day To Die', description: 'As long as you have less than your CON in current HP (or 1, whichever is higher) take +1 ongoing.' },
      { tier: '6-10', name: "Kill 'Em All", description: 'Requires: Appetite for Destruction. Take another move from the Fighter, Bard, or Thief class list. You may not take multiclass moves from those classes.' },
      { tier: '6-10', name: 'War Cry', description: 'When you enter the battle with a show of force, roll+CHA. • On a 10+ both, • on a 7–9 one or the other: Your allies are rallied and take +1 forward. Your enemies feel fear and act accordingly (avoiding you, hiding, attacking with fear-driven abandon).' },
      { tier: '6-10', name: 'Mark Of Might', description: 'When you take this move and spend some uninterrupted time reflecting on your past glories, you may mark yourself with a symbol of your power (a long braid tied with bells, ritual scars or tattoos, etc.) Any intelligent mortal creature who sees this symbol knows instinctively that you are a force to be reckoned with and treats you appropriately.' },
      { tier: '6-10', name: "More! Always More!", description: 'When you satisfy an appetite to the extreme (destroying something unique and significant, gaining enormous fame, riches, power, etc.) you may choose to resolve it. Cross it off the list and mark XP. While you may pursue that appetite again, you no longer feel the burning desire you once did. In its place, choose a new appetite from the list or write your own.' },
      { tier: '6-10', name: 'The One Who Knocks', description: 'When you Defy Danger, on a 12+ you turn the danger back on itself, the GM will describe how.' },
      { tier: '6-10', name: 'Healthy Distrust', description: 'Whenever the unclean magic wielded by mortal men causes you to Defy Danger, treat any result of 6- as a 7–9.' },
      { tier: '6-10', name: 'For The Blood God', description: 'You are initiated in the old ways, the ways of sacrifice. Choose something your gods (or the ancestor spirits, or your totem, etc) value—gold, blood, bones or the like. When you sacrifice those things as per your rites and rituals, roll+WIS. • On a 10+ the GM will grant you insight into your current trouble or a boon to help you. • On a 7-9 the sacrifice is not enough and your gods want some of your flesh as well, but still grant you some insight or boon. • On a miss, you earn the ire of the fickle spirits.' },
    ],
    hasSpells: false,
  },

  // ─────────────────────────────────────────────
  {
    id: 'BARD',
    name: 'Bard',
    hp: '6+Constitution',
    damage: 'd6',
    load: '9+STR',
    startingMoves: `► Arcane Art [always]
When you weave a performance into a basic spell, choose an ally and an effect:
• Heal 1d8 damage
• +1d4 forward to damage
• Their mind is shaken clear of one enchantment
• The next time someone successfully assists the target with aid, they get +2 instead of +1
Then roll+CHA. • On a 10+, the ally gets the selected effect. • On a 7-9 your spell still works, but you draw unwanted attention or your magic reverberates to other targets affecting them as well, GM's choice.

► Charming & Open [always]
When you speak frankly with someone, you can ask their player a question from the list below. They must answer it truthfully, then they may ask you a question from the list (which you must answer truthfully):
• Whom do you serve?
• What do you wish I would do?
• How can I get you to _____?
• What are you really feeling right now?
• What do you most desire?

► Bardic Lore [always]
Choose an area of expertise:
□ Spells and Magicks
□ The Dead and Undead
□ Grand Histories of the Known World
□ A Bestiary of Creatures Unusual
□ The Planar Spheres
□ Legends of Heroes Past
□ Gods and Their Servants
When you first encounter an important creature, location, or item (your call) covered by your bardic lore you can ask the GM any one question about it; the GM will answer truthfully. The GM may then ask you what tale, song, or legend you heard that information in.

► A Port In The Storm [always]
When you return to a civilized settlement you've visited before, tell the GM when you were last here. They'll tell you how it's changed since then.`,
    gear: `Dungeon Rations (5 uses, 1 weight)
Choose one instrument, all are weight 0 for you:
□ Your father's Mandolin, repaired
□ A fine Lute, a gift from a noble
□ The Pipes with which you courted your first love.
□ A stolen Horn
□ A Fiddle, never before played
□ A Songbook in a forgotten tongue

Choose your clothing:
□ Leather Armor (1 armor, worn, 1 weight)
□ Ostentatious Clothes (worn, 0 weight)

Choose your armament:
□ Dueling Rapier (close, precise, 2 weight)
□ Worn Bow (near, 2 weight) / Bundle of Arrows (3 ammo, 1 weight) / Short Sword (close, 1 weight)

Choose one:
□ Adventuring Gear (5 uses, 1 weight)
□ Bandages (3 uses, slow, 0 weight)
□ Halfling Pipeleaf (6 uses, 0 weight)
□ 3 coins`,
    advancedMoves: [
      { tier: '2-10', name: 'Healing Song', description: 'When you heal with Arcane Art, you heal +1d8 damage.' },
      { tier: '2-10', name: 'Vicious Cacophony', description: 'When you grant bonus damage with Arcane Art, you grant an extra +1d4 damage.' },
      { tier: '2-10', name: 'It Goes To Eleven', description: 'When you unleash a crazed performance (a righteous lute solo or mighty brass blast, maybe) choose a target who can hear you and roll+CHA. • On a 10+ the target attacks their nearest ally in range. • On a 7-9 they attack their nearest ally, but you also draw their attention and ire.' },
      { tier: '2-10', name: 'Metal Hurlant', description: 'When you shout with great force or play a shattering note choose a target and roll+CON. • On a 10+, the target takes 1d10 damage and is deafened for a few minutes. • On a 7-9 you still damage your target, but it\'s out of control: the GM will choose an additional target nearby.' },
      { tier: '2-10', name: 'A Little Help From My Friends', description: 'When you successfully aid someone you take +1 forward as well.' },
      { tier: '2-10', name: 'Eldritch Tones', description: 'Your Arcane Art is strong, allowing you to choose two effects instead of one.' },
      { tier: '2-10', name: "Duelist's Parry", description: 'When you Hack & Slash, you take +1 armor forward.' },
      { tier: '2-10', name: 'Bamboozle', description: 'When you parley with someone, on a 7+ you also take +1 forward with them.' },
      { tier: '2-10', name: 'Multiclass Dabbler', description: 'Get one move from another class. Treat your level as one lower for choosing the move.' },
      { tier: '2-10', name: 'Multiclass Initiate', description: 'Get one move from another class. Treat your level as one lower for choosing the move.' },
      { tier: '6-10', name: 'Healing Chorus', description: 'Replaces: Healing Song. When you heal with Arcane Art, you heal +2d8 damage.' },
      { tier: '6-10', name: 'Vicious Blast', description: 'Replaces: Vicious Cacophony. When you grant bonus damage with Arcane Art, you grant an extra +2d4 damage.' },
      { tier: '6-10', name: 'Unforgettable Face', description: "When you meet someone you've met before (your call) after some time apart you take +1 forward against them." },
      { tier: '6-10', name: 'Reputation', description: "When you first meet someone who's heard songs about you, roll+CHA. • On a 10+, tell the GM two things they've heard about you. • On a 7-9, tell the GM one thing they've heard, and the GM tells you one thing." },
      { tier: '6-10', name: 'Eldritch Chord', description: 'Replaces: Eldritch Tones. When you use Arcane Art, you choose two effects. You also get to choose one of those effects to double.' },
      { tier: '6-10', name: 'An Ear For Magic', description: 'When you hear an enemy cast a spell the GM will tell you the name of the spell and its effects. Take +1 forward when acting on the answers.' },
      { tier: '6-10', name: 'Devious', description: 'When you use Charming & Open you may also ask "How are you vulnerable to me?" Your subject may not ask this question of you.' },
      { tier: '6-10', name: "Duelist's Block", description: "Replaces: Duelist's Parry. When you Hack & Slash, you take +2 armor forward." },
      { tier: '6-10', name: 'Con', description: 'Replaces: Bamboozle. When you parley with someone, on a 7+ you also take +1 forward with them and get to ask their player one question which they must answer truthfully.' },
      { tier: '6-10', name: 'Multiclass Master', description: 'Get a move from another class. Treat your level as one lower for choosing the move.' },
    ],
    hasSpells: false,
  },

  // ─────────────────────────────────────────────
  {
    id: 'CLERIC',
    name: 'Cleric',
    hp: '8+Constitution',
    damage: 'd6',
    load: '10+STR',
    startingMoves: `► Deity [always]
You serve and worship some deity or power which grants you spells. Give your god a name and choose your deity's domain:
□ Healing and Restoration
□ Bloody Conquest
□ Civilization
□ Knowledge and Hidden Things
□ The Downtrodden and Forgotten
□ What Lies Beneath

Choose one precept of your religion:
□ It preaches the sanctity of suffering, add Petition: Suffering
□ It's clutish and insular, add Petition: Gaining Secrets
□ It Observes important sacrificial rites, add Petition: Offering
□ It believes in trial by combat, add Petition: Personal Victory

► Divine Guidance [always]
When you petition your deity according to the precept of your religion, you are granted some useful knowledge or boon related to your deity's domain. The GM will tell you what.

► Cast A Spell (WIS) [always]
When you unleash a spell granted by your deity, roll+WIS. • On a 10+ the spell is successfully cast and your deity does not revoke the spell, so you may cast it again. • On a 7-9 the spell is cast, but choose one: You draw unwelcome attention or put yourself in a spot. The casting distances you from your deity; take -1 ongoing to cast a spell until the next time you commune. After it is cast, the spell is forgotten. You cannot cast the spell again until you commune and have it granted to you.

► Commune [always]
When you spend uninterrupted time (an hour or so) in quiet contemplation with your deity, you: Lose any spells already granted to you. Are granted new spells of your choice whose total levels don't exceed your own level +1, and none of which is a higher level than your own level. Prepare all of your rotes, which never count against your limit.

► Turn Undead (WIS) [always]
When you hold your holy symbol aloft and call on your deity for protection, roll+Wis. • On a 7+, so long as you continue to pray and brandish your holy symbol, no undead may come within reach of you. • On a 10+, you also momentarily daze intelligent undead and cause mindless undead to flee. Aggression breaks the effects and they are able to act as normal.`,
    gear: `Some Symbol of the Divine (1 weight), describe it: ___
Dungeon Rations (5 uses, ration, 1 weight)

Choose your defenses:
□ Chainmail (1 armor, worn, 1 weight)
□ Shield (+1 armor, 2 weight)

Choose your armament:
□ Warhammer (close, 1 weight)
□ Mace (close, 1 weight)
□ Staff (close, two-handed, 1 weight) and Bandages (3 uses, slow, 0 weight)

Choose one:
□ Adventuring Gear (5 uses, 1 weight) and Dungeon Rations (5 uses, ration, 1 weight)
□ Healing Potion (0 weight)`,
    advancedMoves: [
      { tier: '2-10', name: 'Chosen One', description: 'Choose one spell. You are granted that spell as if it was one level lower.' },
      { tier: '2-10', name: 'Invigorate', description: 'When you heal someone they take +2 forward to their damage.' },
      { tier: '2-10', name: 'The Scales Of Life And Death', description: 'When someone takes their last breath in your presence, they take +1 to the roll.' },
      { tier: '2-10', name: 'Serenity', description: 'When you cast a spell you ignore the first -1 penalty from ongoing spells.' },
      { tier: '2-10', name: 'First Aid', description: "Cure Light Wounds is a rote for you, and therefore doesn't count against your limit of granted spells." },
      { tier: '2-10', name: 'Empower', description: 'When you cast a spell, on a 10+ you have the option of choosing from the 7–9 list. If you do, you may choose one of these effects as well: The spell\'s effects are doubled. The spell\'s targets are doubled.' },
      { tier: '2-10', name: 'Divine Intervention', description: 'When you Commune you get 1 hold and lose any hold you already had. Spend that hold when you or an ally takes damage to call on your deity, who intervenes with an appropriate manifestation (a sudden gust of wind, a lucky slip, a burst of light) and negate the damage.' },
      { tier: '2-10', name: 'Penitent', description: 'When you take damage and embrace the pain, you may take +1d4 damage (ignoring armor). If you do, take +1 forward to cast a spell.' },
      { tier: '2-10', name: 'Orison For Guidance', description: 'When you sacrifice something of value to your deity and pray for guidance, your deity tells you what it would have you do. If you do it, mark experience.' },
      { tier: '2-10', name: 'Divine Protection', description: 'When you wear no armor or shield you get 2 armor.' },
      { tier: '2-10', name: 'Devoted Healer', description: 'When you heal someone else of damage, add your level to the amount of damage healed.' },
      { tier: '2-10', name: 'Multiclass Dabbler', description: 'Get one move from another class. Treat your level as one lower for choosing the move.' },
      { tier: '6-10', name: 'Anointed', description: 'Requires: Chosen One. Choose one spell in addition to the one you picked for Chosen One. You are granted that spell as if it was one level lower.' },
      { tier: '6-10', name: 'Apotheosis', description: "The first time you spend time in prayer as appropriate to your god after taking this move, choose a feature associated with your deity (rending claws, wings of sapphire feathers, an all-seeing third eye, etc.). When you emerge from prayer, you permanently gain that physical feature." },
      { tier: '6-10', name: 'Reaper', description: 'When you take time after a conflict to dedicate your victory to your deity and deal with the dead, take +1 forward.' },
      { tier: '6-10', name: 'Providence', description: 'Replaces: Serenity. You ignore the -1 penalty from up to two spells you maintain. If you maintain more than two you take normal penalties.' },
      { tier: '6-10', name: 'Divine Invincibility', description: 'Replaces: Divine Intervention. When you Commune you gain 2 hold and lose any hold you already had. Spend that hold when you or an ally takes damage to call on your deity, who intervenes with an appropriate manifestation and negates the damage.' },
      { tier: '6-10', name: 'Martyr', description: 'Replaces: Penitent. When you take damage and embrace the pain, you may take +1d4 damage (ignoring armor). If you do, take +1 forward to cast a spell and add your level to any damage done or healed by the spell.' },
      { tier: '6-10', name: 'Divine Armor', description: 'Replaces: Divine Protection. When you wear no armor or shield you get 3 armor.' },
      { tier: '6-10', name: 'Greater Empower', description: 'Replaces: Empower. When you cast a spell, on a 10-11 you have the option of choosing from the 7–9 list. If you do, you may choose one of these effects as well. On a 12+ you get to choose one of these effects for free.' },
      { tier: '6-10', name: 'Greater First Aid', description: 'Requires: First Aid. Cure Moderate Wounds is a rote for you, and therefore doesn\'t count against your limit of granted spells.' },
      { tier: '6-10', name: 'Multiclass Dabbler', description: 'Get one move from another class. Treat your level as one lower for choosing the move.' },
    ],
    hasSpells: true,
    spellLabel: 'Cleric Spells',
    spellPlaceholder: '',
    spellList: [
      { tier: 'Rote', name: 'Light', description: 'An item you touch glows with divine light, about as bright as a torch. The spell lasts as long as it is in your presence.' },
      { tier: 'Rote', name: 'Sanctify', description: 'Food or water you hold in your hands while you cast this spell is consecrated by your deity. In addition to now being holy or unholy, the affected substance is purified of any mundane spoilage.' },
      { tier: 'Rote', name: 'Guidance', description: 'The symbol of your deity appears before you and gestures towards the direction or course of action your deity would have you take then disappears. The message is through gesture only.' },
      { tier: '1st Level', name: 'Bless', description: '(ongoing) Your deity smiles upon a combatant of your choice. They take +1 ongoing so long as battle continues and they stand and fight. While this spell is ongoing you take -1 to cast a spell.' },
      { tier: '1st Level', name: 'Cure Light Wounds', description: 'At your touch wounds scab and bones cease to ache. Heal an ally you touch of 1d8 damage.' },
      { tier: '1st Level', name: 'Detect Alignment', description: 'When you cast this spell choose an alignment: Good, Evil, Lawful, or Chaotic. One of your senses is briefly attuned to that alignment. The GM will tell you what here is of that alignment.' },
      { tier: '1st Level', name: 'Cause Fear', description: '(ongoing) Choose a target you can see and a nearby object. The target is afraid of the object so long as you maintain the spell. -1 to cast a spell while ongoing.' },
      { tier: '1st Level', name: 'Magic Weapon', description: '(ongoing) The weapon you hold while casting does +1d4 damage until you dismiss this spell. While this spell is ongoing you take -1 to cast a spell.' },
      { tier: '1st Level', name: 'Sanctuary', description: 'As you cast this spell, you walk the perimeter of an area, consecrating it to your deity. You are alerted whenever someone acts with malice within the sanctuary. Anyone who receives healing within a sanctuary heals +1d4 HP.' },
      { tier: '1st Level', name: 'Speak With Dead', description: 'A corpse converses with you briefly. It will answer any three questions you pose to it to the best of the knowledge it had in life and the knowledge it gained in death.' },
      { tier: '3rd Level', name: 'Animate Dead', description: '(ongoing) You invoke a hungry spirit to possess a recently-dead body and serve you. This creates a zombie that follows your orders to the best of its limited abilities. Treat the zombie as a character with access to only the basic moves. The zombie lasts until it is destroyed or until you end the spell.' },
      { tier: '3rd Level', name: 'Resurrection', description: 'Tell the GM you would like to resurrect a corpse whose soul has not yet fully departed this world. Resurrection is always possible, but the GM will give you one or more (possibly all) of these conditions to fulfill.' },
      { tier: '3rd Level', name: 'Cure Moderate Wounds', description: 'You staunch bleeding and set bones through magic. Heal an ally you touch of 2d8 damage.' },
      { tier: '3rd Level', name: 'Darkness', description: "(ongoing) Choose an area you can see: it's filled with supernatural darkness and shadow. While this spell is ongoing you take -1 to cast a spell." },
      { tier: '3rd Level', name: 'Hold Person', description: 'Choose a person you can see. Until you cast a spell or leave their presence they cannot act except to speak. This effect ends immediately if the target takes damage from any source.' },
    ],
  },

  // ─────────────────────────────────────────────
  {
    id: 'DRUID',
    name: 'Druid',
    hp: '6+Constitution',
    damage: 'd6',
    load: '6+STR',
    startingMoves: `► Born Of The Soil [always]
You learned your magic in a place whose spirits are strong and ancient and they've marked you as one of their own. Choose one of the following. It is the land to which you are attuned—when shapeshifting you may take the shape of any animal who might live in your Land:
□ The Great Forests
□ The Whispering Plains
□ The Vast Desert
□ The Stinking Mire
□ The River Delta
□ The Depths of the Earth
□ The Sapphire Islands
□ The Open Sea
□ The Towering Mountains
□ The Frozen North
□ The Blasted Wasteland
Choose a tell—a physical attribute that marks you as born of the soil.

► By Nature Sustained [always]
You don't need to eat or drink. If a move tells you to mark off a ration just ignore it.

► Spirit Tongue [always]
The grunts, barks, chirps, and calls of the creatures of the wild are as language to you. You can understand any animal native to your land or akin to one whose essence you have studied.

► Shapeshifter [always]
When you call upon the spirits to change your shape, roll+Wis. • On a 10+ hold 3. • On a 7-9 hold 2. • On a miss hold 1 in addition to whatever the GM says.
You may take on the physical form of any species whose essence you have studied or who lives in your land. Spend 1 hold to make that move. Once you're out of hold, you return to your natural form.

► Studied Essence [always]
When you spend time in contemplation of an animal spirit, you may add its species to those you can assume using shapeshifting.`,
    gear: `Some Token of your land. Describe it: ___

Choose your defenses:
□ Hide Armor (1 armor, worn, 1 weight)
□ Wooden Shield (+1 armor, 1 weight)

Choose your armament:
□ Shillelagh (close, 2 weight)
□ Staff (close, two-handed, 1 weight)
□ Spear (close, thrown, near, 1 weight)

Choose one:
□ Adventuring Gear (5 uses, 1 weight)
□ Poultices & Herbs (2 uses, slow, 1 weight)
□ Halfling Pipeleaf (6 uses, 0 weight)`,
    advancedMoves: [
      { tier: '2-10', name: "Hunter's Brother", description: 'Choose one move from the ranger class list.' },
      { tier: '2-10', name: 'Red Of Tooth And Claw', description: 'When you are in an appropriate animal form (something dangerous) increase your damage to d8.' },
      { tier: '2-10', name: 'Communion Of Whispers', description: 'When you spend time in a place, making note of its resident spirits and calling on the spirits of the land, roll+Wis. On a 10+ the vision will be clear and helpful to you, your allies, and the spirits around you. On a 7–9 the vision is unclear, its meaning murky. On a miss, the vision is upsetting, frightening, or traumatizing. The GM will describe it. Take -1 forward.' },
      { tier: '2-10', name: 'Barkskin', description: 'So long as your feet touch the ground you have +1 armor.' },
      { tier: '2-10', name: 'Eyes Of The Tiger', description: 'When you mark an animal (with mud, dirt, or blood) you can see through that animal\'s eyes as if they were your own, no matter what distance separates you. Only one animal at a time may be marked in this way.' },
      { tier: '2-10', name: 'Shed', description: 'When you take damage while shapeshifted you may choose to revert to your natural form to negate the damage.' },
      { tier: '2-10', name: 'Thing-talker', description: 'You see the spirits in the sand, the sea and the stone. You may now apply your spirit tongue, shapeshifting and studied essence to inanimate natural objects (plants and rocks) or creatures made thereof, as well as animals. Thing-talker forms can be exact copies or can be mobile vaguely humanoid-shaped entities.' },
      { tier: '2-10', name: 'Formcrafter', description: 'When you shapeshift choose a stat: you take +1 ongoing to rolls using that stat while shifted. The GM will choose a stat, too: you take -1 ongoing to rolls using that stat while shifted.' },
      { tier: '2-10', name: 'Elemental Mastery', description: 'When you call on the primal spirits of fire, water, earth or air to perform a task for you roll+Wis. • On a 10+ choose two. • On a 7-9 choose one. • On a miss, some catastrophe occurs as a result of your calling.' },
      { tier: '2-10', name: 'Balance', description: 'When you deal damage, take 1 balance. When you touch someone and channel the spirits of life you may spend balance. For each balance spent, heal 1d4 HP.' },
      { tier: '6-10', name: 'Embracing No Form', description: 'When you shapeshift, roll 1d4 and add that total to your hold.' },
      { tier: '6-10', name: "Doppleganger's Dance", description: 'You are able to study the essence of specific individuals to take their exact form, including men, elves, or the like. Suppressing your tell is possible, but if you do, take -1 ongoing until you return to your own form.' },
      { tier: '6-10', name: 'Blood And Thunder', description: 'Replaces: Red Of Tooth And Claw. When you are in an appropriate animal form (something dangerous) increase your damage to d10.' },
      { tier: '6-10', name: 'The Druid Sleep', description: 'When you take this move, the next opportunity that you have safety and time to spend in an appropriate location, you may attune yourself to a new land.' },
      { tier: '6-10', name: 'Weather Weaver', description: 'When you are under open skies when the sun rises the GM will ask you what the weather will be that day. Tell them whatever you like, it comes to pass.' },
      { tier: '6-10', name: 'World-talker', description: 'Requires: Thing-talker. You see the patterns that make up the fabric of the world. You may now apply your spirit tongue, shapeshifting and studied essence moves to pure elements—fire, water, air and earth.' },
      { tier: '6-10', name: 'Formshaper', description: 'Requires: Formcrafter. You may increase your armor by 1 or deal an additional +1d4 damage while in an animal form. Choose which when you shapeshift.' },
      { tier: '6-10', name: 'Healthy Distrust', description: 'Whenever the unclean magic wielded by mortal men causes you to Defy Danger, treat any result of 6- as a 7–9.' },
      { tier: '6-10', name: 'Chimera', description: 'When you shapeshift, you may create a merged form of up to three different shapes. Each feature will grant you a different move to make.' },
      { tier: '6-10', name: "Stalker's Sister", description: 'Choose one move from the ranger class list.' },
    ],
    hasSpells: false,
  },

  // ─────────────────────────────────────────────
  {
    id: 'FIGHTER',
    name: 'Fighter',
    hp: '10+Constitution',
    damage: 'd10',
    load: '12+STR',
    startingMoves: `► Signature Weapon [always]
This is your weapon. There are many like it, but this one is yours. Your weapon is your best friend. It is your life. You master it as you master your life. Your weapon, without you, is useless. Without your weapon, you are useless. You must wield your weapon true.

Choose a base description, all are 2 weight:
□ Sword  □ Spear  □ Axe  □ Flail  □ Hammer  □ Fists

Choose a range that best fits your weapon:
□ Hand  □ Close  □ Reach

Choose two enhancements:
□ Hooks and spikes. +1 damage, but +1 weight.
□ Sharp. +2 piercing.
□ Perfectly weighted. Add precise.
□ Serrated edges. +1 damage.
□ Glows in the presence of one type of creature, your choice.
□ Huge. Add messy and forceful.
□ Versatile. Choose an additional range.
□ Well-crafted. -1 weight.

Choose a look: □ Ancient  □ Blood-stained  □ Unblemished  □ Sinister  □ Ornate

► Bend Bars, Lift Gates [always]
When you use pure strength to destroy an inanimate obstacle, roll+STR. • On a 10+, choose 3. • On a 7-9 choose 2:
• It doesn't take a very long time
• Nothing of value is damaged
• It doesn't make an inordinate amount of noise
• You can fix the thing again without a lot of effort

► Armored [always]
You ignore the clumsy tag on any armor you wear.`,
    gear: `You carry your Signature Weapon.
Dungeon Rations (5 uses, ration, 1 weight)

Choose your defenses:
□ Chainmail (1 armor, worn, 1 weight) and Adventuring Gear (5 uses, 1 weight)
□ Scale Armor (2 armor, worn, clumsy, 3 weight)

Choose two:
□ 2 Healing Potions (0 weight)
□ Shield (+1 armor, 2 weight)
□ Antitoxin (0 weight), Dungeon Rations (5 uses, ration, 1 weight), and Poultices & Herbs (2 uses, slow, 1 weight)
□ 22 coins`,
    advancedMoves: [
      { tier: '2-10', name: 'Merciless', description: 'When you deal damage, deal +1d4 damage.' },
      { tier: '2-10', name: 'Heirloom', description: 'When you consult the spirits that reside within your signature weapon, they will give you an insight relating to the current situation, and might ask you some questions in return, roll+CHA. • On a 10+, the GM will give you good detail. • On a 7-9, the GM will give you an impression.' },
      { tier: '2-10', name: 'Improved Weapon', description: 'Choose one extra enhancement for your signature weapon.' },
      { tier: '2-10', name: 'Blacksmith', description: 'When you have access to a forge you can graft the magical powers of a weapon onto your signature weapon. This process destroys the magical weapon. Your signature weapon gains the magical powers of the destroyed weapon.' },
      { tier: '2-10', name: 'Iron Hide', description: 'You gain +1 armor.' },
      { tier: '2-10', name: 'Armor Mastery', description: 'When you make your armor take the brunt of damage dealt to you, the damage is negated but you must reduce the armor value of your armor or shield (your choice) by 1. The value is reduced each time you make this choice. If the reduction leaves the item with 0 armor it is destroyed.' },
      { tier: '2-10', name: 'Seeing Red', description: 'When you Discern Realities during combat, you take +1.' },
      { tier: '2-10', name: 'Interrogator', description: 'When you parley using threats of violence as leverage, you may use STR instead of CHA.' },
      { tier: '2-10', name: 'Scent Of Blood', description: 'When you Hack & Slash an enemy, your next attack against that same foe deals +1d4 damage.' },
      { tier: '2-10', name: 'Multiclass Dabbler', description: 'Get one move from another class. Treat your level as one lower for choosing the move.' },
      { tier: '6-10', name: 'Bloodthirsty', description: 'Replaces: Merciless. When you deal damage, deal +1d8 damage.' },
      { tier: '6-10', name: "Through Death's Eyes", description: "When you go into battle, roll+WIS. • On a 10+, name someone who will live and someone who will die. • On a 7-9, name someone who will live or someone who will die. Name NPCs, not player characters. The GM will make your vision come true, if it's even remotely possible. • On a 6- you see your own death and consequently take -1 ongoing throughout the battle." },
      { tier: '6-10', name: 'Eye For Weaponry', description: 'When you look over an enemy\'s weaponry, ask the GM how much damage they do.' },
      { tier: '6-10', name: 'Superior Warrior', description: 'When you Hack & Slash, on a 12+ you deal your damage, avoid their attack, and impress, dismay, or frighten your enemy.' },
      { tier: '6-10', name: 'Steel Hide', description: 'Replaces: Iron Hide. You gain +2 armor.' },
      { tier: '6-10', name: 'Armored Perfection', description: 'Replaces: Armor Mastery. When you choose to let your armor take the brunt of damage dealt to you, the damage is negated and you take +1 forward against the attacker, but you must reduce the armor value of your armor or shield (your choice) by 1.' },
      { tier: '6-10', name: 'Evil Eye', description: 'Requires: Seeing Red. When you enter combat, roll+CHA. • On a 10+, hold 2. • On a 7-9, hold 1. Spend your hold to make eye contact with an NPC present, who freezes or flinches and can\'t act until you break it off. • On a 6-, your enemies immediately identify you as their biggest threat.' },
      { tier: '6-10', name: 'Taste Of Blood', description: 'Replaces: Scent Of Blood. When you Hack & Slash an enemy, your next attack against that same foe deals +1d8 damage.' },
      { tier: '6-10', name: 'Multiclass Initiate', description: 'Get a move from another class. Treat your level as one lower for choosing the move.' },
    ],
    hasSpells: false,
  },

  // ─────────────────────────────────────────────
  {
    id: 'IMMOLATOR',
    name: 'Immolator',
    hp: '4+Constitution',
    damage: 'd8',
    load: '9+STR',
    startingMoves: `► Burning Brand [always]
When you conjure a weapon of pure flame, roll+CON. On a 10+ choose two of the following tags, on a 7-9 choose one. You may treat your INT as your STR or DEX in regards to making attacks with this weapon. The weapon always begins with the fiery, touch, dangerous, and 3 uses tags. Each attack with the weapon consumes one use:
• hand
• thrown, near
• +1 damage
• remove the dangerous tag

► Fighting Fire with Fire [always]
When you take damage, and that damage is odd (after armor) the flames within you come to your aid. Roll 1d4 and either add that many uses to your burning brand (if active), take that result forward to summon your burning brand, or reduce the damage by that amount, your choice.

► Give Me Fuel, Give Me Fire [always]
When you gaze intensely into someone's eyes, you may ask their player "what fuels the flames of your desire?" they'll answer with the truth, even if the character does not know or would otherwise keep this hidden.

► Zuko Style [always]
When you bend a flame to your will, roll+WIS. On a 10+ it does as you command, taking the shape and movement you desire for as long as it has fuel on which to burn. On a 7-9 the effect is short-lived, lasting only a moment.

► Hand Crafted [always]
You may use your hands in place of tools and fire to craft metal objects. Mundane weapons, armor and metal jewellery can all be formed from their raw components. You may unmake these things, as well, but to do so without time and safety might require that you Defy Danger first.`,
    gear: `You carry no weapons and need no armor but the flames that burn within you. You begin with:
A Symbol of your sacrifices past, describe it: ___
Adventuring Gear (5 uses, 1 weight)
1 Healing Potion (0 weight)

Choose two:
□ Dungeon Rations (5 uses, ration, 1 weight)
□ 1 Healing Potion (0 weight)
□ 10 Coins`,
    advancedMoves: [
      { tier: '2-10', name: 'Lore Of Flame', description: 'When you stare into a source of fire, looking for answers, roll+WIS. On a hit, the GM will tell you something new and interesting about the current situation. On a 10+, the GM will give you good detail. On a 7-9, the GM will give you an impression. If you already know all there is to know, the GM will tell you that.' },
      { tier: '2-10', name: 'Burns Twice As Bright', description: 'When you channel the flames of fate, you may treat a missed roll as a 7-9 or a 7-9 result as a 10+. This may be a roll you or another character has made. Tell the GM something you\'ve lost; an emotion, a memory or some innate piece of your being. You may not use this move again until you\'ve used Burns Half As Long.' },
      { tier: '2-10', name: 'Burns Half As Long', description: 'You gain this move when you gain Burns Twice As Bright. When you sacrifice a victory to the flames of fate, treat any roll of 10+ as a miss.' },
      { tier: '2-10', name: 'This Killing Fire', description: 'Add the following tags to your options for Burning Brand: messy, forceful, reach, near, far.' },
      { tier: '2-10', name: 'Firebrand', description: 'When you introduce a new idea to an NPC, roll+CHA. On a 10+ They believe the idea to be their own and take to it with fervour On a 7-9, Their passion fades after a day or two. On a miss, they respond negatively, speaking out against the idea.' },
      { tier: '2-10', name: 'Ogdru Jahad', description: 'Gain the Wizard move Ritual. The GM will always tell you what you have to sacrifice to gain the effect you desire.' },
      { tier: '2-10', name: 'Moth To The Flame', description: "When you tempt a weak mind with your inner fire, roll+WIS. On a 10+ their will is suppressed, they'll follow you and do as you desire, so long as nothing startles or surprises them. On a 7-9, the effect is only strong enough to distract or confuse them. On a miss, they become agitated and upset, your fire having sparked their hidden desires." },
      { tier: '2-10', name: 'Burning Bridges', description: 'When you would take your last breath, don\'t. Instead, you may erase one of your Bonds. This is permanent and lowers your total available Bonds forever. You are alive and have 1d6 hp. If you have no more Bonds, take your last breath as normal.' },
      { tier: '2-10', name: 'The Enkindler', description: 'When you bolster the courage of others roll+CHA. On a 10+ they shake off all fear and doubt, becoming brave in an instant. On a 7-9, this effect is fleeting, they realize its superficiality and resort to cowardice after a moment or two. On a miss, they\'re cowed or terrified by your presence.' },
      { tier: '2-10', name: 'Sick Burn', description: 'When you insult an NPC, roll + CHA. On a 10+ you leave them no room to react, they bear your insult and the scorn of all who hear it. On a 7-9 you cross a line, they will have their revenge, someday. On a miss you\'ve gone too far, they blow up here and now.' },
      { tier: '6-10', name: "From Hell's Heart", description: 'When you summon fire with any of your moves, you can replace it with the black fires of hell itself. This fire does not burn with heat and ignores armor, scorching the soul itself. Those creatures without souls cannot be harmed by this type of flame.' },
      { tier: '6-10', name: 'Burning Ring Of Fire', description: 'When you fuse a willing person\'s soul to yours, roll+CHA. On a hit you are bound together, able to sense each other at any distance, as well as sharing your emotional state. On a 7-9, the connection is unstable and dangerous. On a miss, the branding is rejected and you both erase any Bonds you have to each other.' },
      { tier: '6-10', name: 'Fanning The Flames', description: 'Requires: Firebrand. You may apply the effects of your Firebrand move to a group of people - a dozen or so - all at once.' },
      { tier: '6-10', name: 'Watch The World Burn', description: 'When you open a channel to the burning planes and call a firestorm, tell the GM what you\'re sacrificing and roll+WIS. On a hit the sky opens up and fire pours like rain in an area about equal to a small village. On a 10+ you can extinguish the storm with a little effort. On a 7-9 the fires rage out of your control.' },
    ],
    hasSpells: false,
  },

  // ─────────────────────────────────────────────
  {
    id: 'PALADIN',
    name: 'Paladin',
    hp: '10+Constitution',
    damage: 'd10',
    load: '12+STR',
    startingMoves: `► Quest [always]
When you dedicate yourself to a mission through prayer and ritual cleansing, state what you set out to do:
• Slay ___, a great blight on the land.
• Defend ___ from the iniquities that beset them.
• Discover the truth of ___.

Then choose up to two boons:
• An unwavering sense of direction to ___
• Invulnerability to ___ (edged weapons, fire, enchantment, etc.)
• A mark of divine authority.
• Senses that pierce lies.
• A voice that transcends language.
• Freedom from hunger, thirst, and sleep.

The GM will then tell you what vow or vows is required of you to maintain your blessing (Honor, Temperance, Piety, Valor, Truth, Hospitality).

► Lay On Hands (CHA) [always]
When you touch someone, skin to skin, and pray for their well-being, roll+CHA. • On a 10+ you heal 1d8 damage or remove one disease. • On a 7-9, they are healed, but the damage or disease is transferred to you.

► I Am The Law [always]
When you give an NPC an order based on your divine authority, roll+Cha. • On a 7+, they choose one: Do what you say. / Back away cautiously, then flee. / Attack you. • On a 10+, they also take +1 forward against them. • On a miss, they do as they please and you take -1 forward against them.

► Armored [always]
You ignore the clumsy tag on armor you wear.`,
    gear: `Dungeon Rations (5 uses, ration, 1 weight)
Scale Armor (2 armor, worn, clumsy, 3 weight)
Some Mark of Faith (0 weight), describe it: ___

Choose your weapon:
□ Halberd (reach, +1 damage, two-handed, 2 weight)
□ Long Sword (close, +1 damage, 1 weight) and Shield (+1 armor, 2 weight)

Choose one:
□ Adventuring Gear (5 uses, 1 weight)
□ Dungeon Rations (5 uses, ration, 1 weight) and Healing Potion (0 weight)`,
    advancedMoves: [
      { tier: '2-10', name: 'Divine Favor', description: 'Dedicate yourself to a deity. You gain the commune and cast a spell cleric moves. When you select this move, treat yourself as a cleric of level 1 for using spells. Every time you gain a level thereafter, increase your effective cleric level by 1.' },
      { tier: '2-10', name: 'Bloody Aegis', description: "When you take damage you can grit your teeth and accept the blow. If you do you take no damage but instead suffer a debility of your choice. If you already have all six debilities you can't use this move." },
      { tier: '2-10', name: 'Smite', description: 'While on a Quest you deal +1d4 damage.' },
      { tier: '2-10', name: 'Holy Protection', description: 'You get +1 armor while on a Quest.' },
      { tier: '2-10', name: 'Voice Of Authority', description: 'Take +1 to order hirelings.' },
      { tier: '2-10', name: 'Hospitaller', description: 'When you heal an ally, you heal +1d8 damage.' },
      { tier: '2-10', name: 'Exterminatus', description: 'When you speak aloud your promise to defeat an enemy, you deal +2d4 damage against that enemy and -4 damage against anyone else. This effect lasts until the enemy is defeated.' },
      { tier: '2-10', name: 'Charge!', description: 'When you lead the charge into combat, those you lead take +1 forward.' },
      { tier: '2-10', name: 'Staunch Defender', description: 'When you Defend you always get +1 hold, even on a 6-.' },
      { tier: '2-10', name: 'Setup Strike', description: "When you Hack & Slash, choose an ally. Their next attack against your target does +1d4 damage." },
      { tier: '6-10', name: 'Evidence Of Faith', description: 'Requires: Divine Favor. When you see divine magic as it happens, you can ask the GM which deity granted the spell and its effects. Take +1 when acting on the answers.' },
      { tier: '6-10', name: 'Holy Smite', description: 'Replaces: Smite. While on a Quest you deal +1d8 damage.' },
      { tier: '6-10', name: 'Ever Onward', description: 'Replaces: Charge!. When you lead the charge into combat, those you lead take +1 forward and +2 armor forward.' },
      { tier: '6-10', name: 'Impervious Defender', description: 'Replaces: Staunch Defender. When you Defend you always get +1 hold, even on a 6-. When you get a 12+ to defend instead of getting hold the nearest attacking creature is stymied giving you a clear advantage.' },
      { tier: '6-10', name: 'Tandem Strike', description: "Replaces: Setup Strike. When you Hack & Slash, choose an ally. Their next attack against your target does +1d4 damage and they take +1 forward against them." },
      { tier: '6-10', name: 'Divine Protection', description: 'Replaces: Holy Protection. You get +2 armor while on a Quest.' },
      { tier: '6-10', name: 'Divine Authority', description: "Replaces: Voice Of Authority. Take +1 to order hirelings. When you roll a 12+ the hireling transcends their moment of fear and doubt and carries out your order with particular effectiveness or efficiency." },
      { tier: '6-10', name: 'Perfect Hospitaller', description: 'Replaces: Hospitaller. When you heal an ally, you heal +2d8 damage.' },
      { tier: '6-10', name: 'Indomitable', description: 'When you suffer a debility (even through Bloody Aegis) take +1 forward against whatever caused it.' },
      { tier: '6-10', name: 'Perfect Knight', description: 'When you Quest you choose three boons instead of two.' },
    ],
    hasSpells: false,
  },

  // ─────────────────────────────────────────────
  {
    id: 'RANGER',
    name: 'Ranger',
    hp: '8+Constitution',
    damage: 'd8',
    load: '11+STR',
    startingMoves: `► Animal Companion [always]
You have a supernatural connection with a loyal animal. You can't talk to it per se but it always acts as you wish it to. Name your animal companion.

Choose a species: Wolf, Cougar, Bear, Eagle, Dog, Hawk, Cat, Owl, Pigeon, Rat, Mule

Choose a base: (affects Ferocity/Cunning/Instinct/Armor)
□ Ferocity +2, Cunning +1, Instinct +1, 1 Armor
□ Ferocity +2, Cunning +2, Instinct +1, 0 Armor
□ Ferocity +1, Cunning +2, Instinct +1, 1 Armor
□ Ferocity +3, Cunning +1, Instinct +2, 1 Armor

Choose as many strengths as its Ferocity:
Fast, Burly, Huge, Calm, Adaptable, Tireless, Quick Reflexes, Camouflage, Ferocious, Intimidating, Keen Senses, Stealthy

Choose as many additional trainings as its Cunning:
Hunt, Search, Scout, Guard, Labor, Travel, Fight Monsters, Perform

Choose as many weaknesses as its Instinct:
Flighty, Savage, Slow, Broken, Frightening, Forgetful, Stubborn, Lame

► Hunt & Track (WIS) [always]
When you follow a trail of clues left behind by passing creatures, roll+WIS. • On a 7+, you follow the creature's trail until there's a significant change in its direction or mode of travel. • On a 10+, you also choose 1: Gain a useful bit of information about your quarry. / Determine what caused the trail to end.

► Called Shot [always]
When you attack a defenseless or surprised enemy at range, you can choose to deal your damage or name your target and roll+DEX:
• Head: 10+: As 7-9, plus your damage / 7-9: They do nothing but stand and drool for a few moments.
• Arms: 10+: As 7-9, plus your damage / 7-9: They drop anything they're holding.
• Legs: 10+: As 7-9, plus your damage / 7-9: They're hobbled and slow moving.

► Command [always]
When you work with your animal companion on something it's trained in:
• and you attack the same target, add its ferocity to your damage
• and you track, add its cunning to your roll
• and you take damage, add its armor to your armor
• and you Discern Realities, add its cunning to your roll
• and you Parley, add its cunning to your roll
• and someone Interferes with you, add its instinct to their roll`,
    gear: `Dungeon Rations (5 uses, ration, 1 weight)
Leather Armor (1 armor, worn, 1 weight)
Bundle Of Arrows (3 ammo, 1 weight)

Choose your armament:
□ Hunter's Bow (near, far, 1 weight) and Short Sword (close, 1 weight)
□ Hunter's Bow (near, far, 1 weight) and Spear (reach, 1 weight)

Choose one:
□ Adventuring Gear (5 uses, 1 weight) and Dungeon Rations (5 uses, ration, 1 weight)
□ Adventuring Gear (5 uses, 1 weight) and Bundle Of Arrows (3 ammo, 1 weight)`,
    advancedMoves: [
      { tier: '2-10', name: 'Half-elven', description: 'Somewhere in your lineage lies mixed blood. You gain the elf starting move if you took the human one at character creation or vice versa. You may take this move only if it is your first advancement.' },
      { tier: '2-10', name: 'Wild Empathy', description: 'You can speak with and understand animals.' },
      { tier: '2-10', name: 'Familiar Prey', description: 'When you Spout Lore about a monster you use WIS instead of INT.' },
      { tier: '2-10', name: "Viper's Strike", description: 'When you strike an enemy with two weapons at once, add an extra 1d4 damage for your off-hand strike.' },
      { tier: '2-10', name: 'Camouflage', description: 'When you keep still in natural surroundings, enemies never spot you until you make a movement.' },
      { tier: '2-10', name: "Man's Best Friend", description: "When you allow your animal companion to take a blow that was meant for you, the damage is negated and your animal companion's ferocity becomes 0. If its ferocity is already 0 you can't use this ability." },
      { tier: '2-10', name: 'Blot Out The Sun', description: 'When you Volley you may spend extra ammo before rolling. For each point of ammo spent you may choose an extra target. Roll once and apply damage to all targets.' },
      { tier: '2-10', name: 'Well-trained', description: 'Choose another training for your animal companion.' },
      { tier: '2-10', name: 'God Amidst The Wastes', description: 'Dedicate yourself to a deity. You gain the commune and cast a spell cleric moves. Treat yourself as a cleric of level 1 for using spells. Every time you gain a level thereafter, increase your effective cleric level by 1.' },
      { tier: '2-10', name: 'Follow Me', description: 'When you Undertake A Perilous Journey you can take two roles. You make a separate roll for each.' },
      { tier: '2-10', name: 'A Safe Place', description: 'When you set the watch for the night, everyone takes +1 to Take Watch.' },
      { tier: '6-10', name: 'Wild Speech', description: 'Replaces: Wild Empathy. You can speak with and understand any non-magical, non-planar creature.' },
      { tier: '6-10', name: "Hunter's Prey", description: 'Replaces: Familiar Prey. When you Spout Lore about a monster you use WIS instead of INT. On a 12+, in addition to the normal effects, you get to ask the GM any one question about the subject.' },
      { tier: '6-10', name: "Viper's Fangs", description: "Replaces: Viper's Strike. When you strike an enemy with two weapons at once, add an extra 1d8 damage for your off-hand strike." },
      { tier: '6-10', name: "Smaug's Belly", description: 'When you know your target\'s weakest point your arrows have 2 piercing.' },
      { tier: '6-10', name: 'Strider', description: 'Replaces: Follow Me. When you Undertake A Perilous Journey you can take two roles. Roll twice and use the better result for both roles.' },
      { tier: '6-10', name: 'A Safer Place', description: 'Replaces: A Safe Place. When you set the watch for the night, everyone takes +1 to Take Watch. After a night in camp when you set the watch everyone takes +1 forward.' },
      { tier: '6-10', name: 'Observant', description: 'When you hunt and track, on a hit you may also ask one question about the creature you are tracking from the Discern Realities list for free.' },
      { tier: '6-10', name: 'Special Trick', description: 'Choose a move from another class. So long as you are working with your animal companion you have access to that move.' },
      { tier: '6-10', name: 'Unnatural Ally', description: 'Your animal companion is a monster, not an animal. Describe it. Give it +2 ferocity and +1 instinct, plus a new training.' },
    ],
    hasSpells: false,
  },

  // ─────────────────────────────────────────────
  {
    id: 'THIEF',
    name: 'Thief',
    hp: '6+Constitution',
    damage: 'd8',
    load: '9+STR',
    startingMoves: `► Trap Expert [always]
When you spend a moment to survey a dangerous area, roll+DEX. • On a 10+, hold 3. • On a 7-9, hold 1. Spend your hold as you walk through the area to ask these questions:
• Is there a trap here and if so, what activates it?
• What does the trap do when activated?
• What else is hidden here?

► Tricks Of The Trade [always]
When you pick locks or pockets or disable traps, roll+DEX. • On a 10+, you do it, no problem. • On a 7-9, you still do it, but the GM will offer you two options between suspicion, danger, or cost.

► Backstab [always]
When you attack a surprised or defenseless enemy with a melee weapon, you can choose to deal your damage or roll+DEX. • On a 10+, choose two. • On a 7-9, choose one:
• You don't get into melee with them
• You deal your damage+1d6
• You create an advantage, +1 forward to you or an ally acting on it
• Reduce their armor by 1 until they repair it

► Flexible Morals [always]
When someone tries to detect your alignment you can tell them any alignment you like.

► Poisoner [always]
You've mastered the care and use of a poison. Choose a poison from the list below; that poison is no longer dangerous for you to use. You also start with three uses of the poison you choose. Whenever you have time to gather materials and a safe place to brew you can make three uses of the poison you choose for free.
• Oil of Tagit (applied): The target falls into a light sleep.
• Bloodweed (touch): The target deals -1d4 damage ongoing until cured.
• Goldenroot (applied): The target treats the next creature they see as a trusted ally, until proved otherwise.
• Serpent's Tears (touch): Anyone dealing damage to the target rolls twice and takes the better result.`,
    gear: `Dungeon Rations (5 uses, ration, 1 weight)
Leather Armor (1 armor, worn, 1 weight)
3 uses of your chosen Poison
10 Coins

Choose your arms:
□ Dagger (hand, 1 weight) and Short Sword (close, 1 weight)
□ Rapier (close, precise, 1 weight)

Choose a ranged weapon:
□ 3 Throwing Daggers (thrown, near, 0 weight)
□ Ragged Bow (near, 2 weight) and Bundle of Arrows (3 ammo, 1 weight)

Choose one:
□ Adventuring Gear (5 uses, 1 weight)
□ Healing Potion (0 weight)`,
    advancedMoves: [
      { tier: '2-10', name: 'Cheap Shot', description: 'When using a precise or hand weapon, your Backstab deals an extra +1d6 damage.' },
      { tier: '2-10', name: 'Cautious', description: 'When you use Trap Expert you always get +1 hold, even on a 6-.' },
      { tier: '2-10', name: 'Wealth And Taste', description: "When you make a show of flashing around your most valuable possession, choose someone present. They will do anything they can to obtain your item or one like it." },
      { tier: '2-10', name: 'Shoot First', description: "You're never caught by surprise. When an enemy would get the drop on you, you get to act first instead." },
      { tier: '2-10', name: 'Underdog', description: "When you're outnumbered, you have +1 armor." },
      { tier: '2-10', name: 'Poison Master', description: "After you've used a poison once it's no longer dangerous for you to use." },
      { tier: '2-10', name: 'Envenom', description: "You can apply even complex poisons with a pinprick. When you apply a poison that's not dangerous for you to use to your weapon it's touch instead of applied." },
      { tier: '2-10', name: 'Brewer', description: 'When you have time to gather materials and a safe place to brew you can create three doses of any one poison you\'ve used before.' },
      { tier: '2-10', name: 'Connections', description: 'When you put out word to the criminal underbelly about something you want or need, roll+CHA. • On a 10+, someone has it, just for you. • On a 7-9, you\'ll have to settle for something close or it comes with strings attached, your call.' },
      { tier: '6-10', name: 'Dirty Fighter', description: 'Replaces: Cheap Shot. When using a precise or hand weapon, your Backstab deals an extra +1d8 damage and all other attacks deal +1d4 damage.' },
      { tier: '6-10', name: 'Extremely Cautious', description: "Replaces: Cautious. When you use Trap Expert you always get +1 hold, even on a 6-. On a 12+ you get 3 hold and the next time you come near a trap the GM will immediately tell you what it does, what triggers it, who set it, and how you can use it to your advantage." },
      { tier: '6-10', name: 'Serious Underdog', description: "Replaces: Underdog. You have +1 armor. When you're outnumbered, you have +2 armor instead." },
      { tier: '6-10', name: 'Evasion', description: 'When you Defy Danger on a 12+, you transcend the danger. You not only do what you set out to, but the GM will offer you a better outcome, true beauty, or a moment of grace.' },
      { tier: '6-10', name: 'Heist', description: 'When you take time to make a plan to steal something, name the thing you want to steal and ask the GM these questions. When acting on the answers you and your allies take +1 forward: Who will notice it\'s missing? / What\'s its most powerful defense? / Who will come after it? / Who else wants it?' },
      { tier: '6-10', name: 'Alchemist', description: 'Replaces: Brewer. When you have time to gather materials and a safe place to brew you can create three doses of any poison you\'ve used before. Alternately you can describe the effects of a poison you\'d like to create. The GM will tell you that you can create it, but with one or more caveats.' },
      { tier: '6-10', name: 'Escape Route', description: "When you're in too deep and need a way out, name your escape route and roll+DEX. • On a 10+ you're gone. • On a 7-9 you can stay or go, but if you go it costs you." },
      { tier: '6-10', name: 'Disguise', description: 'When you have time and materials you can create a disguise that will fool anyone into thinking you\'re another creature of about the same size and shape.' },
      { tier: '6-10', name: 'Strong Arm, True Aim', description: "You can throw any melee weapon, using it to volley. A thrown melee weapon is gone; you can never choose to reduce ammo on a 7-9." },
    ],
    hasSpells: false,
  },

  // ─────────────────────────────────────────────
  {
    id: 'WIZARD',
    name: 'Wizard',
    hp: '4+Constitution',
    damage: 'd4',
    load: '7+STR',
    startingMoves: `► Cast A Spell (INT) [always]
When you release a spell you've prepared, roll+INT. • On a 10+ the spell is successfully cast and you may cast the spell again later. • On a 7-9 the spell is cast, but choose one: You draw unwelcome attention or put yourself in a spot. The GM will tell you how. / The spell disturbs the fabric of reality as it is cast; take -1 ongoing to cast a spell until the next time you Prepare Spells. / After it is cast, the spell is forgotten. You cannot cast the spell again until you prepare spells.

► Prepare Spells [always]
When you spend uninterrupted time (an hour or so) in quiet contemplation of your spellbook, you: Lose any spells you already prepared. Prepare new spells chosen from your spellbook whose total levels don't exceed your own level +1. Prepare your cantrips which never count against your limit.

► Spellbook [always]
You have mastered several spells and inscribed them in your spellbook. You start out with three first level spells, as well as all your cantrips. Whenever you gain a level, you inscribe a new spell of your level or lower. Your spellbook is 1 weight.

► Spell Defense [always]
You may end any ongoing spell immediately and use the energy of its dissipation to deflect an oncoming attack. The spell ends and you subtract its level from the damage done to you.

► Ritual [always]
When you draw on a place of power to create a magical effect, tell the GM what you're trying to achieve. Ritual effects are always possible, but the GM will give you one to four conditions: It's going to take days/weeks/months. / First you must ___. / You'll need help from ___. / It will require a lot of money. / The best you can do is a lesser version, unreliable and limited. / You and your allies will risk danger from ___. / You'll have to disenchant ___ to do it.`,
    gear: `Spellbook (1 weight)
Dungeon Rations (5 uses, ration, 1 weight)

Choose your defenses:
□ Leather Armor (1 armor, worn, 1 weight)
□ Bag of Books (5 uses, 2 weight) and 3 Healing Potions

Choose your weapon:
□ Dagger (hand, 1 weight)
□ Staff (close, two-handed, 1 weight)

Choose one:
□ Healing Potion (0 weight)
□ 3 Antitoxin (0 weight)`,
    advancedMoves: [
      { tier: '2-10', name: 'Prodigy', description: 'Choose a spell. You prepare that spell as if it were one level lower.' },
      { tier: '2-10', name: 'Empowered Magic', description: 'When you cast a spell, on a 10+ you have the option of choosing from the 7–9 list. If you do, you may additionally choose one of the following effects: The spell\'s effects are maximized. / The spell\'s targets are doubled.' },
      { tier: '2-10', name: 'Fount Of Knowledge', description: 'When you Spout Lore about something no one else has any clue about, take +1.' },
      { tier: '2-10', name: 'Know-It-All', description: "When another player's character comes to you for advice and you tell them what you think is best, they get +1 forward when following your advice and you mark experience if they do." },
      { tier: '2-10', name: 'Expanded Spellbook', description: 'Add a new spell from the spell list of any class to your spellbook.' },
      { tier: '2-10', name: 'Enchanter', description: 'When you have time and safety with a magic item you may ask the GM what it does. The GM will answer truthfully.' },
      { tier: '2-10', name: 'Logical', description: 'When you use strict deduction to analyse your surroundings, you can Discern Realities with INT instead of WIS.' },
      { tier: '2-10', name: 'Arcane Ward', description: 'As long as you have at least one prepared spell of first level or higher, you have +2 armor.' },
      { tier: '2-10', name: 'Counterspell', description: 'When you attempt to counter an arcane spell that will otherwise affect you, stake one of your prepared spells on the defense and roll+INT. On a 10+, the spell is countered and has no effect on you. On a 7-9, the spell is countered and you forget the spell you staked.' },
      { tier: '2-10', name: 'Quick Study', description: 'When you see the effects of an arcane spell, ask the GM the name of the spell and its effects. You take +1 when acting on the answers.' },
      { tier: '6-10', name: 'Master', description: 'Requires: Prodigy. Choose one spell in addition to the one you picked for Prodigy. You prepare that spell as if it were one level lower.' },
      { tier: '6-10', name: 'Greater Empowered Magic', description: 'Replaces: Empowered Magic. When you cast a spell, on a 10-11 you have the option of choosing from the 7–9 list. If you do, you may additionally choose one of the following effects. On a 12+ you get to choose one of these effects for free.' },
      { tier: '6-10', name: "Enchanter's Soul", description: "Requires: Enchanter. When you have time and safety with a magic item in a place of power you can empower that item so that the next time you use it its effects are amplified, the GM will tell you exactly how." },
      { tier: '6-10', name: 'Highly Logical', description: 'Replaces: Logical. When you use strict deduction to analyse your surroundings, you can Discern Realities with INT instead of WIS. On a 12+ you get to ask the GM any three questions, not limited by the list.' },
      { tier: '6-10', name: 'Mystical Puppet Strings', description: 'When you use magic to control a person\'s actions, they have no memory of what you had them do and bear you no ill will.' },
      { tier: '6-10', name: 'Arcane Armor', description: 'Replaces: Arcane Ward. As long as you have at least one prepared spell of first level or higher, you have +4 armor.' },
      { tier: '6-10', name: 'Protective Counter', description: 'Requires: Counterspell. When an ally within sight of you is affected by an arcane spell, you can counter it as if it affected you. If the spell affects multiple allies you must counter for each ally separately.' },
      { tier: '6-10', name: 'Ethereal Tether', description: 'When you have time with a willing or helpless subject you can craft an ethereal tether with them. You perceive what they do and can discern realities about them or their surroundings, no matter the distance.' },
      { tier: '6-10', name: 'Spell Augmentation', description: 'When you deal damage to a creature, you can shunt a spell\'s energy into them—end one of your ongoing spells and add the spell\'s level to the damage dealt.' },
      { tier: '6-10', name: 'Self-Powered', description: 'When you have time, arcane materials, and a safe space, you can create your own place of power. Describe to the GM what kind of power it is and how you\'re binding it to this place.' },
    ],
    hasSpells: true,
    spellLabel: 'Wizard Spells',
    spellPlaceholder: '',
    spellList: [
      { tier: 'Cantrip', name: 'Light', description: 'An item you touch glows with arcane light, about as bright as a torch. It gives off no heat or sound and requires no fuel. The spell lasts as long as it is in your presence.' },
      { tier: 'Cantrip', name: 'Unseen Servant', description: 'You conjure a simple invisible construct that can do nothing but carry items. It has Load 3 and carries anything you hand to it. An unseen servant that takes damage or leaves your presence is immediately dispelled.' },
      { tier: 'Cantrip', name: 'Prestidigitation', description: 'You perform minor tricks of true magic. If you touch an item as part of the casting you can make cosmetic changes to it: clean it, soil it, cool it, warm it, flavor it, or change its color. You can also create minor illusions no bigger than yourself.' },
      { tier: '1st Level', name: 'Contact Spirits', description: '(Summoning) Name the spirit you wish to contact (or leave it to the GM). You pull that creature through the planes, just close enough to speak to you. It is bound to answer any one question you ask to the best of its ability.' },
      { tier: '1st Level', name: 'Detect Magic', description: '(Divination) One of your senses is briefly attuned to magic. The GM will tell you what here is magical.' },
      { tier: '1st Level', name: 'Magic Missile', description: '(Evocation) Projectiles of pure magic spring from your fingers. Deal 2d4 damage to one target.' },
      { tier: '1st Level', name: 'Charm Person', description: '(Enchantment, ongoing) The person (not beast or monster) you touch while casting this spell counts you as a friend until they take damage or you prove otherwise. While the spell is ongoing you take -1 to cast a spell.' },
      { tier: '1st Level', name: 'Invisibility', description: '(Illusion, ongoing) Touch an ally: nobody can see them. They're invisible! The spell persists until the target attacks or you dismiss the effect. While the spell is ongoing you cannot cast a spell.' },
      { tier: '1st Level', name: 'Telepathy', description: '(Divination, ongoing) You form a telepathic bond with a single person you touch, enabling you to converse with that person through your thoughts. You can only have one telepathic bond at a time.' },
      { tier: '1st Level', name: 'Alarm', description: 'Walk a wide circle as you cast this spell. Until you prepare spells again your magic will alert you if a creature crosses that circle. Even if you are asleep, the spell will shake you from your slumber.' },
      { tier: '3rd Level', name: 'Dispel Magic', description: 'Choose a spell or magic effect in your presence: this spell rips it apart. Lesser spells are ended, powerful magic is just reduced or dampened so long as you are nearby.' },
      { tier: '3rd Level', name: 'Visions Through Time', description: '(Divination) Cast this spell and gaze into a reflective surface to see into the depths of time. The GM will reveal the details of a grim portent to you—a bleak event that will come to pass without your intervention.' },
      { tier: '3rd Level', name: 'Fireball', description: '(Evocation) You evoke a mighty ball of flame that envelops your target and everyone nearby, inflicting 2d6 damage which ignores armor.' },
      { tier: '3rd Level', name: 'Mimic', description: '(ongoing) You take the form of someone you touch while casting this spell. Your physical characteristics match theirs exactly but your behavior may not. This change persists until you take damage or choose to return to your own form. While this spell is ongoing you lose access to all your wizard moves.' },
      { tier: '3rd Level', name: 'Mirror Image', description: '(Illusion) You create an illusory image of yourself. When you are attacked, roll a d6. On a 4, 5, or 6 the attack hits the illusion instead, the image then dissipates and the spell ends.' },
      { tier: '3rd Level', name: 'Sleep', description: "(Enchantment) 1d4 enemies you can see of the GM's choice fall asleep. Only creatures capable of sleeping are affected. They awake as normal: loud noises, jolts, pain." },
    ],
  },
];

export const getDWClass = (id) => DW_CLASSES.find(c => c.id === id);
