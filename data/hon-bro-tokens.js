window.HTS_TOKENS = window.HTS_TOKENS || {};
window.HTS_TOKENS["hon-bro"] = {
"game": "hon",
"box": "bro",
"title": "Tokens and markers",
"source": "Rulebook V4.1 and Scenario Booklet V2.4",
"groups": [
"Objectives",
"Tactical bonuses",
"Turn chart",
"Combat markers"
],
"entries": [
{
"id": "primary",
"name": "Primary objective",
"group": "Objectives",
"summary": "Orange cross marker. Earns victory points or meets a scenario condition.",
"text": [
"Each objective marker earns you victory points or meets a special condition of the scenario. You control one when you are the only player with at least one infantry unit in one of the 4 adjacent squares, or in the terrain element (building, craters and so on), at the end of a Supply Phase. If your opponent also has a unit there, the objective stays neutral.",
"A marker with a faction symbol can only help that army. Enemy units can still stop you controlling it by standing in an adjacent square or in the terrain element. Once it is controlled, leave it on the board and turn it over to its controlled side. The enemy can still take it back.",
"A neutral marker helps whoever controls it. Swap it for the marker showing that army symbol while they hold it, and swap again if control changes sides."
],
"faces": [
{
"img": "img/hon/bro/tokens/primary-objective-ge-a.webp",
"w": 283,
"h": 283,
"label": "German, side A",
"tall": false
},
{
"img": "img/hon/bro/tokens/primary-objective-ge-b.webp",
"w": 283,
"h": 283,
"label": "German, side B",
"tall": false
},
{
"img": "img/hon/bro/tokens/primary-objective-us-a.webp",
"w": 283,
"h": 283,
"label": "American, side A",
"tall": false
},
{
"img": "img/hon/bro/tokens/primary-objective-us-b.webp",
"w": 283,
"h": 283,
"label": "American, side B",
"tall": false
},
{
"img": "img/hon/bro/tokens/primary-objective-unofficial.webp",
"w": 283,
"h": 283,
"label": "Neutral (file named unofficial)",
"tall": false
}
],
"facts": [],
"links": [
{
"label": "Scenario rules in the booklet",
"href": "scenarios.html?e=rules"
}
],
"src": "Scenario Booklet V2.4, page 3"
},
{
"id": "secondary",
"name": "Secondary objective",
"group": "Objectives",
"summary": "Yellow cross marker. Taken off the board when you control it.",
"text": [
"Control works the same way as a primary objective. When a player takes control of a secondary objective, remove it from the board and put it next to that player's Recruitment Tiles.",
"Depending on the scenario, the player then scores points or reaches a particular stage in the operation."
],
"faces": [
{
"img": "img/hon/bro/tokens/secondary-objective-ge-a.webp",
"w": 283,
"h": 283,
"label": "German, side A",
"tall": false
},
{
"img": "img/hon/bro/tokens/secondary-objective-ge-b.webp",
"w": 283,
"h": 283,
"label": "German, side B",
"tall": false
},
{
"img": "img/hon/bro/tokens/secondary-objective-neutral.webp",
"w": 283,
"h": 283,
"label": "Neutral",
"tall": false
},
{
"img": "img/hon/bro/tokens/secondary-objective-us-a.webp",
"w": 283,
"h": 283,
"label": "American, side A",
"tall": false
},
{
"img": "img/hon/bro/tokens/secondary-objective-us-b.webp",
"w": 283,
"h": 283,
"label": "American, side B",
"tall": false
}
],
"facts": [],
"links": [
{
"label": "Scenario rules in the booklet",
"href": "scenarios.html?e=rules"
}
],
"src": "Scenario Booklet V2.4, pages 3 and 4"
},
{
"id": "bonus",
"name": "Tactical bonuses",
"group": "Tactical bonuses",
"summary": "Crate markers you collect like a secondary objective. Each is consumable, permanent or immediate.",
"text": [
"Tactical objectives are controlled the same way as secondary objectives. The scenario says how many to place. Each bonus is Consumable (spend it once), Permanent (it lasts) or Immediate (it applies when revealed)."
],
"faces": [
{
"img": "img/hon/bro/tokens/bonus-tactic.webp",
"w": 284,
"h": 283,
"label": "On the board",
"tall": false
},
{
"img": "img/hon/bro/tokens/bonus-tactic-initiative.webp",
"w": 284,
"h": 284,
"label": "Initiative",
"tall": false
},
{
"img": "img/hon/bro/tokens/bonus-tactic-instant-order.webp",
"w": 284,
"h": 284,
"label": "Strategist",
"tall": false
},
{
"img": "img/hon/bro/tokens/bonus-tactic-resupply.webp",
"w": 284,
"h": 283,
"label": "Supply",
"tall": false
},
{
"img": "img/hon/bro/tokens/bonus-tactic-permanent-order.webp",
"w": 283,
"h": 284,
"label": "Tactician",
"tall": false
},
{
"img": "img/hon/bro/tokens/bonus-tactic-blank.webp",
"w": 284,
"h": 284,
"label": "Empty",
"tall": false
},
{
"img": "img/hon/bro/tokens/bonus-tactic-objective.webp",
"w": 283,
"h": 284,
"label": "Unlisted (file named objective)",
"tall": false
}
],
"facts": [
[
"Initiative x1 (Consumable)",
"Spend it to keep the Initiative this turn. Flip the Initiative counter to your army side. On your opponent's next turn, he regains the Initiative."
],
[
"Strategist x1 (Consumable)",
"Spend it to get a Special Order Token this turn. You may not have more than 2 Special Order Tokens per turn."
],
[
"Supply x1 (Consumable)",
"Spend it to take 3 spent Gear markers and put them back on their Option tile. They do not have to be the same type."
],
[
"Asset x2 (Consumable)",
"Spend it to replenish your hand of cards straight away."
],
[
"Intuitive x1 (Permanent)",
"+1 Action Card to your hand total."
],
[
"Tactician x3 (Permanent)",
"+1 Numbered Order Token."
],
[
"Explosion x1 (Immediate)",
"The unit that reveals it suffers a grenade hit, and so do all units in squares adjacent to the bonus."
],
[
"Empty x1 (Immediate)",
"Brings nothing."
],
[
"Scans without a booklet entry",
"The scans include a crate with an orange cross (file named objective). The booklet lists no bonus with that picture. There are no scans for Asset, Intuitive or Explosion."
]
],
"links": [
{
"label": "Scenario rules in the booklet",
"href": "scenarios.html?e=rules"
}
],
"src": "Scenario Booklet V2.4, page 4"
},
{
"id": "initiative",
"name": "Initiative marker",
"group": "Turn chart",
"summary": "Shows who has the Initiative. Moves down the turn chart each turn.",
"text": [
"The Initiative marker shows which player has the Initiative. It moves one square down the turn chart to count the turns, and it is flipped over when the Initiative changes.",
"In the Supply Phase (step 8) you move it one notch down the chart and turn it over to find the new Initiative. The other player has it for the next Game Turn.",
"The side with the American star is the American Initiative. The side with the iron cross is the German one."
],
"faces": [
{
"img": "img/hon/bro/tokens/initiative-a.webp",
"w": 211,
"h": 211,
"label": "American side",
"tall": false
},
{
"img": "img/hon/bro/tokens/initiative-b.webp",
"w": 211,
"h": 211,
"label": "German side",
"tall": false
}
],
"facts": [],
"links": [
{
"label": "Rules: Initiative",
"href": "rules.html?q=initiative"
},
{
"label": "Scenario rules in the booklet",
"href": "scenarios.html?e=rules"
}
],
"src": "Rulebook V4.1, page 16; Scenario Booklet V2.4, page 4"
},
{
"id": "turn",
"name": "Turn chart",
"group": "Turn chart",
"summary": "Eight turn spaces with a column beside them for event and END markers.",
"text": [
"The turn chart counts the turns. The Initiative marker sits on the current turn. Special markers go in the column beside the turn number, to show on which turn an event or a condition must happen.",
"The game ends when the final turn is completed. The chart has eight turn spaces."
],
"faces": [
{
"img": "img/hon/bro/tokens/turn-tracker.webp",
"w": 359,
"h": 1300,
"label": "Turn chart, 8 turns",
"tall": true
}
],
"facts": [],
"links": [
{
"label": "Scenario rules in the booklet",
"href": "scenarios.html?e=rules"
}
],
"src": "Scenario Booklet V2.4, page 4"
},
{
"id": "event",
"name": "Event markers",
"group": "Turn chart",
"summary": "Placed on the turn chart. Each scenario says what happens on that turn.",
"text": [
"Event markers go in the turn chart column beside the turn they apply to. What each one does is set by the scenario.",
"Marker 1 is a German or an American event. Marker 2 is an American or a scenario event. Marker 3 is a German or a scenario event."
],
"faces": [
{
"img": "img/hon/bro/tokens/event-1-a.webp",
"w": 211,
"h": 211,
"label": "American event",
"tall": false
},
{
"img": "img/hon/bro/tokens/event-1-b.webp",
"w": 211,
"h": 211,
"label": "German event",
"tall": false
},
{
"img": "img/hon/bro/tokens/event-2-a.webp",
"w": 211,
"h": 211,
"label": "American event",
"tall": false
},
{
"img": "img/hon/bro/tokens/event-2-b.webp",
"w": 211,
"h": 211,
"label": "Scenario event, both armies",
"tall": false
},
{
"img": "img/hon/bro/tokens/event-3-a.webp",
"w": 211,
"h": 211,
"label": "German event",
"tall": false
},
{
"img": "img/hon/bro/tokens/event-3-b.webp",
"w": 211,
"h": 211,
"label": "Scenario event, both armies",
"tall": false
}
],
"facts": [
[
"German event",
"German army specific event marker, as per the scenario."
],
[
"Scenario event",
"Event marker for both armies, as per the scenario."
],
[
"American event",
"American army specific event marker, as per the scenario."
]
],
"links": [
{
"label": "Scenario rules in the booklet",
"href": "scenarios.html?e=rules"
}
],
"src": "Scenario Booklet V2.4, page 4"
},
{
"id": "end",
"name": "END marker",
"group": "Turn chart",
"summary": "Marks the last turn of the game.",
"text": [
"Place it beside the turn number the scenario gives. The game ends when that turn is completed."
],
"faces": [
{
"img": "img/hon/bro/tokens/end.webp",
"w": 211,
"h": 211,
"label": "END",
"tall": false
}
],
"facts": [],
"links": [
{
"label": "Scenario rules in the booklet",
"href": "scenarios.html?e=rules"
}
],
"src": "Scenario Booklet V2.4, page 4"
},
{
"id": "suppressed",
"name": "Suppressed and Activated markers",
"group": "Combat markers",
"summary": "Suppressed: -2 to die rolls and to movement. Activated: the unit is done for the turn.",
"text": [
"Suppressed marker: a unit with a temporary physical or psychological condition that limits its ability to fight, such as suppressive fire or lost morale. Each marker gives a -2 penalty to all of the unit's die rolls and a -2 penalty to its Movement Value. If its Movement Value drops to 0 or less, the unit is Immobilized. There is no maximum number of Suppressed markers.",
"Enemy units ignore the Zone of Control of a unit with a Suppressed marker. A unit that receives one during its Movement Action finishes that action without the penalty. In the Supply Phase you discard one (and only one) Suppressed marker from each of your units.",
"Activated marker: put on a unit that Action Cards or special abilities, such as Opportunity Fire, activate when it has no Order Token or has not been activated yet. The unit loses any Order Token it has (without revealing it) and can no longer be activated or act for the rest of the turn, except to defend itself in an Assault. It cannot take a Movement Action in the Supply Phase either."
],
"faces": [
{
"img": "img/hon/bro/tokens/suppressed-a.webp",
"w": 210,
"h": 210,
"label": "Suppressed, side A",
"tall": false
},
{
"img": "img/hon/bro/tokens/suppressed-b.webp",
"w": 210,
"h": 210,
"label": "Activated, side B",
"tall": false
}
],
"facts": [],
"links": [
{
"label": "Rules: Suppressed",
"href": "rules.html?q=suppressed"
}
],
"src": "Rulebook V4.1, pages 16 and 24"
},
{
"id": "damage",
"name": "Vehicle damage markers",
"group": "Combat markers",
"summary": "Six hit locations on heavy vehicles: crew, tracks, hull, primary weapon, destruction.",
"text": [
"When a heavy vehicle is hit, the attacker rolls one die and puts the Damage marker with that number on the vehicle. The symbol shows the effect.",
"A second Damage marker of the same kind destroys the vehicle. A double hit on a heavy vehicle destroys it automatically."
],
"faces": [
{
"img": "img/hon/bro/tokens/vehicle-damage-1-a.webp",
"w": 210,
"h": 210,
"label": "1 Crew",
"tall": false
},
{
"img": "img/hon/bro/tokens/vehicle-damage-2-a.webp",
"w": 210,
"h": 210,
"label": "2 Tracks",
"tall": false
},
{
"img": "img/hon/bro/tokens/vehicle-damage-3-4-a.webp",
"w": 210,
"h": 210,
"label": "3 or 4 Hull",
"tall": false
},
{
"img": "img/hon/bro/tokens/vehicle-damage-5-a.webp",
"w": 210,
"h": 210,
"label": "5 Primary weapon",
"tall": false
},
{
"img": "img/hon/bro/tokens/vehicle-damage-1-b.webp",
"w": 210,
"h": 210,
"label": "Reverse, 6 Destruction",
"tall": false
}
],
"facts": [
[
"1 Crew",
"Each turn the vehicle can only fire one of its weapons, not both."
],
[
"2 Tracks",
"The vehicle may no longer take Movement Actions for the rest of the game. If it was moving, it stops immediately."
],
[
"3 or 4 Hull",
"Put two Suppressed markers on the vehicle as well as this Damage marker. If it was moving, it stops immediately."
],
[
"5 Primary weapon",
"The vehicle's Primary Weapon is destroyed."
],
[
"6 Destruction",
"The vehicle is destroyed. Turn it over to its Wrecked side."
]
],
"links": [
{
"label": "Rules: Damage",
"href": "rules.html?q=damage"
}
],
"src": "Rulebook V4.1, page 15"
},
{
"id": "destruction",
"name": "Destruction markers",
"group": "Combat markers",
"summary": "Count damage on structures and vehicle wrecks. 1 point side and 2 point side.",
"text": [
"Units with the Destruction special ability can destroy structures. Roll as many dice as the symbol shows. Each result of 4 or higher lets you place a new Destruction marker on its 1 point side, or turn a 1 point marker to its 2 point side.",
"When the points on the markers reach the value of the structure, it is destroyed. A vehicle wreck is removed. Any other terrain element is turned over to its rubble side, and every infantry unit inside gets 1 Suppressed marker."
],
"faces": [
{
"img": "img/hon/bro/tokens/destruction-a.webp",
"w": 211,
"h": 211,
"label": "1 point",
"tall": false
},
{
"img": "img/hon/bro/tokens/destruction-b.webp",
"w": 210,
"h": 210,
"label": "2 points",
"tall": false
}
],
"facts": [],
"links": [
{
"label": "Rules: Destruction",
"href": "rules.html?q=destruction"
}
],
"src": "Rulebook V4.1, page 22"
},
{
"id": "flamer",
"name": "Flamethrower template",
"group": "Combat markers",
"summary": "Long template for a flamethrower attack. Everything it touches gets a Suppressed marker.",
"text": [
"Flamethrower is an alternate firing action. The firing unit has Fire on the Move (-1) and uses the Combat Values printed on the template. Put the narrow end at the centre of the firing counter's square, or on the red dot on the counter, and point the template in any direction your firing arc allows.",
"Any unit even partly under the template is affected, and each attack is resolved on its own. The template is affected by obstacles, and stops once it passes through the centre of a square holding a vehicle. Every unit hit, infantry or vehicle, also gets a Suppressed marker.",
"An infantry unit with the flamethrower ability is removed from the game if it loses an Assault, but it is turned over if a Firing Action destroys it."
],
"faces": [
{
"img": "img/hon/bro/tokens/flamer.webp",
"w": 240,
"h": 1175,
"label": "Flamethrower template",
"tall": true
}
],
"facts": [
[
"Where it comes from",
"The Flamer option (20 points) on a Character, or a flamethrower unit. See Heroes and equipment."
]
],
"links": [
{
"label": "Rules: Flamethrower",
"href": "rules.html?q=flamethrower"
},
{
"label": "Heroes and equipment",
"href": "heroes.html"
}
],
"src": "Rulebook V4.1, page 22"
}
]
};
