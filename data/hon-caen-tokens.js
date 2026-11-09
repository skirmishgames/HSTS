window.HTS_TOKENS = window.HTS_TOKENS || {};
HTS_TOKENS["hon-caen"] = {
 "game": "hon",
 "box": "caen",
 "title": "Tokens and markers",
 "source": "Battle for Caen booklet V1.4",
 "groups": [
  "Objectives",
  "Turn chart",
  "Combat markers",
  "Gear markers",
  "Defences",
  "Customizations",
  "Aircraft",
  "Other markers"
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
  },
  {
   "id": "wjgear-ge",
   "name": "German gear markers",
   "group": "Gear markers",
   "summary": "Grenade, Magnetic Mine and Panzerfaust markers for the German Pioniere. The Gear option brings three of them.",
   "text": [
    "Each marker shows a range arrow and a number. Grenade: range 2. Magnetic Mine: range 1. Panzerfaust: range 4.",
    "The Mine and the Panzerfaust have an explosion side (B) with combat values. The Panzerfaust side B shows 2 in the blast and +1, +5 and +4 below it.",
    "Oros Snowt has his own Grenade marker with an infinity symbol, so it is never used up."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/wj-grenade-ge.webp",
     "w": 211,
     "h": 211,
     "label": "Grenade",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-magmine-a.webp",
     "w": 211,
     "h": 211,
     "label": "Magnetic Mine, side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-magmine-b.webp",
     "w": 211,
     "h": 211,
     "label": "Magnetic Mine, side B",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-pfaust-a.webp",
     "w": 211,
     "h": 211,
     "label": "Panzerfaust, side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-pfaust-b.webp",
     "w": 211,
     "h": 211,
     "label": "Panzerfaust, side B",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-grenade-snowt.webp",
     "w": 211,
     "h": 211,
     "label": "Oros Snowt grenade",
     "tall": false
    }
   ],
   "facts": [
    [
     "Pack",
     "Battle Pack #3, Windsor & Jupiter"
    ],
    [
     "Option",
     "Gear (SS-Panzerpionier), 15 pts"
    ]
   ],
   "links": [
    {
     "label": "Units",
     "href": "units.html"
    }
   ],
   "src": "Battle Pack #3 (Windsor & Jupiter) digital files"
  },
  {
   "id": "wjgear-cw",
   "name": "Commonwealth gear markers",
   "group": "Gear markers",
   "summary": "Ammo, Fuel, Grenade, Knife, PIAT and Additional Shielding markers. They come with the Gear and Recce Gear options.",
   "text": [
    "Ammo shows +2 and +1. Fuel shows a movement bonus of +2. Additional Shielding shows +2. Knife shows +2 beside a blade. Grenade has range 2 and PIAT has range 5, each with a range arrow.",
    "The PIAT has an explosion side (B) showing 1 in the blast and +0, +3 and +2 below it."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/wj-ammo.webp",
     "w": 211,
     "h": 211,
     "label": "Ammo",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-fuel.webp",
     "w": 211,
     "h": 211,
     "label": "Fuel",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-shield.webp",
     "w": 211,
     "h": 211,
     "label": "Additional Shielding",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-grenade-cw.webp",
     "w": 211,
     "h": 211,
     "label": "Grenade",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-knife.webp",
     "w": 211,
     "h": 211,
     "label": "Knife",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-piat-a.webp",
     "w": 211,
     "h": 211,
     "label": "PIAT, side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-piat-b.webp",
     "w": 211,
     "h": 211,
     "label": "PIAT, side B",
     "tall": false
    }
   ],
   "facts": [
    [
     "Pack",
     "Battle Pack #3, Windsor & Jupiter"
    ],
    [
     "Options",
     "Gear (10 pts) and Recce Gear (15 pts), B Recce Squadron"
    ]
   ],
   "links": [
    {
     "label": "Units",
     "href": "units.html"
    }
   ],
   "src": "Battle Pack #3 (Windsor & Jupiter) digital files"
  },
  {
   "id": "wjdefence",
   "name": "Defence lines, defensive position and bridge",
   "group": "Defences",
   "summary": "Markers that come with the Sd.Kfz 251/7 and the Position option of the SS-Panzerpionier.",
   "text": [
    "The Sd.Kfz 251/7 comes with 4 Defence Line markers, 1 Bridge and 1 Defensive Position. The Position option adds 1 more Defensive Position.",
    "Each is two-sided. The Defensive Position shows a green hedgerow side and a ruined side with modifier icons. The Bridge shows two plank strips with direction arrows."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/wj-defline-a.webp",
     "w": 323,
     "h": 568,
     "label": "Defence Line, side A",
     "tall": true
    },
    {
     "img": "img/hon/caen/tokens/wj-defline-b.webp",
     "w": 325,
     "h": 574,
     "label": "Defence Line, side B",
     "tall": true
    },
    {
     "img": "img/hon/caen/tokens/wj-defpos-a.webp",
     "w": 612,
     "h": 612,
     "label": "Defensive Position, side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-defpos-b.webp",
     "w": 612,
     "h": 612,
     "label": "Defensive Position, side B",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-bridge-a.webp",
     "w": 540,
     "h": 540,
     "label": "Bridge, side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-bridge-b.webp",
     "w": 540,
     "h": 540,
     "label": "Bridge, side B",
     "tall": false
    }
   ],
   "facts": [
    [
     "Pack",
     "Battle Pack #3, Windsor & Jupiter"
    ],
    [
     "Options",
     "Sd.Kfz 251/7 (45 pts), Position (10 pts)"
    ]
   ],
   "links": [
    {
     "label": "Units",
     "href": "units.html"
    }
   ],
   "src": "Battle Pack #3 (Windsor & Jupiter) digital files"
  },
  {
   "id": "wjcustom",
   "name": "Customization cards",
   "group": "Customizations",
   "summary": "Charge, Urban Fighter and Ferocious cards with a point cost, plus the Life Point and Tactical Map markers.",
   "text": [
    "Charge costs 10 points and Ferocious costs 10. Urban Fighter costs 5.",
    "Tactical Map is a marker with range 3. Life Point is a skull marker. The booklet for this pack is not in the archive, so the rules for these are not written up yet."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/wj-charge.webp",
     "w": 256,
     "h": 352,
     "label": "Charge (10)",
     "tall": true
    },
    {
     "img": "img/hon/caen/tokens/wj-urban.webp",
     "w": 256,
     "h": 352,
     "label": "Urban Fighter (5)",
     "tall": true
    },
    {
     "img": "img/hon/caen/tokens/wj-ferocious.webp",
     "w": 256,
     "h": 352,
     "label": "Ferocious (10)",
     "tall": true
    },
    {
     "img": "img/hon/caen/tokens/wj-tacmap.webp",
     "w": 211,
     "h": 211,
     "label": "Tactical Map",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-life.webp",
     "w": 211,
     "h": 211,
     "label": "Life Point",
     "tall": false
    }
   ],
   "facts": [
    [
     "Pack",
     "Battle Pack #3, Windsor & Jupiter"
    ]
   ],
   "links": [
    {
     "label": "Units",
     "href": "units.html"
    }
   ],
   "src": "Battle Pack #3 (Windsor & Jupiter) digital files"
  },
  {
   "id": "wjspeed",
   "name": "Speed markers and pilot counter",
   "group": "Aircraft",
   "summary": "Four double-sided Speed markers and the German Pilote counter.",
   "text": [
    "The Speed markers come in two designs, each twice. Some sides show an aircraft icon beside the movement values.",
    "The Pilote counter has a Balkenkreuz. Side A is a figure on foot. Side B is an aircraft canopy."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/wj-speed1-a.webp",
     "w": 211,
     "h": 211,
     "label": "Speed 1, side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-speed1-b.webp",
     "w": 211,
     "h": 211,
     "label": "Speed 1, side B",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-speed2-a.webp",
     "w": 211,
     "h": 211,
     "label": "Speed 2, side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-speed2-b.webp",
     "w": 211,
     "h": 211,
     "label": "Speed 2, side B",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-speed3-a.webp",
     "w": 211,
     "h": 211,
     "label": "Speed 3, side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-speed3-b.webp",
     "w": 211,
     "h": 211,
     "label": "Speed 3, side B",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-speed4-a.webp",
     "w": 211,
     "h": 211,
     "label": "Speed 4, side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-speed4-b.webp",
     "w": 211,
     "h": 211,
     "label": "Speed 4, side B",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-pilot-a.webp",
     "w": 352,
     "h": 352,
     "label": "Pilote, side A",
     "tall": false
    },
    {
     "img": "img/hon/caen/tokens/wj-pilot-b.webp",
     "w": 352,
     "h": 352,
     "label": "Pilote, side B",
     "tall": false
    }
   ],
   "facts": [
    [
     "Pack",
     "Battle Pack #3, Windsor & Jupiter"
    ]
   ],
   "links": [
    {
     "label": "Units",
     "href": "units.html"
    }
   ],
   "src": "Battle Pack #3 (Windsor & Jupiter) digital files"
  },
  {
   "id": "wjrecce",
   "name": "Ambush Recce counter",
   "group": "Other markers",
   "summary": "A hidden Commonwealth reconnaissance counter, a question mark with the roundel.",
   "text": [
    "The counter shows a question mark, a movement value of 3 and a crosshair icon, with the Commonwealth roundel in the corner.",
    "The rules for it are not written up yet because the booklet for this pack is not in the archive."
   ],
   "faces": [
    {
     "img": "img/hon/caen/tokens/wj-ambush-recce.webp",
     "w": 459,
     "h": 459,
     "label": "Ambush Recce",
     "tall": false
    }
   ],
   "facts": [
    [
     "Pack",
     "Battle Pack #3, Windsor & Jupiter"
    ]
   ],
   "links": [
    {
     "label": "Units",
     "href": "units.html"
    }
   ],
   "src": "Battle Pack #3 (Windsor & Jupiter) digital files"
  }
 ]
};
