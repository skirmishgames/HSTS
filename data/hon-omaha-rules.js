window.HTS_RULES = window.HTS_RULES || {};
HTS_RULES["hon-omaha"] = {
"game": "hon",
"box": "omaha",
"title": "Rules",
"chapters": [
{
"n": 1,
"title": "Battlefield"
},
{
"n": 2,
"title": "Special rules"
},
{
"n": 3,
"title": "Special abilities"
},
{
"n": 4,
"title": "Recruitment options"
},
{
"n": 5,
"title": "Aviation rules"
},
{
"n": 6,
"title": "Player generated landings"
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
"id": "2",
"title": "Landing craft and haystacks",
"chapter": 2
},
{
"id": "3.1",
"title": "Movement special abilities",
"chapter": 3
},
{
"id": "3.2",
"title": "Firing special abilities",
"chapter": 3
},
{
"id": "3.3",
"title": "Defense special abilities",
"chapter": 3
},
{
"id": "3.4",
"title": "Command special abilities",
"chapter": 3
},
{
"id": "3.5",
"title": "Other special abilities",
"chapter": 3
},
{
"id": "4.1",
"title": "Support options",
"chapter": 4
},
{
"id": "4.2",
"title": "Gear options",
"chapter": 4
},
{
"id": "4.3",
"title": "Character traits",
"chapter": 4
},
{
"id": "4.4",
"title": "Orders options",
"chapter": 4
},
{
"id": "5",
"title": "Aviation rules",
"chapter": 5
},
{
"id": "6",
"title": "Player generated landings",
"chapter": 6
}
],
"chunks": [
{
"sec": "1.1",
"sub": "Universal defensive bonus",
"page": 4,
"text": "Every unit, whatever their defense type, benefits from this Defensive Bonus.",
"term": null,
"id": 0
},
{
"sec": "1.1",
"sub": "Directional defensive bonus",
"page": 4,
"text": "This Defensive Bonus is applied only if the shot crosses the top edge of the Terrain Element, coming from the direction indicated by the icon.",
"term": null,
"id": 1,
"figs": [
{
"img": "img/hon/omaha/rules/p4-1.webp",
"w": 491,
"h": 202
}
]
},
{
"sec": "1.1",
"sub": "Hole",
"page": 4,
"text": "Infantry Units inside this Terrain Element do not block the Line of Sight of units outside the element A, however they do block LoS for other Infantry Units in the same element B. Note that the corners of the Terrain Element block LoS when a unit fires at units in the same Terrain Element C.",
"term": null,
"id": 2,
"figs": [
{
"img": "img/hon/omaha/rules/p4-3.webp",
"w": 487,
"h": 315
}
]
},
{
"sec": "1.1",
"sub": "Stress",
"page": 4,
"text": "This Terrain Element unsettles nearby units. Put a Suppressed Marker on any unit that either ends its Movement Action within a number of squares equal to the value printed in the icon, or has a clear Line of Sight to the element.\nAs long as the unit stays within range of the stressful element and has a LoS to it, it cannot discard Suppressed Markers.",
"term": null,
"id": 3
},
{
"sec": "1.1",
"sub": "Bunker",
"page": 4,
"text": "Bunkers cannot be Destroyed and Infantry Units can never enter through their windows (by playing a Card or using a Special Ability).\nUnits, gear, or explosion templates that have the Destruction Special Ability can attempt to stun units inside bunkers by targeting them directly or by targeting the bunker. Roll as many dice as indicated in the Destruction icon. If at least one die rolls a 5 or a 6, put a single Suppressed Marker (no more than one) on each unit in the bunker. Concealed units are not affected.",
"term": null,
"id": 4
},
{
"sec": "1.1",
"sub": "Contour line",
"page": 4,
"text": "A red contour line is one that separates two areas of different elevation.\nShots that cross a red line have their range limited to one square beyond the line A, unless the shooter or the target is adjacent to the contour line B. Effects of Terrain Elements that reduce LoS apply their effects normally C. Infantry Units block LoS if both the shooter and the target are Infantry Units D.\nDepending on the type of terrain, the contour line may affect the Movement Action of crossing units.",
"term": null,
"id": 5,
"figs": [
{
"img": "img/hon/omaha/rules/p4-2.webp",
"w": 480,
"h": 483
},
{
"img": "img/hon/omaha/rules/p4-4.webp",
"w": 272,
"h": 136
}
]
},
{
"sec": "1.2",
"sub": "Mounds",
"page": 4,
"text": "A mound square is identified by a yellow border adjacent to a contour line.\nA unit in a mound square and adjacent to the red line does not block a LoS traced to a unit on a higher elevation and adjacent to the other side of the red line A, but it does block LoS in every other case B, C & D.",
"term": null,
"id": 6,
"figs": [
{
"img": "img/hon/omaha/rules/p4-5.webp",
"w": 218,
"h": 213
}
]
},
{
"sec": "1.2",
"sub": "Difficult terrain",
"page": 5,
"text": "Impassable to Vehicles - Difficult Passage\nThese squares represent pools of mud or waterlogged areas. The Germans had flooded large parts of Normandy in anticipation of Allied troop drops.",
"term": null,
"id": 7,
"figs": [
{
"img": "img/hon/omaha/rules/p5-4.webp",
"w": 401,
"h": 260
},
{
"img": "img/hon/omaha/rules/p5-6.webp",
"w": 228,
"h": 253
}
]
},
{
"sec": "1.2",
"sub": "Streams",
"page": 5,
"text": "Impassable to Light Vehicles - Difficult Passage\nThey happily flow in the Normandy countryside and bring freshness and fish to hikers.",
"term": null,
"id": 8,
"figs": [
{
"img": "img/hon/omaha/rules/p5-5.webp",
"w": 194,
"h": 190
}
]
},
{
"sec": "1.2",
"sub": "Fields",
"page": 5,
"text": "Obstacle (Infantry)\nEars of golden wheat, rustling in a warm breeze. Surely nothing could be hiding in such a lovely spot.",
"term": null,
"id": 9
},
{
"sec": "1.2",
"sub": "Embankments (seawalls)",
"page": 5,
"text": "Impassable to Vehicles - Difficult Passage\nAn embankment is defined by a brown line. The height of the embankment is represented by the Terrain Effect icons defining it.\nThe embankment described here is a low Seawall which does not interfere with the LoS but is impassable to vehicles.",
"term": null,
"id": 10
},
{
"sec": "1.3",
"sub": null,
"page": 5,
"text": "They are always placed between two square and never diagonally.",
"term": null,
"id": 11,
"figs": [
{
"img": "img/hon/omaha/rules/p5-1.webp",
"w": 489,
"h": 394
},
{
"img": "img/hon/omaha/rules/p5-2.webp",
"w": 194,
"h": 202
}
]
},
{
"sec": "1.3",
"sub": "Barbed wire",
"page": 5,
"text": "Difficult Passage (only Infantry)\nVehicles equipped with a Culin Hedgerow Cutter can discard a marker to remove ALL barbed wire tokens they encounter during their Movement Action.\nUnactivated Units with the Engineer Special Ability can remove a barbed wire token in their ZoC, after which they get an Activated Marker.",
"term": null,
"id": 12
},
{
"sec": "1.3",
"sub": "Czech hedgehogs",
"page": 5,
"text": "Impassable to Vehicles - Obstacle\nThey sprouted up like weeds, all over the beaches of Normandy.",
"term": null,
"id": 13
},
{
"sec": "1.4",
"sub": null,
"page": 5,
"text": "A unit in a Defensive Element benefits from the Defensive Bonus, unless the unit firing or assaulting this unit is also inside.",
"term": null,
"id": 14
},
{
"sec": "1.4",
"sub": "Trenches",
"page": 5,
"text": "Defensive Bonus (Infantry) - Impassable to Vehicles - Obstacle - Hole\nA unit that moves into or out of a trench must stop its move, unless its Movement Action crosses a section of the trench that has a ladder. Moving within a trench, or from one trench to an adjacent one, does not interrupt movement provided the two joined trench sides are linked by a passage. The walls limit the ZoCs and constrain movement A.\nThe ZoC of a unit outside a trench does not affect units inside the trench, and vice versa\nGrenades and trenches:\nWhen a grenade is thrown into a trench, place the marker onto a square instead of on an Interspace. The blast expands in a 1-square-wide straight line only inside the trench, in any possible direction from the target square. Trench edges stop the propagation of the explosion A.",
"term": null,
"id": 15,
"figs": [
{
"img": "img/hon/omaha/rules/p5-3.webp",
"w": 194,
"h": 201
}
]
},
{
"sec": "2",
"sub": null,
"page": 6,
"text": "There are two types of Landing Craft: large and small. They are placed at the beginning of the game, either on the Attacking side or as indicated by the scenario. The back of the counter must touch the edge of the terrain tile. The units can exit through one of the three squares in front of the Landing Crafts. The Landing Crafts thus become the deployment zone for the attacker.\nYou may deploy units into these squares at the beginning of the game or at the end of any Supply Phase, provided you follow the rules of the Transport Special Ability (here, Transport 7).\nA landing craft has a Transport capacity of 7\nCharacters as well as Infantry Units that have the symbol equal 1 point of Transport capacity.\nAll other Infantry Units equal 2 points.\nLight or Heavy Vehicles occupying 2 squares take up all 7 points of Transport capacity.\n1-square Light Vehicles equal 5 points.\nATTENTION: A vehicle can use its transport capacity\nwhile it is on board a landing craft.\nUnits that you deploy from a landing craft at the end of a Supply Phase must wait until the next turn to enter play, either during the Activation Phase by means of an Order Token or during the next Supply Phase.\nYou may not deploy new units onto a Landing Craft while there is still a unit on it.\nYou must always leave at least 1 Landing Craft empty.\nUnits inside Landing Craft cannot be targeted.\nA 2-square Landing Craft can take a Firing Action if it receives an Order Token.\nDestroying a Landing Craft:\nA Landing Craft can be Destroyed and is then removed from the battlefield. Units on the craft suffer no Hit, but must be redeployed to unoccupied adjacent squares or to squares previously occupied by the landing craft. This is a Forced Move, and the player who owns the units chooses on where to redeploy them. Put a Suppressed Marker on each redeployed unit. If there are no unoccupied squares, the unit drowns and is Destroyed.\nAt the beginning of a Supply Phase, the Attacking player can attempt to recover a Destroyed landing craft by rolling a die. If the result of the roll is equal to a number printed on one of the Destroyed Landing Craft, the player can put it back in play in any sea square, with the back of the craft touching the edge of the board.",
"term": null,
"id": 16,
"figs": [
{
"img": "img/hon/omaha/rules/p6-1.webp",
"w": 471,
"h": 299
}
]
},
{
"sec": "2",
"sub": "Special deployment",
"page": 6,
"text": "In landing scenarios, there is a limit to the number of unit counters the American player may deploy, based on the number of available Landing Craft. Each Turn, one Landing Craft must be left vacant.\nThe player chooses all units from a Recruitment Tile or a Recruitment Option and deploys them as he wishes among the Landing Craft.\nIt is not possible to deploy only some units from a Recruitment Tile and keep the rest for the next turn.\nIn the example above, the player chooses to deploy a Heavy Vehicle in one of the barges, and the units from his Recruitment Tile in the other. The M4 Sherman consumes all transport points of the first Landing Craft ( 7 points). The Lieutenant and 60mm Mortar equal 1 transport point each, the Rifle Team and the Support Team, 2 points each. He will deploy the rest of his units on the next round.",
"term": null,
"id": 17,
"figs": [
{
"img": "img/hon/omaha/rules/p6-2.webp",
"w": 464,
"h": 563
}
]
},
{
"sec": "2",
"sub": "Haystacks",
"page": 7,
"text": "Haystacks allow units to be camouflaged. They are available through an Orders Option, or because a scenario assigns them to an army.\nThe large haystack, granted by the German Tank Ambush Orders Option, allows you to conceal a single Heavy Vehicle, while the small haystack granted by scenarios, allows the concealment of a single Infantry Unit.\nUnits hidden inside Haystacks gain the Opportunity Fire Special Ability",
"term": null,
"id": 18
},
{
"sec": "2",
"sub": "Deployment",
"page": 7,
"text": "• Deploy the haystack(s), using the Scout 3 Special Ability for the large one, or by following the scenario instructions for the little ones.\nPlace them with the question mark visible. The haystack tokens cannot be placed in a Terrain Element.\n• Choose which unit you want to hide and place it next to its Recruitment Tile.\nAssign a Haystack Marker, bearing the same letter as the haystack, to the selected unit.\nThe Orders Option marker has coloured bands to differentiate it from others.",
"term": null,
"id": 19
},
{
"sec": "2",
"sub": "Spotted",
"page": 7,
"text": "Haystacks are Terrain Elements. To spot units hidden in haystacks follow the rules of the Ambush Special Ability. As soon as a unit hidden in a haystack takes a Movement Action or a Firing Action, or is spotted by another unit, discard the haystack counter and replace it with the corresponding Unit.",
"term": null,
"id": 20
},
{
"sec": "2",
"sub": "Boom in the hay",
"page": 7,
"text": "If a Heavy Vehicle passes over a small haystack, discard it and reveal the Infantry Unit that was hidden there.\nIf a Heavy Vehicle end its Movement Action on a small haystack, discard it and reveal the Infantry Unit hidden there. Apply the Running Over Infantry rule described in the 3.2.1 - Movement Action Chapter of the rulebook p.10.",
"term": null,
"id": 21
},
{
"sec": "3.1",
"sub": "Urban fighter",
"page": 7,
"text": "Once and only once per Movement Action, the unit may enter or exit a building through an opening identified by a white arrow.\nThis Special Ability also enables you to exit buildings during a Forced Move following a lost assault.\nIt is not possible to enter bunker windows in this way.",
"term": null,
"id": 22
},
{
"sec": "3.2",
"sub": "Double fire",
"page": 7,
"text": "When this unit is Activated, it may take two Firing Actions but may not fire twice at the same target. Make a separate roll against each target.\nendless Grenades (Sam Fueller).\nSam Fueller has grenades for the whole battle.",
"term": null,
"id": 23
},
{
"sec": "3.2",
"sub": "Hawkeyed",
"page": 7,
"text": "When this unit makes a Firing Action, it ignores the long range penalty.",
"term": null,
"id": 24
},
{
"sec": "3.3",
"sub": "Substitute",
"page": 7,
"text": "This unit can suffer Hits in place of a Heavy Weapon unit (outlined in red) within 2 squares provided it has a LoS (obscured or clear) to it.\nThis Special Ability does not work if the Heavy Weapon was Destroyed during an assault.",
"term": null,
"id": 25
},
{
"sec": "3.4",
"sub": "Barrage order",
"page": 8,
"text": "You may not use this Special Ability on the first turn; a barrage order takes time to prepare.\n• To give a barrage order, give an Order Token to the unit with this Special Ability. It can take no other action (neither a Movement Action, nor a Firing Action) when it is directing a barrage order.\n• Designate up to 3 Heavy Weapon units (outlined in red) that have the exact same name (for example .30 cal or 60mm Mortar) and are within 3 squares of the unit with the barrage order Special Ability. It must have a clear or reduced LoS to each of them.\n• The Heavy Weapon units may take a Firing Action during the Activation of the unit directing the barrage order.\n• Resolve each Firing Action separately.\n• Put an Activated Marker on each unit that took a Firing Action and remove any Order Tokens from them.\nThe unit directing the barrage order keeps its revealed Order Token to indicate it may not act during the Supply Phase.",
"term": null,
"id": 26
},
{
"sec": "3.4",
"sub": "Smart",
"page": 8,
"text": "This unit increases your hand size by 1 Action Card. If more than one unit has this Special Ability, you only benefit once when drawing cards at the end of each Supply Phase.",
"term": null,
"id": 27
},
{
"sec": "3.4",
"sub": "NCO",
"page": 8,
"text": "This unit has an NCO among its members or is itself an NCO. As long as you have an NCO on the board, you always have at least one Order Token.\nWhen Activated, before Firing or Moving, an NCO may instantly remove 1 Suppressed Marker from a friendly unit within 3 squares and in clear LoS.",
"term": null,
"id": 28
},
{
"sec": "3.5",
"sub": "Engineer",
"page": 8,
"text": "Units with this Special Ability may use and activate gear or Terrain Elements that have the same symbol, such as barbed wire.",
"term": null,
"id": 29
},
{
"sec": "3.5",
"sub": "Minesweeper",
"page": 8,
"text": "The unit with this Special Ability does not need to roll a die when entering a square adjacent to one or more Mine counters. Do not reveal any of the Mine counters. If the unit moves through more than one mined square, it may not use this Special Ability.",
"term": null,
"id": 30
},
{
"sec": "4.1",
"sub": "Landing options",
"page": 8,
"text": "These Recruitment Options can only be purchased if the Recruitment Tile bearing the same coloured stripes is present in the player's army. Just like a regular Recruitment Tile or Support Option, this Recruitment Option yields the represented units.",
"term": null,
"id": 31
},
{
"sec": "4.2",
"sub": "Ammo belts",
"page": 8,
"text": "Restricted to units with the Machine Gunner Special Ability\nThis option gives you 3 Ammo Belt markers. Each marker grants you a +2 bonus to one shot against an Infantry Unit or +1 bonus against a Light Vehicle.",
"term": null,
"id": 32
},
{
"sec": "4.2",
"sub": "Bangalores",
"page": 8,
"text": "Restricted to infantry\nThis option gives you 6 Bangalore markers. Instead of taking a Firing Action or a Movement Action, a unit may:\nA. Put a Bangalore marker between two squares in its ZoC.\nB. Add a Bangalore marker at the end of an already placed Bangalore marker.\nC. Set off a line of Bangalores (only if the unit also has the Engineer Special Ability). All units and Terrain Elements in squares on either side of the detonated line are caught in the explosion. Resolve the effects before discarding the destroyed Bangalore markers. Resolve every attack individually.",
"term": null,
"id": 33,
"figs": [
{
"img": "img/hon/omaha/rules/p8-1.webp",
"w": 513,
"h": 250
}
]
},
{
"sec": "4.2",
"sub": "Minefield",
"page": 9,
"text": "This defensive element provides sufficient mine counters to create either:\n• a large field of 8 counters at a cost of 45 points; • a large field of 4 counters at a cost of 25 points.\nEach Mine counter represents several mines. Therefore, it is not systematically removed from the board when it explodes.\nYou can deploy a Mine counter up to 3 Interspaces from your deployment area. Mine counters are deployed facedown so the values are hidden.\nThere are 3 different kinds of Mine counters, and you may choose the counters you want for your minefield from those available:\nAnti-personnel mines.\nAnti-tank mines.\nDecoy Mine (which has no Combat Values).\nMine counters are deployed on Interspaces (including inside buildings), and each must be adjacent (even diagonally) to another Mine counter belonging to the same minefield. A square that has a Mine counter on at least one of its 4 Interspaces is called a 'mined' square. The owner of the minefield is referred to as the defender.\nRevealing and Triggering Mine counters:\nAt the end of a Movement Action through one or more mined squares, even after exiting the minefield, a unit resolves the total amount of triggered mines as one single attack and rolls one die to check for Hits.\nFor each mined square crossed/occupied during his opponent's Movement Action, the defender designates which Mine counter (if there are several) will be triggered. This choice requires the defender to reveal the Mine counter. He may look at all counters before deciding.\nThe defender may choose to trigger a Mine counter that was already revealed. He thus exempts himself from revealing another one, even if nothing prohibits him from doing so.\nThe defender may choose to reveal a decoy Mine counter. The triggered Mine counter must be the one with the highest Combat Value against the moving unit.\nA revealed and/or triggered mine or decoy mine counter is NOT removed from the board (it actually represents several mines of which only one has just exploded).\nAt the first mined square the American unit crosses, the defender chooses to reveal the Mine counter A. He does not reveal the Mine counter B (an anti-tank mine) for the second square crossed, but instead he triggers the Mine counter A again. He then reveals the Mine counter C for the last mined square.",
"term": null,
"id": 34,
"figs": [
{
"img": "img/hon/omaha/rules/p9-1.webp",
"w": 491,
"h": 381
}
]
},
{
"sec": "4.2",
"sub": "Resolving the attack",
"page": 9,
"text": "At the end of the moving unit's action, its player rolls 1 die. To that result, he adds the appropriate Combat Value for the moving unit's type from each revealed Mine counter (1 per square). Use the side Defense Value for Heavy Vehicles. Terrain Elements do not grant their Defensive Bonuses.\nIf the result is equal to or higher than the Defense Value of the moving unit, the unit takes 1 Hit and receives 1 Suppressed Marker.\nOn a result of 1, the unit suffers no Hit and gets no Suppressed Marker, and the defender must choose and discard 1 Mine counter that was added to the roll. The defender can choose a Decoy Mine counter if it was crossed by the moving unit.\nIn the above example, where the American unit crossed 2 mined squares and ended its move on a third, the unit would take 1 Hit and get 1 Suppressed Marker with this result.\nA unit that has the Engineer Special Ability may clear an area of mines instead of moving or firing. Roll a die.\nOn a result of 1, the unit suffers a Hit. On any other result, discard all the Mine counters adjacent to the square the Engineer occupies. This ability does not protect units from mines that have not been removed yet.",
"term": null,
"id": 35
},
{
"sec": "4.2",
"sub": "Explosive charges",
"page": 10,
"text": "Restricted to infantry - Engineer\nThis option gives you 3 explosive Charge markers. Only units with the Engineer Special Ability can use them..\nAt any point of its Movement Action, either during the Activation Phase or the Supply Phase, a unit may place a single marker on a target in its ZoC. You may use several units or have a unit act twice (for example, with the Heroic character trait) to place several markers. The target can be a structure or a non-infantry unit. If a mobile target moves, it takes the marker with it.\nThe explosion happens at the end of the Supply Phase and has no area of effect.\nIf more than one marker of any type is placed on the same target, total the Combat Values or and make a single roll. Destruction values\nUse the side Defense Value of a Heavy Vehicle. Once the explosion occurs, discard the marker(s).",
"term": null,
"id": 36
},
{
"sec": "4.2",
"sub": "Gear",
"page": 10,
"text": "See the rules for each marker to know its limitations.\nThis option gives you 5 markers (as many as printed on the Recruitment Option). You must select them at the beginning of the game from all the markers that have the same colour stripes as the Gear recruitment option. You may not take more than 2 identical markers.",
"term": null,
"id": 37
},
{
"sec": "4.2",
"sub": "Position",
"page": 10,
"text": "Restricted to infantry\nThis option gives you 1 Forward Position. Instead of taking a Firing Action or a Movement Action, during the Activation Phase or the Supply Phase, a unit may put the tile on its square. A forward position tile may not be placed inside a building, rubble, a bunker, a water square, or any square Impassable to Infantry Units\nFront\nBack\nHedgerow side\nother side\nUse the tile's Hedgerow side for a position in a hedgerow, and its reverse side if you put it in any other type of terrain where it is allowed to be placed.",
"term": null,
"id": 38,
"figs": [
{
"img": "img/hon/omaha/rules/p10-1.webp",
"w": 373,
"h": 277
}
]
},
{
"sec": "4.2",
"sub": "Shovels",
"page": 10,
"text": "Restricted to infantry\nThis option gives you 4 Shovel markers. Each marker can be used in one of two ways:\nDuring an assault, it gives you a +1 bonus to the result of your roll. After a Movement Action, you may put a Shovel marker on its 'sand' side between the unit's square and any other square in its ZoC. You may only use it this way on the beach or in the desert.",
"term": null,
"id": 39
},
{
"sec": "4.2",
"sub": "Tank ammo",
"page": 10,
"text": "Restricted to primary weapons on Heavy Vehicles\nThis option gives you 3 markers. You must select them at the beginning of the game from the HE Shells and APC Shells markers that have the same colour stripes as the Tank Ammo recruitment option. You may not take more than 2 identical markers.",
"term": null,
"id": 40
},
{
"sec": "4.2",
"sub": "HE shells",
"page": 10,
"text": "Alternate Firing Action\nHE Shells allow the Howitzer Special Ability and require a red explosion Template.",
"term": null,
"id": 41
},
{
"sec": "4.2",
"sub": "APC shells",
"page": 10,
"text": "Each marker grants you a +1 bonus when firing at a Heavy Vehicle.",
"term": null,
"id": 42
},
{
"sec": "4.2",
"sub": "Tank gear",
"page": 10,
"text": "Restricted to Heavy and Light vehicles\nThis option gives you 3 markers. You must select them at the beginning of the game from the Fuel and Additional Shielding markers that have the same colour stripes as the Tank Gear recruitment option. You may not take more than 2 identical markers.\nFuel: Each marker increases the Movement Value of a vehicle by 1 square.\nAdditional shielding: Each marker grants you a +1 Defensive Bonus.",
"term": null,
"id": 43
},
{
"sec": "4.3",
"sub": "Guardian",
"page": 11,
"text": "Restricted to infantry\nDuring a Firing Action, Defensive Bonuses provided by Terrain Elements are increased by 1 for Infantry units.",
"term": null,
"id": 44
},
{
"sec": "4.3",
"sub": "Training",
"page": 11,
"text": "Training Character Traits grant the pictured Special Ability to the units of the Recruitment Tile in which the trait is slotted.",
"term": null,
"id": 45
},
{
"sec": "4.4",
"sub": "Aircraft",
"page": 11,
"text": "This Orders Option allows you to recruit 1 or 2 Aircraft units. (see Aviation rules p.12-13).",
"term": null,
"id": 46
},
{
"sec": "4.4",
"sub": "Artillery",
"page": 11,
"text": "This Orders Option gives you 3 Artillery Support markers. In order to use an Artillery Support marker, you must place a Numbered or Special Order Token on its tile. When you activate this option, put an explosion Template on any Interspace on the battlefield.\nThe scattering distance for this attack is 3 Interspaces. You may also place a Bluff Order Token as a ruse.",
"term": null,
"id": 47
},
{
"sec": "4.4",
"sub": "Battle plan",
"page": 11,
"text": "This Orders Option gives you 1 Special Order Token for the whole game. You may not have more than 2 Special Order Tokens.",
"term": null,
"id": 48,
"figs": [
{
"img": "img/hon/omaha/rules/p11-2.webp",
"w": 491,
"h": 443
}
]
},
{
"sec": "4.4",
"sub": "Smoke",
"page": 11,
"text": "This Orders Option gives you 3 Smoke templates. In order to use a Smoke template, you must assign a Numbered or Special Order Token to an available Smoke template. You may place a Bluff Order Token. Several Order Tokens can be assigned to several Smoke templates.\nWhen Activated, you can place the Smoke template on any Interspace on the board. Roll a die for scattering. Scattering for smoke is 1 Interspace. Once you've resolved scattering, put the Template on its -4 side.\nAt the end of the Supply Phase: remove the Templates already on their -2 side, then turn the -4 side Templates over onto their -2 side.\nAny Firing Action that goes into, through, or out of a square covered by a Smoke Template suffers the printed penalty.",
"term": null,
"id": 49,
"figs": [
{
"img": "img/hon/omaha/rules/p11-1.webp",
"w": 472,
"h": 243
}
]
},
{
"sec": "4.4",
"sub": "Tank ambush",
"page": 11,
"text": "This Orders Option gives you 1 large Haystack counter (see p.7).",
"term": null,
"id": 50
},
{
"sec": "4.5",
"sub": "Heroic",
"page": 11,
"text": "This customization gives the Character 1 Heroic marker.\nThis marker enables you to activate the Character one additional time. After this additional Activation, the Character receives 1 Suppressed Marker.",
"term": null,
"id": 51
},
{
"sec": "5",
"sub": null,
"page": 12,
"text": "Why do all German soldiers photographed in Normandy have their eyes glued to the sky, and why do they take the trouble to camouflage their vehicles under thick branches, or move only at night ? The answer is simple. Fear ! If you like the sweet sound of Stukas dive-bombing armored columns, the song of machine gun bursts mowing down infantry lines, or the concert of 250 kg bombs shaking the whole audience, then these aviation rules are for you.",
"term": null,
"id": 52,
"figs": [
{
"img": "img/hon/omaha/rules/p12-1.webp",
"w": 986,
"h": 321
}
]
},
{
"sec": "5",
"sub": "Aircraft units",
"page": 12,
"text": "Units with this Special Ability are not present on the battlefield: they fly over it.\n• Aircraft Units are recruited with Orders Options. The cost of these Recruitment Options is defined by the Aircraft you choose, as shown on the Aircraft’s Recruitment Tile.\n• When recruiting an Aircraft, place its Recruitment Tile next to the Command Tile containing the Orders Option.\nExample: The American player decides to recruit a P-51 Mustang. The Orders Option is slotted into the Field Command’s Command Tile and the aircraft’s Recruitment Tile is placed next to it. The cost of this Orders Option is 50 points.\nWARNING: Action Cards that allow moving or changing\nOrder Tokens cannot be played for Aircraft units.",
"term": null,
"id": 53,
"figs": [
{
"img": "img/hon/omaha/rules/p12-3.webp",
"w": 487,
"h": 136
}
]
},
{
"sec": "5",
"sub": "Planespotting",
"page": 12,
"text": "At the end of the Order Phase, the visibility status of Aircraft units is either “In the clouds” or “In plain sight” for the rest of the Turn.\nIn the clouds: the Aircraft Unit has a Bluff Order Token. It is too far away to Attack or be targeted, even by an Anti-Aircraft unit. Reveal the Bluff Order Token at the beginning of the Activation Phase.\nIn plain sight: the Aircraft Unit did not get a Bluff Order Token. It flies over the battlefield and can be targeted but may only take a Firing Action if it got a Numbered or Special Order Token.\nExample: The German player places an Order Token on the Aircraft Unit’s Recruitment Tile, which is then Activated and may be targeted that turn.",
"term": null,
"id": 54,
"figs": [
{
"img": "img/hon/omaha/rules/p12-2.webp",
"w": 446,
"h": 233
}
]
},
{
"sec": "5",
"sub": "Long range penalty",
"page": 12,
"text": "IMPORTANT: NEVER apply the Long Range Penalty,\nwhenever an Aircraft Unit is involved in a Firing Action, whether as attacker or target.",
"term": null,
"id": 55
},
{
"sec": "5",
"sub": "Aircraft taking a firing action",
"page": 12,
"text": "• Aircraft Units can only take a Firing Action when a Numbered or Special Order Token is placed on their Recruitment Tile.\n• Aircraft Units can target ground units or other Aircraft Units.\n• Aircraft Units use the side Defense Value when targeting a Heavy Vehicle.\n• Aircraft Units always have a Clear Line of Sight to every Unit, except those inside Buildings.\n• Units using cover of any non-building terrain (woods, hedges, defensive positions,...) get the benefit from that Terrain’s Defensive Bonus\n• Aircraft Units cannot spot concealed units.",
"term": null,
"id": 56
},
{
"sec": "5",
"sub": "Other units taking a firing action",
"page": 12,
"text": "• Units without Anti-Aircraft Special Abilities can only target Aircraft Units with a Numbered, or Special Order Token placed on their Recruitment Tile.\n• Only units with the Machine Gunner and/or Anti-Aircraft Special Abilities can take a Firing Action against Aircraft Units.\n• A Heavy Vehicle cannot use its Primary Weapon (red outline) for a Firing Action against Aircraft Units, unless that Primary Weapon has the Anti-Aircraft Special Ability. Only if the vehicle has a Secondary Weapon Special (yellow outline) with the Machine Gunner Ability can the vehicle shoot at Aircraft Units.\nSpecial Ability, as • Units with the Limited Range well as Units with a Special Ability that makes use of, cannot fire at Aircraft Units. any Template\n• Units with a Limited Firing Arc cannot fire at Aircraft Units, unless these Units have the Anti-Aircraft Special Ability. In this case, the Limited Firing Arc is ignored.\n• All Units, not in Buildings, have a Clear Line of Sight to any Aircraft Units except those “in the clouds”.",
"term": null,
"id": 57
},
{
"sec": "5",
"sub": "Anti-aircraft",
"page": 13,
"text": "Units with the Anti-Aircraft Special Ability can Fire at an Aircraft Unit, even if that Aircraft Unit does not have a Numbered, or Special Order Token placed on its Recruitment Tile. However, a Unit with this Special Ability cannot fire at any Aircraft Unit that is “in the clouds”.\nAlways add any bonus (+1, +2,...) shown next to the AA Special Ability, to the die roll. If the target is an Aircraft with an Order Token: calculate the Speed Penalty normally (see Speed Penalty). If the target is an Aircraft without an Order Token, apply a standard -2 Speed Penalty instead.",
"term": null,
"id": 58
},
{
"sec": "5",
"sub": "Speed penalty",
"page": 13,
"text": "IMPORTANT: Any unit (land and air) that takes a\nFiring Action against an Aircraft Unit must always apply the Speed Penalty.\nThe Speed Penalty is determined by the numerical difference between the Order Token of the firing unit and that of the Aircraft Unit. Always subtract the lowest value from the highest.\nThe player whose Aircraft Unit was targeted must reveal the Order Token if its value had not been disclosed yet. Replace this Token face down again on the Aviation Recruitment Tile until the Aircraft Unit is Activated.\nOPPORTUNITY FIRE\nA unit using Opportunity Fire in response to an Aircraft that has fired, must use the value of the last revealed Numbered Order Token to resolve the Speed Penalty. Since this is the targeted Aircraft’s own Order Token, the Speed Penalty for Opportunity Fire is always 0.",
"term": null,
"id": 59
},
{
"sec": "5",
"sub": "Special order",
"page": 13,
"text": "If any unit with a Special Order Token targets an Aircraft Unit with a Numbered Order Token, then the Speed Penalty is the difference between the value of the Aircraft Unit’s Order Token and that of the last revealed Numbered Order Token (of either player) before this Firing Action.\nIf an aircraft is Activated with a Special Order before it has been targeted, its Speed Penalty value also is that of the last revealed Numbered Order Token (of either player).\nThis value can be 0 if the plane is Activated before Order Number 1.\nIf the target is an Aircraft with an unrevealed Special Order Token apply a standard -2 Speed Penalty.\nExamples: An Aircraft Unit with Order Token #3 is targeted by a unit:\nwith Order Token #2, the Speed Penalty (3-2) is 1.\nwith Order Token #5, the Speed Penalty (5-3) is 2.\nwith Order Token #3, the Speed Penalty (3-3) is 0.\nwith Opportunity Fire, the Speed Penalty is 0.",
"term": null,
"id": 60
},
{
"sec": "5",
"sub": "Bombs and rockets",
"page": 13,
"text": "Bomb or rocket markers shown on an Aircraft’s Recruitment Tile are used for Alternate Firing Actions.\nThe German FOCKE-WULF has 2 SC-500 bombs. It can use them in an Alternate Firing Action with the Howitzer Special Ability while using the explosion template with the black Combat Values.",
"term": null,
"id": 61
},
{
"sec": "6",
"sub": "Define the game",
"page": 14,
"text": "In order to start, you must define the size of the Defender's army. The defender does not have to be the German player. The number of army points will depend on the importance of the engagement and will define the terrain elements players must place.",
"term": null,
"id": 62
},
{
"sec": "6",
"sub": "Size of the battlefield",
"page": 14,
"text": "The number of Terrain Boards that make up the battlefield. Half of the Terrain Boards must represent the beach with the sea. Place the indicated number of Terrain Tiles on the battlefield (bunker, building, defensive positions), as well as the Defensive Obstacles (barbed wire and Czech hedgehogs). Half of them are chosen and placed by the Attacker, the other half by the Defender.",
"term": null,
"id": 63
},
{
"sec": "6",
"sub": "Number of objectives",
"page": 14,
"text": "The attacker must control a certain number in order to win the game. This number is indicated in parentheses.",
"term": null,
"id": 64
},
{
"sec": "6",
"sub": "Number of bonus tactics",
"page": 14,
"text": "Randomly select the number of Tactical Bonuses indicated from among the 6 available. Try not to look at them when you place them, nor at the ones you set aside.",
"term": null,
"id": 65
},
{
"sec": "6",
"sub": "Number of turns",
"page": 14,
"text": "The number of Turns that the game will last.",
"term": null,
"id": 66
},
{
"sec": "6",
"sub": "Create the armies",
"page": 14,
"text": "Once all these elements are defined, assemble your forces.\n• The Defender constructs his army by spending his army points. He divides them into groups (see table, column 1). Each group must have a value of at least 100 points.\n• The Attacker takes the number of Recruitment Tiles and Landing Craft indicated by the table. This could be a combat group or a Field Command / Feldkommando. The attacker must take at least one small landing craft. He puts into an opaque bag all the option tiles corresponding to his Recruitment Tiles, the common options (gear, units, vehicles, character traits) and the Orders Options if he purchased a Command Tile.\nEach player draws a number of Action Cards as indicated by the table.",
"term": null,
"id": 67
},
{
"sec": "6",
"sub": "Initiative",
"page": 14,
"text": "The Attacker always has the initiative. Thus he deploys first in the landing craft (leaving one landing craft empty). The Defender positions his first group in the deployment zone. This zone is all the squares of the grassy bluff above the beach.",
"term": null,
"id": 68
},
{
"sec": "6",
"sub": "Victory conditions and particular information",
"page": 14,
"text": "Each turn, at the end of the Supply Phase, the attacker draws the number of Option Tiles indicated by the table. He keeps the number indicated in parentheses, and discards the others (he does not put them back in the bag). He divides the options between the slots on the Recruitment Tiles, respecting the rules of the coloured stripes. If he unlocks an Order Special Ability this way, he gains an Order Token for the next turn. If the option cannot be slotted into a Recruitment Tile, it is discarded. He then deploys his new units, respecting the Transport rules for landing craft.\nWARNING: One Landing Craft must always remain empty.\nAdjust the number of Order Tokens at the end of each Supply Phase, according to any casualties and units entering the game.",
"term": null,
"id": 69
},
{
"sec": "6",
"sub": "Defender reinforcements",
"page": 14,
"text": "The defender brings his groups into play in the following Supply Phases:\n• 2 Groups: The second group enters in Turn 2.\n• 3 Groups: The second group enters in Turn 2, the third in Turn 4.\n• 4 Groups: The second group enters in Turn 2, the third in Turn 4, the fourth in Turn 6.\nPlace the event markers on the turn chart so you don't forget the groups arriving later in the game. Use neutral markers if you don't have enough markers in the defender's colour. These units enter on any space on the side opposite the beach.\nThe game stops after the END Turn, or when the attacker controls the number of objectives defined by the table below. If the attacker has not fulfilled his objective, after the END Turn, the defender wins the game.",
"term": null,
"id": 70
},
{
"sec": "6",
"sub": "Landing table",
"page": 14,
"text": "Choose a row for the size of the engagement. Objectives show the number to place, with the number the attacker must control in parentheses. Option tiles show the number drawn each turn, with the number kept in parentheses.",
"term": null,
"table": {
"head": [
"Defender army",
"Battlefield",
"Objectives",
"Bonus tactics",
"Turns",
"Attacker army",
"Attacker heroes",
"Action cards",
"Option tiles"
],
"rows": [
[
"200 - 250 points, 1 group",
"4 boards, 2 terrain tiles, 5 obstacles",
"1 (1)",
"2",
"6",
"2 tiles, 2 landing craft",
"1",
"3",
"2 (1)"
],
[
"300 - 350 points, 2 groups",
"4 boards, 4 terrain tiles, 10 obstacles",
"2 (2)",
"3",
"8",
"3 tiles, 3 landing craft",
"2",
"4",
"3 (2)"
],
[
"400 - 450 points, 3 groups",
"6 boards, 6 terrain tiles, 15 obstacles",
"3 (2)",
"4",
"8",
"4 tiles, 4 landing craft",
"3",
"4",
"4 (3)"
]
]
},
"id": 71
}
]
};
