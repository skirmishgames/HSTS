# Hand-marking spec: scanned Heroes of Normandie (first edition) punchboards

Goal: for one scanned punchboard sheet, write a marks file listing every Recruitment Tile and every Recruitment Option on it, with a tight bounding box in full-resolution sheet pixels. Unit counters, gear markers, terrain and templates are NOT wanted.

What the pieces look like:
- Recruitment Tile: a long piece with a title, usually a portrait or small unit pictures, a points cost in a small tab at the bottom, and 0 to 4 large rounded empty slots showing a badge on colour stripes. Hero tiles are shorter: portrait, name, cost, and one slot or none.
- Recruitment Option: a small card with a name at the top, a points cost at bottom left, sometimes "X3"-style marker counts or a red X square, and colour stripes sticking out at its left and right edges.

Tools (run with Bash):
- Gridded overview: `python3 /tmp/h/v1/grid.py "<sheet path>" <out.png> 200` writes the sheet with a coordinate grid every 200 px (labels are full-resolution pixel coordinates). To zoom, add a crop as a 5th argument `x0,y0,x1,y1` and a smaller step, for example `python3 /tmp/h/v1/grid.py "<sheet>" /tmp/h/v1/m2/z.png 100 0,0,1800,1200`. Look at the result with the Read tool. Always zoom before fixing a box: the overview is too coarse.
- Check: `python3 /tmp/h/v1/mark_check.py <marks.json> <check.png>` cuts every marked piece (each side is snapped to the nearest strong edge within 45 px) and draws your slot boxes in red. Read the check picture and fix boxes until every cut holds the whole piece and nothing else, and every red slot box sits on its slot. If snapping picks a wrong edge, add `"snap": false` to that piece and give exact coordinates.

Marks file format (JSON):
{
 "src": "<path relative to .../First edition/Expansions/, as given to you>",
 "nat": "us" | "ge" | "uk",            (default nation for the sheet; a piece can override with its own "nat")
 "sheet": "<expansion name>",
 "pieces": [
  {"kind": "tile", "name": "Printed Name", "sub": "second line under the name", "cost": 30,
   "type": "hero" | "platoon" | "command",   (command = title decorated with laurel wreaths)
   "box": [x0, y0, x1, y1], "rot": 0,       (rot = degrees clockwise to turn the cut so the name reads upright: 0, 90, 180, 270)
   "squares": 2,                             (number of small red X squares printed on the tile)
   "units": [["Unit name", 1]],              (names in the small unit pictures, with counts)
   "slots": [ {"box": [x0,y0,x1,y1], "size": "wide" | "narrow", "left": ["white","red"], "right": ["black"]} ],
   "notes": ""},
  {"kind": "option", "name": "Printed Name", "cost": 15, "box": [x0,y0,x1,y1], "rot": 0,
   "stripes": ["white","red","white"],       (stripe colours sticking out at the card's sides, top to bottom when upright; ["black"] for a plain black band)
   "name_colour": "white" | "red" | "yellow",
   "markers": "X3" or null, "squares": 1, "units": [["Unit name", 1]], "notes": ""}
 ]
}
Slots: give them in left-to-right order with the tile upright. "left" and "right" are the stripe colours seen on the left half and the right half of that slot (they often differ: one half shows the platoon's colours, the other a black band). Slot boxes use sheet coordinates and only work for tiles with rot 0; for a rotated tile leave "slots" as [] and describe the slots in "notes" instead (count, widths, stripes left and right).

Rules:
- Record only what is printed. If you cannot read a name or cost even when zoomed, set it to null and say so in "notes". Never guess.
- Images drop out of your context if you load too many. Work on one sheet at a time, save the marks file after every two or three pieces, and re-read the check picture after each change rather than trusting memory.
- Write only inside /tmp/h/v1/m2. Do not touch /home/claude/hsts.
- When done, reply with: the marks files written, and for each sheet the tiles (name, cost, slots) and options (name, cost, stripes), plus anything unreadable or uncertain. Say plainly if any check picture was not actually viewed.
