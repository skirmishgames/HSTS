# Labelling spec: Heroes of Normandie first edition punchboard pieces

Each folder holds PNG crops cut automatically from punchboard scans, plus `<sheet>_map.jpg` overview pictures showing where each numbered crop sits on its sheet, and `<sheet>.json` with crop positions. File names look like `us2_07.png` (sheet us2, piece 7).

Look at EVERY crop with the Read tool (one at a time or a few per turn) and write one JSON object per crop. Do not guess: if you cannot read a value, use null and say so in "notes". Zoom is not available, so if text is too small to read say so.

Write the result to `labels.json` in the same folder: a JSON array, one object per crop, in file-name order. Fields:

- file: crop file name.
- kind: one of
  - "tile": a Recruitment Tile. A long piece with a title, a unit composition picture in the middle, a points cost in a small tab, and 0 to 4 large empty rounded slots that show a division badge on colour stripes. Hero or character tiles are shorter: a portrait, a name, a cost and usually one slot or none.
  - "option": a small Recruitment Option card with a name at the top, a points cost at bottom left, and colour stripes sticking out left and right of it. May show small unit pictures, a gear picture and "X3" style marker counts, or a red X square at bottom right.
  - "unit": a unit counter (soldiers or a vehicle seen from above, with numbers along the bottom or sides).
  - "marker": gear, ammo, grenade, suppressed, order token, smoke, template, objective letters and similar game markers with no cost.
  - "other": anything else, or a crop that is mostly background.
- name: the printed name, in normal capitalisation (for example "Weapon Platoon", ".30 Cal Squad", "Sgt. Brady"). For units and markers give the printed name too if there is one.
- sub: for tiles, the second line under the name (for example "4th Inf. Div. 12th Inf. Reg." or "Perfect Spotter"); else null.
- cost: points cost as a number (tiles and options); null for others. Some High Command tiles show a "200+" or "500+" army size restriction as well as a small cost: put the cost in "cost" and the restriction text in "notes".
- rotation: how many degrees CLOCKWISE the crop must be turned so the name reads upright and left to right: 0, 90, 180 or 270.
- stripes: for options and units, the stripe colours that stick out at the sides, top to bottom when upright, as a list of colour words from: white, red, blue, light blue, yellow, orange, green, black, grey, brown, purple. For tiles give the tile's own stripe colours as seen across its slots. Example: ["red","white","blue"]. Use [] if none.
- tile_type (tiles only): "platoon", "command" (title decorated with laurel wreaths, Field Command or High Command), or "hero" (single character portrait).
- slots (tiles only): list of the empty slots in order left to right when the tile is upright. Each: {"size": "wide" or "narrow", "stripes": [colours top to bottom]}. Wide slots are clearly wider than narrow ones on the same tile; if all slots look the same width say "narrow" for all and mention it in notes. Do not count the middle panel with unit pictures as a slot.
- special_ability_slot (tiles only): index (0-based, left to right) of the slot that has a small tab with a star or other icon attached above or below it, or null.
- units (tiles and options): list of the unit names shown in the small composition pictures, with counts, for example [["Lt. Jones",1],["60mm Mortar",1],["Bazooka",1],[".30 Cal",1]]. [] if none can be read.
- breaking_point (tiles and options): number of small red X squares printed on it, or 0.
- markers (options only): text such as "X3" printed on the card if any, else null.
- name_colour (options only): colour of the name text (white, red, yellow, blue, other).
- partial: true if the crop clearly cuts through the piece or holds two pieces, else false.
- confidence: "high", "medium" or "low" for the name and cost reading.
- notes: short free text for anything unusual; "" if nothing.

Rules:
- Work through all crops. Do not skip any, and do not copy values from one crop to another without looking.
- Save progress to labels.json every 20 crops or so, so partial work is not lost.
- Do not edit any other file, and do not touch /home/claude/hsts.
- When finished, reply with: number of crops labelled, counts per kind, the list of tiles (name, cost, slot count), the list of options (name, cost), and every crop you marked partial or low confidence.
