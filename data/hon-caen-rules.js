window.HTS_RULES = window.HTS_RULES || {};
HTS_RULES["hon-caen"] = {
"game": "hon",
"box": "caen",
"title": "Rules",
"chapters": [
{
"n": 1,
"title": "Battlefield"
},
{
"n": 2,
"title": "Special abilities"
},
{
"n": 3,
"title": "Recruitment options"
},
{
"n": 4,
"title": "Aviation rules"
}
],
"sections": [
{
"id": "1.1",
"title": "Terrain effects",
"chapter": 1
},
{
"id": "1.2",
"title": "Terrain elements",
"chapter": 1
},
{
"id": "1.3",
"title": "Buildings",
"chapter": 1
},
{
"id": "1.4",
"title": "Half-squares",
"chapter": 1
},
{
"id": "2.1",
"title": "Change of state",
"chapter": 2
},
{
"id": "2.2",
"title": "Movement special abilities",
"chapter": 2
},
{
"id": "2.3",
"title": "Firing special abilities",
"chapter": 2
},
{
"id": "2.4",
"title": "Defense special abilities",
"chapter": 2
},
{
"id": "2.5",
"title": "Command special abilities",
"chapter": 2
},
{
"id": "3.1",
"title": "Gear options",
"chapter": 3
},
{
"id": "3.2",
"title": "Character traits",
"chapter": 3
},
{
"id": "3.3",
"title": "Orders options",
"chapter": 3
},
{
"id": "3.4",
"title": "Support options",
"chapter": 3
},
{
"id": "4",
"title": "Aviation rules",
"chapter": 4
}
],
"chunks": [
{
"sec": "1.1",
"sub": "Adjacency effects of line elements",
"page": 4,
"text": "Depending on the type of terrain, the Line may affect the Movement of crossing units. A unit adjacent to a Line, red or yellow, with Terrain Effects, ignores the adjacent Line's effects when firing across it (A in the figure). Terrain Effects associated with a Line that reduce LoS or provide a Defensive Bonus affect only the Firing Actions of units that are not adjacent to it (B and C).\nWarning: if a Terrain Effect related to movement is associated with a Line, that effect is applied when the unit crosses the Line.",
"term": null,
"id": 0,
"figs": [
{
"img": "img/hon/caen/rules/p4-1.webp",
"w": 680,
"h": 456
}
]
},
{
"sec": "1.1",
"sub": "Obstacles (reminder)",
"page": 4,
"text": "Obstacles block or reduce LoS.",
"term": null,
"id": 1,
"figs": [
{
"img": "img/hon/caen/rules/p4-2.webp",
"w": 573,
"h": 427
}
]
},
{
"sec": "1.1",
"sub": "Elevated Position",
"page": 4,
"text": "Due to the steep down-angle, a unit in an Elevated Position may not fire at units outside an Elevated Position (on the ground) if their LoS crosses any other square of the Elevated Position in which it resides.\nThe unit in an Elevated Position is less hindered by Obstacles that block or reduce LoS. When its LoS crosses a Terrain Element or vehicle, only the square directly after the Obstacle is affected (A). If the LoS crosses more than one square of an Obstacle, all modifiers are applied (B). The squares beyond the Obstacle are not affected (C). Infantry Units never block the LoS of a unit in an Elevated Position (D).\nIf a unit in an Elevated Position can target an opposing unit, then that opposing unit can target it back. Any of the Obstacle restrictions apply in both directions (A), unless that Obstacle effect is limited by Adjacency.\nWhen a unit in an Elevated Position takes a Firing Action at another Elevated Position, only other elements with the Elevated Position effect, or units in an Elevated Position, can block that LoS. Nothing at ground level can interfere.\nNote, for Battle Pack #3 Windsor & Jupiter: a unit in an Elevated Position ignores Contour Lines but not Elevated Lines.",
"term": "Elevated Position",
"id": 2,
"figs": [
{
"img": "img/hon/caen/rules/p4-3.webp",
"w": 677,
"h": 746
}
]
},
{
"sec": "1.2",
"sub": "Crater",
"page": 5,
"text": "Defensive Bonus (Infantry). Prohibited for Light Vehicles.\nConvenient for hiding during a fight, craters offer decent cover to any infantryman able to brave the opaque and cold puddle at the bottom.",
"term": "Crater",
"id": 3,
"figs": [
{
"img": "img/hon/caen/rules/p5-1.webp",
"w": 253,
"h": 262
}
]
},
{
"sec": "1.2",
"sub": "Rubble",
"page": 5,
"text": "Defensive Bonus (Infantry). Prohibited for Light Vehicles. Difficult Passage: Obstacles.\nThe Allied and German bombings did not spare the city of Caen. So be careful with your ankles and tracks.",
"term": "Rubble",
"id": 4,
"figs": [
{
"img": "img/hon/caen/rules/p5-2.webp",
"w": 253,
"h": 260
}
]
},
{
"sec": "1.2",
"sub": "River",
"page": 5,
"text": "Water.\nEven if the majority of the Normandy offensive took place during the summer, crossing a river in full military kit was never the best solution.",
"term": "River",
"id": 5,
"figs": [
{
"img": "img/hon/caen/rules/p5-3.webp",
"w": 253,
"h": 261
}
]
},
{
"sec": "1.2",
"sub": "Difficult terrain (mud)",
"page": 5,
"text": "Difficult Passage. Prohibited for Vehicles.\nThese are mud puddles or soggy areas. The Germans had flooded large portions of Normandy in anticipation of Allied airdrops.",
"term": "Mud",
"id": 6,
"figs": [
{
"img": "img/hon/caen/rules/p5-4.webp",
"w": 253,
"h": 260
}
]
},
{
"sec": "1.2",
"sub": "Low barricade",
"page": 5,
"text": "Line. Obstacle (Infantry).\nLow walls, barriers, fences, all those little things that punctuate a landscape and get in the way when you want to shoot things.",
"term": "Low barricade",
"id": 7,
"figs": [
{
"img": "img/hon/caen/rules/p5-5.webp",
"w": 253,
"h": 89
}
]
},
{
"sec": "1.3",
"sub": "Modular buildings",
"page": 5,
"text": "Defensive Bonus. Prohibited for Vehicles. Obstacles. Structure.\nThe new buildings in Battle for Caen can be composed of several parts. Each part is considered an independent Terrain Element and can be Destroyed separately (see Destruction, p.9).\nPartially Destroyed Modular Buildings may have different Terrain Effects affecting the same square. When resolving a Firing Action, Movement Action or Assault, apply any Terrain Effects crossed by the LoS or Movement Action.",
"term": "Modular building",
"id": 8,
"figs": [
{
"img": "img/hon/caen/rules/p5-6.webp",
"w": 272,
"h": 390
},
{
"img": "img/hon/caen/rules/p5-7.webp",
"w": 553,
"h": 476
}
]
},
{
"sec": "1.3",
"sub": "Buildings, rooms and zone of control",
"page": 5,
"text": "A unit's ZoC is limited by a Building's walls and windows.\nA unit's Zone of Control adjacent to a blue arrow pointing into or out of a building extends to the squares pointed to by the arrow, and may therefore prevent entry and exit from the building.\nSome walls block the unit's LoS and thus exclude the adjacent squares from the unit's ZoC.",
"term": null,
"id": 9,
"figs": [
{
"img": "img/hon/caen/rules/p5-8.webp",
"w": 603,
"h": 540
},
{
"img": "img/hon/caen/rules/p5-9.webp",
"w": 663,
"h": 364
}
]
},
{
"sec": "1.3",
"sub": "Buildings, rooms and zone of control, example",
"page": 6,
"text": "Unit A exerts a ZoC on the squares and half-squares adjacent to it. Unit B can either leave the building, Assault Unit A, or move to the right wing of the building.",
"term": null,
"id": 10,
"figs": [
{
"img": "img/hon/caen/rules/p6-1.webp",
"w": 539,
"h": 467
}
]
},
{
"sec": "1.3",
"sub": "Buildings, rooms and firing actions",
"page": 6,
"text": "Some buildings may be divided into several rooms by red markings. If a Line of Sight is clear between two units, a Firing Action is possible. A unit that takes a Firing Action or launches an Assault against another unit located in a different room than itself has its target benefit from the Defensive Bonus provided by the building.",
"term": null,
"id": 11,
"figs": [
{
"img": "img/hon/caen/rules/p6-2.webp",
"w": 675,
"h": 354
}
]
},
{
"sec": "1.3",
"sub": "Grenades and buildings",
"page": 6,
"text": "The example shows all the Interspaces (outside the Building) as well as the valid paths into rooms (inside the Building), marked in green.",
"term": null,
"id": 12,
"figs": [
{
"img": "img/hon/caen/rules/p6-3.webp",
"w": 627,
"h": 507
}
]
},
{
"sec": "1.3",
"sub": "Tossing a grenade from a building into another building",
"page": 6,
"text": "It is not possible to throw a grenade from one building into another, even if they are adjacent.",
"term": null,
"id": 13,
"figs": [
{
"img": "img/hon/caen/rules/p6-4.webp",
"w": 580,
"h": 326
}
]
},
{
"sec": "1.3",
"sub": "Grenades and building rooms",
"page": 6,
"text": "An explosion that occurs in the room of a building with several rooms is contained by the walls that delimit it. The walls are indicated by the red markings.",
"term": null,
"id": 14,
"figs": [
{
"img": "img/hon/caen/rules/p6-5.webp",
"w": 677,
"h": 367
}
]
},
{
"sec": "1.3",
"sub": "Chimney",
"page": 6,
"text": "The Chimney is composed of two parts. One is printed on the battlefield while its Secondary Tile is placed next to it.\nWhen climbing to the upper part of the Chimney's Secondary Tile, you must move from the battlefield square with a stairs symbol to the square on the Secondary Tile with a stairs symbol. Take the unit and place it on the square with the stairs symbol on the Secondary Tile of the Chimney. It must stop its Movement Action on this square.",
"term": "Chimney",
"id": 15,
"figs": [
{
"img": "img/hon/caen/rules/p6-6.webp",
"w": 677,
"h": 311
}
]
},
{
"sec": "1.3",
"sub": "Chimney, firing and LoS",
"page": 7,
"text": "A unit on either stairs square may perform a Firing Action on a unit located on the other linked stairs square (either above or below it).\nThe targeted unit gets the Defensive Bonus of the floor it is on.\nA unit on a stairs square can throw a grenade at the floor below or above.\nTo calculate the LoS of a unit located on the Chimney's Secondary Tile, use the corresponding red dot present on the main tile placed on the battlefield. The range is calculated from the red dot by counting only the squares of the General Grid. LoS ignores the Chimney's circle red wall markings.",
"term": null,
"id": 16,
"figs": [
{
"img": "img/hon/caen/rules/p7-1.webp",
"w": 223,
"h": 509
}
]
},
{
"sec": "1.3",
"sub": "Destroying the chimney",
"page": 7,
"text": "To Destroy the Chimney, the unit performing the Firing Action must have a LoS to the red dot (which is not considered an Elevated Position). The Destruction markers are placed on the Chimney's Secondary Tile. It is not possible to use the Indirect Fire Special Ability to inflict Damage to the Chimney. If the Firing Action is directed against a unit present on the Chimney's Secondary Tile, the rules of Elevated Position apply.\nWhen the Chimney has received the required number of Destruction markers, turn over its Secondary Tile to its Ruined side and place it in its location on the board. Any units present in the Chimney are also Destroyed.",
"term": null,
"id": 17
},
{
"sec": "1.3",
"sub": "Ruins",
"page": 7,
"text": "Defensive Bonus. Prohibited for Vehicles. Obstacles. Structure.\nHeaps of bricks, stones, and tangled girders, the ruins have bloomed in Normandy like mushrooms in autumn. Saint Lô has even received the title of \"Capital of the Ruins\".\nRuins are different from buildings because they have no openings or structure points.",
"term": "Ruins",
"id": 18,
"figs": [
{
"img": "img/hon/caen/rules/p7-2.webp",
"w": 272,
"h": 471
}
]
},
{
"sec": "1.3",
"sub": "Templates and partially destroyed rooms",
"page": 7,
"text": "It is possible to place an Explosion Template (even using the Indirect Fire Special Ability) in a Partially Destroyed Room (one part of the room is a ruin, the other part is intact). Place the Template on an Interspace. It does not affect squares on the other side of a wall.\nA Modular Building can be composed of an Intact Tile and a Ruined Tile. The room where these two Tiles meet is a mix of both, called a Partially Destroyed Room.\nIn the first example the explosion icons mark all Interspaces where an Explosion Template can be placed. The explosion Template treats the Intact Room (A) as if it were a Building. Thus it cannot affect Units inside, except in the case of a thrown grenade (see Grenades and building rooms, p.6).\nIn the second example, Template A affects the 4 adjacent squares. As walls block the blast (see p.6), Template B, located inside the Building, does not affect the unit outside. For the same reason, Template C, located outside, does not affect the unit inside. Template D does not touch any square of the Intact Room because it is considered a Building.",
"term": null,
"id": 19,
"figs": [
{
"img": "img/hon/caen/rules/p7-3.webp",
"w": 576,
"h": 459
},
{
"img": "img/hon/caen/rules/p7-4.webp",
"w": 544,
"h": 491
},
{
"img": "img/hon/caen/rules/p7-5.webp",
"w": 566,
"h": 513
}
]
},
{
"sec": "1.4",
"sub": "Half-squares",
"page": 8,
"text": "When two Buildings or Ruins are adjacent to each other, half-squares are created between them.",
"term": "Half-square",
"id": 20
},
{
"sec": "1.4",
"sub": "Half-squares and movement action",
"page": 8,
"text": "Infantry Units, except for larger-than-one-square Infantry counters (Pak 40, etc.), count the two half-squares between Buildings or Ruins as one square for a Movement Action (see p.20 in the HoN BRO Rulebook). They may also move from one Building to the other.\nThe second example shows the possible Movement Actions of Unit A related to the nearby ruins. The red A marks are Diagonal Movement Actions, which are forbidden. The red B marks are Movement Actions blocked by walls.",
"term": null,
"id": 21,
"figs": [
{
"img": "img/hon/caen/rules/p8-1.webp",
"w": 675,
"h": 485
},
{
"img": "img/hon/caen/rules/p8-2.webp",
"w": 619,
"h": 645
}
]
},
{
"sec": "1.4",
"sub": "Half-squares and zone of control",
"page": 8,
"text": "Note: the ZoC of a unit in a half-square extends only to adjacent Offset Grid squares, as well as to General Grid squares overlapped by its position, whether they are complete or incomplete (half-squares).\nThe examples show several types of ZoC relating to half-squares.",
"term": null,
"id": 22,
"figs": [
{
"img": "img/hon/caen/rules/p8-3.webp",
"w": 451,
"h": 1756
}
]
},
{
"sec": "2.1",
"sub": "Overwatch",
"page": 9,
"text": "Once activated, your unit benefits from the Opportunity Fire Special Ability.",
"term": "Overwatch",
"id": 23
},
{
"sec": "2.2",
"sub": "Urban Fighter",
"page": 9,
"text": "Once, and only once, per Movement Action, the unit may enter or exit a building through an opening identified by a white arrow. This Special Ability also enables you to exit buildings during a Forced Move following a lost assault. Urban Fighter cannot be used to enter or exit bunker windows.",
"term": "Urban Fighter",
"id": 24
},
{
"sec": "2.3",
"sub": "Destroyer",
"page": 9,
"text": "This unit adds +2 to the results of all Destruction dice rolls of units in its Zone of Control. They therefore place Destruction markers on Structures on results of 2 or more, and stun (place a Suppressed marker on) units in Bunkers on 3 or more.",
"term": "Destroyer",
"id": 25
},
{
"sec": "2.3",
"sub": "Destruction (breach)",
"page": 9,
"text": "When a Firing Action would result in Destruction markers (see p.22 in the BRO Rulebook) being added to a Building, the acting player may place a Breach marker instead.\nA Breach marker is a special kind of Destruction marker with some additional rules. Just like a normal Destruction marker, you place a Breach marker (on its 1 Destruction point side) on a Building, or turn over an already placed marker to show 2 Destruction points.\nWhere exactly you place a Breach marker depends on the source of the Destruction point:\nIf a Firing Action targets a Unit inside the Building, the Breach marker is placed (or increased) on the wall between the target unit and the firing unit (A).\nIf the shot was against the Building itself, the Breach marker is placed (or increased) on the wall closest to the point of impact (B).\nIf the point of impact is a corner, the player chooses between the two walls that join in that corner (C and D).\nWeapons using Templates cannot make a Breach in a wall, but can destroy Structures if the Template has the Destruction Special Ability.\nExplosive charges with the Destruction Special Ability can Breach a wall.\nBreach markers are openings, so the corresponding rules apply (see p.20 in the BRO Rulebook). Infantry Units may enter and exit the Building through a Breach in the wall.\nIf the Breach marker has a Destruction Point value of 1, the Unit must stop its Movement Action on the other side of the Breach.\nIf the Breach marker has a Destruction Point value of 2, the Unit's Movement Action is not stopped.\nTotal both Breach and Destruction markers together to see if the sum is at least equal to the Structure value of a Building (or section of a modular Building). If so, that Terrain Element is Destroyed.\nIf Destroyed, flip the terrain tile over to its Ruined side. Every Infantry Unit inside receives 1 Suppressed marker and, starting with the player with Initiative, each player redeploys all of their units that were inside the Structure into the Ruins.",
"term": "Destruction (breach)",
"id": 26,
"figs": [
{
"img": "img/hon/caen/rules/p9-2.webp",
"w": 133,
"h": 206
},
{
"img": "img/hon/caen/rules/p9-1.webp",
"w": 576,
"h": 481
}
]
},
{
"sec": "2.3",
"sub": "Hawkeye",
"page": 9,
"text": "This unit's Firing Actions are not subject to the long-range fire penalty.",
"term": "Hawkeye",
"id": 27
},
{
"sec": "2.3",
"sub": "Tank Hunter",
"page": 9,
"text": "Add +1 or -1 to the die roll when determining the location of Damage inflicted to a Heavy Vehicle.",
"term": "Tank Hunter",
"id": 28
},
{
"sec": "2.4",
"sub": "Unshakable",
"page": 9,
"text": "This unit ignores Suppressed markers.",
"term": "Unshakable",
"id": 29
},
{
"sec": "2.5",
"sub": "Barrage order",
"page": 10,
"text": "You may not use this Special Ability on the first turn; a barrage order takes time to prepare.\nTo give a barrage order, give an Order Token to the unit with this Special Ability. It can take no other action (neither a Movement Action nor a Firing Action) when it is directing a barrage order.\nDesignate up to 3 Unactivated Heavy Weapon units (outlined in red) that have the exact same name (for example .30 cal or 60mm Mortar) and are within 3 squares of the unit with the barrage order Special Ability.\nIt must have a clear or reduced LoS to each of them.\nThe Heavy Weapon units may take a Firing Action during the Activation of the unit directing the barrage order. Resolve each Firing Action separately.\nPut an Activated marker on each unit that took a Firing Action and remove any Order Tokens from them.\nThe unit directing the Barrage Order keeps its revealed Order Token to indicate it may not act during the Supply Phase.",
"term": "Barrage order",
"id": 30
},
{
"sec": "2.5",
"sub": "Improvisation",
"page": 10,
"text": "You may draw 1 more card than the maximum allowed, but you must then discard 1.\nTip: you can use Improvisation at the start of the game.",
"term": "Improvisation",
"id": 31
},
{
"sec": "2.5",
"sub": "NCO",
"page": 10,
"text": "This unit has an NCO among its members or is itself an NCO. As long as you have an NCO on the board, you always have at least one Order Token.\nIf this unit receives an Order Token during the Order Phase, it may immediately remove 1 Suppressed marker from another unit within 3 squares, and must have a clear LoS on this unit.",
"term": "NCO",
"id": 32
},
{
"sec": "3.1",
"sub": "Ammo belt",
"page": 10,
"text": "Restricted to units with the MG Special Ability.\nThis option grants you 3 Ammo Belt markers. During a Firing Action, each marker gives you a +2 bonus against an Infantry Unit or +1 against Light Vehicles.",
"term": "Ammo belt",
"id": 33,
"figs": [
{
"img": "img/hon/caen/rules/p10-1.webp",
"w": 151,
"h": 240
}
]
},
{
"sec": "3.1",
"sub": "Tank ammo",
"page": 10,
"text": "Restricted to Heavy Vehicle primary weapons. Alternate Firing Action.\nThis option gives you 3 markers of your choice. You must select them at the beginning of the game from the HE Shells and APC Shells markers with the same colored stripes as the Tank Ammo Recruitment Option.\nAPC Shells: each marker gives you a +1 bonus when firing at Heavy Vehicles.\nHE Shells: explosive shells provide the Howitzer Special Ability and use a red explosion Template.",
"term": "Tank ammo",
"id": 34,
"figs": [
{
"img": "img/hon/caen/rules/p10-2.webp",
"w": 126,
"h": 277
},
{
"img": "img/hon/caen/rules/p10-3.webp",
"w": 117,
"h": 111
},
{
"img": "img/hon/caen/rules/p10-4.webp",
"w": 117,
"h": 111
}
]
},
{
"sec": "3.1",
"sub": "Tank gear",
"page": 10,
"text": "Restricted to Heavy Vehicles.\nThis option gives you 3 markers of your choice. You must select them at the beginning of the game from the Fuel and Additional Shielding markers with the same colored stripes as the Tank Gear Recruitment Option.\nAdditional Shielding: each marker grants you a +1 Defensive Bonus.\nFuel: each marker increases the Movement Value of a vehicle by 1 square.",
"term": "Tank gear",
"id": 35,
"figs": [
{
"img": "img/hon/caen/rules/p10-5.webp",
"w": 126,
"h": 244
},
{
"img": "img/hon/caen/rules/p10-6.webp",
"w": 117,
"h": 110
},
{
"img": "img/hon/caen/rules/p10-7.webp",
"w": 117,
"h": 113
}
]
},
{
"sec": "3.2",
"sub": "Fanatic",
"page": 10,
"text": "Each Fanatic marker allows an Infantry Unit to benefit from the Unshakable Special Ability (see p.9) until the end of the Supply Phase. Place a Fanatic marker on an Infantry Unit during the Order Phase, and discard it at the end of the Supply Phase.",
"term": "Fanatic",
"id": 36,
"figs": [
{
"img": "img/hon/caen/rules/p10-8.webp",
"w": 144,
"h": 246
}
]
},
{
"sec": "3.3",
"sub": "Aircraft",
"page": 11,
"text": "This option allows you to recruit 1 or 2 aircraft (see aviation rules, pp.12 and 13).",
"term": "Aircraft",
"id": 37,
"figs": [
{
"img": "img/hon/caen/rules/p11-1.webp",
"w": 320,
"h": 165
}
]
},
{
"sec": "3.3",
"sub": "Artillery",
"page": 11,
"text": "This Orders Option gives you 3 Artillery Support markers. In order to use an Artillery Support marker, you must place a Numbered or Special Order Token on its Recruitment Option. When you activate this option, put an explosion Template on any Interspace on the battlefield. The scattering distance for this attack is 3 Interspaces.\nTip: you may also place a Bluff Order Token as a ruse.",
"term": "Artillery",
"id": 38,
"figs": [
{
"img": "img/hon/caen/rules/p11-2.webp",
"w": 183,
"h": 330
}
]
},
{
"sec": "3.3",
"sub": "Fortified",
"page": 11,
"text": "This order grants you 3 Fortified markers. During Deployment, you may place only one Fortified marker per Room making up a Building. Each marker increases by 1 the Defensive Bonus provided by the Building. When a Building is to receive a Destruction Point, you may discard the Fortified marker instead.\nWarning: it is not possible to fortify a Bunker.",
"term": "Fortified",
"id": 39,
"figs": [
{
"img": "img/hon/caen/rules/p11-3.webp",
"w": 123,
"h": 304
}
]
},
{
"sec": "3.3",
"sub": "Initiative",
"page": 11,
"text": "You may use this order to retain Initiative. At the end of a Turn where you had the Initiative, announce that you will retain Initiative and discard this Option's marker. At the end of the next Turn, your opponent will gain the Initiative normally.",
"term": "Initiative",
"id": 40,
"figs": [
{
"img": "img/hon/caen/rules/p11-4.webp",
"w": 123,
"h": 164
}
]
},
{
"sec": "3.3",
"sub": "Smoke",
"page": 11,
"text": "This Orders Option gives you 3 Smoke templates. In order to use a Smoke template, you must assign a Numbered or Special Order Token to an available Smoke template. You may place a Bluff Order Token. Several Order Tokens can be assigned to several Smoke templates.\nWhen Activated, you can place the Smoke template on any Interspace on the board.\nRoll a die for scattering. Scattering for smoke is 1 Interspace. Once you have resolved scattering, put the Template on its -4 side.\nAt the end of the Supply Phase: remove the Templates already on their -2 side, then turn the -4 side Templates over onto their -2 side.\nAny Firing Action that goes into, through, or out of a square covered by a Smoke Template suffers the printed penalty.",
"term": "Smoke",
"id": 41,
"figs": [
{
"img": "img/hon/caen/rules/p11-5.webp",
"w": 127,
"h": 203
},
{
"img": "img/hon/caen/rules/p11-6.webp",
"w": 653,
"h": 293
}
]
},
{
"sec": "3.4",
"sub": "Support tile",
"page": 11,
"text": "The Support Tile is only used in scenarios. It is used to integrate a Recruitment Option into an army by overriding the rules of Recruitment, or to simulate a Recruitment Option requiring the placement of an Order Token. The details of the Support Tile are explained in each scenario.",
"term": "Support tile",
"id": 42,
"figs": [
{
"img": "img/hon/caen/rules/p11-7.webp",
"w": 294,
"h": 260
}
]
},
{
"sec": "4",
"sub": "Aircraft units",
"page": 12,
"text": "Units with this Special Ability are not present on the battlefield: they fly over it.\nAircraft Units are recruited with Orders Options. The cost of these Recruitment Options is defined by the Aircraft you choose, as shown on the Aircraft's Recruitment Tile.\nWhen recruiting an Aircraft, place its Recruitment Tile next to the Command Tile containing the Orders Option.\nExample: the Commonwealth player decides to recruit a Spitfire. The Orders Option is slotted into the Field Command's Command Tile and the aircraft's Recruitment Tile is placed next to it. The cost of this Orders Option is 40 points.\nWarning: Action Cards that allow moving or changing Order Tokens cannot be played for Aircraft units.",
"term": "Aircraft unit",
"id": 43,
"figs": [
{
"img": "img/hon/caen/rules/p12-1.webp",
"w": 680,
"h": 193
}
]
},
{
"sec": "4",
"sub": "Planespotting",
"page": 12,
"text": "At the end of the Order Phase, the visibility status of Aircraft units is either \"In the clouds\" or \"In plain sight\" for the rest of the Turn.\nIn the clouds: the Aircraft Unit has a Bluff Order Token. It is too far away to Attack or be targeted, even by an Anti-Aircraft unit. Reveal the Bluff Order Token at the beginning of the Activation Phase.\nIn plain sight: the Aircraft Unit did not get a Bluff Order Token. It flies over the battlefield and can be targeted, but may only take a Firing Action if it got a Numbered or Special Order Token.\nExample: the German player places a Numbered Order Token on the Aircraft Unit's Recruitment Tile, which can not only Activate this turn, but may also be targeted by non-AA units.",
"term": "Planespotting",
"id": 44,
"figs": [
{
"img": "img/hon/caen/rules/p12-2.webp",
"w": 613,
"h": 273
}
]
},
{
"sec": "4",
"sub": "Long range penalty",
"page": 12,
"text": "Important: never apply the Long Range Penalty whenever an Aircraft Unit is involved in a Firing Action, whether as attacker or target.",
"term": null,
"id": 45
},
{
"sec": "4",
"sub": "Aircraft taking a firing action",
"page": 12,
"text": "Aircraft Units can only take a Firing Action when a Numbered or Special Order Token is placed on their Recruitment Tile.\nAircraft Units can target ground units or other Aircraft Units.\nAircraft Units use the side Defense Value when targeting a Heavy Vehicle.\nAircraft Units always have a Clear Line of Sight to every Unit, except those inside Buildings.\nUnits using cover of any non-building terrain (woods, hedges, defensive positions, and so on) get the benefit from that Terrain's Defensive Bonus.\nAircraft Units cannot spot concealed units.",
"term": null,
"id": 46
},
{
"sec": "4",
"sub": "Other units taking a firing action",
"page": 13,
"text": "Units without Anti-Aircraft Special Abilities can only target Aircraft Units with a Numbered or Special Order Token placed on their Recruitment Tile.\nOnly units with the Machine Gunner and/or Anti-Aircraft Special Abilities can take a Firing Action against Aircraft Units.\nA Heavy Vehicle cannot use its Primary Weapon (red outline) for a Firing Action against Aircraft Units, unless that Primary Weapon has the Anti-Aircraft Special Ability. Only if the vehicle has a Secondary Weapon (yellow outline) with the Machine Gunner Special Ability can the vehicle shoot at Aircraft Units.\nUnits with the Limited Range Special Ability, as well as Units with a Special Ability that makes use of any Template, cannot fire at Aircraft Units.\nUnits with a Limited Firing Arc cannot fire at Aircraft Units, unless these Units have the Anti-Aircraft Special Ability. In this case, the Limited Firing Arc is ignored.\nAll Units, not in Buildings, have Clear Line of Sight to any Aircraft Units except those \"in the clouds\".",
"term": null,
"id": 47
},
{
"sec": "4",
"sub": "Anti-aircraft",
"page": 13,
"text": "Units with the Anti-Aircraft Special Ability can Fire at an Aircraft Unit, even if that Aircraft Unit does not have a Numbered or Special Order Token placed on its Recruitment Tile. However, a Unit with this Special Ability cannot fire at any Aircraft Unit that is \"in the clouds\".\nAlways add any bonus (+1, +2, and so on) shown next to the AA Special Ability to the die roll. If the target is an Aircraft with an Order Token, calculate the Speed Penalty normally (see Speed penalty). If the target is an Aircraft without an Order Token, apply a standard -2 Speed Penalty instead.",
"term": "Anti-Aircraft",
"id": 48
},
{
"sec": "4",
"sub": "Speed penalty",
"page": 13,
"text": "Important: any unit (land and air) that takes a Firing Action against an Aircraft Unit must always apply the Speed Penalty.\nThe Speed Penalty is determined by the numerical difference between the Order Token of the firing unit and that of the Aircraft Unit. Always subtract the lowest value from the highest.\nThe player whose Aircraft Unit was targeted must reveal the Order Token if its value had not been disclosed yet. Replace that Token face down again on the Aviation Recruitment Tile until the Aircraft Unit is Activated.",
"term": "Speed penalty",
"id": 49
},
{
"sec": "4",
"sub": "Opportunity fire against aircraft",
"page": 13,
"text": "A unit using Opportunity Fire, in response to an Aircraft that has fired, must use the value of the last revealed Numbered Order Token to resolve the Speed Penalty. Since this is the targeted Aircraft's own Order Token, the Speed Penalty for Opportunity Fire is always 0.",
"term": "Opportunity Fire",
"id": 50
},
{
"sec": "4",
"sub": "Special order",
"page": 13,
"text": "If any unit with a Special Order Token targets an Aircraft Unit with a Numbered Order Token, then the Speed Penalty is the difference between the value of the Aircraft Unit's Order Token and that of the last revealed Numbered Order Token (of either player) before this Firing Action.\nIf an aircraft is Activated with a Special Order before it has been targeted, its Speed Penalty value is also that of the last revealed Numbered Order Token (of either player). This value can be 0 if the plane is Activated before Order Number 1.\nIf the target is an Aircraft with an unrevealed Special Order Token, apply a standard -2 Speed Penalty.\nExamples: an Aircraft Unit with Order Token #3 is targeted by a unit with Order Token #2, the Speed Penalty (3-2) is 1. With Order Token #5, the Speed Penalty (5-3) is 2. With Order Token #3, the Speed Penalty (3-3) is 0. With Opportunity Fire, the Speed Penalty is 0.",
"term": "Special Order",
"id": 51
},
{
"sec": "4",
"sub": "Bombs and rockets",
"page": 13,
"text": "Bomb or rocket markers shown on an Aircraft's Recruitment Tile are used for Alternate Firing Actions.\nThe Commonwealth Hawker Typhoon has 2 1000 lb bombs. It can use them in an Alternate Firing Action with the Howitzer Special Ability while using the explosion template with the black Combat Values.",
"term": "Bombs and rockets",
"id": 52,
"figs": [
{
"img": "img/hon/caen/rules/p13-1.webp",
"w": 667,
"h": 187
}
]
}
]
};
