window.HTS_TOKENS = window.HTS_TOKENS || {};
HTS_TOKENS["hon-hos"] = {
"game": "hon",
"box": "hos",
"title": "Tokens and markers",
"source": "Heroes of Stalingrad rulebook and Core Set punchboards",
"groups": [
"Order tokens",
"Turn chart",
"Effect markers",
"Damage and destruction",
"Templates",
"Objective markers"
],
"entries": [
{
"id": "order-numbered",
"name": "Numbered Order Tokens",
"group": "Order tokens",
"summary": "Each activation starts with one of these. Place them face down, one per unit.",
"text": [
"You get as many Numbered Order Tokens as the sum of all Order stars from officers, Personal Orders, Command options and tile special abilities. Take the ones with the lowest numbers.",
"The player with the Initiative places all of his tokens on the units he wants to activate, then his opponent does the same. Numbers face the owner, so the opponent cannot read them. Units activate in numerical order. A unit can never hold more than one Order Token.",
"If you have no Numbered or Special Order Token to assign, you lose the game at once (sudden death)."
],
"faces": [
{
"img": "img/hon/hos/tokens/order-numbered.webp",
"w": 380,
"h": 130,
"label": "Numbered tokens, Soviet red and German green",
"tall": false
}
],
"facts": [
[
"Limit",
"10 numbered tokens"
],
[
"Placed",
"Order Phase"
],
[
"Revealed",
"Activation Phase, lowest number first"
]
],
"links": [],
"src": "Heroes of Stalingrad rulebook, p.3, p.4"
},
{
"id": "order-bluff",
"name": "Bluff Order Tokens",
"group": "Order tokens",
"summary": "A blank token that fools your opponent. It activates nothing.",
"text": [
"You may use a Bluff token in addition to your other Order Tokens. Its back matches the other Order Tokens, and you place it at the same time. It does not activate the unit. Its only job is to make your opponent think you might.",
"Discard all Bluff Order Tokens in step 2 of the Supply Phase. A Bluff token can pay for an Order such as Artillery Support."
],
"faces": [
{
"img": "img/hon/hos/tokens/order-bluff.webp",
"w": 260,
"h": 132,
"label": "Bluff tokens, Soviet red and German green",
"tall": false
}
],
"facts": [
[
"Limit",
"2 Bluff tokens"
],
[
"Discarded",
"Supply Phase, step 2"
]
],
"links": [],
"src": "Heroes of Stalingrad rulebook, p.3, p.25, p.26"
},
{
"id": "initiative",
"name": "Initiative marker",
"group": "Turn chart",
"summary": "Shows who has the Initiative. It moves down the Turn Chart each turn.",
"text": [
"The player with the Initiative acts first in every phase of the Game Turn. The marker sits beside the current turn on the Turn Chart.",
"At the end of the Supply Phase, move it one notch down the chart and turn it over to find the new Initiative. The Soviet side shows the red star, the German side the iron cross."
],
"faces": [
{
"img": "img/hon/hos/tokens/initiative-soviet.webp",
"w": 210,
"h": 210,
"label": "Soviet side",
"tall": false
},
{
"img": "img/hon/hos/tokens/initiative-german.webp",
"w": 202,
"h": 210,
"label": "German side",
"tall": false
}
],
"facts": [],
"links": [],
"src": "Heroes of Stalingrad rulebook, p.3, p.26"
},
{
"id": "turn-chart",
"name": "Turn chart",
"group": "Turn chart",
"summary": "Eight turn spaces, each with a star slot beside it for markers.",
"text": [
"The chart counts the Game Turns. The Initiative marker sits on the current turn. Scenario markers go in the slot beside a turn number to show when an event or the end of the game happens.",
"The chart has eight turns."
],
"faces": [
{
"img": "img/hon/hos/tokens/turn-chart.webp",
"w": 381,
"h": 1300,
"label": "Turn chart, 8 turns",
"tall": true
}
],
"facts": [
[
"Turns",
"8"
]
],
"links": [],
"src": "Heroes of Stalingrad rulebook, p.3, p.10"
},
{
"id": "event",
"name": "Event markers",
"group": "Turn chart",
"summary": "Placed on the Turn Chart. The scenario says what each one does.",
"text": [
"Event markers go in the slot beside the turn they belong to. What each one triggers is set by the scenario. The Soviet marker is for a Soviet specific event, the German marker for a German one, and the plain marker for an event that affects both armies."
],
"faces": [
{
"img": "img/hon/hos/tokens/event-soviet.webp",
"w": 210,
"h": 203,
"label": "Soviet event",
"tall": false
},
{
"img": "img/hon/hos/tokens/event-german.webp",
"w": 210,
"h": 210,
"label": "German event",
"tall": false
},
{
"img": "img/hon/hos/tokens/event-neutral.webp",
"w": 210,
"h": 210,
"label": "Scenario event, both armies",
"tall": false
}
],
"facts": [],
"links": [],
"src": "Core Set punchboard 5 and 6; scenario setup"
},
{
"id": "end",
"name": "END marker",
"group": "Turn chart",
"summary": "Marks the last turn of the game.",
"text": [
"Place it beside the turn number the scenario gives. The game is over when that turn is completed."
],
"faces": [
{
"img": "img/hon/hos/tokens/end.webp",
"w": 210,
"h": 210,
"label": "END",
"tall": false
}
],
"facts": [],
"links": [],
"src": "Core Set punchboard 5 and 6; scenario setup"
},
{
"id": "suppressed",
"name": "Suppressed Marker",
"group": "Effect markers",
"summary": "A unit under stress. Each marker is -2 to its die rolls and its Movement Value.",
"text": [
"A Suppressed Marker shows a unit caught by suppressive fire, shaken, or simply in dire straits. Each marker inflicts a -2 penalty to all of the unit's die rolls, except scattering and Destruction, and -2 to its Movement Value. If its Movement Value drops to 0 or less, the unit is immobilised. The markers are cumulative.",
"Enemy infantry units ignore the Zone of Control of a unit with a Suppressed Marker. A unit that gets one during its Movement Action finishes that action without the penalty.",
"In the Supply Phase each unit discards one, and only one, Suppressed Marker."
],
"faces": [
{
"img": "img/hon/hos/tokens/suppressed.webp",
"w": 210,
"h": 210,
"label": "Suppressed -2",
"tall": false
}
],
"facts": [
[
"Penalty",
"-2 to die rolls and Movement"
],
[
"Discarded",
"One per unit each Supply Phase"
]
],
"links": [],
"src": "Heroes of Stalingrad rulebook, p.22, p.26"
},
{
"id": "activated",
"name": "Activated marker",
"group": "Effect markers",
"summary": "Shows a unit has been activated without an Order Token.",
"text": [
"Action Cards and special abilities such as Opportunity Fire can activate a unit with no Order Token. Put an Activated marker on it when that happens.",
"A unit that gets an Activated marker loses any Order Token it holds, without revealing it. It can no longer be activated or take an action for the rest of the turn, except to defend itself in an Assault. It cannot take a Movement Action in the Supply Phase."
],
"faces": [
{
"img": "img/hon/hos/tokens/activated.webp",
"w": 210,
"h": 203,
"label": "Activated",
"tall": false
}
],
"facts": [],
"links": [],
"src": "Heroes of Stalingrad rulebook, p.22, p.27"
},
{
"id": "damage",
"name": "Damage markers",
"group": "Damage and destruction",
"summary": "Show where a Heavy Vehicle has been hit. Numbered 1 to 6.",
"text": [
"When you score a Hit on a Heavy Vehicle, roll one die and place the Damage Marker that matches the number. Its symbol shows the effect.",
"1 Crew: the vehicle can only fire one of its weapons each turn. 2 Tracks: no more Movement Actions for the rest of the game. 3 or 4 Hull: two Suppressed Markers as well. 5 Primary weapon: destroyed. 6 or more: the vehicle is destroyed and turned to its wreck side.",
"A second Damage Marker of the same kind destroys the vehicle, and so does a double Hit. A Mechanic can remove one Damage marker instead of firing."
],
"faces": [
{
"img": "img/hon/hos/tokens/damage-1.webp",
"w": 210,
"h": 209,
"label": "1 Crew",
"tall": false
},
{
"img": "img/hon/hos/tokens/damage-2.webp",
"w": 210,
"h": 208,
"label": "2 Tracks",
"tall": false
},
{
"img": "img/hon/hos/tokens/damage-3-4.webp",
"w": 210,
"h": 207,
"label": "3 or 4 Hull",
"tall": false
},
{
"img": "img/hon/hos/tokens/damage-5.webp",
"w": 210,
"h": 208,
"label": "5 Primary weapon",
"tall": false
},
{
"img": "img/hon/hos/tokens/damage-6.webp",
"w": 210,
"h": 210,
"label": "6 Destruction",
"tall": false
}
],
"facts": [
[
"Roll",
"One die, matched to the marker"
]
],
"links": [],
"src": "Heroes of Stalingrad rulebook, p.9"
},
{
"id": "destruction",
"name": "Destruction markers",
"group": "Damage and destruction",
"summary": "Count damage to a structure. 1 point on one side, 2 on the other.",
"text": [
"A unit with the Destruction special ability rolls as many dice as the value shows. Each 4 or more lets you place a new marker on its 1 point side, or turn a placed marker to its 2 point side.",
"When the markers reach the Structure value, the structure is destroyed. A vehicle wreck is removed. A building is turned to its rubble side, every Infantry unit inside gets a Suppressed Marker, and both players redeploy their units into the rubble, the Initiative player first."
],
"faces": [
{
"img": "img/hon/hos/tokens/destruction-1.webp",
"w": 210,
"h": 210,
"label": "1 point",
"tall": false
},
{
"img": "img/hon/hos/tokens/destruction-2.webp",
"w": 210,
"h": 210,
"label": "2 points",
"tall": false
}
],
"facts": [
[
"Hit on",
"4 or more per die"
]
],
"links": [],
"src": "Heroes of Stalingrad rulebook, p.15"
},
{
"id": "flamethrower",
"name": "Flamethrower Template",
"group": "Templates",
"summary": "Cone of flame. Narrow end at the firing unit.",
"text": [
"Put the smallest end of the Template at the centre of the counter's square, or on the red dot on the counter, and point it where you like within any limited firing arc. Use the Combat Values printed on the Template.",
"Any unit even partly under it is affected, infantry or vehicle, and gets a Suppressed Marker as well as any Damage. Obstacles affect it, and it stops at the centre of a square occupied by a vehicle."
],
"faces": [
{
"img": "img/hon/hos/tokens/flamethrower.webp",
"w": 520,
"h": 124,
"label": "Flamethrower Template",
"tall": false
}
],
"facts": [
[
"Firing ability",
"Flamethrower"
],
[
"Counts as",
"Fire on the Move (-1)"
]
],
"links": [],
"src": "Heroes of Stalingrad rulebook, p.16"
},
{
"id": "explosion",
"name": "Explosion Template",
"group": "Templates",
"summary": "Blast circle for Howitzer and Indirect Fire. The back has the scatter chart.",
"text": [
"Put the Template on the target Interspace. Every unit and structure under it, even partly, is affected. Resolve each attack on its own, using the Combat Values that match the firing icon.",
"For Indirect Fire, use the scatter chart on the back and roll a die. On 1 to 4 the shot scatters in the direction of that number, by the distance in the symbol. On 5 or 6 it lands on target. Suppressed Markers do not affect scatter rolls. Concealed units are never affected.",
"You may not place a Template inside a building."
],
"faces": [
{
"img": "img/hon/hos/tokens/explosion-a.webp",
"w": 355,
"h": 360,
"label": "Combat Values side",
"tall": false
},
{
"img": "img/hon/hos/tokens/explosion-b.webp",
"w": 360,
"h": 341,
"label": "Scatter chart side",
"tall": false
}
],
"facts": [
[
"Scatter",
"1 to 4 off target, 5 or 6 on target"
]
],
"links": [],
"src": "Heroes of Stalingrad rulebook, p.16, p.24, p.25"
},
{
"id": "objective",
"name": "Objective markers",
"group": "Objective markers",
"summary": "Mark ground the scenario tells you to take or hold.",
"text": [
"Objective markers show a position the scenario cares about. The yellow X with the red star is the Soviet marker, the one with the iron cross is the German marker, and the plain one carries no army symbol. The scenario says what each one earns or proves."
],
"faces": [
{
"img": "img/hon/hos/tokens/objective-soviet.webp",
"w": 195,
"h": 210,
"label": "Soviet",
"tall": false
},
{
"img": "img/hon/hos/tokens/objective-german.webp",
"w": 210,
"h": 203,
"label": "German",
"tall": false
},
{
"img": "img/hon/hos/tokens/objective-neutral.webp",
"w": 210,
"h": 196,
"label": "Neutral",
"tall": false
}
],
"facts": [],
"links": [],
"src": "Core Set punchboard 5 and 6; scenario setup"
}
]
};
