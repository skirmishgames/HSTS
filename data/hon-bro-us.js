window.HTS_DATA = window.HTS_DATA || {};
HTS_DATA["hon-bro-us"] = {
 "game": "hon",
 "box": "bro",
 "nation": "us",
 "name": "United States",
 "uimg": {
  "Col. Taylor": "img/hon/bro/us/units/us-hq-g-taylor-a.webp",
  "81mm Mortar": "img/hon/bro/us/units/us-hq-81mm-mortar-a.webp",
  "Clint": "img/hon/bro/us/units/us-heroes-clint-a.webp",
  "Oddball": "img/hon/bro/us/units/us-heroes-odball-a.webp",
  "Oddball's M4 Sherman": "img/hon/bro/us/units/us-heroes-odball-m4-sherman-02-a.webp",
  "The Rock": "img/hon/bro/us/units/us-heroes-the-rock-a.webp",
  "Sam Fueller": "img/hon/bro/us/units/18th-inf-reg-c-sam-fueller-a.webp",
  "60mm Mortar": "img/hon/bro/us/units/us-options-60mm-mortar-a.webp",
  "Willys .50 Cal": "img/hon/bro/us/units/us-options-wilys-50cal-a.webp",
  "57mm AT Gun": "img/hon/bro/us/units/us-options-57mm-at-gun.webp",
  "M8 AC Greyhound": "img/hon/bro/us/units/us-options-m8-ac-greyhound-01-a.webp",
  "M5 Stuart": "img/hon/bro/us/units/us-options-m5-stuart-01-a.webp",
  "M4 Sherman": "img/hon/bro/us/units/us-options-m4-sherman-01-a.webp",
  "M3A1 Halftrack": "img/hon/bro/us/units/18th-inf-reg-c-m3a1-halftrack-01-a.webp",
  "M10 A1": "img/hon/bro/us/units/bo-m10-a1.webp"
 },
 "tiles": [
  {
   "id": "field_command_taylor",
   "name": "Field Command",
   "sub": "Colonel George A. Taylor",
   "cost": 30,
   "type": "command",
   "set": "CB",
   "squares": 0,
   "img": "img/hon/bro/us/tiles/field_command_taylor.webp",
   "w": 1670,
   "h": 589,
   "sheet": "US-Vol1-p1",
   "units": [
    [
     "Col. Taylor",
     1,
     "officer"
    ]
   ],
   "slots": [
    {
     "x": 0.0295,
     "y": 0.2251,
     "w": 0.2527,
     "h": 0.7165,
     "size": "w",
     "stripes": [
      "cmd",
      "custom"
     ]
    },
    {
     "x": 0.5672,
     "y": 0.225,
     "w": 0.1969,
     "h": 0.7165,
     "size": "n",
     "stripes": [
      "cmd",
      "custom"
     ]
    },
    {
     "x": 0.7729,
     "y": 0.2249,
     "w": 0.1969,
     "h": 0.7165,
     "size": "n",
     "stripes": [
      "cmd",
      "custom"
     ]
    }
   ],
   "own": [
    "bluff",
    "planning",
    "improvisation",
    "mortar_81mm"
   ]
  },
  {
   "id": "clint",
   "name": "Clint",
   "sub": "Universal Hero",
   "cost": 30,
   "type": "hero",
   "set": "CB",
   "squares": 1,
   "img": "img/hon/bro/us/tiles/clint.webp",
   "w": 800,
   "h": 589,
   "sheet": "US-Vol1-p2",
   "units": [
    [
     "Clint",
     1,
     "character"
    ]
   ],
   "slots": [
    {
     "x": 0.5176,
     "y": 0.1968,
     "w": 0.4143,
     "h": 0.5918,
     "size": "n",
     "stripes": [
      "custom"
     ]
    }
   ],
   "own": []
  },
  {
   "id": "oddball",
   "name": "Oddball",
   "sub": "Positive Freak",
   "cost": 75,
   "type": "hero",
   "set": "CB",
   "squares": 2,
   "img": "img/hon/bro/us/tiles/oddball.webp",
   "w": 800,
   "h": 589,
   "sheet": "US-Vol1-p2",
   "units": [
    [
     "Oddball",
     1,
     "character"
    ],
    [
     "Oddball's M4 Sherman",
     1,
     "vehicle"
    ]
   ],
   "note": "The printed pieces disagree on this hero's name: Oddball on the tank and one side of the hero, Stillman on the other side (known printing inconsistency).",
   "slots": [
    {
     "x": 0.5225,
     "y": 0.1942,
     "w": 0.4142,
     "h": 0.5917,
     "size": "n",
     "stripes": [
      "custom"
     ]
    }
   ],
   "own": []
  },
  {
   "id": "the_rock",
   "name": "The Rock",
   "sub": "Heavy Gunner",
   "cost": 30,
   "type": "hero",
   "set": "CB",
   "squares": 1,
   "img": "img/hon/bro/us/tiles/the_rock.webp",
   "w": 800,
   "h": 589,
   "sheet": "US-Vol1-p2",
   "units": [
    [
     "The Rock",
     1,
     "character"
    ]
   ],
   "slots": [
    {
     "x": 0.5274,
     "y": 0.1987,
     "w": 0.4141,
     "h": 0.5917,
     "size": "n",
     "stripes": [
      "custom"
     ]
    }
   ],
   "own": []
  },
  {
   "id": "rifle_platoon_1id_16a",
   "name": "Rifle Platoon",
   "sub": "1st Inf. Div. 16th Inf. Reg. A",
   "cost": 70,
   "type": "platoon",
   "set": "CB",
   "squares": 3,
   "img": "img/hon/bro/us/tiles/rifle_platoon_1id_16a.webp",
   "w": 2030,
   "h": 589,
   "sheet": "US-Vol1-p3",
   "units": [
    [
     "Lt. Blean",
     1,
     "officer"
    ],
    [
     "Recon Team",
     1,
     "infantry"
    ],
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Support Team",
     1,
     "infantry"
    ]
   ],
   "uimg": {
    "Lt. Blean": "img/hon/bro/us/units/16th-inf-reg-a-blean-a.webp",
    "Recon Team": "img/hon/bro/us/units/16th-inf-reg-a-recon-team.webp",
    "Fire Team": "img/hon/bro/us/units/16th-inf-reg-a-fire-team-a.webp",
    "Support Team": "img/hon/bro/us/units/16th-inf-reg-a-support-team-a.webp",
    ".30 Cal": "img/hon/bro/us/units/16th-inf-reg-a-30-cal-a.webp",
    "Bazooka": "img/hon/bro/us/units/16th-inf-reg-a-bazooka.webp"
   },
   "slots": [
    {
     "x": 0.0278,
     "y": 0.2174,
     "w": 0.2116,
     "h": 0.7172,
     "size": "w",
     "stripes": [
      "R",
      "Y"
     ]
    },
    {
     "x": 0.2461,
     "y": 0.2175,
     "w": 0.1655,
     "h": 0.7172,
     "size": "n",
     "stripes": [
      "R",
      "Y"
     ]
    },
    {
     "x": 0.5942,
     "y": 0.2178,
     "w": 0.1667,
     "h": 0.7172,
     "size": "n",
     "stripes": [
      "R",
      "Y"
     ]
    },
    {
     "x": 0.764,
     "y": 0.218,
     "w": 0.208,
     "h": 0.7172,
     "size": "w",
     "stripes": [
      "R",
      "Y"
     ]
    }
   ],
   "own": [
    "rifle_squad_16a",
    "cal30_squad_16a",
    "bazooka_squad_16a"
   ]
  },
  {
   "id": "rifle_platoon_1id_18c",
   "name": "Rifle Platoon 2",
   "sub": "1st Inf. Div. 18th Inf. Reg. C",
   "cost": 70,
   "type": "platoon",
   "set": "CB",
   "squares": 3,
   "img": "img/hon/bro/us/tiles/rifle_platoon_1id_18c.webp",
   "w": 2030,
   "h": 589,
   "sheet": "US-Vol1-p4",
   "units": [
    [
     "Lt. J.W. Will",
     1,
     "officer"
    ],
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Support Team",
     1,
     "infantry"
    ],
    [
     ".30 Cal",
     1,
     "weapon"
    ]
   ],
   "uimg": {
    "Lt. J.W. Will": "img/hon/bro/us/units/18th-inf-reg-c-w-j-will-a.webp",
    "Recon Team": "img/hon/bro/us/units/18th-inf-reg-c-recon-team.webp",
    "Fire Team": "img/hon/bro/us/units/18th-inf-reg-c-fire-team-a.webp",
    "Support Team": "img/hon/bro/us/units/18th-inf-reg-c-support-team-a.webp",
    ".30 Cal": "img/hon/bro/us/units/18th-inf-reg-c-30-cal-a.webp",
    "Bazooka": "img/hon/bro/us/units/18th-inf-reg-c-bazooka.webp",
    "M3A1 Halftrack": "img/hon/bro/us/units/18th-inf-reg-c-m3a1-halftrack-01-a.webp"
   },
   "note": "The officer is printed as Lt. J.W. Will on the tile and W.J. Will on his own counter (known printing inconsistency).",
   "slots": [
    {
     "x": 0.0279,
     "y": 0.2229,
     "w": 0.2114,
     "h": 0.7174,
     "size": "w",
     "stripes": [
      "R",
      "LB"
     ]
    },
    {
     "x": 0.2462,
     "y": 0.2225,
     "w": 0.1653,
     "h": 0.7173,
     "size": "n",
     "stripes": [
      "R",
      "LB"
     ]
    },
    {
     "x": 0.5943,
     "y": 0.2218,
     "w": 0.1665,
     "h": 0.7173,
     "size": "n",
     "stripes": [
      "R",
      "LB"
     ]
    },
    {
     "x": 0.7642,
     "y": 0.2214,
     "w": 0.2077,
     "h": 0.7174,
     "size": "w",
     "stripes": [
      "R",
      "LB"
     ]
    }
   ],
   "own": [
    "rifle_squad_18c",
    "bazooka_squad_18c",
    "mechanised_m3a1"
   ]
  },
  {
   "id": "us_combat_engineers",
   "name": "US Combat Engineers",
   "sub": "1st Inf. Div. 299th Battalion",
   "cost": 100,
   "type": "platoon",
   "set": "BO",
   "squares": 3,
   "img": "img/hon/bro/us/tiles/us_combat_engineers.webp",
   "w": 1886,
   "h": 590,
   "sheet": "US-Vol2-p1",
   "units": [
    [
     "Lt. Milton",
     1,
     "officer"
    ],
    [
     "Flamer",
     1,
     "weapon"
    ],
    [
     "Fire Team",
     2,
     "infantry"
    ]
   ],
   "slots": [
    {
     "x": 0.0303,
     "y": 0.2339,
     "w": 0.2184,
     "h": 0.6935,
     "size": "w",
     "stripes": [
      "W",
      "R"
     ]
    },
    {
     "x": 0.2576,
     "y": 0.2339,
     "w": 0.1616,
     "h": 0.6935,
     "size": "n",
     "stripes": [
      "W",
      "R"
     ]
    },
    {
     "x": 0.6237,
     "y": 0.2339,
     "w": 0.1616,
     "h": 0.6935,
     "size": "n",
     "stripes": [
      "W",
      "R"
     ]
    },
    {
     "x": 0.8005,
     "y": 0.2339,
     "w": 0.1667,
     "h": 0.6935,
     "size": "n",
     "stripes": [
      "W",
      "R"
     ]
    }
   ],
   "own": [
    "support_squad_eng",
    "assault_squad_eng",
    "bangalore",
    "shovel",
    "position",
    "explosive_m1"
   ]
  },
  {
   "id": "sam_fueller",
   "name": "Sam Fueller",
   "sub": "White Dog",
   "cost": 30,
   "type": "hero",
   "set": "BO",
   "squares": 1,
   "img": "img/hon/bro/us/tiles/sam_fueller.webp",
   "w": 798,
   "h": 590,
   "sheet": "US-Vol2-p2",
   "units": [
    [
     "Sam Fueller",
     1,
     "character"
    ]
   ],
   "slots": [
    {
     "x": 0.5194,
     "y": 0.2097,
     "w": 0.403,
     "h": 0.5726,
     "size": "n",
     "stripes": [
      "custom"
     ]
    }
   ],
   "own": []
  },
  {
   "id": "sgt_horvath",
   "name": "Sgt Horvath",
   "sub": "Motivator",
   "cost": 30,
   "type": "hero",
   "set": "BO",
   "squares": 1,
   "img": "img/hon/bro/us/tiles/sgt_horvath.webp",
   "w": 800,
   "h": 590,
   "sheet": "US-Vol2-p2",
   "units": [
    [
     "Sgt Horvath",
     1,
     "character"
    ]
   ],
   "slots": [
    {
     "x": 0.5179,
     "y": 0.2097,
     "w": 0.4018,
     "h": 0.5726,
     "size": "n",
     "stripes": [
      "custom"
     ]
    }
   ],
   "own": []
  },
  {
   "id": "landing_1id",
   "name": "Landing",
   "sub": "1st Inf. Div. 16th Inf. Reg. A",
   "cost": 30,
   "type": "landing",
   "set": "BO",
   "squares": 3,
   "img": "img/hon/bro/us/tiles/landing_1id.webp",
   "w": 467,
   "h": 586,
   "sheet": "US-Vol2-p2",
   "units": [
    [
     "Fire Team",
     2,
     "infantry"
    ],
    [
     "Support Team",
     2,
     "infantry"
    ]
   ],
   "slots": [],
   "own": []
  },
  {
   "id": "landing_29id",
   "name": "Landing",
   "sub": "29th Inf. Div. 116th Inf. Reg. A",
   "cost": 30,
   "type": "landing",
   "set": "BO",
   "squares": 3,
   "img": "img/hon/bro/us/tiles/landing_29id.webp",
   "w": 467,
   "h": 586,
   "sheet": "US-Vol2-p2",
   "units": [
    [
     "Fire Team",
     2,
     "infantry"
    ],
    [
     "Support Team",
     2,
     "infantry"
    ]
   ],
   "slots": [],
   "own": []
  },
  {
   "id": "high_command_cota",
   "name": "High Command",
   "sub": "Brigadier General Norman Cota",
   "cost": 40,
   "type": "command",
   "set": "BO",
   "squares": 2,
   "img": "img/hon/bro/us/tiles/high_command_cota.webp",
   "w": 1971,
   "h": 590,
   "sheet": "US-Vol2-p3",
   "units": [
    [
     "N. Cota",
     1,
     "officer"
    ],
    [
     "Command Team",
     1,
     "infantry"
    ]
   ],
   "slots": [
    {
     "x": 0.0302,
     "y": 0.2339,
     "w": 0.2053,
     "h": 0.6935,
     "size": "w",
     "stripes": [
      "cmd",
      "custom"
     ]
    },
    {
     "x": 0.2476,
     "y": 0.2339,
     "w": 0.157,
     "h": 0.6935,
     "size": "n",
     "stripes": [
      "cmd",
      "custom"
     ]
    },
    {
     "x": 0.5918,
     "y": 0.2339,
     "w": 0.163,
     "h": 0.6935,
     "size": "n",
     "stripes": [
      "cmd",
      "custom"
     ]
    },
    {
     "x": 0.7669,
     "y": 0.2339,
     "w": 0.2053,
     "h": 0.6935,
     "size": "w",
     "stripes": [
      "cmd",
      "custom"
     ]
    }
   ],
   "own": [
    "aircraft_x1",
    "aircraft_x2",
    "battle_plan",
    "artillery",
    "smoke"
   ]
  },
  {
   "id": "rifle_platoon_29id_116a",
   "name": "Rifle Platoon 3",
   "sub": "29th Inf. Div. 116th Inf. Reg. A",
   "cost": 70,
   "type": "platoon",
   "set": "BO",
   "squares": 3,
   "img": "img/hon/bro/us/tiles/rifle_platoon_29id_116a.webp",
   "w": 1981,
   "h": 600,
   "sheet": "US-Vol2-p4",
   "units": [
    [
     "Lt. B. Hawks",
     1,
     "officer"
    ],
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Support Team",
     1,
     "infantry"
    ],
    [
     "60mm Mortar",
     1,
     "weapon"
    ]
   ],
   "slots": [
    {
     "x": 0.03,
     "y": 0.2302,
     "w": 0.2043,
     "h": 0.6825,
     "size": "w",
     "stripes": [
      "W",
      "B"
     ]
    },
    {
     "x": 0.2464,
     "y": 0.2302,
     "w": 0.1562,
     "h": 0.6825,
     "size": "n",
     "stripes": [
      "W",
      "B"
     ]
    },
    {
     "x": 0.5889,
     "y": 0.2302,
     "w": 0.1623,
     "h": 0.6825,
     "size": "n",
     "stripes": [
      "W",
      "B"
     ]
    },
    {
     "x": 0.7632,
     "y": 0.2302,
     "w": 0.1983,
     "h": 0.6825,
     "size": "w",
     "stripes": [
      "W",
      "B"
     ]
    }
   ],
   "own": [
    "cal30_squad_116a",
    "bazooka_squad_116a",
    "assault_squad_116a"
   ]
  },
  {
   "id": "us_rangers",
   "name": "US Rangers",
   "sub": "2nd Rangers, A Battalion",
   "cost": 90,
   "type": "platoon",
   "set": "BO",
   "squares": 3,
   "img": "img/hon/bro/us/tiles/us_rangers.webp",
   "w": 1552,
   "h": 590,
   "sheet": "US-Vol2-p5",
   "units": [
    [
     "Lt. Edlin",
     1,
     "officer"
    ],
    [
     "Recon Team",
     1,
     "infantry"
    ],
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Support Team",
     1,
     "infantry"
    ]
   ],
   "slots": [
    {
     "x": 0.0383,
     "y": 0.2339,
     "w": 0.2607,
     "h": 0.6935,
     "size": "w",
     "stripes": [
      "B",
      "Y",
      "R"
     ]
    },
    {
     "x": 0.5445,
     "y": 0.2339,
     "w": 0.1994,
     "h": 0.6935,
     "size": "n",
     "stripes": [
      "B",
      "Y",
      "R"
     ]
    },
    {
     "x": 0.7592,
     "y": 0.2339,
     "w": 0.1994,
     "h": 0.6935,
     "size": "n",
     "stripes": [
      "B",
      "Y",
      "R"
     ]
    }
   ],
   "own": [
    "support_squad_rangers",
    "bazooka_squad_rangers",
    "bazooka_rangers",
    "rangers_gear",
    "mobile_fire",
    "urban_fighter"
   ]
  },
  {
   "id": "tank_platoon_743",
   "name": "Tank Platoon",
   "sub": "743rd Tank Battalion",
   "cost": 125,
   "type": "platoon",
   "set": "BO",
   "squares": 2,
   "img": "img/hon/bro/us/tiles/tank_platoon_743.webp",
   "w": 1976,
   "h": 595,
   "sheet": "US-Vol2-p6",
   "units": [
    [
     "M4 Sherman Command",
     1,
     "vehicle"
    ],
    [
     "M4 Sherman",
     1,
     "vehicle"
    ]
   ],
   "slots": [
    {
     "x": 0.0301,
     "y": 0.232,
     "w": 0.2048,
     "h": 0.688,
     "size": "w",
     "stripes": [
      "Y",
      "B"
     ]
    },
    {
     "x": 0.247,
     "y": 0.232,
     "w": 0.1566,
     "h": 0.688,
     "size": "n",
     "stripes": [
      "Y",
      "B"
     ]
    },
    {
     "x": 0.5904,
     "y": 0.232,
     "w": 0.1627,
     "h": 0.688,
     "size": "n",
     "stripes": [
      "Y",
      "B"
     ]
    },
    {
     "x": 0.7651,
     "y": 0.232,
     "w": 0.1988,
     "h": 0.688,
     "size": "w",
     "stripes": [
      "Y",
      "B"
     ]
    }
   ],
   "own": [
    "tank_gear",
    "tank_ammo",
    "m4_sherman_tp",
    "m4a3_105"
   ]
  },
  {
   "id": "private_smithy",
   "name": "Private Smithy",
   "sub": "Smashing Pumpkins",
   "cost": 30,
   "type": "hero",
   "set": "KS-9",
   "squares": 1,
   "img": "img/hon/bro/us/tiles/private_smithy.webp",
   "w": 332,
   "h": 246,
   "sheet": "US-Vol3-p1",
   "units": [
    [
     "Private Smithy",
     1,
     "character"
    ]
   ],
   "slots": [
    {
     "x": 0.5241,
     "y": 0.2114,
     "w": 0.4066,
     "h": 0.5772,
     "size": "n",
     "stripes": [
      "custom"
     ]
    }
   ],
   "own": []
  },
  {
   "id": "luke_brassert",
   "name": "Luke Griff Brassert",
   "sub": "American Padawan",
   "cost": 25,
   "type": "hero",
   "set": "SOLO",
   "squares": 1,
   "img": "img/hon/bro/us/tiles/luke_brassert.webp",
   "w": 332,
   "h": 246,
   "sheet": "US-Vol3-p1",
   "units": [
    [
     "Luke Brassert",
     1,
     "character"
    ]
   ],
   "slots": [
    {
     "x": 0.5241,
     "y": 0.2114,
     "w": 0.4066,
     "h": 0.5772,
     "size": "n",
     "stripes": [
      "custom"
     ]
    }
   ],
   "own": []
  },
  {
   "id": "don_collier",
   "name": "Don Wardaddy Collier",
   "sub": "Fury Tank",
   "cost": 110,
   "type": "hero",
   "set": "WS#0",
   "squares": 2,
   "img": "img/hon/bro/us/tiles/don_collier.webp",
   "w": 650,
   "h": 244,
   "sheet": "US-Vol3-p1",
   "units": [
    [
     "Don \"Wardaddy\" Collier",
     1,
     "character"
    ],
    [
     "Sherman (76) W \"Fury\"",
     1,
     "vehicle"
    ]
   ],
   "slots": [
    {
     "x": 0.0338,
     "y": 0.2131,
     "w": 0.2031,
     "h": 0.6721,
     "size": "n",
     "stripes": [
      "Y",
      "B",
      "R"
     ]
    },
    {
     "x": 0.5415,
     "y": 0.2131,
     "w": 0.2062,
     "h": 0.6721,
     "size": "n",
     "stripes": [
      "Y",
      "B",
      "R"
     ]
    },
    {
     "x": 0.7569,
     "y": 0.2131,
     "w": 0.2062,
     "h": 0.6721,
     "size": "n",
     "stripes": [
      "Y",
      "B",
      "R"
     ]
    }
   ],
   "own": []
  },
  {
   "id": "recon_2edb",
   "name": "Recon Platoon 2e DB",
   "sub": "1er Escadron RBFM 2e DB",
   "cost": 120,
   "type": "platoon",
   "set": "P500",
   "squares": 3,
   "img": "img/hon/bro/us/tiles/recon_2edb.webp",
   "w": 608,
   "h": 248,
   "sheet": "US-Vol3-p2",
   "units": [
    [
     "Vann",
     1,
     "character"
    ],
    [
     "Brigantine",
     1,
     "vehicle"
    ],
    [
     "Recon (BAR)",
     2,
     "infantry"
    ],
    [
     "Trinquette",
     1,
     "vehicle"
    ]
   ],
   "slots": [
    {
     "x": 0.0362,
     "y": 0.2298,
     "w": 0.2237,
     "h": 0.6976,
     "size": "n",
     "stripes": [
      "Y",
      "B",
      "W"
     ]
    },
    {
     "x": 0.7368,
     "y": 0.2298,
     "w": 0.2237,
     "h": 0.6976,
     "size": "n",
     "stripes": [
      "Y",
      "B",
      "W"
     ]
    }
   ],
   "own": [
    "training_fr",
    "guardian_fr"
   ]
  },
  {
   "id": "p47_thunderbolt",
   "name": "Thunderbolt",
   "sub": "Republic P-47",
   "cost": 55,
   "type": "aircraft",
   "set": "BO",
   "squares": 0,
   "img": "img/hon/bro/us/tiles/p47_thunderbolt.webp",
   "w": 602,
   "h": 464,
   "sheet": "TTS Omaha US HQ",
   "units": [
    [
     "Thunderbolt",
     1,
     "aircraft"
    ]
   ],
   "uimg": {
    "Thunderbolt": "img/hon/bro/us/units/air-p47_thunderbolt.webp"
   },
   "slots": [],
   "own": [],
   "note": "Aircraft tile. Recruited with an Aircraft Orders option, and its cost is the cost printed on the tile."
  },
  {
   "id": "p51_mustang",
   "name": "Mustang",
   "sub": "North American P-51D",
   "cost": 50,
   "type": "aircraft",
   "set": "BO",
   "squares": 0,
   "img": "img/hon/bro/us/tiles/p51_mustang.webp",
   "w": 602,
   "h": 464,
   "sheet": "TTS Omaha US HQ",
   "units": [
    [
     "Mustang",
     1,
     "aircraft"
    ]
   ],
   "uimg": {
    "Mustang": "img/hon/bro/us/units/air-p51_mustang.webp"
   },
   "slots": [],
   "own": [],
   "note": "Aircraft tile. Recruited with an Aircraft Orders option, and its cost is the cost printed on the tile."
  }
 ],
 "options": [
  {
   "id": "bluff",
   "name": "Bluff",
   "cat": "order",
   "cost": 10,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "cmd"
   ],
   "img": "img/hon/bro/us/options/bluff.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p1",
   "note": "1 additional Bluff Order Token. Maximum 2 Bluff Order Tokens."
  },
  {
   "id": "planning",
   "name": "Planning",
   "cat": "order",
   "cost": 10,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "cmd"
   ],
   "img": "img/hon/bro/us/options/planning.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p1",
   "note": "1 additional Numbered Order Token. Maximum 10 Numbered Order Tokens."
  },
  {
   "id": "improvisation",
   "name": "Improvisation",
   "cat": "order",
   "cost": 20,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "cmd"
   ],
   "img": "img/hon/bro/us/options/improvisation.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p1",
   "note": "Draw 1 more Action Card than your maximum, then discard 1."
  },
  {
   "id": "mortar_81mm",
   "name": "81mm Mortar",
   "cat": "support",
   "cost": 25,
   "squares": 1,
   "set": "CB",
   "size": "n",
   "stripes": [
    "cmd"
   ],
   "img": "img/hon/bro/us/options/mortar_81mm.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p1",
   "units": [
    [
     "81mm Mortar",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "knife",
   "name": "Knife",
   "cat": "customization",
   "cost": 5,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/knife.webp",
   "w": 114,
   "h": 152,
   "sheet": "US-Vol1-p2",
   "note": "Before an Assault roll, discard the Knife marker for +2. Characters only."
  },
  {
   "id": "panzerfaust_c",
   "name": "Panzerfaust",
   "cat": "customization",
   "cost": 5,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/panzerfaust_c.webp",
   "w": 114,
   "h": 152,
   "sheet": "US-Vol1-p2",
   "note": "1 Panzerfaust marker, range 4. Characters only."
  },
  {
   "id": "mp40",
   "name": "MP40",
   "cat": "customization",
   "cost": 5,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/mp40.webp",
   "w": 116,
   "h": 152,
   "sheet": "US-Vol1-p2",
   "note": "Use the option's Combat Values, Suppressive Fire, limited range 4. Characters only."
  },
  {
   "id": "thompson",
   "name": "Thompson",
   "cat": "customization",
   "cost": 5,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/thompson.webp",
   "w": 116,
   "h": 152,
   "sheet": "US-Vol1-p2",
   "note": "Use the option's Combat Values, Suppressive Fire, limited range 4. Characters only."
  },
  {
   "id": "overwatch",
   "name": "Overwatch",
   "cat": "customization",
   "cost": 10,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/overwatch.webp",
   "w": 114,
   "h": 152,
   "sheet": "US-Vol1-p2",
   "note": "Opportunity Fire special ability. Characters only."
  },
  {
   "id": "bazooka_c",
   "name": "Bazooka",
   "cat": "customization",
   "cost": 15,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/bazooka_c.webp",
   "w": 116,
   "h": 152,
   "sheet": "US-Vol1-p2",
   "note": "2 Bazooka markers, Alternate Firing Action. Characters only."
  },
  {
   "id": "flamer",
   "name": "Flamer",
   "cat": "customization",
   "cost": 20,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/flamer.webp",
   "w": 116,
   "h": 152,
   "sheet": "US-Vol1-p2",
   "note": "Flamethrower special ability. Characters only."
  },
  {
   "id": "rifle_squad_16a",
   "name": "Rifle Squad",
   "cat": "support",
   "cost": 50,
   "squares": 2,
   "set": "CB",
   "size": "w",
   "stripes": [
    "R",
    "Y"
   ],
   "img": "img/hon/bro/us/options/rifle_squad_16a.webp",
   "w": 352,
   "h": 352,
   "sheet": "US-Vol1-p3",
   "units": [
    [
     "Recon Team",
     1,
     "infantry"
    ],
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Support Team",
     1,
     "infantry"
    ]
   ]
  },
  {
   "id": "cal30_squad_16a",
   "name": ".30 Cal Squad",
   "cat": "support",
   "cost": 50,
   "squares": 2,
   "set": "CB",
   "size": "w",
   "stripes": [
    "R",
    "Y"
   ],
   "img": "img/hon/bro/us/options/cal30_squad_16a.webp",
   "w": 352,
   "h": 352,
   "sheet": "US-Vol1-p3",
   "units": [
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Support Team",
     1,
     "infantry"
    ],
    [
     ".30 Cal",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "bazooka_squad_16a",
   "name": "Bazooka Squad",
   "cat": "support",
   "cost": 55,
   "squares": 2,
   "set": "CB",
   "size": "w",
   "stripes": [
    "R",
    "Y"
   ],
   "img": "img/hon/bro/us/options/bazooka_squad_16a.webp",
   "w": 352,
   "h": 352,
   "sheet": "US-Vol1-p3",
   "units": [
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Support Team",
     1,
     "infantry"
    ],
    [
     "Bazooka",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "rifle_squad_18c",
   "name": "Rifle Squad",
   "cat": "support",
   "cost": 50,
   "squares": 2,
   "set": "CB",
   "size": "w",
   "stripes": [
    "R",
    "LB"
   ],
   "img": "img/hon/bro/us/options/rifle_squad_18c.webp",
   "w": 352,
   "h": 352,
   "sheet": "US-Vol1-p4",
   "units": [
    [
     "Recon Team",
     1,
     "infantry"
    ],
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Support Team",
     1,
     "infantry"
    ]
   ]
  },
  {
   "id": "bazooka_squad_18c",
   "name": "Bazooka Squad",
   "cat": "support",
   "cost": 55,
   "squares": 2,
   "set": "CB",
   "size": "w",
   "stripes": [
    "R",
    "LB"
   ],
   "img": "img/hon/bro/us/options/bazooka_squad_18c.webp",
   "w": 352,
   "h": 352,
   "sheet": "US-Vol1-p4",
   "units": [
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Support Team",
     1,
     "infantry"
    ],
    [
     "Bazooka",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "mechanised_m3a1",
   "name": "Mechanised (M3A1 Halftrack x2)",
   "cat": "support",
   "cost": 60,
   "squares": 2,
   "set": "CB",
   "size": "w",
   "stripes": [
    "R",
    "LB"
   ],
   "img": "img/hon/bro/us/options/mechanised_m3a1.webp",
   "w": 352,
   "h": 352,
   "sheet": "US-Vol1-p4",
   "units": [
    [
     "M3A1 Halftrack",
     2,
     "vehicle"
    ]
   ]
  },
  {
   "id": "mortar_60mm",
   "name": "60mm Mortar",
   "cat": "support",
   "cost": 15,
   "squares": 1,
   "set": "CB",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/mortar_60mm.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p5",
   "units": [
    [
     "60mm Mortar",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "willys_50cal",
   "name": "Willys .50 Cal",
   "cat": "support",
   "cost": 25,
   "squares": 1,
   "set": "CB",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/willys_50cal.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p5",
   "units": [
    [
     "Willys .50 Cal",
     1,
     "vehicle"
    ]
   ]
  },
  {
   "id": "at_gun_57mm",
   "name": "57mm AT Gun",
   "cat": "support",
   "cost": 25,
   "squares": 1,
   "set": "CB",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/at_gun_57mm.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p5",
   "units": [
    [
     "57mm AT Gun",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "m8_greyhound",
   "name": "M8 AC Greyhound",
   "cat": "support",
   "cost": 35,
   "squares": 1,
   "set": "CB",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/m8_greyhound.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p5",
   "units": [
    [
     "M8 AC Greyhound",
     1,
     "vehicle"
    ]
   ]
  },
  {
   "id": "veteran",
   "name": "Veteran",
   "cat": "trait",
   "cost": 15,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/veteran.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p5",
   "note": "3 Veteran markers. Each lets you reroll any one roll, yours or your opponent's."
  },
  {
   "id": "grenade",
   "name": "Grenade",
   "cat": "gear",
   "cost": 5,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/grenade.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p5",
   "note": "3 Grenade markers. Alternate Firing Action, max range 2 interspaces. Infantry only."
  },
  {
   "id": "ammo",
   "name": "Ammo",
   "cat": "gear",
   "cost": 10,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/ammo.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p5",
   "note": "3 Ammo markers. Each gives +1 Combat Value in a Firing Action against Infantry. Infantry only."
  },
  {
   "id": "rifle_grenade",
   "name": "Rifle Grenade",
   "cat": "gear",
   "cost": 10,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/rifle_grenade.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p5",
   "note": "3 Rifle Grenade markers. Alternate Firing Action, max range 7 interspaces, Indirect Fire. Infantry only."
  },
  {
   "id": "sticky_bomb",
   "name": "Sticky Bomb",
   "cat": "gear",
   "cost": 10,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/sticky_bomb.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p5",
   "note": "3 Sticky Bomb markers. Placed on a Vehicle in the Unit's ZoC, resolved at the end of the Supply Phase. Infantry only."
  },
  {
   "id": "hedgerow_cutter",
   "name": "Culin Hedgerow Cutter",
   "cat": "gear",
   "cost": 5,
   "squares": 0,
   "set": "CB",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/hedgerow_cutter.webp",
   "w": 256,
   "h": 352,
   "sheet": "US-Vol1-p6",
   "note": "2 Passage markers. A Heavy Vehicle can move through a hedgerow. Heavy Vehicles only."
  },
  {
   "id": "m5_stuart",
   "name": "M5 Stuart",
   "cat": "support",
   "cost": 50,
   "squares": 1,
   "set": "CB",
   "size": "w",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/m5_stuart.webp",
   "w": 352,
   "h": 352,
   "sheet": "US-Vol1-p6",
   "units": [
    [
     "M5 Stuart",
     1,
     "vehicle"
    ]
   ]
  },
  {
   "id": "m4_sherman",
   "name": "M4 Sherman",
   "cat": "support",
   "cost": 60,
   "squares": 1,
   "set": "CB",
   "size": "w",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/m4_sherman.webp",
   "w": 352,
   "h": 352,
   "sheet": "US-Vol1-p6",
   "units": [
    [
     "M4 Sherman",
     1,
     "vehicle"
    ]
   ]
  },
  {
   "id": "cal30_gun",
   "name": ".30 Cal",
   "cat": "support",
   "cost": 15,
   "squares": 1,
   "set": "BO",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/cal30_gun.webp",
   "w": 270,
   "h": 366,
   "sheet": "US-Vol1-p6",
   "units": [
    [
     ".30 Cal",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "bazooka_team",
   "name": "Bazooka",
   "cat": "support",
   "cost": 15,
   "squares": 1,
   "set": "BO",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/bazooka_team.webp",
   "w": 112,
   "h": 152,
   "sheet": "US-Vol1-p6",
   "units": [
    [
     "Bazooka",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "m3a1_halftrack",
   "name": "M3A1 Halftrack",
   "cat": "support",
   "cost": 30,
   "squares": 1,
   "set": "BO",
   "size": "n",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/m3a1_halftrack.webp",
   "w": 110,
   "h": 144,
   "sheet": "US-Vol1-p6",
   "units": [
    [
     "M3A1 Halftrack",
     1,
     "vehicle"
    ]
   ]
  },
  {
   "id": "support_squad_eng",
   "name": "Support Squad",
   "cat": "support",
   "cost": 50,
   "squares": 2,
   "set": "BO",
   "size": "w",
   "stripes": [
    "W",
    "R"
   ],
   "img": "img/hon/bro/us/options/support_squad_eng.webp",
   "w": 355,
   "h": 343,
   "sheet": "US-Vol2-p1",
   "units": [
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Bazooka",
     1,
     "weapon"
    ],
    [
     ".30 Cal",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "assault_squad_eng",
   "name": "Assault Squad",
   "cat": "support",
   "cost": 50,
   "squares": 2,
   "set": "BO",
   "size": "w",
   "stripes": [
    "W",
    "R"
   ],
   "img": "img/hon/bro/us/options/assault_squad_eng.webp",
   "w": 359,
   "h": 357,
   "sheet": "US-Vol2-p1",
   "units": [
    [
     "Fire Team",
     2,
     "infantry"
    ],
    [
     ".30 Cal",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "bangalore",
   "name": "Bangalore",
   "cat": "gear",
   "cost": 10,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "W",
    "R"
   ],
   "img": "img/hon/bro/us/options/bangalore.webp",
   "w": 128,
   "h": 134,
   "sheet": "US-Vol2-p1"
  },
  {
   "id": "shovel",
   "name": "Shovel",
   "cat": "gear",
   "cost": 15,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "W",
    "R"
   ],
   "img": "img/hon/bro/us/options/shovel.webp",
   "w": 260,
   "h": 342,
   "sheet": "US-Vol2-p1"
  },
  {
   "id": "position",
   "name": "Position",
   "cat": "gear",
   "cost": 10,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "W",
    "R"
   ],
   "img": "img/hon/bro/us/options/position.webp",
   "w": 257,
   "h": 352,
   "sheet": "US-Vol2-p1"
  },
  {
   "id": "explosive_m1",
   "name": "Explosive M1",
   "cat": "gear",
   "cost": 10,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "W",
    "R"
   ],
   "img": "img/hon/bro/us/options/explosive_m1.webp",
   "w": 110,
   "h": 134,
   "sheet": "US-Vol2-p1"
  },
  {
   "id": "hardened",
   "name": "Hardened",
   "cat": "customization",
   "cost": 15,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/hardened.webp",
   "w": 271,
   "h": 357,
   "sheet": "US-Vol2-p2"
  },
  {
   "id": "heroic",
   "name": "Heroic",
   "cat": "customization",
   "cost": 10,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/heroic.webp",
   "w": 270,
   "h": 361,
   "sheet": "US-Vol2-p2"
  },
  {
   "id": "grenade_c",
   "name": "Grenade",
   "cat": "customization",
   "cost": 5,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/grenade_c.webp",
   "w": 267,
   "h": 357,
   "sheet": "US-Vol2-p2"
  },
  {
   "id": "mauser",
   "name": "Mauser",
   "cat": "customization",
   "cost": 5,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/mauser.webp",
   "w": 270,
   "h": 361,
   "sheet": "US-Vol2-p2"
  },
  {
   "id": "carbine_m1",
   "name": "Carbine M1",
   "cat": "customization",
   "cost": 5,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/carbine_m1.webp",
   "w": 114,
   "h": 150,
   "sheet": "US-Vol2-p2"
  },
  {
   "id": "aircraft_x1",
   "name": "Aircraft x1",
   "cat": "order",
   "cost": null,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "cmd"
   ],
   "img": "img/hon/bro/us/options/aircraft_x1.webp",
   "w": 106,
   "h": 152,
   "sheet": "US-Vol2-p3",
   "units": [
    [
     "Aircraft",
     1,
     "aircraft"
    ]
   ],
   "note": "Aircraft counters on the sheet: P-47 Thunderbolt (55 pts, two counters) and P-51D Mustang (50 pts). Costs are printed on the aircraft counters."
  },
  {
   "id": "aircraft_x2",
   "name": "Aircraft x2",
   "cat": "order",
   "cost": null,
   "squares": 0,
   "set": "BO",
   "size": "w",
   "stripes": [
    "cmd"
   ],
   "img": "img/hon/bro/us/options/aircraft_x2.webp",
   "w": 140,
   "h": 152,
   "sheet": "US-Vol2-p3",
   "units": [
    [
     "Aircraft",
     2,
     "aircraft"
    ]
   ],
   "note": "Aircraft counters on the sheet: P-47 Thunderbolt (55 pts, two counters) and P-51D Mustang (50 pts). Costs are printed on the aircraft counters."
  },
  {
   "id": "battle_plan",
   "name": "Battle Plan",
   "cat": "order",
   "cost": 30,
   "squares": 0,
   "set": "BO",
   "size": "w",
   "stripes": [
    "cmd"
   ],
   "img": "img/hon/bro/us/options/battle_plan.webp",
   "w": 357,
   "h": 352,
   "sheet": "US-Vol2-p3"
  },
  {
   "id": "artillery",
   "name": "Artillery",
   "cat": "order",
   "cost": 30,
   "squares": 0,
   "set": "BO",
   "size": "w",
   "stripes": [
    "cmd"
   ],
   "img": "img/hon/bro/us/options/artillery.webp",
   "w": 352,
   "h": 352,
   "sheet": "US-Vol2-p3"
  },
  {
   "id": "smoke",
   "name": "Smoke",
   "cat": "order",
   "cost": 10,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "cmd"
   ],
   "img": "img/hon/bro/us/options/smoke.webp",
   "w": 267,
   "h": 310,
   "sheet": "US-Vol2-p3"
  },
  {
   "id": "cal30_squad_116a",
   "name": ".30 Cal Squad",
   "cat": "support",
   "cost": 50,
   "squares": 2,
   "set": "BO",
   "size": "w",
   "stripes": [
    "W",
    "B"
   ],
   "img": "img/hon/bro/us/options/cal30_squad_116a.webp",
   "w": 352,
   "h": 343,
   "sheet": "US-Vol2-p4",
   "units": [
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Support Team",
     1,
     "infantry"
    ],
    [
     ".30 Cal",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "bazooka_squad_116a",
   "name": "Bazooka Squad",
   "cat": "support",
   "cost": 55,
   "squares": 2,
   "set": "BO",
   "size": "w",
   "stripes": [
    "W",
    "B"
   ],
   "img": "img/hon/bro/us/options/bazooka_squad_116a.webp",
   "w": 357,
   "h": 347,
   "sheet": "US-Vol2-p4",
   "units": [
    [
     "Recon Team",
     1,
     "infantry"
    ],
    [
     "Fire Team",
     1,
     "infantry"
    ],
    [
     "Bazooka",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "assault_squad_116a",
   "name": "Assault Squad",
   "cat": "support",
   "cost": 60,
   "squares": 2,
   "set": "BO",
   "size": "w",
   "stripes": [
    "W",
    "B"
   ],
   "img": "img/hon/bro/us/options/assault_squad_116a.webp",
   "w": 357,
   "h": 342,
   "sheet": "US-Vol2-p4",
   "units": [
    [
     "Fire Team",
     2,
     "infantry"
    ],
    [
     "Support Team",
     1,
     "infantry"
    ]
   ]
  },
  {
   "id": "support_squad_rangers",
   "name": "Support Squad",
   "cat": "support",
   "cost": 60,
   "squares": 2,
   "set": "BO",
   "size": "w",
   "stripes": [
    "B",
    "R"
   ],
   "img": "img/hon/bro/us/options/support_squad_rangers.webp",
   "w": 352,
   "h": 343,
   "sheet": "US-Vol2-p5",
   "units": [
    [
     "Support Team",
     1,
     "infantry"
    ],
    [
     "Gunners",
     1,
     "infantry"
    ],
    [
     ".30 Cal",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "bazooka_squad_rangers",
   "name": "Bazooka Squad",
   "cat": "support",
   "cost": 60,
   "squares": 2,
   "set": "BO",
   "size": "w",
   "stripes": [
    "B",
    "R"
   ],
   "img": "img/hon/bro/us/options/bazooka_squad_rangers.webp",
   "w": 352,
   "h": 343,
   "sheet": "US-Vol2-p5",
   "units": [
    [
     "Support Team",
     1,
     "infantry"
    ],
    [
     "Gunners",
     1,
     "infantry"
    ],
    [
     "Bazooka",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "bazooka_rangers",
   "name": "Bazooka",
   "cat": "support",
   "cost": 15,
   "squares": 1,
   "set": "BO",
   "size": "n",
   "stripes": [
    "B",
    "Y"
   ],
   "img": "img/hon/bro/us/options/bazooka_rangers.webp",
   "w": 114,
   "h": 174,
   "sheet": "US-Vol2-p5",
   "units": [
    [
     "Bazooka",
     1,
     "weapon"
    ]
   ]
  },
  {
   "id": "rangers_gear",
   "name": "Rangers Gear",
   "cat": "gear",
   "cost": 20,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "B",
    "Y"
   ],
   "img": "img/hon/bro/us/options/rangers_gear.webp",
   "w": 114,
   "h": 140,
   "sheet": "US-Vol2-p5"
  },
  {
   "id": "mobile_fire",
   "name": "Mobile Fire",
   "cat": "trait",
   "cost": 25,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "B",
    "Y"
   ],
   "img": "img/hon/bro/us/options/mobile_fire.webp",
   "w": 116,
   "h": 152,
   "sheet": "US-Vol2-p5"
  },
  {
   "id": "urban_fighter",
   "name": "Urban Fighter",
   "cat": "trait",
   "cost": 15,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "B",
    "Y"
   ],
   "img": "img/hon/bro/us/options/urban_fighter.webp",
   "w": 114,
   "h": 152,
   "sheet": "US-Vol2-p5"
  },
  {
   "id": "tank_gear",
   "name": "Tank Gear",
   "cat": "gear",
   "cost": 10,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "B",
    "Y"
   ],
   "img": "img/hon/bro/us/options/tank_gear.webp",
   "w": 275,
   "h": 357,
   "sheet": "US-Vol2-p6"
  },
  {
   "id": "tank_ammo",
   "name": "Tank Ammo",
   "cat": "gear",
   "cost": 10,
   "squares": 0,
   "set": "BO",
   "size": "n",
   "stripes": [
    "B",
    "Y"
   ],
   "img": "img/hon/bro/us/options/tank_ammo.webp",
   "w": 275,
   "h": 347,
   "sheet": "US-Vol2-p6"
  },
  {
   "id": "m4_sherman_tp",
   "name": "M4 Sherman",
   "cat": "support",
   "cost": 60,
   "squares": 1,
   "set": "BO",
   "size": "w",
   "stripes": [
    "B",
    "Y"
   ],
   "img": "img/hon/bro/us/options/m4_sherman_tp.webp",
   "w": 348,
   "h": 357,
   "sheet": "US-Vol2-p6",
   "units": [
    [
     "M4 Sherman",
     1,
     "vehicle"
    ]
   ]
  },
  {
   "id": "m4a3_105",
   "name": "M4A3 (105) Sherman",
   "cat": "support",
   "cost": 60,
   "squares": 1,
   "set": "BO",
   "size": "w",
   "stripes": [
    "B",
    "Y"
   ],
   "img": "img/hon/bro/us/options/m4a3_105.webp",
   "w": 352,
   "h": 361,
   "sheet": "US-Vol2-p6",
   "units": [
    [
     "M4A3 (105) Sherman",
     1,
     "vehicle"
    ]
   ]
  },
  {
   "id": "grenade_ks",
   "name": "Grenade",
   "cat": "customization",
   "cost": 5,
   "squares": 0,
   "set": "KS-9",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/grenade_ks.webp",
   "w": 110,
   "h": 152,
   "sheet": "US-Vol3-p1"
  },
  {
   "id": "sticky_bomb_solo",
   "name": "Sticky Bomb",
   "cat": "customization",
   "cost": 5,
   "squares": 0,
   "set": "SOLO",
   "size": "n",
   "stripes": [
    "custom"
   ],
   "img": "img/hon/bro/us/options/sticky_bomb_solo.webp",
   "w": 112,
   "h": 152,
   "sheet": "US-Vol3-p1"
  },
  {
   "id": "training_fr",
   "name": "Training",
   "cat": "trait",
   "cost": 15,
   "squares": 0,
   "set": "P500",
   "size": "n",
   "stripes": [
    "B",
    "Y"
   ],
   "img": "img/hon/bro/us/options/training_fr.webp",
   "w": 120,
   "h": 146,
   "sheet": "US-Vol3-p2"
  },
  {
   "id": "guardian_fr",
   "name": "Guardian",
   "cat": "trait",
   "cost": 10,
   "squares": 0,
   "set": "P500",
   "size": "n",
   "stripes": [
    "B",
    "Y"
   ],
   "img": "img/hon/bro/us/options/guardian_fr.webp",
   "w": 120,
   "h": 146,
   "sheet": "US-Vol3-p2"
  },
  {
   "id": "m10_a1",
   "name": "M10 Tank Destroyer",
   "cat": "support",
   "cost": 60,
   "squares": 1,
   "set": "BO",
   "size": "w",
   "stripes": [
    "any"
   ],
   "img": "img/hon/bro/us/options/m10_a1.webp",
   "w": 352,
   "h": 352,
   "sheet": "TTS Omaha US options",
   "units": [
    [
     "M10 A1",
     1,
     "vehicle"
    ]
   ]
  }
 ]
};
