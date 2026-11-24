window.HTS_RULES = window.HTS_RULES || {};
HTS_RULES["hon-wj"] = {
"game": "hon",
"box": "wj",
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
"title": "Airplane rules (Scenario B)"
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
"title": "Defensive obstacles",
"chapter": 1
},
{
"id": "1.4",
"title": "Defensive elements",
"chapter": 1
},
{
"id": "2.1",
"title": "Assault special abilities",
"chapter": 2
},
{
"id": "2.2",
"title": "Defense special abilities",
"chapter": 2
},
{
"id": "2.3",
"title": "Command special abilities",
"chapter": 2
},
{
"id": "2.4",
"title": "Other special abilities",
"chapter": 2
},
{
"id": "3.1",
"title": "Support options",
"chapter": 3
},
{
"id": "3.2",
"title": "Gear options",
"chapter": 3
},
{
"id": "3.3",
"title": "Character traits",
"chapter": 3
},
{
"id": "3.4",
"title": "Orders options",
"chapter": 3
},
{
"id": "3.5",
"title": "Customizations",
"chapter": 3
},
{
"id": "4",
"title": "Airplane rules (Scenario B)",
"chapter": 4
}
],
"chunks": [
{
"sec": "1.1",
"sub": "Bunkers",
"page": 4,
"text": "Bunkers cannot be Destroyed and Infantry Units can never enter through their windows (by playing a Card or using a Special Ability).\nUnits, gear, or explosion templates that have the Destruction Special Ability can attempt to stun units inside bunkers by targeting them directly or by targeting the bunker. Roll as many dice as indicated in the Destruction icon. If at least one die rolls a 5 or a 6, put a single Suppressed Marker (no more than one) on each unit in the bunker. Concealed units are not affected.",
"term": "Bunker",
"id": 0
},
{
"sec": "1.1",
"sub": "Holes",
"page": 4,
"text": "Infantry Units inside a Terrain Element with this effect do not block the Line of Sight of units outside the Terrain Element, however they do block LoS for other Infantry Units in the same element. Corners that overlap an interspace block LoS when firing at a unit in the same Terrain Element.\nWarning: this effect always applies even if a unit is adjacent to a Line linked to the hole.\nIn the figure, Firing Actions A and B are allowed. Firing Action C fails because the Corner of the Trench blocks LoS, while D fails because the Infantry Unit outside the Terrain Element blocks LoS.",
"term": "Hole",
"id": 1,
"figs": [
{
"img": "img/hon/wj/rules/p4-1.webp",
"w": 508,
"h": 420
}
]
},
{
"sec": "1.1",
"sub": "Large buildings",
"page": 4,
"text": "These Buildings cannot be Destroyed, but their walls can be Breached to create an opening.",
"term": "Large building",
"id": 2
},
{
"sec": "1.1",
"sub": "Lines, anchors and segments",
"page": 4,
"text": "A Line is a specific (linear) type of Terrain Effect.\n1. A Line extends between two Interspace anchors, spaced 1 or more squares apart (here a Line 3 squares long).\n2. Even though they are \"connected\", a Firing Action that crosses multiple segments still adds the Terrain Effects of each segment as if they were individual Lines.",
"term": "Line",
"id": 3,
"figs": [
{
"img": "img/hon/wj/rules/p4-2.webp",
"w": 375,
"h": 165
},
{
"img": "img/hon/wj/rules/p4-3.webp",
"w": 375,
"h": 165
}
]
},
{
"sec": "1.1",
"sub": "Lines, several Lines and adjacency",
"page": 4,
"text": "3. A Firing Action that crosses multiple discrete Lines adds the Terrain Effects of each Line. In the figure, the shot gets a total of -2 and the defender gets +1.\n4. Units adjacent to a Line that Obscures LoS can ignore that modifier when taking Firing Actions, all others cannot. In the figure, A is adjacent to the Line during its Firing Action, so it has no penalty. B is not adjacent to the Line during its Firing Action, so it applies the penalty. Both C units are not adjacent to the Line during the Firing Action, so the penalty applies to both.",
"term": null,
"id": 4,
"figs": [
{
"img": "img/hon/wj/rules/p4-4.webp",
"w": 375,
"h": 230
},
{
"img": "img/hon/wj/rules/p4-5.webp",
"w": 375,
"h": 235
}
]
},
{
"sec": "1.1",
"sub": "Lines, Defensive Bonus and Difficult Passage",
"page": 5,
"text": "5. If the Line is linked to a Defensive Bonus and completely surrounds a linear set of squares, then this set is considered a Terrain Element (a Trench for example). The Defensive Bonus applies only to Units present in the Terrain Element. In the figure, A takes a Firing Action against B. B does not benefit from the Defensive Bonus linked to the Line because it is outside the Terrain Element. If B takes a Firing Action against A, it would ignore the Terrain Effects associated with the Line because it is adjacent to it.\n6. Any Line with Difficult Passage affects Movement Actions that cross it.",
"term": null,
"id": 5,
"figs": [
{
"img": "img/hon/wj/rules/p5-1.webp",
"w": 365,
"h": 220
},
{
"img": "img/hon/wj/rules/p5-2.webp",
"w": 365,
"h": 95
}
]
},
{
"sec": "1.1",
"sub": "Contour lines",
"page": 5,
"text": "A Contour Line is one that separates two areas of different elevation. Firing Actions that cross a Contour Line have their range limited to one square beyond the Line (A), unless the shooter or the target is adjacent to the Contour Line (B). Effects of Terrain Elements that reduce LoS apply their effects normally (B and C). Infantry Units block LoS if both the shooter and the target are Infantry Units (D).",
"term": "Contour Line",
"id": 6,
"figs": [
{
"img": "img/hon/wj/rules/p5-3.webp",
"w": 84,
"h": 194
},
{
"img": "img/hon/wj/rules/p5-4.webp",
"w": 507,
"h": 505
}
]
},
{
"sec": "1.1",
"sub": "Elevated lines",
"page": 5,
"text": "An Elevated Line is used to delineate an area that is higher than an area bounded by a Contour Line. The Firing Action of a unit adjacent to an Elevated Line that crosses that same Elevated Line ignores any Contour Lines it crosses. In all other cases, the same rules apply as for the Contour Line.",
"term": "Elevated Line",
"id": 7,
"figs": [
{
"img": "img/hon/wj/rules/p5-5.webp",
"w": 84,
"h": 124
}
]
},
{
"sec": "1.1",
"sub": "Two hills facing each other",
"page": 5,
"text": "Warning: in the case of two \"Hills\" facing each other, the rules for Contour and Elevated Lines still apply (see the figure).",
"term": null,
"id": 8,
"figs": [
{
"img": "img/hon/wj/rules/p5-6.webp",
"w": 508,
"h": 223
}
]
},
{
"sec": "1.1",
"sub": "Elevated lines, firing examples",
"page": 5,
"text": "Firing Action A ignores the Contour Line since the shooting unit is adjacent to the Elevated Line. Firing Action B is possible because the target is adjacent to the Elevated Line. Firing Action C is not possible because the unit performing the Firing Action is not adjacent to the Elevated Line (the range is limited to one square beyond the Line). Firing Action D is not possible because the LoS crosses an Elevated Line and neither the firing Unit nor the target are adjacent to this Elevated Line.",
"term": null,
"id": 9,
"figs": [
{
"img": "img/hon/wj/rules/p5-7.webp",
"w": 508,
"h": 422
}
]
},
{
"sec": "1.2",
"sub": "Tall grass",
"page": 5,
"text": "Obstacle (Infantry).\nThey're grass, they're tall, they're Tall Grass. If velociraptors are around, stay out!",
"term": "Tall grass",
"id": 10,
"figs": [
{
"img": "img/hon/wj/rules/p5-8.webp",
"w": 190,
"h": 190
}
]
},
{
"sec": "1.3",
"sub": "Barbed hedgehogs",
"page": 6,
"text": "Line. Obstacle. Impassable to Vehicles. Difficult Passage.\nThese Terrain Elements are never placed diagonally, but straddle two squares. They were used to impede the progress of either tanks or infantry, respectively.\nUnits with the Engineer Special Ability may, instead of a Movement Action or Firing Action, remove a Barbed Hedgehogs marker present in their ZoC.",
"term": "Barbed hedgehogs",
"id": 11,
"figs": [
{
"img": "img/hon/wj/rules/p6-1.webp",
"w": 180,
"h": 108
}
]
},
{
"sec": "1.4",
"sub": "Trenches",
"page": 6,
"text": "Line. Defensive Bonus (Infantry). Impassable to Vehicles. Hole. Difficult Passage.\nFrom the Roman camps through the siege of Maastricht (1673) and Vicksburg (1863), right up to the battle of the Somme (1916), trenches have always been an essential component of poliorcetics (haha! you didn't know that one).",
"term": "Trench",
"id": 12,
"figs": [
{
"img": "img/hon/wj/rules/p6-2.webp",
"w": 508,
"h": 90
}
]
},
{
"sec": "1.4",
"sub": "Trenches and movement",
"page": 6,
"text": "A unit that moves into or out of a Trench must stop its Movement Action, unless it crosses the dashed Line with a blue arrow that indicates access to the Trench.\nMoving within a Trench, or from one Trench to an adjacent one, does not interrupt movement provided the two joined trench sides are linked by a passage (the circled symbol in the figure). A unit moving from one Trench to another cannot stop in the square between the two passages (square 3 in the figure). The Corners of Trenches constrain Movement Actions (A).",
"term": null,
"id": 13,
"figs": [
{
"img": "img/hon/wj/rules/p6-3.webp",
"w": 494,
"h": 300
}
]
},
{
"sec": "1.4",
"sub": "ZoC and trenches",
"page": 6,
"text": "Units in Trenches are not affected by the ZoC of units outside the Trench and vice versa. The ZoC of a unit present in a Trench is limited to that element. The Corners of Trenches limit ZoC (A).\nNote: Pegasus Bridge has an earlier version of the Trench Element. Treat the wooden frame of those Trenches as the Line.",
"term": null,
"id": 14,
"figs": [
{
"img": "img/hon/wj/rules/p6-4.webp",
"w": 506,
"h": 336
}
]
},
{
"sec": "1.4",
"sub": "Grenades and trenches",
"page": 6,
"text": "If a Unit is on a square adjacent to a Trench, it can throw a Grenade inside the element and directly onto a square (not an Interspace). The blast expands in a 1-square-wide straight line only inside the Trench, in any possible direction from the target square. Trench Corners that overlap the Interspace stop the propagation of the blast (A). The squares indicating an access to the Trench (dashed Line with a blue arrow) do not block propagation when a Grenade explodes in a square adjacent to an access (B).",
"term": null,
"id": 15,
"figs": [
{
"img": "img/hon/wj/rules/p6-5.webp",
"w": 506,
"h": 380
}
]
},
{
"sec": "1.4",
"sub": "Foxholes",
"page": 6,
"text": "Defensive Bonus (Infantry). Hole.\nWhen you need to hold a position but don't have time to dig trenches or build bunkers, burying yourself is the best solution...",
"term": "Foxhole",
"id": 16,
"figs": [
{
"img": "img/hon/wj/rules/p6-6.webp",
"w": 180,
"h": 198
}
]
},
{
"sec": "2.1",
"sub": "Charge",
"page": 8,
"text": "When this unit launches an Assault, it may first take a Firing Action at its target. If the target survives, resolve the Assault. This free attack disregards range restrictions. If the Firing Action destroys the target, this unit must end its Movement Action in the target's former square.",
"term": "Charge",
"id": 17
},
{
"sec": "2.2",
"sub": "Defender",
"page": 8,
"text": "This unit grants +1 to the Defense Value of friendly Infantry Units in its ZoC. If this unit is Destroyed, this effect persists until the end of the present Activation Phase.",
"term": "Defender",
"id": 18
},
{
"sec": "2.2",
"sub": "Substitute",
"page": 8,
"text": "This unit can suffer Hits in place of a Heavy Weapon unit (outlined in red) within 2 squares, provided it has a LoS (obscured or clear) to that other unit. This Special Ability does not work if the Heavy Weapon was Destroyed during an Assault.",
"term": "Substitute",
"id": 19
},
{
"sec": "2.3",
"sub": "Ambush spotter",
"page": 8,
"text": "When this unit is Activated it may reveal one or more concealed enemy Units to which it has a clear Line of Sight.",
"term": "Ambush spotter",
"id": 20
},
{
"sec": "2.4",
"sub": "Bridge",
"page": 8,
"text": "The Bridge allows units (both infantry and vehicles) to cross Water, Trenches, Ponds, and other depressions. Both exits of the bridge are indicated with blue arrows. The Bridge can be deployed in an empty square in the unit's ZoC. The Bridge can be placed on an Impassable for Vehicles or Infantry square, but not on an Impassable square.",
"term": "Bridge",
"id": 21
},
{
"sec": "2.4",
"sub": "Engineer",
"page": 8,
"text": "Units with this Special Ability may use and interact with gear or Terrain Elements that have the same symbol, such as barbed wire.",
"term": "Engineer",
"id": 22
},
{
"sec": "2.4",
"sub": "Military engineering",
"page": 8,
"text": "At the end or at the beginning of its Movement Action, the SdKfz 251/7 may deploy one of the items (see below) present on its Support Option.\nA unit with the Engineer Special Ability in the SdKfz 251/7's Zone of Control may, at the beginning of its Movement Action, take one of the items from the SdKfz 251/7's Support Option and move with it. At the end of the Engineer's Movement Action, the chosen item must be deployed.\nThere are two types of items:\nBarbed Hedgehogs: they can be deployed between two empty Interspaces and adjacent to the unit carrying them (Pioneer or SdKfz 251/7). If deployed on a Line associated with a Terrain Effect, they do not negate that effect.\nAdvanced Position: it may be deployed in an empty square in the ZoC of the unit carrying it (Pioneer or SdKfz 251/7). An Advanced Position may not be placed in Buildings, Ruins, Bunkers, Water squares or any Impassable square.",
"term": "Military engineering",
"id": 23
},
{
"sec": "3.1",
"sub": "SdKfz 251/7",
"page": 8,
"text": "This option grants a SdKfz 251/7 as well as all the items it can deploy, thanks to the Military Engineering Special Ability.",
"term": "SdKfz 251/7",
"id": 24,
"figs": [
{
"img": "img/hon/wj/rules/p8-1.webp",
"w": 164,
"h": 205
}
]
},
{
"sec": "3.2",
"sub": "Gear",
"page": 8,
"text": "This option gives you 3 markers of your choice. At the beginning of the game, select any combination of 3 Gear markers with the same colored stripes as the Gear Recruitment Option.\nCommonwealth: Grenades, Piat and Knife.\nSS: Grenades, Magnetic Mines and Panzerfaust.",
"term": "Gear",
"id": 25,
"figs": [
{
"img": "img/hon/wj/rules/p8-2.webp",
"w": 106,
"h": 190
}
]
},
{
"sec": "3.2",
"sub": "Knife",
"page": 8,
"text": "Restricted to Infantry.\nBefore rolling your dice in an Assault, discard the Knife marker to add a +2 bonus to the result.",
"term": "Knife",
"id": 26,
"figs": [
{
"img": "img/hon/wj/rules/p8-3.webp",
"w": 90,
"h": 85
}
]
},
{
"sec": "3.2",
"sub": "Piat",
"page": 8,
"text": "Restricted to Infantry. Alternate Firing Action.\nThe maximum range of a Piat is 5 squares. The combat bonus is written on the back. Piat has the Destruction Special Ability.",
"term": "Piat",
"id": 27,
"figs": [
{
"img": "img/hon/wj/rules/p8-4.webp",
"w": 108,
"h": 140
}
]
},
{
"sec": "3.2",
"sub": "Minen",
"page": 9,
"text": "Restricted to Infantry.\nWhen activated (instead of taking a Firing or Movement Action) a unit may place a Minen marker on any square in its Zone of Control. If a friendly or enemy unit crosses or stops on a square containing a Minen marker it suffers an attack. Use the Combat Values on the Minen marker and discard it. Unlike with a full Mine Field, the unit only suffers the attack, without suppression. Units with the Engineer Special Ability may discard an adjacent Minen marker instead of taking a Firing Action or a Movement Action.",
"term": "Minen",
"id": 28,
"figs": [
{
"img": "img/hon/wj/rules/p9-1.webp",
"w": 100,
"h": 352
}
]
},
{
"sec": "3.2",
"sub": "(Advanced) position",
"page": 9,
"text": "Defensive position. Restricted to Infantry.\nThis option gives you 1 Advanced Position. During the Activation Phase or the Supply Phase, a unit may place the Advanced Position on its square instead of taking a Firing Action or a Movement Action. An Advanced Position tile may not be placed inside a Building, Rubble, a Bunker, Water, or any square Impassable to Infantry Units.\nUse the tile's Hedgerow side (front) only when it is in a Hedgerow, and the Neutral side (back) anywhere else it can be placed.",
"term": "Advanced Position",
"id": 29,
"figs": [
{
"img": "img/hon/wj/rules/p9-2.webp",
"w": 100,
"h": 148
},
{
"img": "img/hon/wj/rules/p9-3.webp",
"w": 329,
"h": 154
}
]
},
{
"sec": "3.2",
"sub": "Recce gear",
"page": 9,
"text": "Restricted to Light Vehicles.\nThis option gives you 3 markers of your choice. These markers are restricted to Light Vehicles. You must select them at the beginning of the game from the Ammo, Additional Shielding and Fuel markers with the same colored stripes as this Recce Gear Recruitment Option.",
"term": "Recce gear",
"id": 30,
"figs": [
{
"img": "img/hon/wj/rules/p9-4.webp",
"w": 102,
"h": 148
}
]
},
{
"sec": "3.2",
"sub": "Ammo",
"page": 9,
"text": "Each marker gives you a +2 bonus against Light Vehicles, or +1 against Heavy Vehicles. You may not take a Firing Action using an Ammo marker against a Heavy Vehicle if your unit's grey Combat Value is X.",
"term": "Ammo",
"id": 31,
"figs": [
{
"img": "img/hon/wj/rules/p9-5.webp",
"w": 85,
"h": 80
}
]
},
{
"sec": "3.2",
"sub": "Additional shielding",
"page": 9,
"text": "Each Additional Shielding marker grants a Vehicle a +2 Defensive Bonus.",
"term": "Additional shielding",
"id": 32,
"figs": [
{
"img": "img/hon/wj/rules/p9-6.webp",
"w": 85,
"h": 84
}
]
},
{
"sec": "3.2",
"sub": "Fuel",
"page": 9,
"text": "Each Fuel marker increases the Movement Value of a vehicle by 2 squares.",
"term": "Fuel",
"id": 33,
"figs": [
{
"img": "img/hon/wj/rules/p9-7.webp",
"w": 85,
"h": 83
}
]
},
{
"sec": "3.3",
"sub": "Ferocious",
"page": 9,
"text": "During an Assault, an attacking Ferocious unit always pushes back defenders whether they win or lose, provided the attacking unit has not been Destroyed. This Character Trait does not apply to an Assault against a vehicle.",
"term": "Ferocious",
"id": 34,
"figs": [
{
"img": "img/hon/wj/rules/p9-8.webp",
"w": 100,
"h": 130
}
]
},
{
"sec": "3.3",
"sub": "Hardened",
"page": 9,
"text": "This Character Trait gives you an additional Numbered Order Token. It is imperative that you assign one Order Token (Numbered, Bluff, or Special) to a Unit from this Recruitment Tile each Turn.\nImportant: you still may not have more than 10 Numbered Order Tokens.",
"term": "Hardened",
"id": 35,
"figs": [
{
"img": "img/hon/wj/rules/p9-9.webp",
"w": 100,
"h": 153
}
]
},
{
"sec": "3.4",
"sub": "SS Spirit",
"page": 9,
"text": "Restricted to SS.\nThis option allows you to add 3 or 6 SS Action Cards to your Action Cards deck.",
"term": "SS Spirit",
"id": 36,
"figs": [
{
"img": "img/hon/wj/rules/p9-10.webp",
"w": 100,
"h": 128
}
]
},
{
"sec": "3.5",
"sub": "Charge (customization)",
"page": 9,
"text": "Restricted to Characters.\nThis customization grants a Character the Charge Special Ability (see p.8).",
"term": "Charge customization",
"id": 37,
"figs": [
{
"img": "img/hon/wj/rules/p9-11.webp",
"w": 100,
"h": 130
}
]
},
{
"sec": "3.5",
"sub": "Life point",
"page": 9,
"text": "Restricted to Characters.\nThis customization adds 1 Life Point marker. Discard one to cancel one Hit the Character just suffered. If the Firing Action inflicted a double Hit, you must discard 2 Life Point markers. If the unit does not have enough Life Point markers, it suffers one regular Hit per missing marker.",
"term": "Life point",
"id": 38,
"figs": [
{
"img": "img/hon/wj/rules/p9-12.webp",
"w": 100,
"h": 123
}
]
},
{
"sec": "3.5",
"sub": "Tactical map",
"page": 9,
"text": "Restricted to Characters.\nThis customization brings 3 Tactical Map markers. At the start of the Movement Action of a character (or any of your units within 3 squares of that character), discard 1 marker to ignore any Difficult Passage for that action.",
"term": "Tactical map",
"id": 39,
"figs": [
{
"img": "img/hon/wj/rules/p9-13.webp",
"w": 100,
"h": 127
}
]
},
{
"sec": "3.5",
"sub": "Urban fighter (customization)",
"page": 9,
"text": "Restricted to Characters.\nThis customization grants the Character the Urban Fighter Special Ability (see the Battle for Caen rules, p.9).",
"term": "Urban fighter customization",
"id": 40,
"figs": [
{
"img": "img/hon/wj/rules/p9-14.webp",
"w": 100,
"h": 130
}
]
},
{
"sec": "4",
"sub": "Aviator",
"page": 11,
"text": "Scenario rule for Scenario B. To activate this Special Ability, the Unit must end its movement in an Airplane. Once activated, flip the counter over and leave it on the Airplane. The Unit counts toward the Driver Special Ability (here 1). The Unit cannot be the target of a Firing Action while in the Airplane.\nTo leave the Airplane, it must begin its Movement Action by turning to its Inactive Side.\nIf the Airplane is Destroyed, the Unit must be placed on a square adjacent to the wreckage on its Inactive Side. Place a Suppressed Marker on it. This is a Forced Move.",
"term": "Aviator",
"id": 41
},
{
"sec": "4",
"sub": "Driver",
"page": 11,
"text": "One or several units equaling the Transport Value in the symbol must crew this vehicle before it can be operated.",
"term": "Driver",
"id": 42
},
{
"sec": "4",
"sub": "Airplane take off",
"page": 11,
"text": "An Airplane starts the game stationary (Speed Marker X).\nAn Airplane cannot move without an Aviator in the cockpit. An Airplane may not move on the turn the Aviator enters the cockpit. The player controlling the plane may change the Speed Marker at the beginning of the plane's Movement Action.\nA Speed Marker indicates the Movement Value of the Airplane (blue border) and the Speed Markers that may replace it (green border).",
"term": "Airplane",
"id": 43,
"figs": [
{
"img": "img/hon/wj/rules/p11-1.webp",
"w": 515,
"h": 142
}
]
},
{
"sec": "4",
"sub": "Airplane movement",
"page": 11,
"text": "The Airplane moves in the same way as a 2-square Vehicle and must move at least a number of squares equal to the Movement Value of the selected Speed Marker minus 1 square.\nWarning: the Airplane Wings ignore Terrain Elements and don't block LoS. If, at any time during its Movement Action, a wing of the Airplane overlaps the red line of a Building or Vehicle counter, the Airplane is Destroyed.\nExample: the Movement Value is 4 squares. The Airplane may move 3 or 4 squares but not any slower.",
"term": null,
"id": 44,
"figs": [
{
"img": "img/hon/wj/rules/p11-2.webp",
"w": 75,
"h": 70
}
]
},
{
"sec": "4",
"sub": "Taking off",
"page": 11,
"text": "If, at the beginning of the Airplane's Movement Action, the Speed Marker shows a Movement Value of 6, then it may take off after traveling 6 squares in a straight line even if this makes it leave the board.",
"term": null,
"id": 45,
"figs": [
{
"img": "img/hon/wj/rules/p11-3.webp",
"w": 110,
"h": 102
}
]
}
]
};
