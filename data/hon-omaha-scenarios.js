window.HTS_SCEN = window.HTS_SCEN || {};
HTS_SCEN["hon-omaha"] = {
"game": "hon",
"box": "omaha",
"title": "Scenarios",
"source": "Bloody Omaha rulebook V7.1",
"types": [
"Single scenarios",
"Booklet rules and reference"
],
"entries": [
{
"id": "intro",
"title": "Introduction, summary and the 6 June 1944 report",
"type": "Booklet rules and reference",
"pages": "1 to 3",
"start": 1,
"date": "June 6, 1944",
"summary": "Cover, contents list, credits and the printed report on D-Day at Omaha Beach, from the Tehran decision to the toll of the day.",
"facts": [
[
"Covers",
"Cover, contents of the booklet, credits and the history report."
],
[
"Solo mode",
"The Solo Mode expansion is required for games in Solo Mode."
]
]
},
{
"id": "rules-battlefield",
"title": "1 Battlefield",
"type": "Booklet rules and reference",
"pages": "4 to 5",
"start": 4,
"date": "",
"summary": "Terrain effects, terrain elements, defensive obstacles and trenches for the Omaha boards: hole, stress, bunker, contour line, mounds, streams, seawalls, barbed wire and trenches.",
"facts": [
[
"Covers",
"1.1 Terrain effects, 1.2 Terrain elements, 1.3 Defensive obstacles, 1.4 Defensive elements."
],
[
"Key rule",
"A red contour line limits range to one square beyond the line, and a trench stops movement unless the move crosses a ladder."
]
]
},
{
"id": "rules-special",
"title": "2 Special rules",
"type": "Booklet rules and reference",
"pages": "6 to 7",
"start": 6,
"date": "",
"summary": "Landing craft: transport capacity, deployment and recovery, plus the haystack rules for hiding units.",
"facts": [
[
"Covers",
"Landing craft, special deployment, haystacks."
],
[
"Key rule",
"A landing craft carries 7 transport points. At least one landing craft must stay empty every turn."
]
]
},
{
"id": "rules-abilities",
"title": "3 Special abilities",
"type": "Booklet rules and reference",
"pages": "7 to 8",
"start": 7,
"date": "",
"summary": "Urban fighter, double fire, endless grenades, hawkeyed, substitute, barrage order, smart, NCO, engineer and minesweeper.",
"facts": [
[
"Covers",
"3.1 Movement, 3.2 Firing, 3.3 Defense, 3.4 Command, 3.5 Other special abilities."
]
]
},
{
"id": "rules-recruitment",
"title": "4 Recruitment options",
"type": "Booklet rules and reference",
"pages": "8 to 11",
"start": 8,
"date": "",
"summary": "Support, gear, character trait, orders and customization options: landing, ammo belts, bangalores, minefield, explosive charges, positions, shovels, shells, tank gear, smoke, artillery and heroic.",
"facts": [
[
"Covers",
"4.1 Support options, 4.2 Gear options, 4.3 Character traits, 4.4 Orders options, 4.5 Customizations."
],
[
"Minefield",
"A large field of 8 counters costs 45 points. A field of 4 counters costs 25 points."
]
]
},
{
"id": "rules-aviation",
"title": "5 Aviation rules",
"type": "Booklet rules and reference",
"pages": "12 to 13",
"start": 12,
"date": "",
"summary": "How aircraft are recruited, hidden in the clouds or in plain sight, shot at and shot down, with the speed penalty worked through.",
"facts": [
[
"Covers",
"Aircraft units, planespotting, firing actions, anti-aircraft, speed penalty, special order, bombs and rockets."
],
[
"Key rule",
"Never apply the long range penalty when an aircraft is involved in a Firing Action. Any unit firing at an aircraft applies the speed penalty."
]
]
},
{
"id": "landings",
"title": "Player generated landings",
"type": "Booklet rules and reference",
"pages": "14 to 15",
"start": 14,
"date": "",
"summary": "Rules to build your own Omaha landing: pick a size, set up boards, tiles and obstacles, then play attacker against defender with landing craft and a bag of option tiles.",
"facts": [
[
"Covers",
"Size of the battlefield, objectives, bonus tactics, turns, armies, initiative and reinforcements."
],
[
"Key rule",
"One landing craft must always stay empty. The attacker must take at least one small landing craft."
],
[
"Table",
"The rules page has the full size table (200 to 450 defender points)."
]
]
},
{
"id": "part1",
"title": "Bloody Omaha, Part #1",
"type": "Single scenarios",
"pages": "16 to 17",
"start": 16,
"date": "June 6, 1944",
"summary": "The American assault on the seawall. Tanks cannot land until a seawall section is blown, so the infantry must open the way for one Sherman to reach the objective.",
"facts": [
[
"Front",
"Normandy, German against American"
],
[
"Players",
"2. Solo mode: the AI can only play the German army, with Defensive Attitude suggested."
],
[
"Armies",
"1st Infantry Division, 535 points, against 352. Infanterie Division, 335 points."
],
[
"Starting forces",
"American: Field Command with an M4 Sherman, US Combat Engineers, Rifle Platoon, Landing tile, Clint and a P-51 Mustang. German: Feldkommando, Festungskompanie, a large minefield and Heinrich."
],
[
"Setup",
"6 Omaha terrain boards (OB1-A to OB6-A), 3 wide. American initiative, 1 primary objective, 3 tactical bonuses, 4 action cards each. The Americans deploy in landing craft 1-2 and 5-6 and respect the Transport capacity of 7."
],
[
"Length",
"7 turns"
],
[
"Special rules",
"The German Feldkommando and Defense Group enter on turn 3 through a blue arrow square. American units not deployed on turn 1 can board the landing craft in the Supply Phase of turn 2 but cannot disembark until turn 3. The Sherman cannot disembark until a seawall objective is destroyed, and its Tracks damage counts as a miss."
],
[
"How to win",
"The Americans must blow up the Seawall sections (secondary objectives printed on the tiles) and bring the Sherman to the primary objective. Major American victory: both seawalls and the objective. American victory: one seawall and the objective, or both seawalls without the objective. Minor American victory: one seawall, no objective. German victory: no seawall destroyed."
],
[
"Ends",
"End of turn 7, or when the Sherman reaches the primary objective."
]
],
"armies": {
"us": {
"side": "us",
"limit": 535,
"printed": 535,
"tiles": [
[
"field_command_taylor",
[
"m4_sherman",
"aircraft_x1",
"grenade"
]
],
[
"us_combat_engineers",
[
"assault_squad_eng",
"explosive_m1",
"position",
"bangalore"
]
],
[
"rifle_platoon_1id_16a",
[
"rifle_squad_16a",
"bazooka_team",
"veteran",
"cal30_squad_16a"
]
],
[
"landing_1id",
[]
],
[
"clint",
[
"heroic"
]
],
[
"p51_mustang",
[]
]
],
"note": "The P-51 Mustang (50) is counted. The M4 Sherman on the Field Command shows no cost in the booklet picture. Without its 60 points the builder total is exactly the printed 535, see ISS-023.",
"pts": 595,
"label": "American army",
"sub": "1st Infantry Division"
},
"ge": {
"side": "ge",
"limit": 335,
"printed": 335,
"tiles": [
[
"feldkommando_brassert",
[
"artillery",
"planning",
"ammo"
]
],
[
"festungskompanie",
[
"group_75cm",
"ammo_belt",
"turmstellung",
"defense_group"
]
],
[
"minefield_45",
[]
],
[
"heinrich",
[
"overwatch"
]
]
],
"note": "The Feldkommando and the Defense Group enter on Turn 3. The builder total is 30 points above the printed 335, see ISS-023.",
"pts": 365,
"label": "German army",
"sub": "352. Infanterie Division"
}
},
"figs": [
{
"img": "img/hon/omaha/scen/part1-map.webp",
"w": 946,
"h": 789,
"cap": "Battlefield and deployment, booklet p.16"
}
]
},
{
"id": "part2",
"title": "Bloody Omaha, Part #2",
"type": "Single scenarios",
"pages": "18 to 19",
"start": 18,
"date": "June 6, 1944",
"summary": "The breakout. Bangalores have opened a gap in the obstacles and Cota sends the Rangers through, backed by the 1st and 29th Divisions, against the strongholds above the beach.",
"facts": [
[
"Front",
"Normandy, German against American"
],
[
"Players",
"2 to 3. Solo mode: the AI can only play the German army, with Defensive Attitude suggested."
],
[
"Armies",
"29th Infantry Division with Rangers, 445 points, and 1st Infantry Division, 445 points, against 352. Infanterie Division, 585 points."
],
[
"Starting forces",
"American 29th: High Command (Cota), Rifle Platoon, Landing tile, US Rangers and Sgt Horvath. American 1st: Field Command, Rifle Platoon, US Combat Engineers and The Rock. German: Divisionsstab, Festungskompanie, Panzergrenadiere and Heinrich."
],
[
"Setup",
"9 terrain boards: C1-B, C3-A and C2-A at the back, OB1-A to OB3-A in the middle and OB4-A to OB6-A on the beach. American initiative, 2 secondary objectives, 2 tactical bonuses, 4 action cards each. Arrange the 8 mine counters face down and draw 4 without revealing them, then place them face down on the board. The Germans deploy first."
],
[
"Length",
"8 turns"
],
[
"Special rules",
"Units with a coloured outline on their tile are not deployed yet. Orange outlines enter on turn 2, green on turn 3 and blue on turn 5. American units arrive in the landing craft with their division badge, German units through a blue arrow square."
],
[
"How to win",
"The Americans must control both secondary objectives at the end of a Supply Phase. Otherwise the Germans win at the end of turn 8."
]
],
"armies": {
"us29": {
"side": "us",
"limit": 445,
"printed": 445,
"tiles": [
[
"high_command_cota",
[
null,
null,
"rifle_grenade",
"m5_stuart"
]
],
[
"rifle_platoon_29id_116a",
[
null,
null,
"grenade",
"assault_squad_116a"
]
],
[
"landing_29id",
[]
],
[
"us_rangers",
[
null,
"veteran",
"mobile_fire"
]
],
[
"sgt_horvath",
[
"flamer"
]
]
],
"note": "The M5 Stuart and the Landing tile enter on Turn 2. The Assault Squad enters on Turn 3.",
"pts": 445,
"label": "29th Infantry Division army",
"sub": "29th Infantry Division and Rangers"
},
"us1": {
"side": "us",
"limit": 445,
"printed": 445,
"tiles": [
[
"field_command_taylor",
[
"m4_sherman",
null,
"improvisation"
]
],
[
"rifle_platoon_1id_16a",
[
null,
null,
"grenade",
"bazooka_squad_16a"
]
],
[
"us_combat_engineers",
[
"support_squad_eng",
"shovel",
null,
null
]
],
[
"the_rock",
[
"ammo"
]
]
],
"note": "The Bazooka Squad and The Rock enter on Turn 2. The M4 Sherman and the Support Squad enter on Turn 3.",
"pts": 445,
"label": "1st Infantry Division army",
"sub": "1st Infantry Division"
},
"ge": {
"side": "ge",
"limit": 585,
"printed": 585,
"tiles": [
[
"divisionsstab_kraiss",
[
"artillery",
"bluff",
"pak40",
"luchs"
]
],
[
"festungskompanie",
[
"pak40_group",
"mg42",
"grenade",
"group_75cm"
]
],
[
"panzergrenadiere_1",
[
"panzerschreck_group_1",
"grenade",
"zundapp",
"assault_group"
]
],
[
"heinrich",
[
"ammo"
]
]
],
"note": "Blue outlined units enter on Turn 5 (Luchs, Pak 40 Group, Panzerschreck Group). Green outlined units enter on Turn 3 (Artillery, Pak 40, Grenades, Zundapp, Assault Group).",
"pts": 585,
"label": "German army",
"sub": "352. Infanterie Division"
}
},
"figs": [
{
"img": "img/hon/omaha/scen/part2-map.webp",
"w": 946,
"h": 1069,
"cap": "Battlefield and deployment, booklet p.18"
}
]
},
{
"id": "little",
"title": "Little River of No Return",
"type": "Single scenarios",
"pages": "20 to 21",
"start": 20,
"date": "June 1944",
"summary": "A task force closes on a farm where General Kraiss has set up his HQ. The Germans must hold for a day. Capturing Kraiss is the prize.",
"facts": [
[
"Front",
"Normandy, German against American"
],
[
"Players",
"2. Solo mode: the AI can play either side."
],
[
"Armies",
"Task Force with US Rangers, 495 points, against 2. Panzer Division, 415 points."
],
[
"Starting forces",
"American: Tank Platoon (M4A3 105 Sherman, M10 Tank Destroyer), US Rangers and Sgt Horvath. German: Divisionsstab (Kraiss), Panzer-Aufklärungs, Helmut, 2 haystacks and defensive positions."
],
[
"Setup",
"6 terrain boards (OB1-B to OB6-B). American initiative, 1 primary objective, 2 secondary objectives, 3 tactical bonuses, 4 action cards each. The Germans deploy first and place defensive positions and haystacks anywhere in their deployment zone. The Americans enter through orange arrow squares, with an Order Token in the Activation Phase or without one in the Supply Phase."
],
[
"Length",
"8 turns"
],
[
"How to win",
"The Americans must win an Assault against Kraiss to capture him. A captured general cannot be liberated and is removed from the game. Major American victory: Kraiss captured plus the primary and one secondary objective. American victory: Kraiss captured and one objective. Minor American victory: primary plus one secondary, no capture. Major German victory: no capture and no objective. German victory: only one objective held. Minor German victory: Kraiss captured but no objectives held, or other partial results."
]
],
"armies": {
"us": {
"side": "us",
"limit": 495,
"printed": 495,
"tiles": [
[
"tank_platoon_743",
[
"m4a3_105",
"tank_ammo",
"tank_gear",
"m10_a1"
]
],
[
"us_rangers",
[
"support_squad_rangers",
"rangers_gear",
"urban_fighter"
]
],
[
"sgt_horvath",
[
"bazooka_c"
]
]
],
"pts": 495,
"label": "American army",
"sub": "Task Force with US Rangers"
},
"ge": {
"side": "ge",
"limit": 415,
"printed": 415,
"tiles": [
[
"divisionsstab_kraiss",
[
"artillery",
"tank_ambush",
"ammo",
"panzer_iv"
]
],
[
"panzer_aufklaerungs",
[
"stummel_group",
"panzerschreck",
"guardian"
]
],
[
"helmut",
[
"pak40"
]
]
],
"note": "Add the two haystack counters (A and B) and the defensive positions from the scenario. The printed 415 is 10 above the builder total, see ISS-023.",
"pts": 405,
"label": "German army",
"sub": "2. Panzer Division"
}
},
"figs": [
{
"img": "img/hon/omaha/scen/little-map.webp",
"w": 946,
"h": 686,
"cap": "Battlefield and deployment, booklet p.20"
}
]
},
{
"id": "big",
"title": "Big River of No Return",
"type": "Single scenarios",
"pages": "22 to 23",
"start": 22,
"date": "June 1944",
"summary": "Little River on a larger scale. Two groups per side, up to four players, and a scoring race to crown the best commander.",
"facts": [
[
"Front",
"Normandy, German against American"
],
[
"Players",
"2 to 4. Solo mode: the AI can play either side, and two players can team up against it."
],
[
"Armies",
"American Group A (Task Force, 495) and Group B (1st Infantry Division, 550) against German Group A (2. Panzer Division, 415) and Group B (352. Infanterie Division, 470)."
],
[
"Setup",
"9 terrain boards: OB1-B to OB3-B at the back, OB6-B, OB4-B and OB5-B in the middle and C1-B, C3-A and C2-A in front. Preparation follows Little River of No Return. American group A has initiative. Each player draws 3 action cards (4 in a two player game)."
],
[
"Length",
"10 turns"
],
[
"How to win",
"Capture rules and victory levels are the same as Little River of No Return. Players also keep score: capturing Kraiss is worth 50 victory points, the primary objective 30 and a secondary objective 20. The winning side compares scores and the top scorer is the elite commander."
]
],
"armies": {
"us": {
"side": "us",
"limit": 495,
"printed": 495,
"tiles": [
[
"tank_platoon_743",
[
"m4a3_105",
"tank_ammo",
"tank_gear",
"m10_a1"
]
],
[
"us_rangers",
[
"support_squad_rangers",
"rangers_gear",
"urban_fighter"
]
],
[
"sgt_horvath",
[
"bazooka_c"
]
]
],
"pts": 495,
"label": "American Group A",
"sub": "Task Force with US Rangers"
},
"us2": {
"side": "us",
"limit": 550,
"printed": 550,
"tiles": [
[
"field_command_taylor",
[
"m5_stuart",
"aircraft_x1",
"aircraft_x1"
]
],
[
"sam_fueller",
[
"willys_50cal"
]
],
[
"oddball",
[
"m8_greyhound"
]
],
[
"rifle_platoon_1id_16a",
[
"bazooka_squad_16a",
"grenade",
"veteran",
"m4_sherman"
]
],
[
"p47_thunderbolt",
[]
],
[
"p51_mustang",
[]
]
],
"note": "The Thunderbolt (55) and Mustang (50) tiles are counted. The total comes to 5 points above the printed 550, see ISS-023.",
"pts": 555,
"label": "American Group B",
"sub": "1st Infantry Division"
},
"ge": {
"side": "ge",
"limit": 415,
"printed": 415,
"tiles": [
[
"divisionsstab_kraiss",
[
"artillery",
"tank_ambush",
"ammo",
"panzer_iv"
]
],
[
"panzer_aufklaerungs",
[
"stummel_group",
"panzerschreck",
"guardian"
]
],
[
"helmut",
[
"pak40"
]
]
],
"note": "Add the two haystack counters (A and B) and the defensive positions from the scenario. The printed 415 is 10 above the builder total, see ISS-023.",
"pts": 405,
"label": "German Group A",
"sub": "2. Panzer Division"
},
"ge2": {
"side": "ge",
"limit": 470,
"printed": 470,
"tiles": [
[
"feldkommando_brassert",
[
"luchs",
"mg_nest",
"concealed"
]
],
[
"festungskompanie",
[
"pak40_group",
"ammo_belt",
"grenade",
"group_75cm"
]
],
[
"ludwig",
[
"flak38"
]
],
[
"otto",
[
"puma"
]
]
],
"note": "",
"pts": 470,
"label": "German Group B",
"sub": "352. Infanterie Division"
}
},
"figs": [
{
"img": "img/hon/omaha/scen/big-map.webp",
"w": 946,
"h": 997,
"cap": "Battlefield and deployment, booklet p.22"
}
]
},
{
"id": "icons",
"title": "Icon summary",
"type": "Booklet rules and reference",
"pages": "24",
"start": 24,
"date": "",
"summary": "The one-page reminder of the terrain effect and special ability icons, with their page references.",
"facts": [
[
"Covers",
"Terrain effects and the special abilities, in short form."
],
[
"Printing note",
"The numbering and some page references on this page do not match the rules chapters."
]
]
}
]
};
