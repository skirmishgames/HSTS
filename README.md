# Heroes System Tactical Scale

A free fan-made archive and army builder for Heroes of Normandie by Devil Pig Games. It runs in the browser with no account and no server. Everything is saved on your own device.

You need the rulebook to play. This project is not affiliated with or endorsed by Devil Pig Games.

## What it does

- **Visual roster.** Recruitment Tiles and Recruitment Options appear as the real tile art, not a text list. Options sit in the slots of the tile they belong to.
- **Country and points.** Pick United States or Germany, set a points limit (150 to 500, or your own), and watch the total against the limit.
- **Slot rules.** Each slot knows its size and colour stripes. The option picker lists only what fits, and can show everything if your tiles disagree with the data.
- **Roster summary.** Costs per tile and option, plus the breaking points shown as red squares.
- **Included units as text.** Every tile and every support option lists the units it brings (for example Bazooka Squad: Support Team, Gunners, Bazooka). The roster ends with a tally of all units in the army.
- **Unit index.** `units.html` is a separate searchable page. Search "Rifle Platoon 1st Inf. Div. 16th Inf. Reg. A" and it shows that platoon with every unit on the tile and in each option that comes with it. A second view lists every unit and where it comes from. Every tile in the builder links to it.
- **Rules search.** `rules.html` searches the Big Red One rulebook (V4.1) by word. Results show the section, sub-heading and page, with matches highlighted. Open any result to read the whole section, or browse the contents. The keyword glossary is included.
- **Landing page and boxes.** `index.html` is the front door: what the site is, Big Red One as the main box, and tiles for the other boxes (Bloody Omaha, Battle for Caen, War Stories, Heroes of Stalingrad, Heroes of Normandie 1st edition) and shortcuts to every tool. `box.html?b=bro|omaha|caen|ws|hos|hon1` is the hub for one box: its art, a description, and links into the rules, scenarios, units, heroes, cards, tokens, icons, maps and history for that box, with counts. Battle Pack #3 (Windsor & Jupiter) sits on the Caen page. `hon1` is the first edition (V1): its page links to the 81-product catalogue (`expansions.html?l=hon1`) and shows rules, scenarios and units as "not archived yet", because no V1 files are in the archive. The army builder moved to `builder.html`. Old army links that start `index.html#b=` are forwarded to it. Box texts and counts live in `data/hon-boxes.js`, built by `python3 tools/boxes_stats.py --write` (run it after data changes). Box art is in `img/boxes/`.
- **War Stories.** `scenarios.html?b=ws` and `scenario.html?b=ws&s=...` hold War Stories #0 to #4 (Hell's Fury, Blue and Grey at Moon-sur-Elle, Colombelles Castle, Juno Beach, The Black Baron). Each is typed out in full with its map, armies, tile gallery, original sheet and the PDF in `pdf/ws-*.pdf`. Data is in `data/hon-ws-scenarios*.js`, pictures in `img/hon/ws/`. The tiles are not in the army builder yet.
- **Guides and documents.** `guides.html` holds six text guides (`?g=<id>`): what to buy, strategy tips, assault and opportunity fire, using Normandie sets in Heroes of Stalingrad, who the heroes are based on, and playing first edition scenarios with Big Red One. Data is in `data/hon-guides.js`. Under them is a library of 123 documents (`?d=<id>`, `?c=<group>`, `?q=<words>`): first edition rules sheets, scenario packs and books, 59 single scenarios (the Scenario Contest Compilation of Winter 2015 and the Core Set, Carentan, Pointe du Hoc, Caught in a Trap, Heroes and Gold, Civilians under fire, Guardians' Chronicles and Gazette books, each split into its scenarios and marked as part of its book), four Gazettes, unit bibles, collector catalogues, game aids and unofficial rules. Data (including the text of every page) is in `data/hon-library.js`, page pictures in `img/hon/lib/<id>/pNN.webp`, PDFs in `pdf/lib/`. Each document carries a note that the V2 rules override older rules. The hero tiles on `heroes.html` show a Based on line for names found in the heroes guide. The publisher's forum posts are credited without links because that forum is gone.
- **Historical reference.** `history.html` has 65 short, searchable entries on the real formations, weapons, vehicles, aircraft and defences behind the Big Red One units. Entries are a collapsed index: click one to read it. Filter by side and category (Formations, People, Small arms, Support weapons, Vehicles, Aircraft, Defences and mines), and jump to the matching tiles in the unit index. Each entry links to its source. Data lives in `data/hon-bro-history.js`. Battle for Caen (`data/hon-caen-history.js`) and Heroes of Stalingrad (`data/hon-hos-history.js`) have their own sets.
- **Scenarios index.** `scenarios.html` lists every scenario in the Big Red One Scenario Booklet (V2.4) with its booklet page number, a summary and the key facts: date, armies and points, setup, length, how to win and special rules. It also lists the booklet's rules chapters with page numbers. Entries are a collapsed index you click to read. Data lives in `data/hon-bro-scenarios.js`. The box buttons also include First edition (V1), built at load time from the document library (`data/hon-library.js`): the 76 single scenarios, packs, books and gazette entries, each linking to its library page and PDF.
- **Scenario reader.** `scenario.html?b=<box>&s=<id>` shows one scenario in full: story, battlefield and deployment picture, recruitment pictures, preparation, special rules, victory conditions, step-by-step example (Plain Carnage) and campaign notes. It is built for phones and iPads (single column, large touch targets, tap a picture or a "Booklet page N" marker to open the original page full size). Each page also lists the armies for the builder and the original pages. The Download section gives the PDF of the whole booklet. Text data: `data/hon-bro-scenarios-full.js` and `data/hon-omaha-scenarios-full.js`. Figures: `img/hon/<box>/scenfig/`. Page images: `img/hon/<box>/scenpages/` (p = full size, t = thumbnail). PDFs: `pdf/`.
- **Scenario armies.** Eight scenarios (Plain Carnage, Chicken Game, A Rough Night, Caumont-l'Éventé, Le Quesnay, Surrounded!, Windy at Sept-Vents! and We Shall Pass!) have "Open the armies in the builder" buttons, one per side. Armies follow the booklet recruitment pictures. Pages 21 to 28 follow the V2.5 booklet, the rest V2.4. Thirteen of the sixteen match the booklet points exactly. The German armies in Plain Carnage, Le Quesnay and Surrounded! come out 5 to 10 points under the printed figure. Armies are stored in `data/hon-bro-scenarios.js` as tile ids and one option id per slot.
- **Tokens and markers.** `tokens.html` shows the scans of the objective, tactical bonus, turn chart, event, suppressed, vehicle damage, destruction and flamethrower markers with what each does, linked to the rules search. Data lives in `data/hon-bro-tokens.js`.
- **Heroes and equipment.** `heroes.html` lists every hero tile for both sides, the units on it, and every option that fits its slot, worked out with the same rule as the builder. Filter by box (Big Red One, Bloody Omaha, promo heroes). It also shows the equipment cards and markers: Bazooka, Panzerfaust, Knife, MP40, Thompson, Flamer and Overwatch, plus the Bloody Omaha Heroic, Grenade, Mauser, Carbine M1 and Hardened cards. Data lives in `data/hon-bro-heroes.js` (each card has a `box`). It now carries 24 equipment cards, including the Veteran, Ammo, Grenade, Rifle grenade, Sticky bomb, Panzerfausts, the promo box gear and the Windsor & Jupiter cards (Charge, Ferocious, Urban Fighter). Text is from rulebook V4.1 pp.28-30 and the Caen booklet p.9. UK hero gear with no art is listed in ISSUES.txt ISS-036.
- **Expansions.** `expansions.html` is a catalogue of 158 products across six games (Heroes of Normandie V2 and V1, Stalingrad, Pacific, Shadows over Normandie, Black Reach). Filter by game and type (big box, army box punchboards, gazette, terrain and so on) or search. Entries with notes show what the product holds, a small preview of its punchboard where there is one, and links to what the tool covers (only the V2 boxes so far). A "starter forces" section summarises an older community buying guide. The product list comes from the collection checklist, not from a web source. Data lives in `data/expansions.js` and previews in `img/exp/`.
- **Commonwealth units and Battle for Caen: Epsom, Charnwood & Goodwood.** The builder, units page and heroes page have a third nation, Commonwealth (`data/hon-bro-uk.js`, 9 tiles and 34 options). The new German tiles and options for the box are in `data/hon-bro-ge.js`. Every ECG tile and option has the set code `ECG`. Four new stripe colours (olive, cream, blue, pale yellow) are named in `js/app.js`. Battle for Caen is its own box in History (`data/hon-caen-history.js`) and Rules (`data/hon-caen-rules.js`, booklet V1.4 WIP). The units tracker sends tiles and options with set code `ECG` to the Caen History file. Scenarios are in too (`data/hon-caen-scenarios.js` and `-full.js`): six campaign scenarios, the Safari bonus scenario and the campaign report, with 16 armies for the builder, maps, recruitment pictures, the 28 original pages and the PDF in `pdf/`. Tokens (`data/hon-caen-tokens.js`, 7 entries for the box) and the 13 icons of the booklet summary (in `data/hon-icons.js`) are in.
- **Battle Pack #3: Windsor & Jupiter.** An expansion for Battle for Caen, not a big box. It has set code `BP3` in `data/hon-bro-ge.js` (5 tiles, 15 options) and `data/hon-bro-uk.js` (4 tiles, 12 options): Divisionsstab Meyer, Feldkommando Herold, hero Oros Snowt, Jägerbataillon and SS-Panzerpionier for the Germans, and Field Command Essame, hero Arthur Ash, B Recce Squadron and the Duke of Cornwall's Light Infantry for the Commonwealth. Costs, breaking points, slots and stripes were read from the Tabletop Simulator art (ISS-032). History entries (16) are in the Battle for Caen file, tokens (6 entries) are in `data/hon-caen-tokens.js`, and heroes show under their own box. The units tracker sends `BP3` to the Caen History file. The pack's rulebook and scenarios are not in the archive (ISS-031). Maps were already in.
- **My collection, site-wide.** Every page has a "My collection" button in the header. Tick the boxes, expansions, punchboards and promos you own (78 products: 12 older ones plus everything in the Archive catalogue) and the Scenarios, Units, Heroes, Maps and builder pages hide what you cannot use. Each filtered page says how many items are hidden and has a "Show everything" link, and the header button shows the count or "(off)". Nothing ticked means no filter. The choice is saved on this device (`hts.hon.own.v1`) and every page reads it. Scenarios match on boards and units: a scenario is shown when you own every board and army box it needs, with alternatives where either will do (for example Core Box or Big Red One boards). A scenario with no entry in `data/hon-needs.js` is shown as "Needs not tagged" and is never hidden. The builder option picker keeps its "Show options I do not own" tick. The Cards page is not filtered (it only holds Big Red One decks). Code: `js/collection.js`. Product list: `data/hon-products.js`, generated from `data/expansions.js` by `node tools/mkproducts.js` (the 12 older products stay at the top of `js/collection.js`). Scenario needs: `data/hon-needs.js`, generated by `node tools/mkneeds.js` from the scenario setup text plus hand-tagged entries.
- **Cards.** `cards.html` shows every Battle Event card of Big Red One, US and German decks (50 cards each, 62 different cards after copies are merged). Each card has its full size picture (zoom, previous and next, download), when it is played, what it does, and the number of copies. Filter by side and by when the card is played, or search the card text. Text was typed from the scans (read by OCR, then corrected by hand). Data lives in `data/hon-bro-cards.js`, pictures in `img/hon/bro/cards/` (`.webp` full size, `.t.webp` thumbnail). Cards for Bloody Omaha, Battle for Caen and Battle Pack #3 are not in the archive yet (ISS-034).
- **Bloody Omaha scenarios and tokens.** `scenarios.html` and `tokens.html` have a box switch. Omaha has the player generated landings chapter, Part 1, Part 2, Little River of No Return and Big River of No Return, each with a battlefield map and builder links (11 armies, some with notes where the printed points differ, see ISSUES.txt ISS-023). Tokens cover Bangalore, Explosive M1, Forward position, Shovel, Ammo belt, Tank gear, shells, mines, haystack, smoke, artillery, bombs and Heroic. Data lives in `data/hon-omaha-scenarios.js` and `data/hon-omaha-tokens.js`. The whole 24-page booklet is readable as 12 entries: the introduction with the 6 June 1944 report, the five rules chapters (Battlefield, Special rules, Special abilities, Recruitment options, Aviation rules), the scenarios and the icon summary. The builder has the aircraft (P-47, P-51, Fw 190, Bf 109, Spitfire, Typhoon), the Support tile and the M10 A1, so the Omaha and Caen armies come closer to the printed points (see ISSUES.txt ISS-023, ISS-030, ISS-037).
- **Icon glossary.** `icons.html` lists every icon from the rulebook icon summaries (Big Red One p.36, Bloody Omaha p.24, Heroes of Stalingrad p.28) with its picture, group, page and what it does. Search by name or words in the description, filter by group, and switch box. Icons are cut from the PDFs at native size with their transparency. Data lives in `data/hon-icons.js` (images in `img/hon/<box>/icons/`). The Stalingrad icons are cut from rulebook p.28 with the page background removed. Stalingrad has no rules compendium yet, so its icon cards have no "Find in the rules" link.
- **Rules compendium.** `rules.html` now covers Big Red One and Bloody Omaha. Rule entries carry figures cropped from the rulebook pages (`img/hon/<box>/rules/`), tables (the Omaha player generated landings table), and chips that link to the matching icon in the glossary. Search results show thumbnails. Add new boxes by adding `data/hon-<box>-rules.js` and a box name in `js/rules.js`.
- **Maps.** `maps.html` is a map builder for five boxes: Big Red One, Bloody Omaha, Battle for Caen (Epsom, Charnwood & Goodwood), Battle for Caen (Windsor & Jupiter) and Heroes of Stalingrad. The Stalingrad box has 8 boards (Core Set CB1 to CB6, Battle Pack BP1 and BP2). Each print file is one side, named by the mark printed in its top left corner (CB1-A, CB1-B and so on); the marks are stored as `ma` and `mb` on the piece and shown on the cards and in the viewer. The Sewers punchboard sheets are not included: they hold irregular rooms, corridors and tokens, not marked A and B boards. Pick a box, filter its terrain by type (Maps, Houses and buildings, Defensive positions, Rocks, Thickets and forests, Ponds, Roads and rivers, Bridges, Trails, Obstacles, Landing craft; type names follow rulebook p.19) or search by name, view both sides of any piece, then add it to a canvas. Drag, rotate, flip, duplicate, reorder, undo and redo. Pieces from different boxes can share one map. Choose a map size from 1 to 9 boards or type squares. Snap is whole square, half square or off. Save maps on your device, copy a link (`maps.html#m=...`), download a picture or print. It warns when a piece is used more than once or two boards overlap. Data lives in `data/maps.js`. A board is 7 by 7 squares and one square is 200 pixels in the images. Boards carry their side label (such as OB5-A or EC1-B) in the top left square. Every board shows its printed corner marks (C1-A, OB1-A, EC1-A, WJ1-A, CB1-A and so on) in the viewer and on the cards. The Big Red One houses are named by their marks (A-01, B-01, C-01) and the Omaha landing craft by the numbers on their ramps (01 to 06). Omaha board OB5 side B is misprinted OB4-B, and the site keeps that mark.
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
js/home.js            the landing page and box pages
js/heroes.js          the heroes and equipment page
js/maps.js            the map builder
js/icons.js           the icon glossary
data/hon-icons.js     icon glossary entries
data/hon-omaha-rules.js  Bloody Omaha rules (V7.1)
data/maps.js          terrain pieces for the five boxes (img/hon/maps/<box>/)
data/hon-bro-tokens.js the marker entries
data/hon-omaha-tokens.js  the Bloody Omaha marker entries
data/hon-hos-tokens.js  the Heroes of Stalingrad marker entries (13 entries, pictures in img/hon/hos/tokens/)
data/expansions.js    the expansions catalogue
data/hon-omaha-scenarios.js  the Bloody Omaha scenarios and armies
data/hon-bro-heroes.js the equipment cards
data/hon-boxes.js     box descriptions and counts for the landing page (built by tools/boxes_stats.py)
data/hon-bro-scenarios.js the scenario summaries
data/hon-bro-history.js the historical entries
data/hon-bro-rules.js the rulebook text by section and page
index.html            the landing page
box.html              one page per box
builder.html          the army builder
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

## Releases

Browsers and GitHub Pages cache css, js and data files. Run `python3 tools/stamp.py hts-vNN` before each release. It adds `?v=hts-vNN` to every local css, js and data link in the html pages so visitors never get a new page with an old stylesheet.

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
- **Tabletop Simulator guide.** `data/hon-guides.js` has a guide, "Playing on Steam with Tabletop Simulator", with links to the Big Red One mod, the contributor's Steam Workshop page and a Google Drive folder of high resolution images. `js/guides.js` allows only steamcommunity.com and drive.google.com as external links inside guide text.
- **Tile pictures and print files.** `data/hon-library.js` has six tile-picture documents in Unit references (Pegasus Bridge and its terrain, Kelly's Heroes, Gazette 4, GE 21eme PZ, Pulp Stories #1), each a set of contact sheets with a PDF. Edition `Other` marks lines other than Heroes of Normandie. A new group, Print files and maps, holds six documents with reduced previews of the large print maps (Woods and Hills, Vercors 1944, tournament maps, Selonge Forest depots, Church, The Mansion). Four documents hold the surviving preview pages of Sainte-Mere-Eglise and Gazettes 1 to 3. The library now has 211 documents in 11 groups.
- **Operation Neptune campaign sheet.** `data/hon-library.js` has the document `operation-neptune-campaign-sheet` (Scenario packs and books, edition Community, 7 landscape pages, PDF). A document can carry an optional `background` field, an array of the same blocks guides use (`h`, `h3`, `p`, `ul`, `table`). `js/guides.js` shows it above the page pictures, includes it in the document search, and allows en.wikipedia.org links in it. For this sheet it holds the historical background, a 28 row table that links each scenario to its document on this site, and the sources.
- **Fan made scenarios.** The `fanmade` group in `data/hon-library.js` has 42 documents: 29 fan scenarios with the parchment layout or the official look (each with a PDF), 4 fan campaigns (Nijmegen 44, Schnee Eifel 44, Hakker-Houxvert, Battle of the Bulge, PDF pages turned into pictures to keep the files small), and 9 web-only documents whose layout is plain (the OPJH tournament scenarios and rules, T1 to T3, and the general tournament rules). Every doc has `ed: 'Community'` and a `kind` (Small armies, Large armies, Very large armies, Skirmish, Campaign scenario, Campaign, Tournament). Only scenarios that name their map tiles were kept. The Scenarios page has a "Fan made (unofficial)" button, built from this group, and every entry is badged "Fan made". Four official tournament scenarios (Battlefield 1 and 2 in French, Martyrs' Square, Selonge Forest) are in the `single` group as first edition documents.
- **Heroes of Stalingrad documents.** The `stalingrad` group in `data/hon-library.js` has 25 documents (`ed: 'Other'`, each with a `kind`): the rulebook, Battle Pack rules, the German and Russian unit card errata (with PDFs), the offset grid map game aid, Core Set scenarios, Factory, House of Hell, Sewers and Sniper scenarios, the Hell on Earth mini campaign, Battlefield Stories 1 to 5, War Stories 1 and 2, and seven picture-only documents (`kind: 'Punchboards and tiles'`, 1700 px wide, no PDF) for the Core Set punchboards and map tiles, Battle Pack punchboards and map tiles, Duel of Snipers, Heroic Platoon and Sewers. The Scenarios page has a Heroes of Stalingrad button built from this group. The recruitment tiles and options are in the army builder and unit index (see Heroes of Stalingrad army data below).
- **Heroes of Stalingrad army data.** `data/hon-hos-ru.js` (Soviet Union, 12 tiles, 35 options) and `data/hon-hos-gs.js` (Germany, 12 tiles, 32 options) use the same shape as `data/hon-bro-*.js`, with pictures in `img/hon/hos/{ru,gs}/{tiles,options,units}/`. Set codes are `HoS-CB` (Core Set), `HoS-BP` (Battle Pack), `HoS-KS` (Duel of Snipers) and `HoS-HP` (Heroic Platoons); they are listed in `js/collection.js` and in the Stalingrad box in `js/units.js`. Builder nation ids are `ru` and `gs`. Everything was read from the reduced punchboard pictures by eye: costs, breaking-point squares and stripe colours should be checked against the cards in the box. Order tokens are modelled: a tile's `orders` is its fixed order stars (officer stars and printed tile stars), `starSlots` lists the slot indexes that carry a star, and the builder adds one order token for each star slot that holds an option. Command options that add orders are not counted. Unit stats (`stats` in the nation file: `mv` move, `rng` range, `df` defense, `o`/`p`/`g` the orange, purple and grey combat values, `null` for X) are held for infantry, officers, heroes and weapons and shown on the unit index counters. Vehicles and aircraft have no stats yet. Sewers tiles are not in the builder because they have no units. Two tiles (Panzergrenadiere II and Die Geisterabteilung) are printed sideways on the sheets and were turned upright. `data/hon-hos-history.js` has 35 History entries (formations, people, small arms, support weapons, vehicles, aircraft), each with a Wikipedia or other source; the page is `history.html?b=hos`. Named officers and fictional heroes with no source found are listed in `tools/tracker_exclusions.json` as `unsourced` or `fictional`, so the tracker passes without inventing facts. The Heroes page (`heroes.html?b=hos`) lists the 9 Stalingrad hero tiles (5 Red Army, 4 German) from the same data; it shows no equipment cards for them and no "Based on" lines.
