# Heroes System Tactical Scale

A free fan-made army builder for Heroes of Normandie by Devil Pig Games. It runs in the browser with no account and no server. Everything is saved on your own device.

You need the rulebook to play. This project is not affiliated with or endorsed by Devil Pig Games.

## What it does

- **Visual roster.** Recruitment Tiles and Recruitment Options appear as the real tile art, not a text list. Options sit in the slots of the tile they belong to.
- **Country and points.** Pick United States or Germany, set a points limit (150 to 500, or your own), and watch the total against the limit.
- **Slot rules.** Each slot knows its size and colour stripes. The option picker lists only what fits, and can show everything if your tiles disagree with the data.
- **Roster summary.** Costs per tile and option, plus the breaking points shown as red squares.
- **Included units as text.** Every tile and every support option lists the units it brings (for example Bazooka Squad: Support Team, Gunners, Bazooka). The roster ends with a tally of all units in the army.
- **Unit index.** `units.html` is a separate searchable page. Search "Rifle Platoon 1st Inf. Div. 16th Inf. Reg. A" and it shows that platoon with every unit on the tile and in each option that comes with it. A second view lists every unit and where it comes from. Every tile in the builder links to it.
- **Rules search.** `rules.html` searches the Big Red One rulebook (V4.1) by word. Results show the section, sub-heading and page, with matches highlighted. Open any result to read the whole section, or browse the contents. The keyword glossary is included.
- **Historical reference.** `history.html` has 65 short, searchable entries on the real formations, weapons, vehicles, aircraft and defences behind the Big Red One units. Entries are a collapsed index: click one to read it. Filter by side and category, and jump to the matching tiles in the unit index. Each entry links to its source. Data lives in `data/hon-bro-history.js`.
- **Scenarios index.** `scenarios.html` lists every scenario in the Big Red One Scenario Booklet (V2.4) with its booklet page number, a summary and the key facts: date, armies and points, setup, length, how to win and special rules. It also lists the booklet's rules chapters with page numbers. Entries are a collapsed index you click to read. Data lives in `data/hon-bro-scenarios.js`.
- **Scenario armies.** Eight scenarios (Plain Carnage, Chicken Game, A Rough Night, Caumont-l'Éventé, Le Quesnay, Surrounded!, Windy at Sept-Vents! and We Shall Pass!) have "Open the armies in the builder" buttons, one per side. Armies follow the booklet recruitment pictures. Twelve of the sixteen match the booklet points exactly. The four German armies in Plain Carnage, Le Quesnay, Surrounded! and We Shall Pass! come out 5 to 10 points under the printed figure. Armies are stored in `data/hon-bro-scenarios.js` as tile ids and one option id per slot.
- **Tokens and markers.** `tokens.html` shows the scans of the objective, tactical bonus, turn chart, event, suppressed, vehicle damage, destruction and flamethrower markers with what each does, linked to the rules search. Data lives in `data/hon-bro-tokens.js`.
- **Heroes and equipment.** `heroes.html` lists every hero tile for both sides, the units on it, and every option that fits its slot, worked out with the same rule as the builder. It also shows the weapon cards and markers (Bazooka, Panzerfaust, Knife, MP40, Thompson, Flamer, Overwatch). Data lives in `data/hon-bro-heroes.js`.
- **Save, share, print.** Save armies on your device, copy a link, export or import a file, print a roster sheet.

Content so far: Big Red One, United States and Germany, 33 Recruitment Tiles and 127 options across the core box and the extra sets listed on the tile sheets.

## Use it

Open `index.html` in a browser, or host the repo with GitHub Pages (main branch, root folder). There is no build step.

## How the data is organised

```
data/hon-bro-us.js    tiles and options for one country in one box
data/hon-bro-ge.js
img/hon/bro/us/tiles/ one image per Recruitment Tile
img/hon/bro/us/options/
js/app.js             the builder
js/units.js           the unit index page
js/rules.js           the rules search page
js/history.js         the historical reference page
js/scenarios.js       the scenarios index page
js/tokens.js          the tokens and markers page
js/heroes.js          the heroes and equipment page
data/hon-bro-tokens.js the marker entries
data/hon-bro-heroes.js the equipment cards
data/hon-bro-scenarios.js the scenario summaries
data/hon-bro-history.js the historical entries
data/hon-bro-rules.js the rulebook text by section and page
units.html
rules.html
history.html
scenarios.html
tokens.html
heroes.html
css/style.css
test/smoke.js         Playwright smoke test
```

A tile has `slots`. Each slot has a position on the tile image (fractions of the image), a `size` (`w` wide, `n` narrow) and `stripes`. A tile has `units` as `[name, quantity, kind]` and `own`, the ids of the options printed on the same sheet. Support options also carry `units`. Kinds: officer, character, infantry, weapon, vehicle, marker, aircraft.

An option has a `size`, `stripes` and a `cat` (support, gear, trait, order, customization).

Stripe codes: R red, Y yellow, B blue, LB light blue, W white, K black, G green, T tan, O orange, `cmd` command stripes, `custom` customization, `any` common option with no stripes.

An option fits a slot when the sizes match and at least one stripe is shared. `any` options fit every slot of the right size, including the single slot on a hero tile, because the Scenario Booklet puts common gear and support cards on heroes.

To add another box, add a `data/hon-<box>-<country>.js` file in the same shape, add the images, and register the country in `js/app.js`.

## Art sources

The 12 core box tiles (US: Field Command, Clint, Oddball, The Rock, both Rifle Platoons; Germany: Feldkommando, Helmut, Otto, Ludwig, both Panzergrenadiere) and the core box options come from the individual print-ready files, about 2.4 times the resolution of the rest. Everything else was cropped from the Vol PDFs and is lower resolution. Unit counter pictures in the unit index come from the same print files, so only units with a published counter file show a picture.

Known printing inconsistencies in the source files: Oddball and Stillman are used for the same hero, and Lt. J.W. Will is printed as W.J. Will on his counter.

## Sets

The `set` code on each tile is the code printed on the sheet it came from: CB, BO, KS-9, SOLO, WS#0, P500. Use the set chips in the library to filter by them.

## Checking the data

Costs, sizes, stripes and unit lists were read from the tile sheets. If something does not match your physical tiles, email games@staroversky.com. Slot and stripe data lives in plain JavaScript, so fixes are small edits.

## Tests

```
npm i playwright
node test/smoke.js
```
