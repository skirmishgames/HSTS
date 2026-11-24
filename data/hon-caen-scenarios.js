window.HTS_SCEN = window.HTS_SCEN || {};
HTS_SCEN["hon-caen"] = {
 "game": "hon",
 "box": "caen",
 "title": "Scenarios",
 "source": "Battle Pack 2 rules and scenarios booklet (final) and The Creel scenario sheet",
 "types": [
  "Campaign scenarios",
  "Bonus scenario",
  "Booklet rules and reference"
 ],
 "entries": [
  {
   "id": "tradingblows",
   "title": "Trading Blows (Campaign 1/6)",
   "type": "Campaign scenarios",
   "pages": "16 to 17",
   "start": 16,
   "date": "June 26, 1944",
   "summary": "Saint-Manvieu, first of six linked campaign scenarios. The Royal Scots Fusiliers storm the SS command post, then hold the village against the SS counterattack and a FLAK 88 firing from Rauray ridge.",
   "facts": [
    [
     "Front",
     "Normandy, Operation Epsom, Saint Manvieu"
    ],
    [
     "Players",
     "2. The AI can play either side."
    ],
    [
     "Armies",
     "Commonwealth, 15th Infantry Division, 250 points plus 180 in reinforcements, against 12. SS and 21. Panzer, 185 points plus a pool of reinforcements."
    ],
    [
     "Setup",
     "6 boards (C4-B, C5-B, EC5-B over C2-A, EC6-B, C1-B). CW initiative, 1 CW primary objective, 2 tactical bonuses, the Red Dot marker, 4 action cards each. The German player deploys first."
    ],
    [
     "Length",
     "8 turns"
    ],
    [
     "Special rules",
     "A FLAK 88 Support tile gives the Germans 3 shots from the red dot, in an elevated position. The two German secondary objectives and the German reinforcements arrive at the end of the Supply Phase of turn 3, and the Germans enter on turn 4. German recruitment follows the normal rules. CW reinforcements arrive the turn after the CW player controls the primary objective. Artillery Orders on the CW Support tile."
    ],
    [
     "How to win",
     "The CW player controls the primary objective before the counterattack on turn 4, then stops the Germans from controlling the two German secondary objectives. German major victory: both secondaries at the end of turn 6 or 7."
    ],
    [
     "Campaign",
     "Scenario 1 of 6. The result sets up scenario 2 and can win the Germans an Eisernes Kreuz."
    ]
   ],
   "armies": {
    "uk": {
     "side": "uk",
     "limit": 250,
     "printed": 250,
     "tiles": [
      [
       "chaudiere",
       [
        "bren_platoon_cha",
        "grenade_uk",
        "wasp",
        "piat_platoon_cha"
       ]
      ]
     ],
     "pts": 250,
     "sub": "15th Infantry Division",
     "label": "Commonwealth army"
    },
    "uk_reinf": {
     "side": "uk",
     "limit": 180,
     "printed": 180,
     "tiles": [
      [
       "rwr",
       [
        null,
        "mortar_3in",
        "universal_carrier"
       ]
      ],
      [
       "ludger_houde",
       [
        null
       ]
      ],
      [
       "support_tile",
       [
        "artillery"
       ]
      ]
     ],
     "pts": 165,
     "sub": "15th Infantry Division",
     "note": "Not in the builder: Houde's Bazooka (15 points, x2). The files have no Commonwealth version of that card. It brings the total to the printed 180. The Royal Winnipeg Rifles tile keeps its first slot empty.",
     "label": "Commonwealth reinforcements"
    },
    "ge": {
     "side": "ge",
     "limit": 185,
     "printed": 185,
     "tiles": [
      [
       "feldkommando_milius",
       [
        null,
        null,
        "fanatic"
       ]
      ],
      [
       "ss_panzergrenadiere_hj",
       []
      ]
     ],
     "pts": 135,
     "sub": "12. SS Panzer-Division and 21. Panzer-Division",
     "note": "The FLAK 88 Support tile is not in the builder. The 50 points that bring the army to the printed 185 are worked out from the total, the card shows no cost. The Feldkommando keeps two slots empty and the SS-Panzergrenadiere four.",
     "label": "German army"
    }
   },
   "figs": [
    {
     "img": "img/hon/caen/scenfig/tb-map.webp",
     "w": 1100,
     "h": 711,
     "cap": "Battlefield and deployment, booklet p.16"
    }
   ]
  },
  {
   "id": "lightbrigade",
   "title": "Charge of the Light Brigade (Campaign 2/6)",
   "type": "Campaign scenarios",
   "pages": "18 to 19",
   "start": 18,
   "date": "June 29, 1944",
   "summary": "The 129th Brigade crosses the Odon and races to outflank the defenders of Baron-sur-Odon before the German 88s on Hill 113 can spot it.",
   "facts": [
    [
     "Front",
     "Normandy, Operation Epsom, Baron-sur-Odon"
    ],
    [
     "Players",
     "2. The AI can play either side."
    ],
    [
     "Armies",
     "Commonwealth, 43rd Infantry Division, 475 points, against 12. SS Panzer-Division, 320 points."
    ],
    [
     "Setup",
     "6 boards (C1-B, C2-A, C4-B, C3-A, EC4-B, EC5-B) with the Odon strip between them. CW initiative, 2 CW and 1 neutral secondary objective, 2 tactical bonuses, 4 action cards each. The German player deploys first, the Commonwealth enters from the left edge."
    ],
    [
     "Length",
     "6 turns"
    ],
    [
     "Special rules",
     "A FLAK 88 on Hill 113 joins the Germans from turn 5, 3 shots from the red dot. The CW primary objective appears when the CW player captures both CW secondaries."
    ],
    [
     "How to win",
     "Capture both CW secondary objectives, then control the primary at the end of turn 6. Major victory also needs the neutral secondary captured."
    ],
    [
     "Campaign",
     "Scenario 2 of 6. A major CW victory wins a Victoria Cross."
    ]
   ],
   "armies": {
    "uk": {
     "side": "uk",
     "limit": 475,
     "printed": 475,
     "tiles": [
      [
       "field_command_mathieu",
       [
        "mechanized_carrier",
        "aircraft_x1",
        "daimler_ac"
       ]
      ],
      [
       "worcestershire",
       [
        "bren_platoon_wor",
        "grenade_uk",
        "wasp",
        "mech_piat_wor"
       ]
      ],
      [
       "jack_banks",
       [
        "universal_carrier"
       ]
      ],
      [
       "spitfire",
       []
      ]
     ],
     "pts": 465,
     "sub": "43rd Infantry Division",
     "label": "Commonwealth army",
     "note": "The final booklet still prints 475, but with the Spitfire at its new cost of 40 the army it shows comes to 465."
    },
    "ge": {
     "side": "ge",
     "limit": 320,
     "printed": 320,
     "tiles": [
      [
       "feldkommando_milius",
       [
        null,
        "mg_nest",
        "concealed"
       ]
      ],
      [
       "ss_panzergrenadiere_hj",
       [
        "assault_group_hj",
        "flak38",
        "grenade",
        null
       ]
      ],
      [
       "ludwig",
       [
        "ammo"
       ]
      ]
     ],
     "pts": 280,
     "sub": "12. SS Panzer-Division",
     "note": "The FLAK 88 Support tile arrives as a reinforcement and is not in the builder. The 40 points that bring the army to the printed 320 are worked out from the total.",
     "label": "German army"
    }
   },
   "figs": [
    {
     "img": "img/hon/caen/scenfig/clb-map.webp",
     "w": 1100,
     "h": 686,
     "cap": "Battlefield and deployment, booklet p.18"
    }
   ]
  },
  {
   "id": "beavertails",
   "title": "Beaver Tails with Sauerkraut (Campaign 3/6)",
   "type": "Campaign scenarios",
   "pages": "20 to 21",
   "start": 20,
   "date": "July 8, 1944",
   "summary": "The 9th Canadian Brigade defends Buron against the 12. SS. Both sides have a different goal: the SS must retake the village, the Canadians must hold two objectives.",
   "facts": [
    [
     "Front",
     "Normandy, Operation Charnwood, Buron"
    ],
    [
     "Players",
     "2. The AI can play either side."
    ],
    [
     "Armies",
     "3rd Canadian Infantry Division, 500 points, against 12. SS Panzer-Division, 535 points."
    ],
    [
     "Setup",
     "6 boards (C2-B, C5-B, C4-B over EC6-B, EC5-B, EC4-B). German initiative, 1 German primary and 2 CW secondary objectives, 3 tactical bonuses, 4 action cards each. The CW player deploys first, the Germans enter through the top edge."
    ],
    [
     "Length",
     "6 turns"
    ],
    [
     "Special rules",
     "The game can end early at the end of a Supply Phase once a player has completed his goal. If both have, the END marker moves down one turn, and past turn 8 it is a draw."
    ],
    [
     "How to win",
     "The Germans control their primary objective. The Commonwealth controls both CW secondary objectives, all at the end of the game."
    ],
    [
     "Campaign",
     "Scenario 3 of 6. A Commonwealth win gives 8 turns in scenario 4, a German win makes the CW capture both secondaries there."
    ]
   ],
   "armies": {
    "uk": {
     "side": "uk",
     "limit": 500,
     "printed": 500,
     "tiles": [
      [
       "field_command_mathieu",
       [
        "aircraft_x2",
        "smoke",
        "ammo_uk"
       ]
      ],
      [
       "chaudiere",
       [
        "piat_platoon_cha",
        "grenade_uk",
        "vickers_mg",
        "support_platoon_cha"
       ]
      ],
      [
       "sgt_lee_lowe",
       []
      ],
      [
       "spitfire",
       []
      ],
      [
       "hawker_typhoon",
       []
      ]
     ],
     "pts": 465,
     "sub": "3rd Canadian Infantry Division",
     "note": "Not in the builder: Lowe's Overwatch (10 points, no UK version of it exists yet) and an extra unit card beside the Field Command tile. That card shows no cost. The final booklet prints 500 points (V1.4 printed 505), so 30 points are needed to reach it and the card may be a Universal Carrier. Check it against the booklet.",
     "label": "Commonwealth army"
    },
    "ge": {
     "side": "ge",
     "limit": 535,
     "printed": 535,
     "tiles": [
      [
       "feldkommando_milius",
       [
        "tiger_i",
        null,
        null
       ]
      ],
      [
       "ss_panzergrenadiere_hj",
       [
        "flamer_group_hj",
        "mg42_hmg_hj",
        "magnetic_mine",
        "assault_group_hj"
       ]
      ],
      [
       "ss_panzergruppe",
       []
      ]
     ],
     "pts": 535,
     "sub": "12. SS Panzer-Division",
     "note": "The card in the first Feldkommando slot costs 90 points and is read as a Tiger I. The SS-Panzergruppe slots are all empty. Check both against the booklet.",
     "label": "German army"
    }
   },
   "figs": [
    {
     "img": "img/hon/caen/scenfig/bt-map.webp",
     "w": 1100,
     "h": 786,
     "cap": "Battlefield and deployment, booklet p.20"
    }
   ]
  },
  {
   "id": "zuruck",
   "title": "Zurück! (Campaign 4/6)",
   "type": "Campaign scenarios",
   "pages": "22 to 23",
   "start": 22,
   "date": "July 9, 1944",
   "summary": "Caen is nearly lost. The Germans withdraw behind the Orne and the Canadians must stop the 16. Luftwaffen-Feld Division from getting 6 infantry units and 2 heavy vehicles off the board.",
   "facts": [
    [
     "Front",
     "Normandy, Operation Charnwood, Caen"
    ],
    [
     "Players",
     "2. The AI cannot play the German side."
    ],
    [
     "Armies",
     "3rd Canadian Infantry Division, 445 points, against 12. SS Panzer-Division and 16. Luftwaffen-Feld-Division, 460 points."
    ],
    [
     "Setup",
     "6 boards (EC1-B, EC2-B, EC3-B over EC4-A, EC6-B, EC5-B). CW initiative, 2 CW secondary objectives, 2 tactical bonuses, 4 action cards each. The German player deploys first."
    ],
    [
     "Length",
     "6 turns, or 8 after a CW win in scenario 3"
    ],
    [
     "Special rules",
     "The Germans score by exiting units through the arrow squares. After a German win in scenario 3, the CW player must capture both secondaries."
    ],
    [
     "How to win",
     "The Germans exit 6 infantry units and 2 heavy vehicles. The Commonwealth captures one of its two secondaries first. Major CW victory: the Germans cannot get enough units out."
    ],
    [
     "Campaign",
     "Scenario 4 of 6. A CW win earns a Battle Plan Orders option for scenario 5."
    ]
   ],
   "armies": {
    "uk": {
     "side": "uk",
     "limit": 445,
     "printed": 445,
     "tiles": [
      [
       "rwr",
       [
        "cromwell_mk4",
        "daimler_ac",
        "universal_carrier"
       ]
      ],
      [
       "chaudiere",
       [
        "piat_platoon_cha",
        "grenade_uk",
        "vickers_mg",
        "support_platoon_cha"
       ]
      ],
      [
       "ludger_houde",
       []
      ]
     ],
     "pts": 440,
     "sub": "3rd Canadian Infantry Division",
     "note": "Houde's Thompson (5 points) is hero equipment and is not in the builder. It brings the total to the printed 445.",
     "label": "Commonwealth army"
    },
    "ge": {
     "side": "ge",
     "limit": 460,
     "printed": 460,
     "tiles": [
      [
       "ss_panzergruppe",
       [
        "panzer_iv_ss",
        "flak38",
        null
       ]
      ],
      [
       "panzergrenadiere_1",
       [
        "assault_group",
        "schwimmwagen",
        "grenade",
        "pzgren_squad_1"
       ]
      ],
      [
       "ludwig",
       []
      ]
     ],
     "pts": 460,
     "sub": "12. SS Panzer-Division and 16. Luftwaffen-Feld-Division",
     "label": "German army"
    }
   },
   "figs": [
    {
     "img": "img/hon/caen/scenfig/zu-map.webp",
     "w": 1100,
     "h": 711,
     "cap": "Battlefield and deployment, booklet p.22"
    }
   ]
  },
  {
   "id": "charon",
   "title": "Charon the Ferryman (Campaign 5/6)",
   "type": "Campaign scenarios",
   "pages": "24 to 25",
   "start": 24,
   "date": "July 18, 1944",
   "summary": "Goodwood. The British must cross the Orne into Caen and take a primary objective plus a secondary, while a tough 16. Luftwaffen-Feld Division holds the city.",
   "facts": [
    [
     "Front",
     "Normandy, Operation Goodwood, Caen"
    ],
    [
     "Players",
     "2. The AI can play either side."
    ],
    [
     "Armies",
     "3rd Infantry Division and 11th Armoured Division, 690 points, against 16. Luftwaffen-Feld-Division, 520 points."
    ],
    [
     "Setup",
     "7 boards (C5-B, EC5-A, EC4-A over EC3-B, EC2-B, EC1-B plus a strip). CW initiative, 1 CW primary and 2 CW secondary objectives, 2 tactical bonuses, 4 action cards each. The German player deploys first, the Commonwealth enters from the bottom edge."
    ],
    [
     "Length",
     "8 turns"
    ],
    [
     "Special rules",
     "The Initiative Orders option can join the CW army at the start of turn 5."
    ],
    [
     "How to win",
     "The CW player controls his primary objective and captures at least one secondary. The game ends early when he does."
    ],
    [
     "Campaign",
     "Scenario 5 of 6. A CW win means one secondary objective is enough in scenario 6. A German win moves the German event marker to turn 3."
    ]
   ],
   "armies": {
    "uk": {
     "side": "uk",
     "limit": 690,
     "printed": 690,
     "tiles": [
      [
       "high_command_dempsey",
       [
        "battle_plan",
        "aircraft_x1",
        "universal_carrier",
        "m5_stuart_uk"
       ]
      ],
      [
       "worcestershire",
       [
        "bren_platoon_wor",
        "grenade_uk",
        "mortar_3in",
        "mech_piat_wor"
       ]
      ],
      [
       "hussars_23",
       [
        "sexton_25pdr",
        "tank_gear_uk",
        "veteran_uk"
       ]
      ],
      [
       "jack_banks",
       [
        "ammo_uk"
       ]
      ],
      [
       "hawker_typhoon",
       []
      ]
     ],
     "pts": 680,
     "sub": "3rd Infantry Division and 11th Armoured Division",
     "note": "Not in the builder: the Initiative Orders option (10 points) that joins the army at the start of turn 5. Every slot on the High Command tile is already used. It brings the total to 685. The final booklet prints 690 (V1.4 printed 685), so 5 points are unaccounted for. Check the army against the booklet.",
     "label": "Commonwealth army"
    },
    "ge": {
     "side": "ge",
     "limit": 520,
     "printed": 520,
     "tiles": [
      [
       "feldkommando_milius",
       [
        "panzer_iv",
        "concealed",
        "fanatic"
       ]
      ],
      [
       "panzergrenadiere_1",
       [
        "assault_group",
        "flak38",
        "grenade",
        "luchs"
       ]
      ],
      [
       "panzergrenadiere_2",
       [
        null,
        "pak40",
        "panzerfaust",
        "panzerschreck_group_2"
       ]
      ],
      [
       "emil_durr",
       []
      ]
     ],
     "pts": 515,
     "sub": "16. Luftwaffen-Feld-Division",
     "note": "Dürr's Panzerfaust (5 points) is hero equipment and is not in the builder. It brings the total to the printed 520. The 15-point card in the Feldkommando is read as Fanatic.",
     "label": "German army"
    }
   },
   "figs": [
    {
     "img": "img/hon/caen/scenfig/ch-map.webp",
     "w": 1100,
     "h": 721,
     "cap": "Battlefield and deployment, booklet p.24"
    }
   ]
  },
  {
   "id": "operationstack",
   "title": "Operation Stack (Campaign 6/6)",
   "type": "Campaign scenarios",
   "pages": "26 to 27",
   "start": 26,
   "date": "July 20, 1944",
   "summary": "Final campaign scenario. Canadians must take two objectives in the steel works and then bring down the chimney the German spotters use, before the 12. SS stops them.",
   "facts": [
    [
     "Front",
     "Normandy, Operation Goodwood, Caen"
    ],
    [
     "Players",
     "2. The AI can play both sides and, as the CW, treats the chimney as a priority target."
    ],
    [
     "Armies",
     "3rd Canadian Infantry Division, 535 points, against 12. SS Panzer-Division, 470 points."
    ],
    [
     "Setup",
     "6 boards (EC5-B, EC6-A, EC4-B over EC1-A, EC3-A, EC2-A). CW initiative, 2 CW secondary objectives, 1 tactical bonus, 4 action cards each. The German player deploys first, the Commonwealth enters from the bottom edge."
    ],
    [
     "Length",
     "6 turns"
    ],
    [
     "Special rules",
     "The chimney can only be fired at from the red dot and is not an elevated position. Indirect Fire cannot damage it. German reinforcements enter through the blue arrows."
    ],
    [
     "How to win",
     "The CW player captures both secondary objectives (one after a CW win in scenario 5), then destroys the chimney before the end of turn 6. If he has not captured the required secondaries at the end of turn 4 (turn 3 after a German win in scenario 5) it is a German major victory."
    ],
    [
     "Campaign",
     "Scenario 6 of 6. The result decides the campaign."
    ]
   ],
   "armies": {
    "uk": {
     "side": "uk",
     "limit": 535,
     "printed": 535,
     "tiles": [
      [
       "field_command_mathieu",
       [
        "concealed",
        "aircraft_x1",
        null
       ]
      ],
      [
       "chaudiere",
       [
        "support_platoon_cha",
        "grenade_uk",
        "veteran_uk",
        "piat_platoon_cha"
       ]
      ],
      [
       "rwr",
       [
        "howitzer_support",
        "mortar_3in",
        "universal_carrier"
       ]
      ],
      [
       "ludger_houde",
       []
      ],
      [
       "spitfire",
       []
      ]
     ],
     "pts": 535,
     "sub": "3rd Canadian Infantry Division",
     "note": "The 60-point Royal Winnipeg Rifles card is read as Howitzer Support. The total matches the 535 printed in the final booklet, where the Spitfire costs 40 (it was 50 in V1.4, which printed 545). Check the army against the booklet.",
     "label": "Commonwealth army"
    },
    "ge": {
     "side": "ge",
     "limit": 240,
     "printed": 240,
     "tiles": [
      [
       "feldkommando_milius",
       [
        null,
        "fanatic",
        "initiative_ge"
       ]
      ],
      [
       "ss_panzergrenadiere_hj",
       [
        "assault_group_hj",
        "granatwerfer_8cm_hj",
        "ammo",
        null
       ]
      ]
     ],
     "pts": 240,
     "sub": "12. SS Panzer-Division",
     "note": "The printed 470 points cover both groups, this one and the reinforcements. The Feldkommando and the SS-Panzergrenadiere each keep their last slots empty.",
     "label": "German army"
    },
    "ge_reinf": {
     "side": "ge",
     "limit": 230,
     "printed": 230,
     "tiles": [
      [
       "panzergrenadiere_2",
       [
        null,
        null,
        null,
        "mech_sdkfz251"
       ]
      ],
      [
       "ludwig",
       []
      ]
     ],
     "pts": 155,
     "sub": "12. SS Panzer-Division",
     "note": "Not in the builder: Ludwig's 15-point equipment and the Flamer Group (60 points). With them the reinforcements reach 230 points. They enter through the blue arrows.",
     "label": "German reinforcements"
    }
   },
   "figs": [
    {
     "img": "img/hon/caen/scenfig/st-map.webp",
     "w": 1100,
     "h": 889,
     "cap": "Battlefield and deployment, booklet p.26"
    }
   ]
  },
  {
   "id": "safari",
   "title": "Safari in Normandy (Scenario A)",
   "type": "Bonus scenario",
   "pages": "14 to 15",
   "start": 14,
   "date": "June 25, 1944",
   "summary": "Bonus scenario outside the campaign. The 49th Division and the Shermans of the 24th Lancers hit La Grande Ferme, held by SS Panzergrenadiers and a handful of Panthers-sized cats.",
   "facts": [
    [
     "Front",
     "Normandy, Operation Martlet, Tessel"
    ],
    [
     "Players",
     "2. The AI can play either side."
    ],
    [
     "Armies",
     "Commonwealth, 49th Infantry Division, 595 points, against 12. SS and 21. Panzer-Division, 495 points."
    ],
    [
     "Setup",
     "6 boards (C6-A, C3-A, C2-A over C5-B, C1-B, C4-A). CW initiative, 1 CW primary objective, 3 tactical bonuses, 4 action cards each. The German player deploys first, then the CW player."
    ],
    [
     "Length",
     "6 turns"
    ],
    [
     "Special rules",
     "None beyond the standard rules. Not part of the campaign."
    ],
    [
     "How to win",
     "The CW player controls the primary objective at the end of turn 6. The game can end early at the end of a Supply Phase once he controls it."
    ],
    [
     "Campaign",
     "Bonus, outside the six campaign scenarios."
    ]
   ],
   "armies": {
    "uk": {
     "side": "uk",
     "limit": 595,
     "printed": 595,
     "tiles": [
      [
       "worcestershire",
       [
        "mech_piat_wor",
        "grenade_uk",
        "universal_carrier",
        "cromwell_mk4"
       ]
      ],
      [
       "hussars_23",
       [
        "sherman_firefly",
        "tank_gear_uk",
        "tank_ammo_uk"
       ]
      ],
      [
       "sgt_lee_lowe",
       [
        "veteran_uk"
       ]
      ],
      [
       "jack_banks",
       [
        "flamer_uk"
       ]
      ]
     ],
     "pts": 595,
     "sub": "49th Infantry Division",
     "note": "The 15-point card on Lowe is read as Veteran.",
     "label": "Commonwealth army"
    },
    "ge": {
     "side": "ge",
     "limit": 495,
     "printed": 495,
     "tiles": [
      [
       "panzergrenadiere_1",
       [
        "panzerschreck_group_1",
        "panzerfaust",
        "grenade",
        "pzgren_squad_1"
       ]
      ],
      [
       "ss_panzergruppe",
       [
        "stug_iv_ss",
        "pak40",
        null
       ]
      ],
      [
       "emil_durr",
       []
      ],
      [
       "helmut",
       []
      ]
     ],
     "pts": 495,
     "sub": "12. SS Panzer-Division and 21. Panzer-Division",
     "note": "The builder total comes to 500, five points above the printed 495, and Dürr's Knife (5 points) is hero equipment that is not in the builder. Check the Panzergrenadiere tile against the booklet.",
     "label": "German army"
    }
   },
   "figs": [
    {
     "img": "img/hon/caen/scenfig/sf-map.webp",
     "w": 1100,
     "h": 631,
     "cap": "Battlefield and deployment, booklet p.14"
    }
   ]
  },
  {
   "id": "creel",
   "title": "The Creel (single scenario)",
   "type": "Bonus scenario",
   "pages": "1 to 2",
   "start": 15,
   "sheet": true,
   "date": "July 1944",
   "summary": "Solo scenario sheet outside the campaign. The Worcestershire Regiment must dislodge the 12. SS-Panzer-Division from a ruined factory in the suburbs of Caen, where the rubble hinders the attackers and covers the defenders. Needs Battle Pack #2.",
   "facts": [
    [
     "Front",
     "Normandy, suburbs of Caen"
    ],
    [
     "Players",
     "1. Solo mode: the AI can play either side. You choose the faction the AI plays and keep the initiative every turn."
    ],
    [
     "Armies",
     "Commonwealth, 43rd Infantry Division, 425 points, against 12. SS-Panzer-Division, 370 points."
    ],
    [
     "Required products",
     "Battle Pack #2 Epsom, Charnwood, Goodwood"
    ],
    [
     "Setup",
     "4 boards: EC6-A and EC1-A on top, EC5-A and EC4-A below, with a street strip between the two columns, and the Chimney. 1 Commonwealth primary objective, 2 German secondary objectives, 4 solo mode tactical bonuses, 4 action cards. The sheet gives the full solo mode set up for both factions."
    ],
    [
     "Length",
     "7 turns"
    ],
    [
     "Special rules",
     "None beyond the standard rules and the solo mode. The AI attitude is Aggressive if it plays the CW and Defensive if it plays the Germans (Balanced is also allowed). A die roll in the Order Phase of turns 3 and 5 gives the AI a Danger tile effect."
    ],
    [
     "How to win",
     "The Commonwealth controls its primary objective at the end of turn 7. The Germans win by controlling both secondary objectives at the end of any Supply Phase. If neither side has done it at the end of turn 7, the game is a draw."
    ],
    [
     "Campaign",
     "Single scenario, outside the six campaign scenarios."
    ]
   ],
   "figs": [
    {
     "img": "img/hon/caen/scenfig/creel-map.webp",
     "w": 1120,
     "h": 803,
     "cap": "Battlefield and deployment, sheet page 1"
    }
   ]
  },
  {
   "id": "campaignreport",
   "title": "Campaign report",
   "type": "Booklet rules and reference",
   "pages": "28",
   "start": 28,
   "date": "",
   "summary": "The score sheet for the six-scenario campaign. Each win counts 5 points, medals count 2, and the side with the highest total wins.",
   "facts": [
    [
     "Covers",
     "The campaign score sheet and the icon summary for the Battle for Caen rules."
    ],
    [
     "Scoring",
     "A Commonwealth or German scenario victory is worth 5 points. A Victoria Cross or an Eisernes Kreuz is worth 2 points."
    ],
    [
     "Medals",
     "Victoria Cross: scenarios 2, 3 and 4 (major CW victory in 2 and 4). Eisernes Kreuz: scenarios 1, 3 and 6. None in scenario 5."
    ],
    [
     "Winner",
     "The side with the highest score wins the campaign."
    ],
    [
     "Scenario titles",
     "The report uses the same titles as the scenario pages, Trading Blows and Beaver Tails with Sauerkraut."
    ]
   ],
   "figs": []
  }
 ]
};
