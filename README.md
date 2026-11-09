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
- **Scenario reader.** `scenario.html?b=<box>&s=<id>` shows one scenario in full: story, battlefield and deployment picture, recruitment pictures, preparation, special rules, victory conditions, step-by-step example (Plain Carnage) and campaign notes. It is built for phones and iPads (single column, large touch targets, tap a picture or a "Booklet page N" marker to open the original page full size). Each page also lists the armies for the builder and the original pages. The Download section gives the PDF of the whole booklet. Text data: `data/hon-bro-scenarios-full.js` and `data/hon-omaha-scenarios-full.js`. Figures: `img/hon/<box>/scenfig/`. Page images: `img/hon/<box>/scenpages/` (p = full size, t = thumbnail). PDFs: `pdf/`.
- **Scenario armies.** Eight scenarios (Plain Carnage, Chicken Game, A Rough Night, Caumont-l'Éventé, Le Quesnay, Surrounded!, Windy at Sept-Vents! and We Shall Pass!) have "Open the armies in the builder" buttons, one per side. Armies follow the booklet recruitment pictures. Pages 21 to 28 follow the V2.5 booklet, the rest V2.4. Thirteen of the sixteen match the booklet points exactly. The German armies in Plain Carnage, Le Quesnay and Surrounded! come out 5 to 10 points under the printed figure. Armies are stored in `data/hon-bro-scenarios.js` as tile ids and one option id per slot.
- **Tokens and markers.** `tokens.html` shows the scans of the objective, tactical bonus, turn chart, event, suppressed, vehicle damage, destruction and flamethrower markers with what each does, linked to the rules search. Data lives in `data/hon-bro-tokens.js`.
- **Heroes and equipment.** `heroes.html` lists every hero tile for both sides, the units on it, and every option that fits its slot, worked out with the same rule as the builder. Filter by box (Big Red One, Bloody Omaha, promo heroes). It also shows the equipment cards and markers: Bazooka, Panzerfaust, Knife, MP40, Thompson, Flamer and Overwatch, plus the Bloody Omaha Heroic, Grenade, Mauser, Carbine M1 and Hardened cards. Data lives in `data/hon-bro-heroes.js` (each card has a `box`).
- **Expansions.** `expansions.html` is a catalogue of 158 products across six games (Heroes of Normandie V2 and V1, Stalingrad, Pacific, Shadows over Normandie, Black Reach). Filter by game and type (big box, army box punchboards, gazette, terrain and so on) or search. Entries with notes show what the product holds, a small preview of its punchboard where there is one, and links to what the tool covers (only the V2 boxes so far). A "starter forces" section summarises an older community buying guide. The product list comes from the collection checklist, not from a web source. Data lives in `data/expansions.js` and previews in `img/exp/`.
- **Commonwealth units and Battle for Caen: Epsom, Charnwood & Goodwood.** The builder, units page and heroes page have a third nation, Commonwealth (`data/hon-bro-uk.js`, 9 tiles and 34 options). The new German tiles and options for the box are in `data/hon-bro-ge.js`. Every ECG tile and option has the set code `ECG`. Four new stripe colours (olive, cream, blue, pale yellow) are named in `js/app.js`. Battle for Caen is its own box in History (`data/hon-caen-history.js`) and Rules (`data/hon-caen-rules.js`, booklet V1.4 WIP). The units tracker sends tiles and options with set code `ECG` to the Caen History file. Scenarios are in too (`data/hon-caen-scenarios.js` and `-full.js`): six campaign scenarios, the Safari bonus scenario and the campaign report, with 16 armies for the builder, maps, recruitment pictures, the 28 original pages and the PDF in `pdf/`. Tokens (`data/hon-caen-tokens.js`, 7 entries for the box) and the 13 icons of the booklet summary (in `data/hon-icons.js`) are in.
- **Battle Pack #3: Windsor & Jupiter.** An expansion for Battle for Caen, not a big box. It has set code `BP3` in `data/hon-bro-ge.js` (5 tiles, 15 options) and `data/hon-bro-uk.js` (4 tiles, 12 options): Divisionsstab Meyer, Feldkommando Herold, hero Oros Snowt, Jägerbataillon and SS-Panzerpionier for the Germans, and Field Command Essame, hero Arthur Ash, B Recce Squadron and the Duke of Cornwall's Light Infantry for the Commonwealth. Costs, breaking points, slots and stripes were read from the Tabletop Simulator art (ISS-032). History entries (16) are in the Battle for Caen file, tokens (6 entries) are in `data/hon-caen-tokens.js`, and heroes show under their own box. The units tracker sends `BP3` to the Caen History file. The pack's rulebook and scenarios are not in the archive (ISS-031). Maps were already in.
- **Bloody Omaha scenarios and tokens.** `scenarios.html` and `tokens.html` have a box switch. Omaha has the player generated landings chapter, Part 1, Part 2, Little River of No Return and Big River of No Return, each with a battlefield map and builder links (11 armies, some with notes where the printed points differ, see ISSUES.txt ISS-023). Tokens cover Bangalore, Explosive M1, Forward position, Shovel, Ammo belt, Tank gear, shells, mines, haystack, smoke, artillery, bombs and Heroic. Data lives in `data/hon-omaha-scenarios.js` and `data/hon-omaha-tokens.js`.
- **Icon glossary.** `icons.html` lists every icon from the rulebook icon summaries (Big Red One p.36, Bloody Omaha p.24) with its picture, group, page and what it does. Search by name or words in the description, filter by group, and switch box. Icons are cut from the PDFs at native size with their transparency. Data lives in `data/hon-icons.js` (images in `img/hon/<box>/icons/`).
- **Rules compendium.** `rules.html` now covers Big Red One and Bloody Omaha. Rule entries carry figures cropped from the rulebook pages (`img/hon/<box>/rules/`), tables (the Omaha player generated landings table), and chips that link to the matching icon in the glossary. Search results show thumbnails. Add new boxes by adding `data/hon-<box>-rules.js` and a box name in `js/rules.js`.
- **Maps.** `maps.html` is a map builder for four boxes: Big Red One, Bloody Omaha, Battle for Caen (Epsom, Charnwood & Goodwood) and Battle for Caen (Windsor & Jupiter). Pick a box, filter its terrain by type (Maps, Houses and buildings, Defensive positions, Rocks, Thickets and forests, Ponds, Roads and rivers, Bridges, Trails, Obstacles, Landing craft; type names follow rulebook p.19) or search by name, view both sides of any piece, then add it to a canvas. Drag, rotate, flip, duplicate, reorder, undo and redo. Pieces from different boxes can share one map. Choose a map size from 1 to 9 boards or type squares. Snap is whole square, half square or off. Save maps on your device, copy a link (`maps.html#m=...`), download a picture or print. It warns when a piece is used more than once or two boards overlap. Data lives in `data/maps.js`. A board is 7 by 7 squares and one square is 200 pixels in the images. Boards carry their side label (such as OB5-A or EC1-B) in the top left square.
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
js/maps.js            the map builder
js/icons.js           the icon glossary
data/hon-icons.js     icon glossary entries
data/hon-omaha-rules.js  Bloody Omaha rules (V7.1)
data/maps.js          terrain pieces for the four boxes (img/hon/maps/<box>/)
data/hon-bro-tokens.js the marker entries
data/hon-omaha-tokens.js  the Bloody Omaha marker entries
data/expansions.js    the expansions catalogue
data/hon-omaha-scenarios.js  the Bloody Omaha scenarios and armies
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
maps.html
icons.html
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

## Trackers

Two scripts keep the data honest as boxes are added. Run both after every import, with `--write` to refresh the files in `docs/`.

- `python3 tools/units_tracker.py` lists every unit, recruitment tile and option and whether it has a History entry. The rule: History entries are added in one batch right after each box import, and this script flags what is missing. Game-mechanic options (orders, traits, gear cards) and invented hero characters are recorded in `tools/tracker_exclusions.json` rather than given History entries. Output: `docs/units-tracker.md` and `.csv`.
- `python3 tools/lowres_log.py` (needs Pillow) logs the pixel size of every unit image, tile and option card and flags low resolution. `docs/lowres-images.csv` is the list to send the game's creators when asking for better files.

## Look and feel

Fonts are self-hosted in `fonts/` (SIL Open Font License, licences included). The rulebooks use GoodHeadlinePro and Army, which are commercial, so the site uses close open substitutes: Fira Sans Condensed for text, Alfa Slab One for titles, Special Elite for labels. Colours come from the rulebook pages: olive drab, khaki parchment, brass and a red accent, with a dark theme on the same hues. Navigation icons are original SVGs in `img/nav/`, applied by CSS on the link target.

## Archive policy

Devil Pig Games has closed, so this project is also a digital archive for the community. For every scenario book or scenario that is added from now on:

- Keep the full version, not only a summary, as a web page that reads well on an iPad or phone.
- Look for the best version available on the web (the most complete and most recent) and preserve that one too.
- Store the PDF in the repository and offer it as a download beside the web version.
- Do not link out to the old publisher site or forum. Pages must keep working without them.

The existing Big Red One and Bloody Omaha scenarios have been retrofitted to this policy (hts-v22). The remaining gap is listed in ISSUES.txt ISS-024.
