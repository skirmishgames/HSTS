window.HTS_TOKENS = window.HTS_TOKENS || {};
HTS_TOKENS["hon-caen"] = {
 "game": "hon",
 "box": "caen",
 "title": "Tokens and markers",
 "source": "Battle for Caen booklet V1.4",
 "groups": [
  "Objectives",
  "Turn chart",
  "Combat markers"
 ],
 "entries": [
  {
   "id": "primary",
   "name": "Commonwealth primary objective",
   "group": "Objectives",
   "summary": "The Commonwealth objective the scenario tells you to place. Two faces, orange cross on stone paving.",
   "text": [
    "Each scenario says how many objectives to place and which side they belong to. A Commonwealth Primary Objective carries the roundel in the centre.",
    "In the campaign, the result of the previous scenario can change which version of an objective you place (for example a blue or orange outline in the booklet). Check the Campaign box of each scenario."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/primary-cw-a.webp",
     "w": 567,
     "h": 567,
     "label": "Side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/primary-cw-b.webp",
     "w": 567,
     "h": 567,
     "label": "Side B",
     "tall": false
    }
   ],
   "facts": [
    [
     "Used in",
     "Trading Blows, Charon the Ferryman, Safari in Normandy"
    ]
   ],
   "links": [
    {
     "label": "Scenarios",
     "href": "scenarios.html?b=caen"
    }
   ],
   "src": "Battle for Caen booklet V1.4, scenarios"
  },
  {
   "id": "secondary",
   "name": "Commonwealth secondary objective",
   "group": "Objectives",
   "summary": "Yellow cross on stone paving. The back has no roundel.",
   "text": [
    "Secondary Objectives are placed as the scenario says. In the campaign, scenarios 2 to 6 change how many of them the Commonwealth player must hold, depending on who won the previous scenario.",
    "In Operation Stack the Commonwealth player must hold his secondary objectives before he may attack the chimney."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/secondary-cw-a.webp",
     "w": 567,
     "h": 567,
     "label": "Side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/secondary-cw-b.webp",
     "w": 567,
     "h": 568,
     "label": "Side B",
     "tall": false
    }
   ],
   "facts": [
    [
     "Used in",
     "Charge of the Light Brigade, Beaver Tails with Sauerkraut, Zurück!, Charon the Ferryman, Operation Stack"
    ]
   ],
   "links": [
    {
     "label": "Scenarios",
     "href": "scenarios.html?b=caen"
    }
   ],
   "src": "Battle for Caen booklet V1.4, scenarios"
  },
  {
   "id": "initiative",
   "name": "Initiative markers",
   "group": "Turn chart",
   "summary": "One marker per side. It shows who has the Initiative.",
   "text": [
    "The marker with the roundel is the Commonwealth Initiative marker, the one with the Balkenkreuz is the German one. Every scenario starts by saying which side has the Initiative.",
    "The Initiative Orders Option lets a player keep the Initiative for one more turn. It joins the Commonwealth army at the start of turn 5 of Charon the Ferryman."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/initiative-cw.webp",
     "w": 211,
     "h": 211,
     "label": "Commonwealth",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/initiative-ge.webp",
     "w": 211,
     "h": 211,
     "label": "German",
     "tall": false
    }
   ],
   "facts": [
    [
     "Option cost",
     "10 points (Initiative orders)"
    ]
   ],
   "links": [
    {
     "label": "Rules for Initiative",
     "href": "rules.html?b=caen&q=initiative"
    }
   ],
   "src": "Battle for Caen booklet V1.4, p.11"
  },
  {
   "id": "event",
   "name": "Commonwealth event marker",
   "group": "Turn chart",
   "summary": "Placed on the turn chart. The scenario says what happens on that turn.",
   "text": [
    "Event markers go in the turn chart column beside the turn they apply to. What each one does is set by the scenario.",
    "The Caen campaign also uses German event markers (a plus sign on a blue outline) that move to an earlier turn after certain results, for example in Charge of the Light Brigade and Operation Stack."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/event-cw.webp",
     "w": 211,
     "h": 211,
     "label": "Commonwealth event",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/event-back.webp",
     "w": 211,
     "h": 211,
     "label": "Back",
     "tall": false
    }
   ],
   "facts": [],
   "links": [
    {
     "label": "Scenarios",
     "href": "scenarios.html?b=caen"
    }
   ],
   "src": "Battle for Caen booklet V1.4, scenarios"
  },
  {
   "id": "destruction",
   "name": "Destruction markers, 3 and 4 points",
   "group": "Combat markers",
   "summary": "Higher value Destruction markers. The faces show 3 and 4.",
   "text": [
    "These sit alongside the 1 and 2 point Destruction markers of the core box. Total all Destruction and Breach markers on a Structure and compare the sum with its Structure value.",
    "When the total equals the Structure value, the Terrain Element is destroyed: flip the tile to its ruined side, put 1 Suppressed marker on every Infantry Unit inside, then redeploy them into the ruins."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/destruction-3.webp",
     "w": 211,
     "h": 211,
     "label": "3 points",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/destruction-4.webp",
     "w": 211,
     "h": 211,
     "label": "4 points",
     "tall": false
    }
   ],
   "facts": [],
   "links": [
    {
     "label": "Rules: Destruction (breach)",
     "href": "rules.html?b=caen&q=breach"
    }
   ],
   "src": "Battle for Caen booklet V1.4, p.9"
  },
  {
   "id": "breach",
   "name": "Breach markers",
   "group": "Combat markers",
   "summary": "A special Destruction marker for a hole in a wall. 1 point side and 2 point side.",
   "text": [
    "When a Firing Action would add Destruction markers to a Building, the acting player may place a Breach marker instead. It goes on the wall between the firing unit and the target, or on the wall nearest the point of impact.",
    "A Breach is an opening. Infantry may enter and exit through it. On the 1 point side the unit must stop on the other side, on the 2 point side its Movement Action is not stopped. Breach points count towards the Structure value together with ordinary Destruction markers."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/breach-1.webp",
     "w": 428,
     "h": 329,
     "label": "1 point",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/breach-2.webp",
     "w": 427,
     "h": 330,
     "label": "2 points",
     "tall": false
    }
   ],
   "facts": [
    [
     "Special ability",
     "Destruction (breach), p.9"
    ]
   ],
   "links": [
    {
     "label": "Rules: Destruction (breach)",
     "href": "rules.html?b=caen&q=breach"
    }
   ],
   "src": "Battle for Caen booklet V1.4, p.9"
  },
  {
   "id": "template",
   "name": "Yellow explosion template",
   "group": "Combat markers",
   "summary": "Round blast template. Printed values at the foot: +2, +2 and X.",
   "text": [
    "Explosion templates are used by Artillery Support markers and other Template attacks. Place the template on an Interspace on the board. Artillery scatters 3 Interspaces, smoke scatters 1.",
    "Walls block the blast. A template placed inside a Building does not affect units outside it, and the other way round. In a partially destroyed room the intact half is treated as a Building."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/template-yellow.webp",
     "w": 665,
     "h": 665,
     "label": "Template",
     "tall": false
    }
   ],
   "facts": [
    [
     "Printed values",
     "+2, +2, X"
    ]
   ],
   "links": [
    {
     "label": "Rules: templates and partially destroyed rooms",
     "href": "rules.html?b=caen&q=template"
    }
   ],
   "src": "Battle for Caen booklet V1.4, pp.7 and 11"
  }
 ]
};
