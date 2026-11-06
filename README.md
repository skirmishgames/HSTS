# Heroes of Normandie army builder

A free fan-made army builder for Heroes of Normandie by Devil Pig Games. It runs in the browser with no account and no server. Everything is saved on your own device.

You need the rulebook to play. This project is not affiliated with or endorsed by Devil Pig Games.

## What it does

- **Visual roster.** Recruitment Tiles and Recruitment Options appear as the real tile art, not a text list. Options sit in the slots of the tile they belong to.
- **Country and points.** Pick United States or Germany, set a points limit (150 to 500, or your own), and watch the total against the limit.
- **Slot rules.** Each slot knows its size and colour stripes. The option picker lists only what fits, and can show everything if your tiles disagree with the data.
- **Roster summary.** Costs per tile and option, plus the breaking points shown as red squares.
- **Included units as text.** Every tile and every support option lists the units it brings (for example Bazooka Squad: Support Team, Gunners, Bazooka). The roster ends with a tally of all units in the army.
- **Unit index.** `units.html` is a separate searchable page. Search "Rifle Platoon 1st Inf. Div. 16th Inf. Reg. A" and it shows that platoon with every unit on the tile and in each option that comes with it. A second view lists every unit and where it comes from. Every tile in the builder links to it.
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
units.html
css/style.css
test/smoke.js         Playwright smoke test
```

A tile has `slots`. Each slot has a position on the tile image (fractions of the image), a `size` (`w` wide, `n` narrow) and `stripes`. A tile has `units` as `[name, quantity, kind]` and `own`, the ids of the options printed on the same sheet. Support options also carry `units`. Kinds: officer, character, infantry, weapon, vehicle, marker, aircraft.

An option has a `size`, `stripes` and a `cat` (support, gear, trait, order, customization).

Stripe codes: R red, Y yellow, B blue, LB light blue, W white, K black, G green, T tan, O orange, `cmd` command stripes, `custom` customization, `any` common option with no stripes.

An option fits a slot when the sizes match and at least one stripe is shared. `any` options fit every slot except the single slot on a hero tile.

To add another box, add a `data/hon-<box>-<country>.js` file in the same shape, add the images, and register the country in `js/app.js`.

## Sets

The `set` code on each tile is the code printed on the sheet it came from: CB, BO, KS-9, SOLO, WS#0, P500. Use the set chips in the library to filter by them.

## Checking the data

Costs, sizes, stripes and unit lists were read from the tile sheets. If something does not match your physical tiles, email games@staroversky.com. Slot and stripe data lives in plain JavaScript, so fixes are small edits.

## Tests

```
npm i playwright
node test/smoke.js
```
