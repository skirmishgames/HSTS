// Smoke test. Run: node test/smoke.js  (needs playwright; serves the repo on a local port)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const srv = http.createServer((req, res) => {
  let p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (p.endsWith('/')) p += 'index.html';
  fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); res.end(b); });
});
function ok(c, m) { if (!c) { console.error('FAIL: ' + m); process.exitCode = 1; } else console.log('ok: ' + m); }
(async () => {
  await new Promise(r => srv.listen(0, r));
  const url = 'http://127.0.0.1:' + srv.address().port + '/builder.html';
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  pg.on('dialog', d => d.accept());
  await pg.goto(url);
  ok(await pg.locator('.lcard').count() > 10, 'US library lists tiles');
  // add the 16th Inf Rifle Platoon
  await pg.locator('.lcard', { hasText: 'Rifle Platoon' }).first().locator('[data-add]').click();
  ok(await pg.locator('.atile').count() === 1, 'tile added to army');
  ok((await pg.textContent('#ptsUsed')) === '70', 'tile cost counted (70)');
  // slot 1 is wide: Rifle Squad (50) fits, Veteran (narrow) should not be listed
  await pg.locator('.atile .slot').first().click();
  ok(await pg.locator('#picker:not([hidden])').count() === 1, 'picker opens');
  ok(await pg.locator('.pcard', { hasText: 'Rifle Squad' }).count() >= 1, 'rifle squad offered');
  ok(await pg.locator('.pcard', { hasText: 'Veteran' }).count() === 0, 'narrow option hidden from wide slot');
  ok(await pg.locator('.pcard', { hasText: 'Bluff' }).count() === 0, 'order option hidden from platoon slot');
  await pg.locator('.pcard', { hasText: 'Rifle Squad' }).first().click();
  ok((await pg.textContent('#ptsUsed')) === '120', 'option cost counted (120)');
  // narrow slot 2 takes common narrow gear
  await pg.locator('.atile .slot').nth(1).click();
  await pg.locator('.pcard', { hasText: 'Grenade' }).first().click();
  ok((await pg.textContent('#ptsUsed')) === '125', 'common gear fits narrow slot (125)');
  // limit warning
  await pg.fill('#limitNum', '100');
  ok(await pg.locator('.warnings .bad').count() === 1, 'over limit warning shown');
  // override placement
  await pg.fill('#limitNum', '250');
  await pg.locator('.atile .slot').nth(2).click();
  await pg.check('#pickAll');
  await pg.locator('.pcard.nofit').first().click();
  ok(await pg.locator('.slot.mismatch').count() === 1, 'forced placement flagged amber');
  // germany
  await pg.click('[data-nation="ge"]');
  ok(await pg.locator('.atile').count() === 0, 'switching country clears army');
  ok(await pg.locator('.lcard', { hasText: 'Panzergrenadiere' }).count() >= 2, 'German tiles listed');
  // command tile takes orders
  await pg.locator('.lcard', { hasText: 'Feldkommando' }).first().locator('[data-add]').click();
  await pg.locator('.atile .slot').nth(1).click();
  ok(await pg.locator('.pcard', { hasText: 'Planning' }).count() === 1, 'orders offered on command tile');
  await pg.keyboard.press('Escape');
  // unit text in the roster
  await pg.click('[data-nation="us"]');
  await pg.locator('.lcard', { hasText: 'US Rangers' }).first().locator('[data-add]').click();
  ok((await pg.textContent('.atile .incl')).includes('Lt. Edlin'), 'tile includes line shows units');
  await pg.locator('.atile .slot').first().click();
  ok(await pg.locator('.pcard', { hasText: 'Includes: Support Team, Gunners, Bazooka' }).count() >= 1, 'picker shows Bazooka Squad units');
  await pg.locator('.pcard', { hasText: 'Includes: Support Team, Gunners, Bazooka' }).first().click();
  ok((await pg.textContent('.optlist')).includes('Gunners'), 'option line shows Gunners');
  ok((await pg.textContent('#summary')).includes('Units in this army'), 'army unit tally shown');
  // unit index page
  const up = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const uerrs = []; up.on('pageerror', e => uerrs.push(e.message)); up.on('console', m => { if (m.type() === 'error') uerrs.push(m.text()); });
  const q = encodeURIComponent('Rifle Platoon 1st Inf. Div. 16th Inf. Reg. A');
  await up.goto(url.replace('builder.html', 'units.html') + '?n=us&q=' + q);
  ok(await up.locator('.ucard').count() === 1, 'exact platoon search returns one tile');
  const ut = await up.textContent('.ucard');
  ok(['Lt. Blean', 'Recon Team', 'Rifle Squad', '.30 Cal', 'Bazooka'].every(w => ut.includes(w)), 'platoon shows tile units and own options units');
  ok(await up.locator('.ucard figure.ctr').count() >= 4, 'unit counters shown for the platoon');
  await up.fill('#q', 'bazooka');
  await up.waitForTimeout(300);
  ok(await up.locator('.ucard').count() >= 3, 'search bazooka finds several tiles');
  // filters
  await up.fill('#q', '');
  await up.waitForTimeout(250);
  ok(await up.locator('#boxes button.on').textContent() === 'All boxes' && await up.locator('#boxes button').count() === 7, 'game box filter offers All boxes plus six boxes');
  // first edition in the unit index
  await up.goto(url.replace('builder.html', 'units.html') + '?n=us&q=' + encodeURIComponent('4th Ar.Div. 37th Ar.Regt')); await up.waitForTimeout(300);
  ok(await up.locator('.ucard').count() === 1 && /Sherman Squadron/i.test(await up.textContent('.ucard h3')) && await up.locator('.ucard .v1badge').count() === 1, 'unit index: first edition Sherman Squadron is found by its regiment, with the badge');
  await up.goto(url.replace('builder.html', 'units.html') + '?n=us&b=v1'); await up.waitForTimeout(300);
  ok((await up.textContent('#stat')).startsWith('33 tiles, 89 common options'), 'unit index: First edition box lists the 33 US tiles and 89 options');
  await up.goto(url.replace('builder.html', 'units.html') + '?n=fr'); await up.waitForTimeout(300);
  ok((await up.textContent('#stat')).startsWith('6 tiles, 10 common options') && await up.locator('.ucard', { hasText: 'Maquisards' }).count() === 1, 'unit index: French (FFI) lists its 6 tiles and 10 options');
  await up.goto(url.replace('builder.html', 'units.html') + '?n=us&q=grenade'); await up.waitForTimeout(300);
  ok(await up.locator('.ucard', { hasText: 'Grenade' }).count() >= 2, 'unit index: gear with no units, such as Grenade, can be found');
  await up.fill('#q', '');
  const boxCounts = await up.evaluate(() => { const out = {}; ['us', 'ge', 'uk'].forEach(n => { const d = window.HTS_DATA['hon-bro-' + n]; out[n] = { all: d.tiles.length, bro: d.tiles.filter(t => t.set === 'CB').length, omaha: d.tiles.filter(t => t.set === 'BO').length, caen: d.tiles.filter(t => ['ECG', 'BP3'].includes(t.set)).length }; }); return out; });
  for (const bxId of ['bro', 'omaha', 'caen']) {
    await up.goto(url.replace('builder.html', 'units.html') + '?n=us&b=' + bxId); await up.waitForTimeout(250);
    const want = boxCounts.us[bxId];
    ok((await up.locator('#stat').textContent()).startsWith(want + ' tile') || (want === 0 && await up.locator('.empty2').count() === 1), 'unit index: ' + bxId + ' box shows its ' + want + ' US tiles');
  }
  await up.goto(url.replace('builder.html', 'units.html') + '?n=uk&b=omaha'); await up.waitForTimeout(250);
  ok(await up.locator('.empty2').count() === 1 && /no Commonwealth tiles/.test(await up.locator('.empty2').textContent()), 'unit index: Bloody Omaha has no Commonwealth tiles and says so');
  await up.goto(url.replace('builder.html', 'units.html') + '?n=us'); await up.waitForTimeout(250);
  await up.click('#boxes [data-box="caen"]'); await up.click('#nations [data-nation="uk"]'); await up.waitForTimeout(250);
  ok((await up.locator('#stat').textContent()).startsWith(boxCounts.uk.caen + ' tile'), 'unit index: picking a box and nation with the buttons works');
  await up.goto(url.replace('builder.html', 'units.html') + '?n=us'); await up.waitForTimeout(250);
  ok(await up.locator('#boxes button.on').textContent() === 'All boxes', 'game box filter is on All boxes');
  const all = await up.locator('.ucard').count();
  await up.click('[data-tt="hero"]');
  const heroes = await up.locator('.ucard').count();
  ok(heroes > 0 && heroes < all, 'tile type filter narrows to heroes');
  await up.click('[data-tt="all"]');
  await up.click('[data-kind="vehicle"]');
  const veh = await up.locator('.ucard').count();
  ok(veh > 0 && veh < all, 'unit type filter narrows to tiles with vehicles');
  await up.click('[data-view="unit"]');
  ok((await up.locator('.ulist-group h3').allTextContents()).every(t => t.startsWith('Vehicle')), 'unit list shows only vehicles');
  await up.click('#btnReset');
  await up.click('[data-view="tile"]');
  await up.fill('#q', 'Panzerschreck');
  await up.click('[data-nation="ge"]');
  ok(await up.locator('.ucard').count() >= 2, 'German search works');
  await up.fill('#q', '');
  await up.waitForTimeout(300);
  await up.click('[data-view="unit"]');
  ok(await up.locator('.urow').count() > 10, 'unit list view lists units');
  await up.fill('#q', 'fire group');
  await up.waitForTimeout(300);
  ok(await up.locator('.urow', { hasText: 'Fire Group' }).count() >= 1, 'unit list search');
  const ub = await up.evaluate(() => Array.from(document.images).filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).length);
  ok(ub === 0, 'unit index: no broken images');
  ok(uerrs.length === 0, 'unit index: no console errors ' + uerrs.join('|'));
  await up.close();
  // rules search page
  const rp = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const rerrs = []; rp.on('pageerror', e => rerrs.push(e.message)); rp.on('console', m => { if (m.type() === 'error') rerrs.push(m.text()); });
  await rp.goto(url.replace('builder.html', 'rules.html'));
  ok(await rp.locator('.rlink').count() > 30, 'rules contents list sections');
  await rp.fill('#q', 'suppressed marker');
  await rp.waitForTimeout(300);
  ok(await rp.locator('.rcard').count() >= 3, 'rules search finds suppressed marker');
  ok(await rp.locator('.rcard mark').count() >= 1, 'rules matches are highlighted');
  await rp.fill('#q', 'opportunity fire');
  await rp.waitForTimeout(300);
  ok((await rp.locator('.rcard').first().textContent()).toLowerCase().includes('opportunity'), 'rules search finds opportunity fire');
  await rp.locator('.rtitle').first().click();
  ok(await rp.locator('#rmodal:not([hidden]) .rchunk').count() >= 1, 'rules result opens centred reader');
  const box = await rp.locator('.rdlg').boundingBox();
  ok(Math.abs((box.x + box.width / 2) - 550) < 4 && box.width <= 721, 'rules reader is centred and readable width');
  await rp.keyboard.press('Escape');
  ok(await rp.locator('#rmodal:not([hidden])').count() === 0, 'Escape closes reader');
  await rp.locator('.rtitle').first().click();
  if (await rp.locator('[data-full-open]').count()) { await rp.click('[data-full-open]'); ok(await rp.locator('.rsub, .rchunk').count() >= 2, 'whole section view'); }
  await rp.click('[data-close]');
  await rp.fill('#q', '');
  await rp.waitForTimeout(300);
  await rp.locator('.rlink').nth(5).click();
  ok(await rp.locator('#rmodal:not([hidden]) .rchunk').count() >= 1, 'contents link opens reader');
  await rp.mouse.click(5, 5);
  ok(await rp.locator('#rmodal:not([hidden])').count() === 0, 'backdrop click closes reader');
  await rp.fill('#q', 'opportunity fire');
  await rp.waitForTimeout(300);
  await rp.click('[data-ch="3"]');
  ok(await rp.locator('.rcard').count() >= 1, 'chapter filter keeps matches');
  await rp.fill('#q', 'zzzzqq');
  await rp.waitForTimeout(300);
  ok(await rp.locator('.empty2').count() === 1, 'rules no-match message');
  ok(rerrs.length === 0, 'rules page: no console errors ' + rerrs.join('|'));
  // historical reference page
  const hp = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const herrs = []; hp.on('pageerror', e => herrs.push(e.message)); hp.on('console', m => { if (m.type() === 'error') herrs.push(m.text()); });
  const hurl = url.replace('builder.html', 'history.html');
  await hp.goto(hurl);
  const hn = await hp.locator('.hrow').count();
  ok(hn >= 50, 'history lists entries (' + hn + ')');
  ok(await hp.locator('.hbody p').count() === 0, 'history loads no entry text until opened');
  await hp.locator('.hhead').first().click();
  ok(await hp.locator('.hrow.open .htext').count() === 1 && await hp.locator('.hbody p').count() === 1, 'clicking an entry expands it');
  await hp.locator('.hhead').first().click();
  ok(await hp.locator('.hrow.open').count() === 0, 'clicking again collapses it');
  const rh = hp.locator('.hhead').nth(1), hb0 = await rh.boundingBox();
  await rh.click();
  const ob = await hp.locator('.hrow.open').boundingBox();
  ok(Math.abs(ob.x - hb0.x) < 4 && Math.abs(ob.width - hb0.width) < 4, 'right-hand entry expands in place, directly under its title');
  await rh.click();
  await hp.fill('#q', 'sherman');
  await hp.waitForTimeout(300);
  ok((await hp.locator('.hhead .hname').first().textContent()).includes('Sherman'), 'history search ranks Sherman first');
  ok(await hp.locator('.hrow mark').count() >= 1, 'history matches highlighted');
  await hp.fill('#q', 'omaha');
  await hp.waitForTimeout(300);
  ok(await hp.locator('.hrow').count() >= 5, 'history search omaha');
  await hp.fill('#q', 'mauser');
  await hp.waitForTimeout(300);
  ok(await hp.locator('.hrow').count() >= 1, 'history alias search (Mauser)');
  await hp.fill('#q', '');
  await hp.click('[data-side="ge"]');
  ok(await hp.locator('.hb-us').count() === 0, 'German filter hides American entries');
  await hp.click('[data-cat="Aircraft"]');
  ok(await hp.locator('.hrow').count() === 2, 'German aircraft filter gives 2');
  await hp.fill('#q', 'zzzzqq');
  await hp.waitForTimeout(300);
  ok(await hp.locator('.empty2').count() === 1, 'history no-match message');
  ok(herrs.length === 0, 'history page: no console errors ' + herrs.join('|'));
  // scenarios index page
  const sp = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const serrs = []; sp.on('pageerror', e => serrs.push(e.message)); sp.on('console', m => { if (m.type() === 'error') serrs.push(m.text()); });
  await sp.goto(url.replace('builder.html', 'scenarios.html'));
  ok(await sp.locator('.hrow').count() === 12, 'scenarios index lists 12 entries');
  ok(await sp.locator('.hbody p').count() === 0, 'scenario text not loaded until opened');
  const firstScen = (await sp.locator('.hrow .spg').allTextContents());
  ok(firstScen.includes('p.10-14') && firstScen.includes('p.15') && firstScen.includes('p.26-27'), 'scenario page numbers shown');
  await sp.locator('.hhead', { hasText: 'Plain Carnage' }).click();
  ok((await sp.locator('.hrow.open').textContent()).includes('175 points'), 'scenario opens with details');
  await sp.fill('#q', 'halftrack');
  await sp.waitForTimeout(300);
  ok((await sp.locator('.hname').first().textContent()).includes('Chicken Game'), 'scenario search finds Chicken Game');
  await sp.fill('#q', '');
  await sp.click('[data-type="Campaign"]');
  ok(await sp.locator('.hrow').count() === 6, 'campaign filter shows 6');
  await sp.fill('#q', 'zzzzqq');
  await sp.waitForTimeout(300);
  ok(await sp.locator('.empty2').count() === 1, 'scenarios no-match message');
  ok(serrs.length === 0, 'scenarios page: no console errors ' + serrs.join('|'));
  // scenario armies open in the builder with the right points and no slot warnings
  const armyInfo = JSON.parse(await sp.evaluate(() => JSON.stringify(window.HTS_SCEN['hon-bro'].entries.filter(e => e.armies).map(e => [e.id, e.armies]))));
  ok(armyInfo.length === 8, 'eight scenarios carry armies');
  await sp.fill('#q', ''); await sp.click('[data-type="all"]');
  await sp.locator('.hhead', { hasText: 'Surrounded' }).click();
  const hrefs = await sp.locator('#s-surrounded [data-army]').evaluateAll(a => a.map(x => x.getAttribute('href')));
  ok(hrefs.length === 2 && hrefs.every(h => h.startsWith('builder.html#b=')), 'open row shows American and German builder links');
  const ap = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const aerrs = []; ap.on('pageerror', e => aerrs.push(e.message));
  for (const [id, ar] of armyInfo) {
    for (const side of ['us', 'ge']) {
      const a = ar[side];
      const j = { n: side, l: a.limit, nm: id, a: a.tiles };
      const h = Buffer.from(JSON.stringify(j)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      await ap.goto(url + '#b=' + h);
      await ap.reload();
      const used = await ap.textContent('#ptsUsed');
      ok(Number(used) === a.pts, id + ' ' + side + ' loads ' + a.pts + ' points (got ' + used + ')');
      ok(await ap.locator('.warnings p:not(.bad)').count() === 0, id + ' ' + side + ' has no slot warnings');
    }
  }
  ok(aerrs.length === 0, 'builder: no errors loading scenario armies ' + aerrs.join('|'));
  // every "Find in the game" link returns at least one tile
  const data = JSON.parse(await hp.evaluate(() => JSON.stringify(window.HTS_HISTORY['hon-bro'].entries.filter(e => e.find).map(e => [e.id, e.find.n, e.find.q]))));
  const bad = [];
  const lp = await b.newPage({ viewport: { width: 1280, height: 900 } });
  for (const [id, n, q] of data) {
    await lp.goto(url.replace('builder.html', 'units.html') + '?n=' + n + '&q=' + encodeURIComponent(q));
    await lp.waitForTimeout(150);
    if (await lp.locator('.ucard').count() < 1) bad.push(id + ':' + q);
  }
  ok(bad.length === 0, 'history find links all return tiles ' + bad.join(','));
  await rp.close();
  // tokens page
  const base = url.replace('builder.html', '');
  const tp = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const terrs = []; tp.on('pageerror', e => terrs.push(e.message)); tp.on('console', m => { if (m.type() === 'error') terrs.push(m.text()); });
  await tp.goto(base + 'tokens.html');
  ok(await tp.locator('.hrow').count() === 11, 'tokens page lists 11 entries');
  ok(await tp.locator('.hbody p').count() === 0, 'token text not loaded until opened');
  await tp.locator('.hhead', { hasText: 'Vehicle damage' }).click();
  ok(await tp.locator('.hrow.open .tface').count() === 5, 'vehicle damage shows 5 marker faces');
  await tp.fill('#q', 'suppressed'); await tp.waitForTimeout(300);
  ok((await tp.locator('.hname').first().textContent()).includes('Suppressed'), 'token search finds Suppressed first');
  await tp.fill('#q', ''); await tp.click('[data-group="Turn chart"]');
  ok(await tp.locator('.hrow').count() === 4, 'turn chart group has 4 entries');
  await tp.fill('#q', 'zzzzqq'); await tp.waitForTimeout(300);
  ok(await tp.locator('.empty2').count() === 1, 'tokens no-match message');
  const tlinks = JSON.parse(await tp.evaluate(() => JSON.stringify(window.HTS_TOKENS['hon-bro'].entries.reduce((a, e) => a.concat(e.links.map(l => l.href)), []))));
  const badL = [];
  for (const h of Array.from(new Set(tlinks))) {
    if (!h.startsWith('rules.html')) continue;
    await lp.goto(base + h); await lp.waitForTimeout(250);
    if (await lp.locator('.rrow, .result, .rcard').count() < 1) badL.push(h);
  }
  ok(badL.length === 0, 'token rules links return results ' + badL.join(','));
  ok(terrs.length === 0, 'tokens page: no console errors ' + terrs.join('|'));
  const broken2 = await tp.evaluate(async () => { await new Promise(r => setTimeout(r, 400)); return Array.from(document.images).filter(i => i.complete && i.naturalWidth === 0).length; });
  ok(broken2 === 0, 'tokens page: no broken images');
  // heroes page
  const hrp = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const hrerrs = []; hrp.on('pageerror', e => hrerrs.push(e.message)); hrp.on('console', m => { if (m.type() === 'error') hrerrs.push(m.text()); });
  await hrp.goto(base + 'heroes.html');
  ok(await hrp.locator('.hrow').count() === 8, 'US heroes page lists 8 hero tiles');
  ok(await hrp.locator('.eqcard').count() === 24, 'equipment shows 24 cards across boxes');
  await hrp.click('[data-nation="ge"]');
  ok(await hrp.locator('.hrow').count() === 6, 'German heroes page lists 6 hero tiles');
  await hrp.locator('.hhead', { hasText: 'Ludwig' }).click();
  ok(await hrp.locator('.hrow.open .tchip', { hasText: 'Overwatch' }).count() === 1, 'Ludwig can take Overwatch');
  ok(await hrp.locator('.hrow.open .htile').count() === 1, 'hero tile image shown');
  await hrp.click('[data-nation="us"]');
  await hrp.locator('.hhead', { hasText: 'Oddball' }).click();
  ok(await hrp.locator('.hrow.open .tchip', { hasText: 'Culin' }).count() === 1, 'Oddball can take the Culin Hedgerow Cutter (scenario booklet)');
  await hrp.fill('#q', 'knife'); await hrp.waitForTimeout(300);
  ok(await hrp.locator('.eqcard').count() === 1 && await hrp.locator('.hrow').count() === 0, 'heroes search narrows equipment and heroes');
  ok(hrerrs.length === 0, 'heroes page: no console errors ' + hrerrs.join('|'));
  const hlinks2 = ['rules.html?q=' + encodeURIComponent('heroes characters'), 'rules.html?q=flamethrower', 'rules.html?q=opportunity'];
  const badH = [];
  for (const h of hlinks2) { await lp.goto(base + h); await lp.waitForTimeout(250); if (await lp.locator('.rrow, .result, .rcard').count() < 1) badH.push(h); }
  ok(badH.length === 0, 'heroes rules links return results ' + badH.join(','));

  // heroes box filter and Omaha equipment
  await hrp.fill('#q', ''); await hrp.waitForTimeout(300);
  await hrp.click('[data-box="omaha"]');
  ok(await hrp.locator('.hrow').count() === 2 && await hrp.locator('.eqcard').count() === 5, 'heroes: Bloody Omaha shows 2 US heroes and 5 equipment cards');
  await hrp.click('[data-nation="ge"]');
  ok(await hrp.locator('.hrow').count() === 1, 'heroes: Bloody Omaha German hero is Heinrich');
  await hrp.click('[data-box="bro"]');
  ok(await hrp.locator('.hrow').count() === 3 && await hrp.locator('.eqcard').count() === 13, 'heroes: Big Red One German 3 heroes, 13 equipment cards');
  await hrp.click('[data-nation="us"]'); await hrp.click('[data-box="promo"]');
  ok(await hrp.locator('.hrow').count() === 3 && await hrp.locator('.eqcard').count() === 3, 'heroes: promo filter shows 3 US heroes and 3 promo equipment cards');
  await hrp.click('[data-box="all"]'); await hrp.fill('#q', 'heroic'); await hrp.waitForTimeout(300);
  ok(await hrp.locator('.eqcard', { hasText: 'Heroic' }).count() === 1 && await hrp.locator('.eqcard img').count() === 2, 'heroes: Heroic card has option and marker images');
  const hbroken = await hrp.evaluate(async () => { await new Promise(r => setTimeout(r, 400)); return Array.from(document.images).filter(i => i.complete && i.naturalWidth === 0).length; });
  ok(hbroken === 0, 'heroes page: no broken images');
  const eqImgs = JSON.parse(await hrp.evaluate(() => JSON.stringify(window.HTS_HEROES.equipment.reduce((a, q) => a.concat(q.faces.map(f => f.img)), []))));
  ok(eqImgs.every(f => fs.existsSync(path.join(root, f))), 'every equipment image file exists (' + eqImgs.length + ')');
  await hrp.goto(base + 'heroes.html?b=omaha&n=us&q=horvath'); await hrp.waitForTimeout(300);
  ok(await hrp.locator('.hrow').count() === 1, 'heroes: URL box and search are applied');
  ok(hrerrs.length === 0, 'heroes page after box filter: no console errors ' + hrerrs.join('|'));

  // Bloody Omaha scenarios, tokens and armies
  await sp.goto(base + 'scenarios.html?b=omaha'); await sp.waitForTimeout(300);
  ok(await sp.locator('.hrow').count() === 12, 'omaha scenarios and rules chapters: 12 entries');
  await sp.locator('.hhead', { hasText: 'Part #2' }).first().click();
  ok(await sp.locator('.hrow.open [data-army]').count() === 3, 'omaha part 2 shows 3 builder links');
  const oInfo = JSON.parse(await sp.evaluate(() => JSON.stringify(window.HTS_SCEN['hon-omaha'].entries.filter(e => e.armies).map(e => [e.id, e.armies]))));
  ok(oInfo.length === 4, 'omaha: four scenarios carry armies');
  let oArmies = 0;
  for (const [id, ar] of oInfo) {
    for (const key of Object.keys(ar)) {
      const a = ar[key];
      const j = { n: a.side, l: a.limit, nm: id + ' ' + key, a: a.tiles };
      const h = Buffer.from(JSON.stringify(j)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      await ap.goto(url + '#b=' + h); await ap.reload();
      const used = await ap.textContent('#ptsUsed');
      ok(Number(used) === a.pts, 'omaha ' + id + ' ' + key + ' loads ' + a.pts + ' points (got ' + used + ')');
      ok(await ap.locator('.warnings p:not(.bad)').filter({ hasNotText: 'SP instead of a cost' }).count() === 0, 'omaha ' + id + ' ' + key + ' has no slot warnings');
      oArmies++;
    }
  }
  ok(oArmies === 11, 'omaha: 11 armies loaded');
  ok(serrs.length === 0 && aerrs.length === 0, 'omaha scenarios and armies: no console errors ' + serrs.concat(aerrs).join('|'));
  await tp.goto(base + 'tokens.html?b=omaha'); await tp.waitForTimeout(300);
  ok(await tp.locator('.hrow').count() === 14, 'omaha tokens: 14 entries');
  await tp.locator('.hhead', { hasText: 'Haystack' }).first().click();
  ok(await tp.locator('.hrow.open .tface').count() >= 1, 'omaha token opens with faces');
  const otImgs = JSON.parse(await tp.evaluate(() => JSON.stringify(window.HTS_TOKENS['hon-omaha'].entries.reduce((a, e) => a.concat(e.faces.map(f => f.img)), []))));
  ok(otImgs.every(f => fs.existsSync(path.join(root, f))), 'every omaha token image exists (' + otImgs.length + ')');
  const scImgs = JSON.parse(await sp.evaluate(() => JSON.stringify(window.HTS_SCEN['hon-omaha'].entries.reduce((a, e) => a.concat((e.figs || []).map(f => f.img)), []))));
  ok(scImgs.length > 0 && scImgs.every(f => fs.existsSync(path.join(root, f))), 'every omaha scenario figure exists (' + scImgs.length + ')');
  ok(terrs.length === 0, 'omaha tokens: no console errors ' + terrs.join('|'));
  await tp.goto(base + 'tokens.html?b=hos'); await tp.waitForTimeout(300);
  ok(await tp.locator('.hrow').count() === 13, 'hos tokens: 13 entries');
  const hsImgs = JSON.parse(await tp.evaluate(() => JSON.stringify(window.HTS_TOKENS['hon-hos'].entries.reduce((a, e) => a.concat(e.faces.map(f => f.img)), []))));
  ok(hsImgs.length > 20 && hsImgs.every(f => fs.existsSync(path.join(root, f))), 'every hos token image exists (' + hsImgs.length + ')');
  ok(/Heroes of Stalingrad/.test(await tp.locator('#subtitle').innerText()), 'hos tokens: subtitle names Heroes of Stalingrad');
  await tp.goto(base + 'tokens.html?b=caen'); await tp.waitForTimeout(300);
  ok(await tp.locator('.hrow').count() === 13, 'caen tokens: 13 entries');
  const ctImgs = JSON.parse(await tp.evaluate(() => JSON.stringify(window.HTS_TOKENS['hon-caen'].entries.reduce((a, e) => a.concat(e.faces.map(f => f.img)), []))));
  ok(ctImgs.length === 48 && ctImgs.every(f => fs.existsSync(path.join(root, f))), 'every caen token image exists (' + ctImgs.length + ')');

  // Battle Event cards viewer
  await tp.goto(base + 'cards.html'); await tp.waitForTimeout(500);
  const cd = await tp.evaluate(() => { const e = window.HTS_CARDS['hon-bro'].entries; return { n: e.length, c: e.reduce((a, x) => a + x.copies, 0), tiles: document.querySelectorAll('.ccard').length, imgs: e.reduce((a, x) => a.concat([x.img, x.thumb]), []) }; });
  ok(cd.n === 62 && cd.c === 100 && cd.tiles === 62, 'cards: 62 different cards, 100 in the box, all shown');
  ok(cd.imgs.every(f => fs.existsSync(path.join(root, f))), 'cards: every picture exists (' + cd.imgs.length + ')');
  await tp.fill('#q', 'suppressed'); await tp.waitForTimeout(300);
  const cs = await tp.evaluate(() => document.querySelectorAll('.ccard').length);
  ok(cs > 5 && cs < 62, 'cards: search narrows the list (' + cs + ')');
  await tp.fill('#q', ''); await tp.click('[data-side=ge]'); await tp.waitForTimeout(200);
  ok(await tp.evaluate(() => document.querySelectorAll('.ccard').length) === 31, 'cards: German side has 31 different cards');
  await tp.click('.ccard'); await tp.waitForTimeout(200);
  ok(await tp.evaluate(() => !document.getElementById('lbx').hidden && /Burst/.test(document.getElementById('lbxCap').textContent) && document.getElementById('lbxDl').getAttribute('href').endsWith('.webp')), 'cards: full size view opens with a download link');
  await tp.click('#lbxClose');
  { const ordr = await tp.evaluate(() => [...new Set(window.HTS_CARDS['hon-bro'].entries.filter(e => e.phase === 'Order').map(e => e.name))].sort().join(','));
    ok(ordr === 'Communications Scrambled,Confusion,Dynamic,High Command,Ready!,Tactician', 'cards: the Order group holds the cards that act on Order Tokens (' + ordr + ')'); }

  // My collection filter in the builder
  await tp.goto(base + 'builder.html'); await tp.evaluate(() => { try { localStorage.removeItem('hts.hon.own.v1'); } catch (e) {} }); await tp.reload(); await tp.waitForTimeout(400);
  const own0 = await tp.locator('.lcard').count();
  ok((await tp.textContent('#btnOwn')).trim() === 'My collection' && await tp.locator('.setup #btnOwn').count() === 0, 'collection: builder uses the header button only, not set by default');
  await tp.click('#btnOwn');
  ok(await tp.locator('details.ownsec').count() >= 5 && await tp.locator('details.ownsec[open]').count() === 0, 'collection: every group starts collapsed');
  await tp.click('summary:has-text("HoN: Big Red One")'); await tp.check('[data-own="CB"]'); await tp.click('#ownNone'); await tp.waitForTimeout(100);
  ok(await tp.locator('details.ownsec[open]').count() === 1 && await tp.locator('[data-own="CB"]').isVisible(), 'collection: Clear keeps the open group open');
  await tp.check('[data-own="CB"]');
  ok(/^1 of \d+$/.test(await tp.locator('details.ownsec[open] summary .count').textContent()), 'collection: the group count updates as soon as a box is ticked');
  await tp.click('#ownClose'); await tp.waitForTimeout(200);
  const own1 = await tp.locator('.lcard').count();
  ok(own0 > own1 && own1 === 6, 'collection: only Big Red One tiles after ticking CB (' + own0 + ' to ' + own1 + ')');
  ok(/\(1\)/.test(await tp.textContent('#btnOwn')) && /hidden because of My collection/.test(await tp.locator('#ownnote').innerText()), 'collection: header button shows the count and the builder says how many tiles are hidden');
  await tp.locator('.lcard', { hasText: 'Rifle Platoon' }).first().locator('[data-add]').click();
  await tp.locator('.atile .slot').first().click();
  const pk1 = await tp.locator('.pcard').count();
  await tp.check('#pickOwn'); const pk2 = await tp.locator('.pcard').count();
  ok(pk2 >= pk1, 'collection: picker can show options not owned (' + pk1 + ' to ' + pk2 + ')');
  await tp.keyboard.press('Escape');
  await tp.click('#btnOwn'); await tp.click('#ownNone'); await tp.click('#ownClose'); await tp.waitForTimeout(200);
  ok(await tp.locator('.lcard').count() === own0, 'collection: clearing the ticks shows everything again');
  await tp.evaluate(() => { try { localStorage.removeItem('hts.hon.own.v1'); localStorage.removeItem('hts.hon.bro.v1'); } catch (e) {} });

  // Aircraft tiles, Support tile and M10 in the builder
  await tp.goto(base + 'builder.html'); await tp.evaluate(() => { try { localStorage.removeItem('hts.hon.own.v1'); localStorage.removeItem('hts.hon.bro.v1'); } catch (e) {} }); await tp.reload(); await tp.waitForTimeout(400);
  await tp.click('[data-type=aircraft]'); await tp.waitForTimeout(150);
  ok(await tp.locator('.lcard').count() === 2, 'builder: 2 US aircraft tiles (Thunderbolt, Mustang)');
  await tp.locator('.lcard', { hasText: 'Thunderbolt' }).first().locator('[data-add]').click();
  ok((await tp.textContent('#ptsUsed')) === '55', 'builder: Thunderbolt costs 55');
  tp.once('dialog', d => d.accept());
  await tp.click('[data-nation="uk"]'); await tp.click('[data-type=support]'); await tp.waitForTimeout(150);
  await tp.locator('.lcard', { hasText: 'Support' }).first().locator('[data-add]').click();
  await tp.locator('.atile .slot').first().click();
  ok(await tp.locator('.pcard', { hasText: 'Artillery' }).count() >= 1 && await tp.locator('.pcard').count() > 20, 'builder: Support tile slot takes any option');
  await tp.locator('.pcard', { hasText: 'Artillery' }).first().click();
  ok((await tp.textContent('#ptsUsed')) === '30', 'builder: Support tile with Artillery costs 30');
  tp.once('dialog', d => d.accept());
  await tp.click('[data-nation="us"]');
  const m10 = JSON.parse(await tp.evaluate(() => JSON.stringify(window.HTS_DATA['hon-bro-us'].options.filter(o => o.id === 'm10_a1').map(o => [o.cost, o.size]))));
  ok(m10.length === 1 && m10[0][0] === 60, 'builder: M10 Tank Destroyer option (60) is in the US data');
  const air = JSON.parse(await tp.evaluate(() => JSON.stringify(['us', 'ge', 'uk'].map(n => window.HTS_DATA['hon-bro-' + n].tiles.filter(t => t.type === 'aircraft').map(t => t.cost)))));
  ok(JSON.stringify(air) === '[[55,50],[60,40],[50,50]]', 'builder: aircraft costs ' + JSON.stringify(air));
  await tp.evaluate(() => { try { localStorage.removeItem('hts.hon.bro.v1'); } catch (e) {} });

  // Battle Pack #3 (Windsor & Jupiter) units
  await tp.goto(base + 'units.html'); await tp.waitForTimeout(300);
  const wj = JSON.parse(await tp.evaluate(() => JSON.stringify(['ge', 'uk'].map(n => { const d = window.HTS_DATA['hon-bro-' + n]; return [d.tiles.filter(t => t.set === 'BP3').length, d.options.filter(o => o.set === 'BP3').length, d.tiles.filter(t => t.set === 'BP3').every(t => t.slots.length > 0 && t.cost > 0)]; }))));
  ok(wj[0][0] === 5 && wj[0][1] === 15 && wj[1][0] === 4 && wj[1][1] === 12 && wj[0][2] && wj[1][2], 'Battle Pack 3: 9 tiles and 27 options with slots and costs');
  const wjImgs = JSON.parse(await tp.evaluate(() => JSON.stringify(['ge', 'uk'].reduce((a, n) => { const d = window.HTS_DATA['hon-bro-' + n]; d.tiles.concat(d.options).filter(x => x.set === 'BP3').forEach(x => { a.push(x.img); Object.values(x.uimg || {}).forEach(u => a.push(u)); }); return a; }, []))));
  ok(wjImgs.length > 60 && wjImgs.every(f => fs.existsSync(path.join(root, f))), 'every Battle Pack 3 image exists (' + wjImgs.length + ')');

  // Battle for Caen scenarios and armies
  await sp.goto(base + 'scenarios.html?b=caen'); await sp.waitForTimeout(300);
  ok(await sp.locator('.hrow').count() === 8, 'caen scenarios: 8 entries');
  const cInfo = JSON.parse(await sp.evaluate(() => JSON.stringify(window.HTS_SCEN['hon-caen'].entries.filter(e => e.armies).map(e => [e.id, e.armies]))));
  ok(cInfo.length === 7, 'caen: seven scenarios carry armies');
  let cArmies = 0;
  for (const [id, ar] of cInfo) {
    for (const key of Object.keys(ar)) {
      const a = ar[key];
      const j = { n: a.side, l: a.limit, nm: id + ' ' + key, a: a.tiles };
      const h = Buffer.from(JSON.stringify(j)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      await ap.goto(url + '#b=' + h); await ap.reload();
      const used = await ap.textContent('#ptsUsed');
      ok(Number(used) === a.pts, 'caen ' + id + ' ' + key + ' loads ' + a.pts + ' points (got ' + used + ')');
      ok(await ap.locator('.warnings p:not(.bad)').filter({ hasNotText: 'SP instead of a cost' }).count() === (id === 'beavertails' && key === 'ge' ? 1 : 0), 'caen ' + id + ' ' + key + ' has no slot warnings' + (id === 'beavertails' && key === 'ge' ? ' except the Magnetic Mine (black and white stripes) the booklet puts in a black and yellow slot' : ''));
      cArmies++;
    }
  }
  ok(cArmies === 16, 'caen: 16 armies loaded');
  const cImgs = JSON.parse(await sp.evaluate(() => JSON.stringify(window.HTS_SCEN['hon-caen'].entries.reduce((a, e) => a.concat((e.figs || []).map(f => f.img)), []))));
  ok(cImgs.length === 7 && cImgs.every(f => fs.existsSync(path.join(root, f))), 'every caen scenario figure exists (' + cImgs.length + ')');

  // expansions page
  const xp = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const xerrs = []; xp.on('pageerror', e => xerrs.push(e.message)); xp.on('console', m => { if (m.type() === 'error') xerrs.push(m.text()); });
  await xp.goto(base + 'expansions.html');
  ok(await xp.locator('.hrow').count() === 131, 'expansions: 131 products listed');
  ok(await xp.locator('.hbody p').count() === 0, 'expansions: details not loaded until opened');
  ok(await xp.locator('#guide .eqcard').count() === 6, 'expansions: 6 starter force notes shown');
  await xp.click('[data-line="hon2"]');
  ok(await xp.locator('.hrow').count() === 14, 'expansions: Heroes of Normandie V2 has 14 products');
  await xp.click('[data-cat="tool"]');
  ok(await xp.locator('.hrow').count() === 9, 'expansions: 4 V2 boxes and 5 War Stories are in the tool');
  await xp.locator('.hhead', { hasText: 'Bloody Omaha' }).click();
  ok(await xp.locator('.hrow.open .hfind a').count() === 8, 'expansions: Bloody Omaha shows 8 tool links');
  await xp.click('[data-line="all"]'); await xp.click('[data-cat="all"]');
  await xp.fill('#q', 'commonwealth'); await xp.waitForTimeout(300);
  ok((await xp.locator('.hname').first().textContent()).includes('Army Box CW'), 'expansions: search finds the Commonwealth army box');
  ok(await xp.locator('#guide').count() === 0, 'expansions: starter notes hidden while searching');
  await xp.locator('.hhead', { hasText: 'Army Box CW' }).click();
  ok(await xp.locator('.hrow.open .xfig img').count() === 1, 'expansions: opened entry shows its preview image');
  ok(await xp.locator('.hrow.open [data-guide]').count() === 2, 'expansions: Army Box CW links to 2 starter force notes');
  await xp.fill('#q', ''); await xp.waitForTimeout(300);
  await xp.locator('.hrow.open [data-guide]').first().click();
  ok(await xp.locator('#guide-0').count() === 1, 'expansions: starter force link jumps to the note');
  await xp.locator('#guide-0 [data-open="hon1-pegasus-bridge"]').click();
  ok(await xp.locator('#x-hon1-pegasus-bridge.open').count() === 1, 'expansions: note chip opens the product');
  await xp.click('[data-cat="Gazette"]');
  ok(await xp.locator('.hrow').count() > 5, 'expansions: type filter works');
  await xp.fill('#q', 'zzzzqq'); await xp.waitForTimeout(300);
  ok(await xp.locator('.empty2').count() === 1, 'expansions: no-match message');
  const xhtml = fs.readFileSync(path.join(root, 'data/expansions.js'), 'utf8') + fs.readFileSync(path.join(root, 'expansions.html'), 'utf8');
  ok(!/devil-pig-games\.com|forum/i.test(xhtml.replace(/Devil Pig Games\./g, '')), 'expansions: no forum or Devil Pig site links');
  const xImgs = JSON.parse(await xp.evaluate(() => JSON.stringify(window.HTS_EXPANSIONS.lines.reduce((a, l) => a.concat(l.items.reduce((b, i) => b.concat((i.imgs || []).map(f => f.img)), [])), []))));
  ok(xImgs.length === 25 && xImgs.every(f => fs.existsSync(path.join(root, f))), 'expansions: every preview image exists (' + xImgs.length + ')');
  ok(xerrs.length === 0, 'expansions page: no console errors ' + xerrs.join('|'));
  const navMiss = [];
  for (const pg of ['index', 'units', 'rules', 'scenarios', 'scenario', 'tokens', 'icons', 'heroes', 'maps', 'history']) {
    if (!fs.readFileSync(path.join(root, pg + '.html'), 'utf8').includes('href="expansions.html"')) navMiss.push(pg);
  }
  ok(navMiss.length === 0, 'expansions link is in every menu ' + navMiss.join(','));

  // maps page
  const mpg = await b.newPage({ viewport: { width: 1360, height: 900 } });
  const mperrs = []; mpg.on('pageerror', e => mperrs.push(e.message)); mpg.on('console', m => { if (m.type() === 'error') mperrs.push(m.text()); });
  mpg.on('dialog', d => d.accept());
  await mpg.goto(base + 'maps.html'); await mpg.waitForTimeout(400);
  ok(await mpg.locator('.mcard').count() === 16, 'maps: Big Red One lists 16 pieces');
  await mpg.locator('.mcard', { hasText: 'Board C1' }).locator('[data-add]').click();
  await mpg.locator('.mcard', { hasText: 'Board C2' }).locator('[data-add]').click();
  ok(await mpg.locator('.mp').count() === 2, 'maps: two boards placed');
  const mpos = await mpg.evaluate(() => HTS_MAPS_UI.state.map.items.map(i => [i.x, i.y]));
  ok(JSON.stringify(mpos) === '[[0,0],[7,0]]', 'maps: boards go side by side on 7 square steps');
  await mpg.locator('.mcard', { hasText: 'House A-01' }).locator('[data-add]').click();
  const hb = await mpg.locator('.mp').last().boundingBox();
  await mpg.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2); await mpg.mouse.down();
  await mpg.mouse.move(hb.x + hb.width / 2 + 120, hb.y + hb.height / 2 + 90, { steps: 6 }); await mpg.mouse.up();
  const moved = await mpg.evaluate(() => { const i = HTS_MAPS_UI.state.map.items[2]; return i.x !== 0 || i.y !== 0; });
  ok(moved, 'maps: piece drags');
  await mpg.keyboard.press('f');
  ok(await mpg.evaluate(() => HTS_MAPS_UI.state.map.items[2].s) === 'b', 'maps: F flips the side');
  await mpg.keyboard.press('r');
  ok(await mpg.evaluate(() => HTS_MAPS_UI.state.map.items[2].r) === 1, 'maps: R rotates');
  await mpg.keyboard.press('Control+z'); await mpg.keyboard.press('Control+z');
  ok(await mpg.evaluate(() => { const i = HTS_MAPS_UI.state.map.items[2]; return i.r === 0 && i.s === 'a'; }), 'maps: undo restores rotation and side');
  const enc = await mpg.evaluate(() => HTS_MAPS_UI.encode());
  const mp2 = await b.newPage({ viewport: { width: 1200, height: 800 } });
  await mp2.goto(base + 'maps.html#m=' + enc); await mp2.waitForTimeout(400);
  ok(await mp2.locator('.mp').count() === 3, 'maps: share link restores the map');
  await mpg.click('[data-box="omaha"]');
  ok(await mpg.locator('.mcard').count() === 22, 'maps: Omaha lists 22 pieces (6 double-sided boards)');
  ok(await mpg.locator('#groups .chip').count() === 6, 'maps: Omaha offers 5 types plus All types');
  await mpg.click('[data-group="Roads and rivers"]');
  ok(await mpg.locator('.mcard').count() === 7, 'maps: type filter narrows to roads');
  await mpg.click('[data-box="all"]');
  ok(await mpg.locator('.mcard').count() === 88, 'maps: all boxes lists 88 pieces');
  await mpg.click('[data-group="Roads and rivers"]');
  ok(await mpg.locator('.mcard').count() === 15, 'maps: all boxes with Roads and rivers shows 15');
  await mpg.click('[data-group="Houses and buildings"]');
  ok(await mpg.locator('.mcard').count() === 15, 'maps: all boxes houses and buildings (3 + 7 + 5)');
  await mpg.click('[data-box="bro"]');
  await mpg.click('[data-group="Defensive positions"]');
  ok(await mpg.locator('.mcard').count() === 6, 'maps: Big Red One has 6 tiles with a defensive position');
  await mpg.click('[data-group="Ponds"]');
  ok(await mpg.locator('.mcard').count() === 1, 'maps: one tile has a pond');
  ok((await mpg.locator('.mcard').first().innerText()).includes('A: Pond. B: Rocks.'), 'maps: card names what each side shows');
  await mpg.click('[data-box="omaha"]');
  await mpg.click('[data-group="Roads and rivers"]');
  await mpg.fill('#q', 'beach'); await mpg.waitForTimeout(300);
  ok(await mpg.locator('.mcard').count() === 0, 'maps: search within a group');
  await mpg.fill('#q', ''); await mpg.waitForTimeout(250);
  await mpg.click('[data-box="bro"]');
  await mpg.locator('.mcard', { hasText: 'Board C1' }).locator('[data-add]').click();
  ok(await mpg.locator('#mwarn p').count() >= 1, 'maps: copy count warning');
  await mpg.fill('#q', '');
  await mpg.locator('.mcard', { hasText: 'House C-01' }).locator('.mthumb').click();
  ok(await mpg.locator('#mmodal:not([hidden]) img').count() === 2, 'maps: viewer shows both sides');
  await mpg.keyboard.press('Escape');
  const mh = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await mh.goto(base + 'maps.html?b=hos'); await mh.waitForTimeout(400);
  ok(await mh.locator('.mcard').count() === 8 && /Stalingrad/.test(await mh.locator('#subtitle').innerText()), 'maps: Heroes of Stalingrad lists 8 boards');
  ok((await mh.locator('.mcard').first().innerText()).includes('CB1-A') && (await mh.locator('.mcard').nth(7).innerText()).includes('BP2-B'), 'maps: Stalingrad boards show the printed corner marks');
  await mh.locator('.mcard', { hasText: 'Board CB3' }).locator('.mthumb').click();
  ok((await mh.locator('#mmodal figcaption').allInnerTexts()).join('|') === 'Side A, CB3-A|Side B, CB3-B', 'maps: Stalingrad viewer names both sides by their marks');
  await mh.close();
  await mpg.fill('#mname', 'Smoke map'); await mpg.click('#bSave');
  ok(await mpg.locator('.msv').count() === 1, 'maps: map saved');
  const [dl] = await Promise.all([mpg.waitForEvent('download'), mpg.click('#bPng')]);
  ok(dl.suggestedFilename() === 'smoke-map.png', 'maps: picture downloads');
  const mbroken = await mpg.evaluate(() => Array.from(document.images).filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).length);
  ok(mbroken === 0, 'maps: no broken images');
  const allMap = await mpg.evaluate(() => { const bad = []; HTS_MAPS.boxes.forEach(b => b.pieces.forEach(p => { ['a', 'b', 't'].forEach(k => { if (p[k]) bad.push('img/hon/maps/' + b.id + '/' + p[k]); }); })); return bad; });
  const missing = [];
  for (const u of allMap) { const r = await mpg.request.get(base + u); if (r.status() !== 200) missing.push(u); }
  ok(missing.length === 0, 'maps: every piece image exists (' + allMap.length + ') ' + missing.join(','));
  const mm = await b.newPage({ viewport: { width: 390, height: 800 } });
  await mm.goto(base + 'maps.html'); await mm.waitForTimeout(300);
  await mm.locator('.mcard', { hasText: 'Board C3' }).locator('[data-add]').click(); await mm.waitForTimeout(250);
  ok(await mm.locator('#stage').isVisible() && await mm.evaluate(() => document.documentElement.scrollWidth) <= 390, 'maps: phone switches to the map without sideways scroll');
  ok(mperrs.length === 0, 'maps: no console errors ' + mperrs.join('|'));
  const mdat = JSON.parse(await mpg.evaluate(() => JSON.stringify(window.HTS_MAPS)));
  const allBoards = mdat.boxes.reduce((a, bx) => a.concat(bx.pieces.filter(p => p.kind === 'board')), []);
  ok(allBoards.length === 32 && allBoards.every(p => p.ma && p.mb), 'maps: every board carries its printed corner marks (' + allBoards.length + ')');
  ok(mdat.boxes.some(bx => bx.id === 'omaha' && bx.pieces.some(p => p.id === 'ob5' && p.mb === 'OB4-B')), 'maps: OB5 side B keeps its printed OB4-B mark');
  ok(mdat.boxes.some(bx => bx.id === 'bro' && bx.pieces.filter(p => /^House [ABC]-01/.test(p.name)).length === 3) && mdat.boxes.some(bx => bx.id === 'omaha' && bx.pieces.filter(p => /^Landing craft 0[1-6]$/.test(p.name)).length === 6), 'maps: houses and landing craft are named by their printed marks');
  // icon glossary and rules compendium
  const ip = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const iperrs = []; ip.on('pageerror', e => iperrs.push(e.message)); ip.on('console', m => { if (m.type() === 'error') iperrs.push(m.text()); });
  await ip.goto(base + 'icons.html'); await ip.waitForTimeout(300);
  ok(await ip.locator('.gcard').count() === 95, 'icons: 95 entries across all four boxes');
  await ip.goto(base + 'icons.html?b=hos'); await ip.waitForTimeout(300);
  ok(await ip.locator('.gcard').count() === 32 && await ip.locator('.gcard a[href^="rules.html"]').count() === 0, 'icons: Heroes of Stalingrad has 32 entries and no rules links');
  await ip.fill('#q', 'sniper'); await ip.waitForTimeout(250);
  ok(await ip.locator('.gcard').count() === 1 && await ip.locator('.gcard img').count() >= 1, 'icons: search finds Sniper with its picture');
  await ip.fill('#q', ''); await ip.locator('#boxes [data-box="omaha"]').click();
  ok(await ip.locator('.gcard').count() === 17, 'icons: Bloody Omaha has 17 entries');
  await ip.locator('#boxes [data-box="caen"]').click();
  ok(await ip.locator('.gcard').count() === 13, 'icons: Battle for Caen has 13 entries');
  await ip.locator('#boxes [data-box="omaha"]').click();
  await ip.locator('#groups [data-group="Terrain effects"]').click();
  ok(await ip.locator('.gcard').count() === 6, 'icons: Omaha terrain filter shows 6');
  const ibroken = await ip.evaluate(() => Array.from(document.images).filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).length);
  ok(ibroken === 0, 'icons: no broken images');
  const iconFiles = await ip.evaluate(() => { const o = []; Object.keys(HTS_ICONS).forEach(k => HTS_ICONS[k].entries.forEach(e => e.icons.forEach(i => o.push(i.img)))); return o; });
  const imiss = []; for (const u of iconFiles) { const r = await ip.request.get(base + u); if (r.status() !== 200) imiss.push(u); }
  ok(imiss.length === 0, 'icons: every icon file exists (' + iconFiles.length + ')');
  ok(iperrs.length === 0, 'icons: no console errors ' + iperrs.join('|'));
  const rq = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const rqerrs = []; rq.on('pageerror', e => rqerrs.push(e.message)); rq.on('console', m => { if (m.type() === 'error') rqerrs.push(m.text()); });
  await rq.goto(base + 'rules.html?b=omaha'); await rq.waitForTimeout(300);
  ok(await rq.locator('.rlink').count() >= 14, 'rules: Omaha sections listed');
  await rq.fill('#q', 'bangalore'); await rq.waitForTimeout(250);
  ok(await rq.locator('.rcard').count() >= 1, 'rules: Omaha search finds Bangalores');
  await rq.fill('#q', 'landing table'); await rq.waitForTimeout(250);
  await rq.locator('.rtitle').first().click(); await rq.waitForTimeout(250);
  ok(await rq.locator('#rmodal .rtable tbody tr').count() === 3, 'rules: landing table renders 3 rows');
  await rq.goto(base + 'rules.html?b=omaha&q=minefield'); await rq.waitForTimeout(250);
  ok(await rq.locator('.rthumbs img').count() >= 1, 'rules: search card shows a figure thumbnail');
  await rq.locator('.rtitle').first().click(); await rq.waitForTimeout(400);
  ok(await rq.locator('#rmodal .rfig img').count() >= 1, 'rules: section shows its figure');
  await rq.goto(base + 'rules.html?b=bro&q=howitzer'); await rq.waitForTimeout(250);
  ok(await rq.locator('.rcard').count() >= 1, 'rules: Big Red One search still works');
  const figAll = await rq.evaluate(() => { const o = []; ['hon-bro', 'hon-omaha'].forEach(k => HTS_RULES[k].chunks.forEach(c => (c.figs || []).forEach(f => o.push(f.img)))); return o; });
  const fmiss = []; for (const u of figAll) { const r = await rq.request.get(base + u); if (r.status() !== 200) fmiss.push(u); }
  ok(figAll.length > 60 && fmiss.length === 0, 'rules: every figure file exists (' + figAll.length + ')');
  ok(rqerrs.length === 0, 'rules: no console errors ' + rqerrs.join('|'));
  // scenario reader: full web versions, page images, PDFs
  const rd = await b.newPage({ viewport: { width: 390, height: 844 } });
  const rderrs = []; rd.on('pageerror', e => rderrs.push(e.message)); rd.on('console', m => { if (m.type() === 'error') rderrs.push(m.text()); });
  const fullData = await rd.goto(base + 'scenario.html?b=bro&s=plain').then(() => rd.evaluate(() => JSON.parse(JSON.stringify(window.HTS_SCEN_FULL))));
  const wanted = { bro: ['rules', 'free', 'multi', 'plain', 'chicken', 'night', 'caumont', 'quesnay', 'surrounded', 'windy', 'pass', 'tracker'], omaha: ['intro', 'rules-battlefield', 'rules-special', 'rules-abilities', 'rules-recruitment', 'rules-aviation', 'landings', 'part1', 'part2', 'little', 'big', 'icons'], caen: ['tradingblows', 'lightbrigade', 'beavertails', 'zuruck', 'charon', 'operationstack', 'safari', 'campaignreport'] };
  for (const bx of Object.keys(wanted)) {
    const f = fullData['hon-' + bx];
    ok(f && wanted[bx].every(id => f.entries[id] && f.entries[id].blocks.length > 10), bx + ': every scenario has a full web version');
    for (const pdf of f.book.pdfs) { const st = fs.statSync(path.join(root, pdf.href)); ok(st.size > 1e6, bx + ': PDF stored in the repo ' + pdf.href); }
    const need = []; for (let n = 1; n <= f.book.pages.n; n++) ['p', 't'].forEach(k => need.push(f.book.pages.dir + k + String(n).padStart(2, '0') + '.webp'));
    ok(need.every(u => fs.existsSync(path.join(root, u))), bx + ': page images and thumbnails for all ' + f.book.pages.n + ' pages exist');
    const figs = []; wanted[bx].forEach(id => f.entries[id].blocks.forEach(bl => { if (bl.k === 'fig') figs.push(bl.img); }));
    ok(figs.length >= wanted[bx].length - 3 && figs.every(u => fs.existsSync(path.join(root, u))), bx + ': every figure file exists (' + figs.length + ')');
    ok(wanted[bx].every(id => f.entries[id].blocks.some(bl => bl.k === 'pg')), bx + ': every scenario carries booklet page markers');
    for (const id of wanted[bx]) {
      await rd.goto(base + 'scenario.html?b=' + bx + '&s=' + id); await rd.waitForTimeout(150);
      const info = await rd.evaluate(() => ({ h1: (document.querySelector('.stitle') || {}).textContent, n: document.querySelectorAll('.sbody > *').length, pg: document.querySelectorAll('.pgmark').length, dl: document.querySelectorAll('.sdl a[download]').length, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      ok(info.h1 && info.n > 10 && info.pg >= 1 && info.dl >= 1, bx + '/' + id + ': renders text, page markers and download link');
      ok(info.sw <= info.cw + 1, bx + '/' + id + ': no sideways scroll on a phone');
    }
  }
  // Omaha booklet: every page 1 to 24 has a marker in a full entry, and the rules entries carry text for the new chapters
  const omf = fullData['hon-omaha'];
  const omPg = new Set(); Object.values(omf.entries).forEach(e => e.blocks.forEach(bl => { if (bl.k === 'pg') omPg.add(bl.n); }));
  const omMissing = []; for (let n = 1; n <= 24; n++) if (!omPg.has(n)) omMissing.push(n);
  ok(omMissing.length === 0, 'omaha: every booklet page 1 to 24 has a page marker in a web entry (missing: ' + omMissing.join(',') + ')');
  const omText = id => omf.entries[id].blocks.map(bl => (bl.t || '') + ' ' + (bl.items || []).join(' ')).join(' ');
  ok(/Minefield/.test(omText('rules-recruitment')) && /Speed Penalty/.test(omText('rules-aviation')) && /Transport capacity of 7/.test(omText('rules-special')) && /Trenches/.test(omText('rules-battlefield')) && /Barrage order/.test(omText('rules-abilities')) && /Cota/.test(omText('intro')) && /Minesweeper/.test(omText('icons')), 'omaha: rules chapters carry their text');
  const omRs = await rd.goto(base + 'scenario.html?b=omaha&s=rules-recruitment').then(() => rd.evaluate(() => ({ h4: document.querySelectorAll('.sbody h4').length, h3: document.querySelectorAll('.sbody h3').length, pm: document.querySelectorAll('.pgmark').length })));
  ok(omRs.h4 >= 15 && omRs.h3 >= 5 && omRs.pm === 4, 'omaha recruitment options entry renders sub headings and four page markers (' + JSON.stringify(omRs) + ')');
  // rules page: pictures sit under the right rules
  const omRulePics = await rq.evaluate(() => { const o = {}; HTS_RULES['hon-omaha'].chunks.forEach(c => { if (c.sub) o[c.sub] = (c.figs || []).map(f => f.img.split('/').pop()); }); return o; });
  ok(omRulePics['Trenches'].join() === 'p5-4.webp,p5-6.webp' && omRulePics['Difficult terrain'].join() === 'p5-2.webp' && omRulePics['Streams'].join() === 'p5-3.webp' && omRulePics['Shovels'].join() === 'p10-1.webp' && omRulePics['Mounds'].join() === 'p4-5.webp,p5-1.webp', 'omaha rules: pictures match their rules');
  await rd.goto(base + 'scenario.html?b=bro&s=plain'); await rd.waitForTimeout(200);
  await rd.locator('.pgmark button').first().click(); await rd.waitForTimeout(200);
  ok(await rd.locator('#lbx:not([hidden])').count() === 1, 'page marker opens the original page');
  await rd.keyboard.press('Escape');
  ok(await rd.locator('#lbx[hidden]').count() === 1, 'lightbox closes with Escape');
  await rd.goto(base + 'scenarios.html?b=omaha'); await rd.waitForTimeout(250);
  ok((await rd.locator('#dlbar a[download]').count()) >= 1, 'scenarios index offers the PDF download');
  await rd.locator('.hrow').first().locator('.hhead, button').first().click(); await rd.waitForTimeout(200);
  ok(await rd.locator('a[data-read]').count() >= 1, 'scenarios index links to the full scenario');
  ok(rderrs.length === 0, 'scenario reader: no console errors ' + rderrs.join('|'));
  // images load
  const broken = await pg.evaluate(() => Array.from(document.images).filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).length);
  ok(broken === 0, 'no broken images');
  // mobile
  await pg.setViewportSize({ width: 390, height: 800 });
  ok(await pg.isVisible('#tabLib'), 'mobile tabs visible');
  await pg.screenshot({ path: process.env.SHOT || '/tmp/h/shot-mobile.png' });
  ok(errs.length === 0, 'no console errors ' + errs.join('|'));
  // landing page and box pages
  const hm = await b.newPage({ viewport: { width: 390, height: 844 } });
  const hmerrs = []; hm.on('pageerror', e => hmerrs.push(e.message)); hm.on('console', m => { if (m.type() === 'error') hmerrs.push(m.text()); });
  await hm.goto(base + 'index.html'); await hm.waitForTimeout(300);
  ok(await hm.locator('#boxGrid .boxcard').count() === 5 && await hm.locator('#boxGrid .boxcard[href="box.html?b=hos"]').count() === 1 && await hm.locator('#boxGrid .boxcard[href="box.html?b=ws"]').count() === 1 && await hm.locator('#boxGrid .boxcard[href="box.html?b=hon1"]').count() === 1 && await hm.locator('.hero-link[href="box.html?b=bro"]').count() === 1, 'landing: Big Red One as the main box, two battle packs, War Stories, Heroes of Stalingrad and the first edition as option tiles');
  ok(await hm.locator('.gocard').count() === 12, 'landing: twelve shortcuts');
  await hm.waitForFunction(() => Array.from(document.querySelectorAll('.boxcard img, .hero-art')).every(i => i.complete && i.naturalWidth > 0), null, { timeout: 8000 }).catch(() => {});
  ok((await hm.locator('.boxcard img').evaluateAll(a => a.every(i => i.complete && i.naturalWidth > 0))) && (await hm.locator('.hero-art').evaluate(i => i.complete && i.naturalWidth > 0)), 'landing: box art loads');
  ok(await hm.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), 'landing: no sideways scroll on a phone');
  const gohrefs = await hm.locator('.gocard').evaluateAll(a => a.map(x => x.getAttribute('href')));
  const missingPages = gohrefs.filter(h => !fs.existsSync(path.join(root, h.split('?')[0])));
  ok(missingPages.length === 0, 'landing: every shortcut goes to a page that exists ' + missingPages.join(','));
  await hm.goto(base + 'box.html?b=bro'); await hm.goto(base + 'index.html#b=abc'); await hm.waitForTimeout(300);
  ok(/builder\.html/.test(hm.url()), 'old army links on index.html#b= forward to the builder');
  for (const bx of ['bro', 'omaha', 'caen', 'ws', 'hos', 'hon1']) {
    await hm.goto(base + 'box.html?b=' + bx); await hm.waitForTimeout(250);
    const hrefs = await hm.locator('#boxLinks a').evaluateAll(a => a.map(x => x.getAttribute('href')));
    const miss = hrefs.filter(h => !fs.existsSync(path.join(root, h.split('?')[0])));
    ok(hrefs.length >= (bx === 'hon1' || bx === 'ws' || bx === 'hos' ? 1 : 8) && miss.length === 0, 'box ' + bx + ': links go to pages that exist (' + hrefs.length + ')');
    ok(await hm.locator('.bh-art').evaluate(i => i.complete && i.naturalWidth > 0), 'box ' + bx + ': art loads');
    ok(await hm.locator('#boxOther li').count() === 5, 'box ' + bx + ': links to the other five boxes');
  }
  await hm.goto(base + 'box.html?b=caen'); await hm.waitForTimeout(250);
  ok(await hm.locator('#boxExp a').count() === 2, 'box caen: Windsor & Jupiter links');
  const boxData = await hm.evaluate(() => JSON.parse(JSON.stringify(window.HTS_BOXES)));
  const wantScen = { bro: 'scenarios.html?b=bro', omaha: 'scenarios.html?b=omaha', caen: 'scenarios.html?b=caen', ws: 'scenarios.html?b=ws' };
  ok(boxData.boxes.filter(x => !x.edition && x.id !== 'hos').every(x => x.links.some(l => l.href === wantScen[x.id]) && fs.existsSync(path.join(root, x.art))), 'box data: each box links to its scenarios and has art');
  ok(boxData.boxes.some(x => x.id === 'hos' && fs.existsSync(path.join(root, x.art)) && x.links.some(l => l.href === 'scenarios.html?b=hos')), 'box data: Heroes of Stalingrad has art and links to its scenarios');
  await hm.goto(base + 'box.html?b=hon1'); await hm.waitForTimeout(200);
  ok(await hm.locator('#boxLinks a[href="expansions.html?l=hon1"]').count() === 1 && await hm.locator('#boxLinks .off').count() === 0 && await hm.locator('#boxLinks a[href="guides.html?c=rules"]').count() === 1 && await hm.locator('#boxLinks a[href="guides.html?c=scenarios"]').count() === 1 && await hm.locator('#boxLinks a[href="guides.html?c=units"]').count() === 1 && await hm.locator('#boxLinks a[href="guides.html?c=single"]').count() === 1 && await hm.locator('#boxLinks a[href="guides.html?c=gazettes"]').count() === 1, 'box hon1: catalogue, rules, scenarios, single scenarios, gazettes and unit references all link to pages');
  await hm.goto(base + 'expansions.html?l=hon1'); await hm.waitForTimeout(400);
  ok(await hm.locator('.hrow').count() > 20 && await hm.locator('.chip.on[data-line="hon1"]').count() === 1, 'first edition catalogue lists its products');
  // Scenarios menu: first edition (V1) option lists the library scenarios
  await hm.goto(base + 'scenarios.html'); await hm.waitForTimeout(300);
  ok(await hm.locator('#boxes button[data-box="v1"]').count() === 1, 'scenarios page: first edition (V1) button');
  await hm.goto(base + 'scenarios.html?b=v1'); await hm.waitForTimeout(400);
  ok(await hm.locator('.hrow').count() === 85 && /85 of 85/.test(await hm.locator('#stat').innerText()), 'scenarios V1: 85 library entries (63 single, 15 packs, 7 gazette items)');
  await hm.click('[data-type="Scenario Contest Compilation"]');
  ok(await hm.locator('.hrow').count() === 13, 'scenarios V1: contest chip lists intro and 12 scenarios');
  // Scenarios menu: fan made option, labelled as unofficial
  ok(await hm.locator('#boxes button[data-box="fan"]').count() === 1, 'scenarios page: fan made (unofficial) button');
  await hm.goto(base + 'scenarios.html?b=fan'); await hm.waitForTimeout(400);
  ok(await hm.locator('.hrow').count() === 43 && /43 of 43/.test(await hm.locator('#stat').innerText()), 'scenarios fan made: 43 entries');
  ok(await hm.locator('.hrow .hbadges .hb', { hasText: 'Fan made' }).count() === 43 && /not official/i.test(await hm.locator('#srcnote').innerText()), 'scenarios fan made: every entry is badged fan made and the note says not official');
  ok(await hm.locator('[data-type="Small armies"]').count() === 1 && await hm.locator('[data-type="Tournament"]').count() === 1 && await hm.locator('[data-type="Campaign"]').count() === 1, 'scenarios fan made: type chips');
  await hm.fill('#q', 'Wittmann'); await hm.waitForTimeout(400);
  ok(await hm.locator('.hrow').count() >= 2, 'scenarios fan made: search finds Wittmann scenarios');
  ok(await hm.locator('#boxes button[data-box="hos"]').count() === 1, 'scenarios page: Heroes of Stalingrad button');
  await hm.goto(base + 'scenarios.html?b=hos'); await hm.waitForTimeout(400);
  ok(await hm.locator('.hrow').count() === 25 && /Eastern Front/.test(await hm.locator('#srcnote').innerText()), 'scenarios Stalingrad: 25 documents, note names the Eastern Front');
  ok(await hm.locator('[data-type="Mini campaign"]').count() === 1 && await hm.locator('[data-type="Battlefield Stories"]').count() === 1 && await hm.locator('[data-type="Punchboards and tiles"]').count() === 1, 'scenarios Stalingrad: type chips');
  await hm.fill('#q', 'Rattenkrieg'); await hm.waitForTimeout(400);
  ok(await hm.locator('.hrow').count() === 1, 'scenarios Stalingrad: search finds the sewer scenario');
  await hm.goto(base + 'scenarios.html?b=v1'); await hm.waitForTimeout(400);
  ok(await hm.locator('.hrow .hbadges .hb', { hasText: 'Fan made' }).count() === 0, 'scenarios V1: no fan made entries in the official first edition list');
  await hm.click('[data-type="all"]'); await hm.fill('#q', 'Godsend'); await hm.waitForTimeout(400);
  await hm.click('.hhead >> nth=0');
  const v1links = await hm.locator('.hbody:not([hidden]) a').evaluateAll(a => a.map(x => x.getAttribute('href')));
  ok(v1links.some(h => /^guides\.html\?d=core-set-01-godsend$/.test(h)) && v1links.some(h => /^pdf\/lib\/core-set-01-godsend\.pdf$/.test(h)), 'scenarios V1: entry links to its library page and PDF');
  // War Stories
  const wsp = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const wserrs = []; wsp.on('pageerror', e => wserrs.push(e.message)); wsp.on('console', m => { if (m.type() === 'error') wserrs.push(m.text()); });
  await wsp.goto(base + 'scenarios.html?b=ws'); await wsp.waitForTimeout(400);
  ok(await wsp.locator('.hrow').count() === 5, 'war stories: five scenarios listed');
  for (const sid of ['hells-fury', 'blue-and-grey', 'colombelles-castle', 'juno-beach', 'black-baron']) {
    await wsp.goto(base + 'scenario.html?b=ws&s=' + sid); await wsp.waitForTimeout(500);
    const info = await wsp.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('.sbody img'));
      imgs.forEach(i => { i.loading = 'eager'; });
      await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = r; i.onerror = r; })));
      const dl = Array.from(document.querySelectorAll('.sdl a')).map(a => a.getAttribute('href'));
      return { h1: (document.querySelector('.stitle') || {}).textContent, n: document.querySelectorAll('.sbody h2').length, imgs: imgs.length, bad: imgs.filter(i => !i.naturalWidth).length, dl, gal: document.querySelectorAll('.sgal li').length, x: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    ok(/War Stories #/.test(info.h1) && info.n >= 6 && info.imgs >= 3 && info.bad === 0 && !info.x, 'war stories ' + sid + ': full page, ' + info.imgs + ' pictures load, no sideways scroll (' + info.bad + ' broken)');
    ok(info.dl.length === 1 && fs.existsSync(path.join(root, info.dl[0])), 'war stories ' + sid + ': PDF download exists ' + info.dl.join(','));
    ok(sid === 'colombelles-castle' ? info.gal === 0 : info.gal >= 15, 'war stories ' + sid + ': tile gallery ' + info.gal);
  }
  await wsp.goto(base + 'scenario.html?b=ws&s=juno-beach'); await wsp.waitForTimeout(300);
  await wsp.locator('.sgalb').first().click(); await wsp.waitForTimeout(150);
  ok(await wsp.locator('#lbx').isVisible(), 'war stories: a tile picture opens full size');
  ok(wserrs.length === 0, 'war stories: no console errors ' + wserrs.join('|'));
  await wsp.close();
  await hm.goto(base + 'box.html?b=omaha'); await hm.waitForTimeout(200);
  ok(await hm.locator('#boxLinks .off').count() === 1, 'box omaha: Cards shown as not archived yet');
  ok(hmerrs.length === 0, 'landing and box pages: no console errors ' + hmerrs.join('|'));
  // Heroes of Stalingrad army builder and unit index
  {
    const sp = await b.newPage({ viewport: { width: 1280, height: 900 } });
    const sperrs = []; sp.on('pageerror', e => sperrs.push(e.message)); sp.on('console', m => { if (m.type() === 'error') sperrs.push(m.text()); }); sp.on('dialog', d => d.accept());
    await sp.goto(base + 'builder.html');
    await sp.click('[data-nation="ru"]');
    ok(await sp.locator('.lcard').count() === 12 && await sp.locator('.lcard', { hasText: 'Siberian Rifle Battalion' }).count() === 1 && await sp.locator('.lcard', { hasText: 'Sasha and the Beasts' }).count() === 1, 'builder Soviet Union (Stalingrad): 12 tiles incl. Siberian Rifle Battalion and Sasha');
    await sp.locator('.lcard', { hasText: 'Volga Rifle Battalion' }).first().locator('[data-add]').click();
    ok((await sp.textContent('#ptsUsed')) === '55', 'builder Stalingrad Red: Volga Rifle Battalion costs 55');
    ok(await sp.locator('.atile .slot.star').count() === 2 && /Order tokens: 1\./.test(await sp.locator('.warnings').innerText()), 'builder Stalingrad Red: Volga Rifle Battalion has 2 star slots and 1 order token');
    await sp.locator('.atile .slot').first().click();
    ok(await sp.locator('.pcard', { hasText: 'Mortar Group' }).count() >= 1 && await sp.locator('.pcard', { hasText: 'Veteran' }).count() === 0, 'builder Stalingrad Red: red slot offers Mortar Group, hides black-only Veteran');
    await sp.locator('.pcard', { hasText: 'Mortar Group' }).first().click();
    ok((await sp.textContent('#ptsUsed')) === '100', 'builder Stalingrad Red: Mortar Group adds 45 (100)');
    ok(/Order tokens: 2\./.test(await sp.locator('.warnings').innerText()), 'builder Stalingrad Red: filling a star slot adds an order token');
    // merged Germany: Normandie and Stalingrad German tiles and options in one nation
    await sp.click('[data-nation="ge"]');
    const natNames = await sp.locator('#nations button').allInnerTexts();
    ok(natNames.join('|') === 'United States|Germany|Commonwealth|French (FFI)|Soviet Union (Stalingrad)' && await sp.locator('#nations [data-nation="gs"]').count() === 0, 'builder: five nations (' + natNames.join(', ') + ')');
    const rawN = await sp.evaluate(() => ({ ge: window.HTS_DATA['hon-bro-ge'].tiles.length, gs: window.HTS_DATA['hon-hos-gs'].tiles.length, v1: window.HTS_DATA['hon-v1-ge'].tiles.length }));
    ok(await sp.locator('.lcard').count() === rawN.ge + rawN.gs + rawN.v1 && rawN.gs === 12, 'builder Germany: library holds every tile of both German files and the first edition box (' + rawN.ge + ' + ' + rawN.gs + ' + ' + rawN.v1 + ')');
    ok(await sp.locator('.lcard', { hasText: 'Die Geisterabteilung' }).count() === 1 && await sp.locator('.lcard', { hasText: 'Jägermeister' }).count() === 1 && await sp.locator('.lcard', { hasText: 'Brassert' }).count() === 1 && await sp.locator('.lcard', { hasText: 'SS Panzergrenadiere' }).count() >= 1, 'builder Germany: Big Red One German tiles and Die Geisterabteilung are in one library');
    ok(await sp.locator('.lcard .hosbadge:not(.v1badge)').count() === 12 && await sp.locator('.lcard', { hasText: 'Brassert' }).locator('.hosbadge').count() === 0 && await sp.locator('.lcard', { hasText: 'Die Geisterabteilung' }).locator('.hosbadge', { hasText: 'Stalingrad' }).count() === 1, 'builder Germany: only the 12 Stalingrad tiles carry the Stalingrad badge');
    const unitHrefs = await sp.evaluate(() => ({ gs: document.querySelector('.lcard:has(.hosbadge) a[href^="units.html"]').getAttribute('href'), ge: Array.from(document.querySelectorAll('.lcard')).filter(c => !c.querySelector('.hosbadge'))[0].querySelector('a[href^="units.html"]').getAttribute('href') }));
    ok(/^units\.html\?n=gs&/.test(unitHrefs.gs) && /^units\.html\?n=ge&/.test(unitHrefs.ge), 'builder Germany: Units link opens gs for Stalingrad tiles and ge for Normandie tiles');
    for (const w of ['stalingrad', 'STALINGRAD', 'Eastern Front']) {
      await sp.fill('#search', w);
      ok(await sp.locator('.lcard').count() === 12 && await sp.locator('.lcard .hosbadge').count() === 12, 'builder Germany: search "' + w + '" shows only the 12 Stalingrad tiles, each with the badge');
    }
    await sp.fill('#search', '');
    await sp.click('#setChips [data-set="HoS-HP"]');
    ok(await sp.locator('.lcard').count() === 1 && await sp.locator('.lcard', { hasText: 'Die Geisterabteilung' }).count() === 1, 'builder Germany: HoS-HP set chip still filters (Die Geisterabteilung only)');
    await sp.click('#setChips [data-set="HoS-HP"]');
    ok(await sp.locator('#setChips [data-set^="HoS-"]').count() === 4 && await sp.locator('#setChips [data-set]:not([data-set^="HoS-"])').count() >= 1, 'builder Germany: set chips list the four HoS codes and the Normandie codes');
    await sp.locator('.lcard', { hasText: 'Feldkommando' }).filter({ hasText: 'Hoth' }).locator('[data-add]').click();
    await sp.locator('.atile .slot').first().click();
    ok(await sp.locator('.pcard', { hasText: 'Artillery' }).count() >= 1 && await sp.locator('.pcard', { hasText: 'Aircraft' }).count() >= 1, 'builder Stalingrad German: command tile offers Artillery and Aircraft orders');
    ok(await sp.locator('.pcard', { hasText: 'Artillery' }).filter({ has: sp.locator('.hosbadge') }).count() === 1, 'builder Germany: option picker cards of Stalingrad options carry the badge');
    await sp.keyboard.press('Escape');
    // mixed army: one tile from each game, same option name from both (Bluff, 5 and 10 points)
    await sp.click('[data-nation="us"]'); await sp.click('[data-nation="ge"]');
    await sp.locator('.lcard', { hasText: 'Brassert' }).locator('[data-add]').click();
    await sp.locator('.lcard', { hasText: 'Panzergrenadiere' }).filter({ hasText: 'III. Battalion' }).locator('[data-add]').click();
    ok((await sp.textContent('#ptsUsed')) === '130', 'builder mixed army: Brassert (30) + Panzergrenadiere III (100) = 130');
    await sp.locator('.atile').first().locator('.slot').nth(1).click();
    const bluffs = await sp.locator('.pcard', { hasText: 'Bluff' }).count();
    await sp.locator('.pcard', { hasText: 'Bluff' }).filter({ has: sp.locator('.hosbadge') }).first().click();
    ok(bluffs === 2 && (await sp.textContent('#ptsUsed')) === '140', 'builder mixed army: picker lists both Bluffs, the Stalingrad one adds 10 (140)');
    await sp.locator('.atile').first().locator('.slot').nth(2).click();
    await sp.locator('.pcard', { hasText: 'Bluff' }).filter({ hasNot: sp.locator('.hosbadge') }).first().click();
    ok((await sp.textContent('#ptsUsed')) === '145' && await sp.locator('.warnings .bad').count() === 0 && await sp.locator('.slot.mismatch').count() === 0, 'builder mixed army: the Normandie Bluff adds 5 (145), no warnings');
    const mixedState = await sp.evaluate(() => window.HTS.state.army.map(e => e.t + ':' + e.o.join(',')).join(' ; '));
    ok(/bluff/.test(mixedState) && /gs:bluff/.test(mixedState) && /gs:panzergrenadiere_iii/.test(mixedState), 'builder mixed army: ids from both games are kept apart (' + mixedState + ')');
    ok(/Tiles from Heroes of Normandie have no order tokens/.test(await sp.locator('.warnings').innerText()), 'builder mixed army: order token note names the Normandie tiles');
    await sp.reload(); await sp.waitForTimeout(300);
    ok((await sp.textContent('#ptsUsed')) === '145' && await sp.locator('.atile').count() === 2, 'builder mixed army: reload keeps both tiles and the points');
    const lnk = await sp.evaluate(() => { const S = window.HTS.state; return btoa(unescape(encodeURIComponent(JSON.stringify({ n: S.nation, l: S.limit, nm: 'mix', a: S.army.map(e => [e.t, e.o]) })))); });
    await sp.evaluate(() => { try { localStorage.removeItem('hts.hon.bro.v1'); } catch (e) {} });
    await sp.goto('about:blank'); await sp.goto(base + 'builder.html#b=' + lnk.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')); await sp.waitForTimeout(300);
    ok((await sp.textContent('#ptsUsed')) === '145' && await sp.locator('.atile').count() === 2, 'builder mixed army: share link restores the mixed army');
    // old saves under the nation gs still load, as Germany
    const gsArmy = [['feldkommando_hoth', ['artillery', 'battle_plan', null]], ['panzergrenadiere', [null, 'veteran', null, null]]];
    const gsPts = await sp.evaluate(a => { const d = window.HTS_DATA['hon-hos-gs'], t = {}, o = {}; d.tiles.forEach(x => t[x.id] = x); d.options.forEach(x => o[x.id] = x); return a.reduce((n, e) => n + t[e[0]].cost + e[1].reduce((m, id) => m + (id ? o[id].cost : 0), 0), 0); }, gsArmy);
    const enc = j => Buffer.from(JSON.stringify(j)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    await sp.goto('about:blank'); await sp.goto(base + 'builder.html#b=' + enc({ n: 'gs', l: 300, nm: 'Old gs link', a: gsArmy })); await sp.waitForTimeout(300);
    ok(await sp.locator('#nations [data-nation="ge"].on').count() === 1 && await sp.locator('.atile').count() === 2 && (await sp.textContent('#ptsUsed')) === String(gsPts) && await sp.locator('.optlist li').count() === 3 && await sp.locator('.warnings .bad').count() === 0, 'builder: an old gs share link loads as Germany with its tiles and options (' + gsPts + ' points)');
    ok((await sp.inputValue('#armyName')) === 'Old gs link' && (await sp.textContent('#ptsLimit')) === '300', 'builder: old gs link keeps its name and limit');
    await sp.goto(base + 'builder.html');
    await sp.evaluate(a => { localStorage.setItem('hts.hon.bro.v1', JSON.stringify({ nation: 'gs', limit: 250, name: 'Old gs save', army: a.map((e, i) => ({ id: 'x' + i, t: e[0], o: e[1] })), theme: 'light', saved: [{ name: 'Old gs saved army', nation: 'gs', pts: 1, snap: { n: 'gs', l: 250, nm: 'Old gs saved army', a: a } }] })); }, gsArmy);
    await sp.reload(); await sp.waitForTimeout(300);
    ok(await sp.locator('#nations [data-nation="ge"].on').count() === 1 && await sp.locator('.atile').count() === 2 && (await sp.textContent('#ptsUsed')) === String(gsPts), 'builder: an old gs army saved in the browser loads as Germany with its tiles and options');
    ok(/Old gs saved army \(GE/.test(await sp.locator('#savedRow').innerText()), 'builder: an old gs entry in the saved list shows as Germany');
    await sp.click('#btnNew'); await sp.click('[data-load="0"]'); await sp.waitForTimeout(200);
    ok(await sp.locator('.atile').count() === 2 && (await sp.textContent('#ptsUsed')) === String(gsPts), 'builder: loading an old gs saved army from the list works');
    // old ge army still loads unchanged
    await sp.goto('about:blank'); await sp.goto(base + 'builder.html#b=' + enc({ n: 'ge', l: 250, nm: 'Old ge', a: [['feldkommando_brassert', [null, 'bluff', null]]] })); await sp.waitForTimeout(300);
    ok((await sp.textContent('#ptsUsed')) === '35' && await sp.locator('.atile').count() === 1, 'builder: an old ge link loads unchanged (Bluff is the 5 point Normandie one)');
    await sp.evaluate(() => { try { localStorage.removeItem('hts.hon.bro.v1'); } catch (e) {} });
    await sp.goto(base + 'builder.html');
    await sp.click('[data-nation="ru"]');
    await sp.goto(base + 'heroes.html?b=hos&n=ru'); await sp.waitForTimeout(300);
    ok(await sp.locator('.hrow').count() === 5 && await sp.locator('.hrow', { hasText: 'Mariya Oktyabrskaya' }).count() === 1 && await sp.locator('.eqcard').count() === 0, 'heroes Stalingrad Red: 5 hero tiles, no Normandie equipment cards');
    await sp.click('#nations [data-nation="gs"]'); await sp.waitForTimeout(250);
    ok(await sp.locator('.hrow').count() === 4 && await sp.locator('.hrow', { hasText: 'Steiner' }).count() === 1, 'heroes Stalingrad German: 4 hero tiles incl. Steiner');
    await sp.locator('.hhead', { hasText: 'Steiner' }).click(); await sp.waitForTimeout(200);
    ok(!/Based on:/.test(await sp.locator('.hbody').first().innerText()), 'heroes Stalingrad: no Based on line borrowed from the Normandie heroes');
    await sp.click('#boxes [data-box="bro"]'); await sp.waitForTimeout(250);
    ok(await sp.locator('#nations [data-nation="us"].on').count() === 1, 'heroes: picking a Normandie box leaves the Stalingrad nation');
    await sp.goto(base + 'units.html?b=hos&n=ru'); await sp.waitForTimeout(300);
    ok(/Move \d, Def \d/.test((await sp.locator('.stl').first().innerText()).replace(/\s+/g, ' ')) && await sp.locator('.stl').count() >= 10, 'unit index Stalingrad Red: counters show Move, Defense and combat values');
    ok(/^12 tile/.test(await sp.locator('#stat').innerText()), 'unit index Stalingrad Red: 12 tiles');
    await sp.click('#nations [data-nation="gs"]'); await sp.waitForTimeout(250);
    ok(/^12 tile/.test(await sp.locator('#stat').innerText()), 'unit index Stalingrad German: 12 tiles');
    await sp.click('#boxes [data-box="bro"]'); await sp.waitForTimeout(250);
    ok(!(await sp.locator('#nations [data-nation="gs"].on').count()), 'unit index: picking a Normandie box leaves the Stalingrad nation');
    const hosd = ['ru', 'gs'].map(n => { const t = fs.readFileSync(path.join(root, 'data/hon-hos-' + n + '.js'), 'utf8'); return JSON.parse(t.slice(t.indexOf('= {') + 2, t.lastIndexOf('}') + 1)); });
    ok(hosd.every(d => d.tiles.every(t => fs.existsSync(path.join(root, t.img)) && t.own.every(o => d.options.some(x => x.id === o))) && d.options.every(o => fs.existsSync(path.join(root, o.img)) && o.cost !== undefined)), 'Stalingrad data: every tile and option picture exists and every owned option is defined');
    await sp.goto(base + 'history.html?b=hos'); await sp.waitForTimeout(300);
    ok(await sp.locator('.hrow').count() === 35 && /Heroes of Stalingrad/.test(await sp.locator('#subtitle').innerText()), 'history Stalingrad: 35 entries');
    await sp.click('[data-side="gs"]');
    ok(await sp.locator('.hrow').count() >= 15 && await sp.locator('.hrow', { hasText: 'Hermann Hoth' }).count() === 1 && await sp.locator('.hrow', { hasText: '62nd Army' }).count() === 0, 'history Stalingrad: German filter keeps Hoth and drops 62nd Army');
    await sp.fill('#q', 'zaytsev'); await sp.waitForTimeout(300);
    ok((await sp.locator('.hhead .hname .ht').first().textContent()).includes('Zaytsev') && await sp.locator('.hhead .hname .ht mark').count() >= 1, 'history Stalingrad: search finds Zaytsev with the match inline in the title');
    const hosh = await sp.evaluate(() => window.HTS_HISTORY['hon-hos'].entries.filter(e => e.find).map(e => [e.id, e.find.n, e.find.q]));
    const hosBad = [];
    for (const [id, n, q] of hosh) {
      await sp.goto(base + 'units.html?b=hos&n=' + n + '&q=' + encodeURIComponent(q)); await sp.waitForTimeout(120);
      if (await sp.locator('.ucard').count() < 1) hosBad.push(id + ':' + q);
    }
    ok(hosBad.length === 0, 'history Stalingrad: every Find in the game link returns tiles ' + hosBad.join(','));
    ok(boxData.boxes.some(x => x.id === 'hos' && x.links.some(l => l.id === 'history' && l.count === hosh.length + ' entries')), 'box data: Stalingrad History link count matches the entries');
    ok(sperrs.length === 0, 'Stalingrad builder and unit index: no console errors ' + sperrs.join('|'));
    await sp.close();
  }
  // look and feel: self-hosted fonts and nav icons on every page
  const navPages = ['index', 'box', 'builder', 'units', 'rules', 'scenarios', 'scenario', 'tokens', 'icons', 'heroes', 'cards', 'maps', 'expansions', 'history', 'guides', 'search'];
  const np = await b.newPage({ viewport: { width: 1100, height: 800 } });
  for (const pgName of navPages) {
    await np.goto(base + pgName + '.html' + (pgName === 'scenario' ? '?b=bro&s=night' : '')); await np.waitForTimeout(400);
    const info = await np.evaluate(async () => {
      await document.fonts.ready;
      const links = Array.from(document.querySelectorAll('.top-actions a, .top-actions button'));
      return { n: links.length, noIcon: links.filter(a => getComputedStyle(a, '::before').backgroundImage === 'none').map(a => a.textContent.trim()),
        fira: document.fonts.check('700 1em "Fira Sans Condensed"'), slab: document.fonts.check('1em "Alfa Slab One"'), x: document.documentElement.scrollWidth > innerWidth };
    });
    ok(info.n >= 9 && info.noIcon.length === 0 && info.fira && info.slab && !info.x, pgName + ': nav icons and fonts (' + info.noIcon.join(',') + ')');
  }
  await np.close();
  // guides
  const gp = await b.newPage({ viewport: { width: 390, height: 844 } });
  const gperrs = []; gp.on('pageerror', e => gperrs.push(e.message)); gp.on('console', m => { if (m.type() === 'error') gperrs.push(m.text()); });
  await gp.goto(base + 'guides.html'); await gp.waitForTimeout(300);
  ok(await gp.locator('#gList li').count() === 7, 'guides: seven guides listed');
  const gids = await gp.locator('#gList a').evaluateAll(a => a.map(x => new URL(x.href).searchParams.get('g')));
  for (const gid of gids) {
    await gp.goto(base + 'guides.html?g=' + gid); await gp.waitForTimeout(200);
    ok(await gp.locator('.stitle').count() === 1 && await gp.locator('.snote').count() >= 1 && /V2|Big Red One/.test(await gp.locator('.snote').first().innerText()), 'guide ' + gid + ': renders with the V2 note');
    ok(await gp.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), 'guide ' + gid + ': no sideways scroll on a phone');
  }
  await gp.goto(base + 'guides.html?g=v1-to-v2'); await gp.waitForTimeout(200);
  ok(await gp.locator('.stable tbody tr').count() === 6, 'guide v1-to-v2: six platoon equivalents');
  await gp.goto(base + 'guides.html?g=who-are-these-heroes'); await gp.waitForTimeout(200);
  ok(await gp.locator('.stable').count() === 4, 'guide heroes: four faction tables');
  await gp.goto(base + 'guides.html?g=what-to-buy'); await gp.waitForTimeout(200);
  ok(await gp.locator('.sbody a[href="expansions.html"]').count() === 1, 'guide what-to-buy: catalogue link is a real link');
  ok(gperrs.length === 0, 'guides: no console errors ' + gperrs.join('|'));
  const ghtml = fs.readFileSync(path.join(root, 'data/hon-guides.js'), 'utf8') + fs.readFileSync(path.join(root, 'guides.html'), 'utf8');
  ok(!/devil-pig-games\.com|devilpig/i.test(ghtml), 'guides: no links to the defunct publisher');
  // documents library
  await gp.goto(base + 'guides.html'); await gp.waitForTimeout(400);
  const LIB = await gp.evaluate(() => JSON.parse(JSON.stringify({ n: window.HTS_LIB.docs.length, g: window.HTS_LIB.groups.length, ids: window.HTS_LIB.docs.map(d => [d.id, d.n, d.pdf && d.pdf.href]) })));
  ok(LIB.n === 205 && LIB.g === 11, 'documents: 205 documents in 11 groups');
  ok(await gp.locator('.dcard').count() === 205, 'documents: every document is listed');
  const missingLib = [];
  for (const [id, n, pdf] of LIB.ids) { for (let k = 1; k <= n; k++) { if (!fs.existsSync(path.join(root, 'img/hon/lib/' + id + '/p' + String(k).padStart(2, '0') + '.webp'))) missingLib.push(id + k); } if (pdf && !fs.existsSync(path.join(root, pdf))) missingLib.push(pdf); }
  ok(missingLib.length === 0, 'documents: every page picture and PDF exists ' + missingLib.slice(0, 5).join(','));
  const FANC = await gp.evaluate(() => { const d = window.HTS_LIB.docs.filter(x => x.group === 'fanmade'); return { n: d.length, pdf: d.filter(x => x.pdf).length, bad: d.filter(x => x.ed !== 'Community' || !x.kind || !/^Fan made|^OPJH/.test(x.credit)).length, big: d.filter(x => x.pdf && /MB/.test(x.pdf.size) && parseFloat(x.pdf.size) > 20).length }; });
  ok(FANC.n === 43 && FANC.pdf === 4 && FANC.bad === 0 && FANC.big === 0, 'documents: 43 fan made documents (42 before the rebuild, one without tiles removed, two added), 4 with a PDF (the campaigns), all labelled community and fan made, no PDF over 20 MB ' + JSON.stringify(FANC));
  await gp.goto(base + 'guides.html?d=fan-the-bunker'); await gp.waitForTimeout(400);
  ok(/Fan made/.test(await gp.locator('.smeta').innerText()) && /not official/i.test(await gp.locator('.snote').first().innerText()) && await gp.locator('a[download]').count() === 0, 'fan made document: labelled unofficial, rebuilt layout has no PDF');
  // fan scenarios rebuilt in the web layout
  const FS = await gp.evaluate(() => { const d = window.HTS_LIB.docs.filter(x => x.group === 'fanmade'), sc = d.filter(x => x.scn); return {
    n: d.length, scn: sc.length, noscn: d.filter(x => !x.scn).map(x => x.id),
    bad: sc.filter(x => !x.title || !((x.scn.maps && x.scn.maps.length) || (x.scn.tiles && x.scn.tiles.length) || x.scn.tilesNote) || x.pdf).map(x => x.id),
    nomapfile: sc.filter(x => (x.scn.maps || []).concat(x.scn.forces ? x.scn.forces.filter(f => f.img).map(f => f.img) : []).some(m => !m.img)).map(x => x.id),
    gone: ['fan-hon-general-tournament-rules'].filter(i => d.some(x => x.id === i)),
    added: ['fan-the-german-strongpoint-at-foucarville', 'fan-the-la-manoir-farmhouse-6-june-1944'].filter(i => d.some(x => x.id === i && x.scn)),
    edel: d.filter(x => /edelweiss/i.test(x.id)).length }; });
  ok(FS.n === 43 && FS.scn === 38 && FS.noscn.length === 5, 'fan scenarios: 43 fan docs, 38 with the web layout, 5 left on the page pictures (' + FS.noscn.join(', ') + ')');
  ok(FS.bad.length === 0 && FS.nomapfile.length === 0, 'fan scenarios: every web layout doc has a title, a map picture or a tiles line, and no PDF (' + FS.bad.join(', ') + ')');
  ok(FS.gone.length === 0 && FS.added.length === 2 && FS.edel === 0, 'fan scenarios: the removed doc is gone, the two added scenarios are in, Operation Edelweiss is not');
  const fsFiles = fs.readdirSync(path.join(root, 'pdf', 'lib')).filter(f => /^fan-/.test(f));
  const fsRef = await gp.evaluate(() => window.HTS_LIB.docs.filter(x => x.group === 'fanmade' && x.pdf).map(x => x.pdf.href.split('/').pop()));
  ok(fsFiles.every(f => fsRef.indexOf(f) >= 0) && fsRef.length === 4, 'fan scenarios: no leftover fan PDF in pdf/lib (' + fsFiles.length + ' files for ' + fsRef.length + ' docs)');
  const fsImgs = fs.readdirSync(path.join(root, 'img', 'hon', 'lib')).filter(f => /^fan-/.test(f));
  const fsIds = await gp.evaluate(() => window.HTS_LIB.docs.filter(x => x.group === 'fanmade').map(x => x.id));
  ok(fsImgs.every(f => fsIds.indexOf(f) >= 0) && fsIds.every(f => fsImgs.indexOf(f) >= 0), 'fan scenarios: every fan doc has a picture folder and no picture folder is left over');
  await gp.goto(base + 'guides.html?d=fan-t3-hold-the-line'); await gp.waitForTimeout(500);
  const heads = await gp.evaluate(() => Array.from(document.querySelectorAll('.scn-sec h2')).map(h => h.textContent));
  ok(heads.join('|') === 'Background|Map and set-up|Forces|Deployment|Special rules|Objectives and victory', 'fan scenario layout: sections in order (' + heads.join('|') + ')');
  ok(/C4-B/.test(await gp.locator('.scn-tiles').first().innerText()) && await gp.locator('.scn-tile').count() === 8 && await gp.locator('.scn-map img').count() === 1 && await gp.locator('.scn-fimg img').count() === 2, 'fan scenario layout: tiles, the map picture and the two force pictures');
  ok(await gp.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), 'fan scenario layout: no sideways scroll at phone width');
  ok(await gp.locator('a[download]').count() === 0 && await gp.locator('details.scn-orig').count() === 1, 'fan scenario layout: no PDF link, and the original pages are kept in a fold');
  await gp.goto(base + 'guides.html?d=fan-opjh-2019-tournament-rules'); await gp.waitForTimeout(400);
  ok(await gp.locator('.scn-sec').count() === 0 && await gp.locator('.dpage').count() === 1 && await gp.locator('a[download]').count() === 0, 'fan scenario fallback: a doc without scn still shows its page pictures');
  await gp.goto(base + 'guides.html'); await gp.waitForTimeout(400);
  await gp.fill('#lq', 'quagmire'); await gp.waitForTimeout(300);
  ok(await gp.locator('.dcard a[href="guides.html?d=fan-opjh-2019-2-village-in-the-woods"]').count() === 1, 'fan scenario search: a word in the rules text finds the scenario');
  await gp.goto(base + 'guides.html'); await gp.waitForTimeout(400);
  await gp.fill('#lq', 'night combat'); await gp.waitForTimeout(300);
  ok(await gp.locator('.dcard a[href="guides.html?d=pegasus-bridge-errata"]').count() === 1, 'documents: search finds night combat in the Pegasus Bridge text');
  await gp.click('#lchips [data-c="scenarios"]'); await gp.waitForTimeout(200);
  ok(await gp.locator('.dcard').count() >= 1, 'documents: group filter works with a search');
  await gp.goto(base + 'guides.html?c=units'); await gp.waitForTimeout(300);
  ok(await gp.locator('.dcard').count() === 21 && await gp.locator('#lchips .chip.on').innerText() === 'Unit references 21', 'documents: ?c=units opens the unit references');
  // tile picture documents
  const tileDocs = { 'pegasus-bridge-tiles': [7, 'V1'], 'pegasus-bridge-terrain-tiles': [3, 'V1'], 'kellys-heroes-tiles': [4, 'V1'], 'gazette-4-tiles': [2, 'V1'], 'ge-21eme-pz-tiles': [6, 'V1'], 'pulp-stories-1-tiles': [3, 'Other'] };
  for (const [tid, [tn, ted]] of Object.entries(tileDocs)) {
    await gp.goto(base + 'guides.html?d=' + tid); await gp.waitForTimeout(300);
    ok(await gp.locator('.dpage').count() === tn && await gp.locator('a.btn[href="pdf/lib/' + tid + '.pdf"]').count() === 1 && fs.existsSync(path.join(root, 'pdf/lib/' + tid + '.pdf')), 'tile document ' + tid + ': ' + tn + ' pages and a PDF');
  }
  await gp.goto(base + 'guides.html?d=pulp-stories-1-tiles'); await gp.waitForTimeout(300);
  ok(/other than Heroes of Normandie/.test(await gp.locator('.snote').innerText()), 'tile document: Pulp Stories note says it is another line');
  await gp.goto(base + 'guides.html?c=units'); await gp.waitForTimeout(300); await gp.fill('#lq', 'sherman oddball'); await gp.waitForTimeout(300);
  ok(await gp.locator('.dcard a[href="guides.html?d=kellys-heroes-tiles"]').count() === 1, 'documents: search finds a tile by name');
  const printDocs = { 'wood-hills-print': 7, 'vercors-maps': 2, 'tournament-maps': 6, 'selonge-forest-depots': 2, 'church-print': 2, 'mansion-print': 2, 'sainte-mere-eglise-campaign-book-pages': 7, 'gazette-1-pages': 3, 'gazette-2-pages': 3, 'gazette-3-pages': 4 };
  for (const [pid, pn] of Object.entries(printDocs)) {
    await gp.goto(base + 'guides.html?d=' + pid); await gp.waitForTimeout(300);
    ok(await gp.locator('.dpage').count() === pn, 'document ' + pid + ': ' + pn + ' pages');
  }
  await gp.goto(base + 'guides.html?c=print'); await gp.waitForTimeout(300);
  ok(await gp.locator('.dcard').count() === 6, 'documents: ?c=print lists the six print file documents');
  await gp.fill('#lq', 'Speirs'); await gp.waitForTimeout(300); await gp.goto(base + 'guides.html?q=Speirs'); await gp.waitForTimeout(400);
  ok(await gp.locator('.dcard a[href="guides.html?d=gazette-3-pages"]').count() === 1, 'documents: search finds Run Speirs in Gazette 3 pages');
  await gp.goto(base + 'guides.html?d=operation-neptune-campaign-sheet'); await gp.waitForTimeout(400);
  ok(await gp.locator('.dpage').count() === 7 && await gp.locator('a.btn[href="pdf/lib/operation-neptune-campaign-sheet.pdf"]').count() === 1, 'neptune sheet: seven pages and the PDF link');
  ok(await gp.locator('h2#historical-background').count() === 1 && /Operation Bodyguard/.test(await gp.locator('.sbody').first().innerText()), 'neptune sheet: historical background section is shown');
  ok(await gp.locator('.sbody table tbody tr').count() === 28, 'neptune sheet: 28 scenarios in the order table');
  ok(await gp.locator('.sbody table a[href="guides.html?d=pointe-du-hoc-02-now-what"]').count() === 1 && await gp.locator('.sbody table a[href="guides.html?d=pegasus-bridge-campaign-book"]').count() >= 6, 'neptune sheet: table links to the scenario documents and books');
  ok(await gp.locator('.sbody a[href^="https://en.wikipedia.org/wiki/"]').count() === 5 && await gp.locator('.sbody a[rel="noopener"][target="_blank"]').count() === 5, 'neptune sheet: five source links open in a new tab');
  ok(!/devil-pig-games|dpg\.|forum/i.test(await gp.locator('.sbody').first().innerText()), 'neptune sheet: background has no publisher address');
  await gp.goto(base + 'guides.html?q=' + encodeURIComponent('Lord Lovat') + '#documents'); await gp.waitForTimeout(400);
  ok(await gp.locator('.dcard a[href="guides.html?d=operation-neptune-campaign-sheet"]').count() === 1, 'documents: search "Lord Lovat" finds the Neptune sheet through its background');
  await gp.goto(base + 'guides.html?d=mines'); await gp.waitForTimeout(400);
  ok(await gp.locator('.dpage').count() === 2 && await gp.locator('a.btn[href="pdf/lib/mines.pdf"]').count() === 1 && /V2/.test(await gp.locator('.snote').innerText()), 'document mines: two pages, PDF link, V2 note');
  await gp.locator('.sfigb').first().click(); await gp.waitForTimeout(200);
  ok(await gp.locator('#lbx').isVisible() && await gp.locator('#lbxImg').evaluate(i => i.complete && i.naturalWidth > 0), 'document mines: page opens in the viewer');
  await gp.keyboard.press('Escape');
  await gp.goto(base + 'guides.html?d=bro-errata'); await gp.waitForTimeout(400);
  ok(await gp.locator('.dpage').count() === 3 && await gp.locator('a.btn[href="pdf/lib/bro-errata.pdf"]').count() === 1 && /for the Big Red One \(V2\) rules/.test(await gp.locator('.snote').innerText()), 'document bro-errata: three pages, PDF link, V2 note');
  ok(/Sticky Bomb/.test(await gp.locator('.sread').innerText()) && !/devil-pig-games/i.test(await gp.locator('.sread').innerText()), 'document bro-errata: text is readable and has no publisher address');
  await gp.goto(base + 'guides.html?d=full-throttle'); await gp.waitForTimeout(400);
  ok(await gp.locator('.dpage').count() === 2 && /Fan made, not official/.test(await gp.locator('.snote').innerText()), 'document full-throttle: two pages and the not official note');
  await gp.goto(base + 'guides.html?d=scc-04-back-home-or-not'); await gp.waitForTimeout(400);
  ok(await gp.locator('.dpage').count() === 2 && await gp.locator('a.btn[href="pdf/lib/scc-04-back-home-or-not.pdf"]').count() === 1 && /Part of Scenario Contest Compilation \(Winter 2015\), scenario 4 of 12/.test((await gp.locator('.snote').allInnerTexts()).join(' ')) && await gp.locator('.snote a[href="guides.html?d=scc-intro"]').count() === 1, 'contest scenario 4: own page, own PDF, says it is part of the compilation');
  await gp.goto(base + 'guides.html?d=scc-intro'); await gp.waitForTimeout(400);
  ok(await gp.locator('ol.slist li a').count() === 12, 'contest compilation cover lists the 12 scenarios');
  await gp.goto(base + 'guides.html?c=single'); await gp.waitForTimeout(300);
  ok(await gp.locator('.dcard').count() === 63 && await gp.locator('.dcard .hsrc', { hasText: 'Part of Scenario Contest Compilation (Winter 2015)' }).count() === 13 && await gp.locator('.dcard .hsrc', { hasText: 'Part of Core Set scenario book (V1.1b)' }).count() === 10, 'single scenarios: 63 listed, 13 from the contest and 10 from the Core Set book');
  await gp.goto(base + 'guides.html?d=core-set-intro'); await gp.waitForTimeout(400);
  ok(await gp.locator('ol.slist li a').count() === 10 && /introduction to Core Set scenario book/.test((await gp.locator('.snote').allInnerTexts()).join(' ')), 'Core Set book introduction lists its 10 scenarios');
  await gp.goto(base + 'guides.html?d=core-set-10-tempest-of-fire'); await gp.waitForTimeout(400);
  ok(await gp.locator('.dpage').count() === 2 && await gp.locator('a.btn[href="pdf/lib/core-set-10-tempest-of-fire.pdf"]').count() === 1 && await gp.locator('.snote a[href="guides.html?d=core-set-intro"]').count() === 1, 'Core Set scenario 10: two pages, own PDF, link to its book');
  await gp.goto(base + 'guides.html?d=gazette-7-story'); await gp.waitForTimeout(400);
  ok(await gp.locator('ol.slist li a').count() === 3, 'Gazette 7 lists its three scenarios');
  await gp.goto(base + 'guides.html?d=slaughterhouse-bro'); await gp.waitForTimeout(300);
  ok(/for the Big Red One \(V2\) rules/.test(await gp.locator('.snote').first().innerText()), 'slaughterhouse (Big Red One version) is marked V2');
  await gp.goto(base + 'guides.html?d=bible-core'); await gp.waitForTimeout(400);
  ok(await gp.locator('a.btn[href^="pdf/"]').count() === 0 && /project files/.test(await gp.locator('.sread').innerText()), 'document bible-core: no PDF on the site, says where the original is');
  ok(gperrs.length === 0, 'documents: no console errors ' + gperrs.join('|'));
  const lhtml = fs.readFileSync(path.join(root, 'data/hon-library.js'), 'utf8');
  ok(!/devil-pig-games\.com|devilpiggames\.com/i.test(lhtml), 'documents: no links to the defunct publisher');
  await gp.close();
  // hero tiles show who they are based on
  await hrp.goto(base + 'heroes.html?b=bro&n=us&q=oddball'); await hrp.waitForTimeout(300);
  await hrp.click('.hhead'); await hrp.waitForTimeout(200);
  ok(/Based on:\s*Oddball \(Donald Sutherland\)/.test(await hrp.locator('.hbody').first().innerText()), 'heroes: Oddball shows what he is based on');
  await hrp.goto(base + 'heroes.html?b=omaha&n=us&q=horvath'); await hrp.waitForTimeout(300);
  await hrp.click('.hhead'); await hrp.waitForTimeout(200);
  ok(!/Based on:/.test(await hrp.locator('.hbody').first().innerText()), 'heroes: a hero with no entry shows no Based on line');

  // My collection, site-wide
  {
    const np = await b.newPage({ viewport: { width: 1280, height: 900 } });
    const nerrs = []; np.on('pageerror', e => nerrs.push(e.message)); np.on('console', m => { if (m.type() === 'error') nerrs.push(m.text()); });
    const clear = () => np.evaluate(() => { try { localStorage.removeItem('hts.hon.own.v1'); } catch (e) {} });
    await np.goto(base + 'scenarios.html?b=omaha'); await clear(); await np.reload(); await np.waitForTimeout(500);
    const dat = JSON.parse(await np.evaluate(() => JSON.stringify({
      groups: window.HTS_PRODUCTS.length, prods: window.HTS_PRODUCTS.reduce((a, g) => a + g.items.length, 0),
      needs: Object.keys(window.HTS_NEEDS).length, codes: window.HTS_OWN.products.map(i => i.code),
      bad: Object.keys(window.HTS_NEEDS).filter(k => [].concat.apply([], window.HTS_NEEDS[k].map(x => [].concat(x))).some(c => window.HTS_OWN.products.map(i => i.code).indexOf(c) < 0)),
      badLib: Object.keys(window.HTS_NEEDS).filter(k => k.indexOf('lib:') === 0 && !window.HTS_LIB.docs.some(d => d.id === k.slice(4))) })));
    ok(dat.groups >= 5 && dat.prods === 75 && dat.codes.length === 87, 'collection: product list has 87 products, 12 older and 75 grouped (' + dat.groups + ' groups, ' + dat.prods + ' products)');
    ok(dat.needs >= 50 && dat.bad.length === 0, 'collection: every needs entry uses a known product code ' + dat.bad.join(','));
    ok(dat.badLib.length === 0, 'collection: every lib needs entry is a real document ' + dat.badLib.join(','));
    ok(await np.locator('#btnOwn').count() === 1, 'collection: My collection button is in the header on the scenarios page');
    const sc0 = await np.locator('.hrow').count();
    ok(sc0 >= 4 && await np.locator('#ownnote').innerText() === '', 'collection: scenarios page shows everything and no note when nothing is set (' + sc0 + ')');
    const api = JSON.parse(await np.evaluate(() => { const O = window.HTS_OWN; localStorage.setItem('hts.hon.own.v1', JSON.stringify({ own: { CB: true }, only: true })); return JSON.stringify([O.owns('CB'), O.owns('nope-unknown'), O.ownsAll(['BO']), O.ownsAll([['BO', 'CB']]), O.ownsAll(['CB', 'BO'])]); }));
    await np.reload(); await np.waitForTimeout(500);
    const api2 = JSON.parse(await np.evaluate(() => JSON.stringify([window.HTS_OWN.owns('CB'), window.HTS_OWN.owns('BO'), window.HTS_OWN.owns('nope-unknown'), window.HTS_OWN.ownsAll([['BO', 'CB']]), window.HTS_OWN.ownsAll(['CB', 'BO'])])));
    ok(JSON.stringify(api2) === JSON.stringify([true, false, true, true, false]), 'collection: owns, unknown codes, alternatives and all-of rules (' + JSON.stringify(api2) + ')');
    const sc1 = await np.locator('.hrow').count();
    ok(sc1 > 0 && sc1 < sc0, 'collection: scenarios page hides scenarios you cannot play (' + sc0 + ' to ' + sc1 + ')');
    ok(/hidden because of My collection/.test(await np.locator('#ownnote').innerText()), 'collection: scenarios page says how many are hidden');
    ok(await np.locator('#btnOwn').innerText().then(t => /\(1\)/.test(t) || /1/.test(t)), 'collection: header button shows the count');
    await np.goto(base + 'units.html'); await np.waitForTimeout(500);
    ok(/hidden because of My collection/.test(await np.locator('#ownnote').innerText()), 'collection: units page uses the same setting');
    await np.goto(base + 'heroes.html'); await np.waitForTimeout(500);
    ok(/hidden because of My collection/.test(await np.locator('#ownnote').innerText()), 'collection: heroes page uses the same setting');
    await np.goto(base + 'maps.html'); await np.waitForTimeout(800); await np.click('[data-box=all]'); await np.waitForTimeout(300);
    ok(/hidden because of My collection/.test(await np.locator('#ownnote').innerText()), 'collection: maps page uses the same setting');
    await np.click('[data-own-off]'); await np.waitForTimeout(300);
    ok(await np.locator('#ownnote').innerText() === '' && await np.evaluate(() => !window.HTS_OWN.active()), 'collection: Show everything switches the filter off');
    await np.goto(base + 'scenarios.html?b=omaha'); await np.waitForTimeout(500);
    ok(await np.locator('.hrow').count() === sc0, 'collection: switching off on one page applies to the others');
    await clear();
    ok(nerrs.length === 0, 'collection: no console errors on the item pages ' + nerrs.join('|'));
    await np.close();
  }
  // option shapes: a slot only takes options of its own shape (Big Red One rulebook p.6, Stalingrad rulebook p.22)
  {
    const vm = require('vm'); const ctx = { window: { HTS_DATA: {} } }; ctx.HTS_DATA = ctx.window.HTS_DATA; vm.createContext(ctx);
    fs.readdirSync(path.join(root, 'data')).filter(f => /^hon-(bro|hos)-(us|ge|uk|ru|gs)\.js$/.test(f)).forEach(f => vm.runInContext(fs.readFileSync(path.join(root, 'data', f), 'utf8'), ctx));
    let badSize = 0, hp = 0, hpBad = 0;
    Object.keys(ctx.HTS_DATA).forEach(k => { const D = ctx.HTS_DATA[k];
      D.tiles.forEach(t => t.slots.forEach(s => { if (s.size !== 'w' && s.size !== 'n') badSize++; if (t.set === 'HoS-HP') { hp++; if (s.size !== 'n') hpBad++; } }));
      D.options.forEach(o => { if (o.size !== 'w' && o.size !== 'n') badSize++; if (o.set === 'HoS-HP') { hp++; if (o.size !== 'n') hpBad++; } }); });
    ok(badSize === 0, 'shapes: every slot and option is wide or narrow');
    ok(hp === 13 && hpBad === 0, 'shapes: Stalingrad Heroic Platoon slots and options are all narrow (' + hp + ' checked)');
    const shp = await b.newPage({ viewport: { width: 1280, height: 900 } }); shp.on('dialog', d => d.accept());
    await shp.goto(base + 'builder.html'); await shp.click('[data-nation="ru"]');
    await shp.locator('.lcard', { hasText: 'Sasha and the Beasts' }).first().locator('[data-add]').click();
    await shp.locator('.atile .slot').first().click();
    const shapeTxt = await shp.locator('#pickMeta').innerText();
    ok(/narrow/.test(shapeTxt) && await shp.locator('.pcard', { hasText: 'Support Team' }).count() >= 1 && await shp.locator('.pcard', { hasText: 'Mortar Group' }).count() === 0, 'shapes: Sasha slot is narrow and lists only narrow options');
    await shp.close();
  }
  // grouped header menu
  {
    const nv = await b.newPage({ viewport: { width: 1280, height: 800 } });
    await nv.goto(base + 'scenarios.html'); await nv.waitForTimeout(400);
    ok(await nv.locator('.top-actions .navgrp').count() === 3 && await nv.locator('.navgrp.here[data-nav="play"]').count() === 1, 'menu: Play, Reference and Archive groups, current group marked');
    ok(!(await nv.locator('.navmenu a[href="units.html"]').isVisible()), 'menu: links are hidden until a group is opened');
    await nv.click('.navgrp[data-nav="ref"] summary'); await nv.click('.navgrp[data-nav="arc"] summary');
    ok(await nv.locator('.navgrp[open]').count() === 1, 'menu: opening one group closes the other');
    await nv.keyboard.press('Escape');
    ok(await nv.locator('.navgrp[open]').count() === 0, 'menu: Escape closes the menu');
    await nv.click('.navgrp[data-nav="ref"] summary'); await nv.click('.navmenu a[href="units.html"]'); await nv.waitForTimeout(400);
    ok(/units\.html/.test(nv.url()), 'menu: a link inside a group goes to its page');
    await nv.close();
  }
  ok(!JSON.parse(fs.readFileSync(path.join(root, 'data/hon-library.js'), 'utf8').replace(/^window\.HTS_LIB = /, '').replace(/;\s*$/, '')).docs.some(d => ['rules-reference-sheets', 'special-abilities-v1', 'v1-rulebook-wrecks', 'multiplayer-rules-v1', 'aviation-rules-v1', 'compendium-errata', 'unofficial-faq'].indexOf(d.id) >= 0), 'documents: first edition core rules are not on the site (V2 overrides them)');
  // first edition (V1) army boxes in the builder
  {
    const vm = require('vm'); const ctx = { window: { HTS_DATA: {} } }; ctx.HTS_DATA = ctx.window.HTS_DATA; vm.createContext(ctx);
    ['us', 'ge', 'uk', 'fr'].forEach(n => vm.runInContext(fs.readFileSync(path.join(root, 'data', 'hon-v1-' + n + '.js'), 'utf8'), ctx));
    const cnt = ['us', 'ge', 'uk', 'fr'].map(n => ctx.HTS_DATA['hon-v1-' + n].tiles.length + '/' + ctx.HTS_DATA['hon-v1-' + n].options.length).join(' ');
    ok(cnt === '33/89 29/105 19/64 6/10', 'first edition: data holds 33/89 (US), 29/105 (German), 19/64 (Commonwealth) and 6/10 (French) tiles and options (' + cnt + ')');
    let missing = [], bad = [];
    ['us', 'ge', 'uk', 'fr'].forEach(n => { const D = ctx.HTS_DATA['hon-v1-' + n];
      D.tiles.concat(D.options).forEach(x => { if (!fs.existsSync(path.join(root, x.img))) missing.push(x.img); if (typeof x.cost !== 'number' || !x.name) bad.push(x.id); });
      D.tiles.forEach(t => t.slots.forEach(sl => { if (['w', 'n'].indexOf(sl.size) < 0 || !sl.stripes.length) bad.push(t.id); })); });
    ok(missing.length === 0 && bad.length === 0, 'first edition: every tile and option has a picture, a name, a cost and valid slots ' + missing.concat(bad).slice(0, 5).join(','));
    const v1p = await b.newPage({ viewport: { width: 1280, height: 900 } }); const v1errs = []; v1p.on('pageerror', e => v1errs.push(e.message)); v1p.on('dialog', d => d.accept());
    await v1p.goto(base + 'builder.html'); await v1p.evaluate(() => { try { localStorage.clear(); } catch (e) {} }); await v1p.reload(); await v1p.waitForTimeout(400);
    await v1p.fill('#search', 'first edition'); await v1p.waitForTimeout(300);
    ok(await v1p.locator('.lcard').count() === 33 && await v1p.locator('.lcard .v1badge').count() === 33 && await v1p.locator('.lcard', { hasText: 'Sherman Squadron' }).count() === 1, 'first edition: searching "first edition" lists the 32 US first edition tiles, each with the badge');
    await v1p.fill('#search', ''); await v1p.click('[data-nation="ge"]'); await v1p.fill('#search', 'panzergrenadiere'); await v1p.waitForTimeout(300);
    await v1p.locator('.lcard', { has: v1p.locator('.v1badge') }).filter({ hasText: 'PZGR-LEHR' }).first().locator('[data-add]').click();
    ok((await v1p.textContent('#ptsUsed')) === '65' && await v1p.locator('.atile .slot').count() === 4, 'first edition: Panzergrenadiere costs 65 and has 4 slots');
    await v1p.locator('.atile .slot').nth(0).click(); await v1p.waitForTimeout(200);
    const s0 = await v1p.locator('.pcard .nm').allInnerTexts();
    ok(s0.length === 3 && s0.indexOf('Support Group') >= 0, 'first edition: a platoon-stripe slot lists only that platoon\'s long options (' + s0.join(', ') + ')');
    await v1p.keyboard.press('Escape'); await v1p.locator('.atile .slot').nth(1).click(); await v1p.waitForTimeout(200);
    const s1 = await v1p.locator('.pcard .nm').allInnerTexts();
    ok(s1.indexOf('Grenade') >= 0 && s1.indexOf('MG 42') < 0 && s1.indexOf('Support Group') < 0, 'first edition: a black slot lists only first edition black-stripe options, no V2 options (' + s1.join(', ') + ')');
    await v1p.locator('.pcard', { hasText: 'Grenade' }).first().click(); await v1p.waitForTimeout(200);
    ok((await v1p.textContent('#ptsUsed')) === '70', 'first edition: option cost is added (70)');
    await v1p.reload(); await v1p.waitForTimeout(400);
    ok((await v1p.textContent('#ptsUsed')) === '70', 'first edition: the army survives a reload');
    // airborne black (ISS-094): paratrooper options stay off non-airborne tiles
    const ab = await b.newPage({ viewport: { width: 1280, height: 900 } }); ab.on('pageerror', e => v1errs.push(e.message));
    await ab.goto(base + 'builder.html'); await ab.evaluate(() => { try { localStorage.clear(); } catch (e) {} }); await ab.reload(); await ab.waitForTimeout(400);
    await ab.click('[data-nation="us"]'); await ab.fill('#search', 'Sherman Squadron'); await ab.waitForTimeout(300);
    await ab.locator('.lcard', { hasText: '37th' }).first().locator('[data-add]').click(); await ab.waitForTimeout(200);
    { const shSlot = ab.locator('.atile').last().locator('.slot').first(); await shSlot.click(); await ab.waitForTimeout(200);
      const sh = await ab.locator('.pcard .nm').allInnerTexts();
      ok(sh.indexOf('Grenade') >= 0 && sh.indexOf('Ace Driver') >= 0 && sh.indexOf('Knife') < 0 && sh.indexOf('Dropped') < 0 && sh.indexOf('Training Paratrooper') < 0, 'first edition: Sherman Squadron small slot takes generic black and its own options, no airborne ones (' + sh.length + ')');
      await ab.keyboard.press('Escape'); }
    await ab.fill('#search', 'US Paratroopers'); await ab.waitForTimeout(300);
    await ab.locator('.lcard', { hasText: '502' }).first().locator('[data-add]').click(); await ab.waitForTimeout(200);
    { await ab.locator('.atile').last().locator('.slot').nth(1).click(); await ab.waitForTimeout(200);
      const pa = await ab.locator('.pcard .nm').allInnerTexts();
      ok(pa.indexOf('Knife') >= 0 && pa.indexOf('Sprinter') >= 0 && pa.indexOf('Grenade') >= 0 && pa.indexOf('Dropped') < 0 && pa.indexOf('Engineers Squad') < 0, 'first edition: paratrooper small black slot takes small airborne and generic black options, not the large Dropped or Engineers Squad (' + pa.length + ')');
      await ab.keyboard.press('Escape'); }
    await ab.close();
    // French (FFI): first edition nation
    await v1p.fill('#search', ''); await v1p.click('[data-nation="fr"]'); await v1p.waitForTimeout(300);
    ok(await v1p.locator('.lcard').count() === 6 && await v1p.locator('.lcard', { hasText: 'Maquisards' }).locator('.v1badge').count() === 1, 'first edition French: French (FFI) lists the Maquisards tile with the First edition badge');
    await v1p.locator('.lcard', { hasText: 'Maquisards' }).locator('[data-add]').click(); await v1p.waitForTimeout(200);
    const frSlots = await v1p.locator('.atile .slot').count(); let frDone = false;
    for (let i = 0; i < frSlots && !frDone; i++) { await v1p.locator('.atile .slot').nth(i).click(); await v1p.waitForTimeout(150);
      const c = v1p.locator('.pcard', { hasText: 'SOE Agents' }); if (await c.count()) { await c.first().click(); frDone = true; } else await v1p.keyboard.press('Escape'); }
    await v1p.waitForTimeout(200);
    ok(frDone && (await v1p.textContent('#ptsUsed')) === '140', 'first edition French: Maquisards 55 plus SOE Agents 85 totals 140 (' + (await v1p.textContent('#ptsUsed')) + ')');
    await v1p.reload(); await v1p.waitForTimeout(400);
    ok((await v1p.textContent('#ptsUsed')) === '140' && await v1p.locator('#nations .on').innerText() === 'French (FFI)', 'first edition French: the army survives a reload');
    // share link round trip
    const frSnap = Buffer.from(JSON.stringify({ n: 'fr', l: 250, nm: 'ffi', a: [['v1:maquisards', ['v1:soe_agents', null, null]]] })).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    await v1p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await v1p.goto('about:blank'); await v1p.goto(base + 'builder.html#b=' + frSnap); await v1p.waitForTimeout(400);
    ok((await v1p.textContent('#ptsUsed')) === '140' && await v1p.locator('#nations .on').innerText() === 'French (FFI)', 'first edition French: a share link for the French nation loads');
    // old saves: a US army holding a French id drops the entry and does not crash
    await v1p.evaluate(() => { localStorage.setItem('hts.hon.bro.v1', JSON.stringify({ nation: 'us', limit: 250, name: 'old', army: [{ id: 'z1', t: 'v1:maquisards', o: ['v1:soe_agents', null] }], theme: 'light', saved: [] })); });
    await v1p.reload(); await v1p.waitForTimeout(400);
    ok((await v1p.textContent('#ptsUsed')) === '0' && await v1p.locator('.atile').count() === 0, 'first edition French: an old US save holding French ids loads with those entries dropped (' + (await v1p.textContent('#ptsUsed')) + ', ' + await v1p.locator('.atile').count() + ', ' + await v1p.locator('#nations .on').innerText() + ')');
    ok(v1errs.length === 0, 'first edition: no console errors ' + v1errs.join('|'));
    await v1p.evaluate(() => { try { localStorage.clear(); } catch (e) {} }); await v1p.close();
  }
  // stripes: an option must carry only colours that are on the slot
  {
    const stp = await b.newPage({ viewport: { width: 1280, height: 900 } }); stp.on('dialog', d => d.accept());
    await stp.goto(base + 'builder.html'); await stp.evaluate(() => { try { localStorage.clear(); } catch (e) {} }); await stp.reload(); await stp.waitForTimeout(400);
    await stp.locator('.lcard', { hasText: '16th Inf. Reg. A' }).first().locator('[data-add]').click();
    await stp.locator('.atile .slot').first().click(); await stp.waitForTimeout(200);
    const wide = await stp.evaluate(() => { const H = window.HTS, D = H.data(); return Array.from(document.querySelectorAll('.pcard [data-pick], .pcard')).length; });
    const names = await stp.locator('.pcard .nm').allInnerTexts();
    const subs = await stp.evaluate(() => { const D = window.HTS.data(); const t = D.d.tiles.find(x => x.id === 'rifle_platoon_1id_16a'); const sl = t.slots[0]; return D.d.options.filter(o => o.size === sl.size && o.stripes.indexOf('any') < 0 && o.stripes.some(c => sl.stripes.indexOf(c) >= 0) && !o.stripes.every(c => sl.stripes.indexOf(c) >= 0)).map(o => o.id); });
    const shown = await stp.evaluate(() => Array.from(document.querySelectorAll('.pcard')).map(c => c.getAttribute('data-pick') || c.getAttribute('data-opt') || ''));
    ok(names.length >= 3 && subs.length > 0 && subs.every(id => shown.indexOf(id) < 0), 'stripes: the 16th Inf. Reg. A slot does not list options that share only one stripe colour (' + subs.slice(0, 4).join(', ') + ')');
    await stp.close();
  }
  // site-wide search
  {
    const sp = await b.newPage({ viewport: { width: 1100, height: 900 } }); sp.on('dialog', d => d.accept());
    const sperrs = []; sp.on('pageerror', e => sperrs.push(e.message)); sp.on('console', m => { if (m.type() === 'error') sperrs.push(m.text()); });
    const dataReqs = []; sp.on('request', r => { if (/\/data\//.test(r.url())) dataReqs.push(r.url().split('/data/')[1].split('?')[0]); });
    await sp.goto(base + 'search.html'); await sp.waitForTimeout(500);
    ok(dataReqs.join(',') === 'hon-products.js' && await sp.locator('.sgroup').count() === 0, 'search: opening the page loads no search data until the first search (' + dataReqs.join(',') + ')');
    for (const pn of ['index', 'builder', 'scenarios', 'guides', 'search']) {
      await sp.goto(base + pn + '.html'); await sp.waitForTimeout(150);
      const lk = sp.locator('.top-actions > a[href="search.html"]');
      ok(await lk.count() === 1 && (await lk.innerText()).trim() === 'Search', 'search: the header has a plain Search link on ' + pn + '.html');
    }
    await sp.goto(base + 'search.html?q=' + encodeURIComponent('sticky bomb')); await sp.waitForTimeout(2500);
    ok(await sp.inputValue('#q') === 'sticky bomb', 'search: ?q= fills the box and runs the search');
    const gTitles = await sp.locator('.sgroup h2').allInnerTexts();
    ok(['ARMY BUILDER', 'RULES', 'DOCUMENTS', 'HEROES AND EQUIPMENT'].every(t => gTitles.some(g => g.toUpperCase().startsWith(t))), 'search: sticky bomb is found in builder, rules, documents and heroes groups (' + gTitles.join('|') + ')');
    const cnts = await sp.locator('.sgroup .hcount').allInnerTexts();
    ok(cnts.length === gTitles.length && cnts.every(c => /^\d+$/.test(c.trim())) && /^\d+ results? in \d+ groups?\./.test(await sp.locator('#stat').innerText()), 'search: each group shows a count and the total is stated');
    ok(await sp.locator('.sgroup mark').count() >= 4, 'search: matched words are highlighted');
    const swap = async w => { await sp.fill('#q', w); await sp.waitForTimeout(500); return sp.locator('#stat').innerText(); };
    const a1 = await swap('sticky bomb'), a2 = await swap('bomb sticky'), a3 = await swap('sticky bomb qqzzxx');
    ok(a1 === a2 && /results? in/.test(a1) && /^0 results/.test(a3) && await sp.locator('.empty2').count() === 1, 'search: several words are ANDed (word order does not matter, one missing word gives no results)');
    ok(/[?&]q=sticky%20bomb%20qqzzxx/.test(sp.url()), 'search: the URL follows the box (replaceState)');
    // cap and show all
    await sp.fill('#q', 'carentan'); await sp.waitForTimeout(500);
    const bn = Number(await sp.locator('#g-builder .hcount').innerText());
    ok(bn > 8 && await sp.locator('#g-builder .sres').count() === 8 && await sp.locator('#g-builder [data-all]').innerText() === 'Show all ' + bn, 'search: a group shows 8 results and a "Show all N" control');
    await sp.click('#g-builder [data-all]');
    ok(await sp.locator('#g-builder .sres').count() === bn, 'search: Show all lists every result in the group');
    // links go to the right page
    const hrefsOf = async g => sp.locator('#g-' + g + ' .sres a.sname').evaluateAll(a => a.map(x => x.getAttribute('href')));
    await sp.fill('#q', 'suppressed marker'); await sp.waitForTimeout(600);
    const h = {}; for (const g of ['scenarios', 'rules', 'documents', 'tokens', 'icons', 'cards']) h[g] = await hrefsOf(g);
    ok(h.scenarios.every(x => /^scenarios\.html\?b=(bro|omaha|caen|ws|v1|fan|hos)&q=/.test(x)) && h.rules.every(x => /^rules\.html\?b=(bro|omaha|caen)&s=[\d.a-z-]+&k=\d+&q=/.test(x)) && h.documents.every(x => /^guides\.html\?[dg]=/.test(x)) && h.tokens.every(x => /^tokens\.html\?b=/.test(x)) && h.icons.every(x => /^icons\.html\?b=/.test(x)) && h.cards.every(x => /^cards\.html\?s=(us|ge)&q=/.test(x)), 'search: result links use each page\'s own parameters');
    const opened = async (href, sel, msg) => { await sp.goto(base + href); await sp.waitForTimeout(500); ok(await sp.locator(sel).count() >= 1, 'search: ' + msg + ' (' + href.slice(0, 60) + ')'); };
    await opened(h.rules[0], '#rmodal:not([hidden]) .rchunk', 'a rules link opens that section');
    await opened(h.tokens[0], '.hrow.open, .hrow', 'a tokens link lists the token');
    await opened(h.cards[0], '.cgrid .ccard, .cgrid > *', 'a cards link lists the card');
    await opened(h.scenarios.find(x => /b=bro/.test(x)) || h.scenarios[0], '.hrow.open', 'a scenarios link opens the entry');
    // builder links: tile and option, first edition included
    await sp.goto(base + 'search.html?q=' + encodeURIComponent('Maquisards')); await sp.waitForTimeout(1500);
    const mq = await hrefsOf('builder');
    ok(mq.some(x => /^builder\.html\?n=fr&q=Maquisards/.test(x)), 'search: a first edition French tile links to the French builder with the search prefilled (' + mq.slice(0, 2).join(' ') + ')');
    await sp.goto(base + mq.find(x => /n=fr&q=/.test(x))); await sp.waitForTimeout(500);
    ok(await sp.locator('#nations .on').innerText() === 'French (FFI)' && await sp.locator('.lcard', { hasText: 'Maquisards' }).count() === 1 && await sp.inputValue('#search') !== '' && !/\?/.test(sp.url()), 'search: builder.html?n=&q= opens that country with the search box filled and the URL cleaned');
    await sp.goto(base + 'search.html?q=' + encodeURIComponent('SOE Agents')); await sp.waitForTimeout(1500);
    const soe = (await hrefsOf('builder')).find(x => /o=v1%3Asoe_agents/.test(x));
    ok(!!soe, 'search: an option result links with its builder option id (' + soe + ')');
    await sp.goto(base + soe); await sp.waitForTimeout(500);
    ok(/SOE Agents/.test(await sp.locator('#optnote').innerText()) && await sp.locator('.lcard').count() >= 1 && await sp.locator('.lcard').count() < 6, 'search: an option link lists only the tiles with a slot for it');
    await sp.click('[data-opt-clear]');
    ok(await sp.locator('.lcard').count() === 6 && await sp.locator('#optnote').innerText() === '', 'search: the option filter can be cleared');
    // a link for another country asks before it clears an army (the test accepts)
    await sp.goto(base + 'builder.html'); await sp.evaluate(() => { try { localStorage.clear(); } catch (e) {} }); await sp.reload(); await sp.waitForTimeout(300);
    await sp.locator('.lcard').first().locator('[data-add]').click();
    let asked = 0; sp.removeAllListeners('dialog'); sp.on('dialog', d => { asked++; d.dismiss(); });
    await sp.goto(base + 'builder.html?n=ge&q=Feldkommando'); await sp.waitForTimeout(500);
    ok(asked === 1 && await sp.locator('#nations .on').innerText() === 'United States' && await sp.locator('.atile').count() === 1, 'search: a builder link for another country keeps the army if the person says no');
    sp.removeAllListeners('dialog'); sp.on('dialog', d => d.accept());
    await sp.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    // phone width, light and dark
    await sp.setViewportSize({ width: 390, height: 844 });
    for (const th of ['light', 'dark']) {
      await sp.goto(base + 'search.html?q=' + encodeURIComponent('sticky bomb')); await sp.evaluate(t => document.documentElement.setAttribute('data-theme', t), th); await sp.waitForTimeout(2000);
      const m = await sp.evaluate(() => ({ x: document.documentElement.scrollWidth > document.documentElement.clientWidth, bg: getComputedStyle(document.querySelector('.sgroup')).backgroundColor, ink: getComputedStyle(document.querySelector('.sname')).color }));
      ok(!m.x && m.bg !== m.ink, 'search: no sideways scroll at 390px in the ' + th + ' theme');
    }
    ok(sperrs.length === 0, 'search: no console errors ' + sperrs.join('|'));
    await sp.close();
  }
  // edition filter in the builder
  {
    const ep = await b.newPage({ viewport: { width: 1280, height: 900 } }); ep.on('dialog', d => d.accept());
    const eperrs = []; ep.on('pageerror', e => eperrs.push(e.message)); ep.on('console', m => { if (m.type() === 'error') eperrs.push(m.text()); });
    await ep.goto(base + 'builder.html'); await ep.evaluate(() => { try { localStorage.clear(); } catch (e) {} }); await ep.reload(); await ep.waitForTimeout(400);
    const chipsText = async () => (await ep.locator('#edChips .chip').allInnerTexts()).join('|');
    const eds = async () => ep.evaluate(() => { const o = {}; window.HTS.data().d.tiles.forEach(t => { o[t.ed] = (o[t.ed] || 0) + 1; }); return o; });
    let ecount = await eds();
    ok(await chipsText() === 'All|V2|First edition' && !(await ep.locator('#edRow').isHidden()), 'edition: United States offers All, V2 and First edition (no Stalingrad)');
    await ep.click('[data-nation="ge"]'); ecount = await eds();
    ok(await chipsText() === 'All|V2|Stalingrad|First edition' && ecount.v2 > 0 && ecount.hos === 12 && ecount.v1 === 29, 'edition: Germany offers all four chips (' + JSON.stringify(ecount) + ')');
    const lib = async () => ep.locator('.lcard').count();
    const all0 = await lib();
    ok(all0 === ecount.v2 + ecount.hos + ecount.v1, 'edition: All lists every tile (' + all0 + ')');
    await ep.click('[data-ed="v2"]');
    ok(await lib() === ecount.v2 && await ep.locator('.lcard .hosbadge').count() === 0, 'edition: V2 lists only the current edition tiles (' + ecount.v2 + ')');
    await ep.click('[data-ed="hos"]');
    ok(await lib() === 12 && await ep.locator('.lcard .hosbadge:not(.v1badge)').count() === 12, 'edition: Stalingrad lists the 12 Stalingrad tiles in Germany');
    await ep.click('[data-ed="v1"]');
    ok(await lib() === 29 && await ep.locator('.lcard .v1badge').count() === 29, 'edition: First edition lists the 29 German first edition tiles');
    ok(await ep.evaluate(() => localStorage.getItem('hts.hon.edition.v1')) === 'v1', 'edition: the choice is saved under its own key');
    await ep.reload(); await ep.waitForTimeout(400);
    ok(await ep.locator('#edChips .chip.on').innerText() === 'First edition' && await lib() === 29, 'edition: the saved choice is applied on load');
    // countries with one edition have no row, and the saved choice does not hide their tiles
    await ep.click('[data-nation="fr"]');
    ok(await ep.locator('#edRow').isHidden() && await lib() === 6, 'edition: French (first edition only) has no Edition row and lists its 6 tiles');
    await ep.click('[data-nation="ru"]');
    ok(await ep.locator('#edRow').isHidden() && await lib() === 12, 'edition: Soviet Union (Stalingrad only) has no Edition row and lists its 12 tiles');
    await ep.click('[data-nation="us"]'); await ep.waitForTimeout(100);
    ok(await ep.locator('#edChips .chip.on').innerText() === 'First edition' && await lib() === (await eds()).v1, 'edition: the saved choice comes back on a country that has that edition');
    // search words still work, combined with the chip (AND)
    await ep.click('[data-nation="ge"]'); await ep.click('[data-ed="all"]');
    await ep.fill('#search', 'stalingrad'); await ep.waitForTimeout(150);
    ok(await lib() === 12, 'edition: the search word "stalingrad" still finds the Stalingrad tiles');
    await ep.fill('#search', 'first edition'); await ep.waitForTimeout(150);
    ok(await lib() === 29, 'edition: the search words "first edition" still find the first edition tiles');
    await ep.click('[data-ed="v2"]'); await ep.fill('#search', 'stalingrad'); await ep.waitForTimeout(150);
    ok(await lib() === 0, 'edition: V2 plus the search word "stalingrad" is an AND and lists nothing');
    await ep.fill('#search', ''); await ep.click('[data-ed="all"]');
    // tiles in the army stay when the filter changes, and the picker still lists every option that fits
    await ep.click('[data-nation="us"]');
    await ep.fill('#search', 'Rifle Platoon'); await ep.waitForTimeout(150);
    await ep.locator('.lcard', { hasText: 'Rifle Platoon' }).filter({ hasNot: ep.locator('.v1badge') }).first().locator('[data-add]').click();
    await ep.fill('#search', 'first edition'); await ep.waitForTimeout(150);
    await ep.locator('.lcard .v1badge').first().locator('xpath=ancestor::div[contains(@class,"lcard")]').locator('[data-add]').click();
    ok(await ep.locator('.atile').count() === 2, 'edition: a V2 and a first edition tile are in the army');
    await ep.fill('#search', '');
    await ep.locator('.atile').first().locator('.slot').first().click(); await ep.waitForTimeout(150);
    const pickAll = await ep.locator('.pcard').count(); await ep.keyboard.press('Escape');
    await ep.click('[data-ed="v1"]');
    ok(await ep.locator('.atile').count() === 2 && await ep.locator('#board .atile h3').first().innerText() !== '', 'edition: the army keeps tiles from the other edition');
    await ep.locator('.atile').first().locator('.slot').first().click(); await ep.waitForTimeout(150);
    ok(await ep.locator('.pcard').count() === pickAll && pickAll > 0, 'edition: the option picker still lists every option that fits the slot (' + pickAll + ')');
    await ep.keyboard.press('Escape');
    // set chips follow the edition
    await ep.click('[data-ed="all"]');
    const setsAll = await ep.locator('#setChips .chip').allInnerTexts();
    await ep.click('[data-ed="v2"]');
    const setsV2 = await ep.locator('#setChips .chip').allInnerTexts();
    ok(setsAll.some(x => /^hon1-/.test(x)) && setsV2.length > 0 && !setsV2.some(x => /^hon1-/.test(x)), 'edition: set chips list only the sets of the chosen edition (' + setsAll.length + ' to ' + setsV2.length + ')');
    await ep.click('[data-ed="all"]'); await ep.click('#setChips .chip:has-text("hon1-")');
    const withSet = await lib();
    await ep.click('[data-ed="v2"]');
    ok(await ep.locator('#setChips .chip.on').count() === 0 && await lib() > withSet, 'edition: a chosen set that the new edition does not have is dropped, not left filtering');
    // My collection: the note counts what the collection alone hides
    await ep.click('[data-ed="all"]');
    await ep.evaluate(() => { try { localStorage.setItem('hts.hon.own.v1', JSON.stringify({ own: { CB: true }, only: true })); } catch (e) {} });
    await ep.reload(); await ep.waitForTimeout(400);
    const noteN = async () => { const t = await ep.locator('#ownnote').innerText(); const m = /^(\d+) tiles? (is|are) hidden/.exec(t.trim()); return m ? Number(m[1]) : 0; };
    const dataCount = async f => ep.evaluate(f => { const D = window.HTS.data(); return D.d.tiles.filter(t => (f.ed === 'all' || t.ed === f.ed)).length; }, f);
    const shown = {}, hid = {};
    for (const e of ['all', 'v2', 'v1']) { await ep.click('[data-ed="' + e + '"]'); shown[e] = await lib(); hid[e] = await noteN(); }
    const tot = {}; for (const e of ['all', 'v2', 'v1']) tot[e] = await dataCount({ ed: e });
    ok(['all', 'v2', 'v1'].every(e => shown[e] + hid[e] === tot[e]), 'edition: with My collection on, shown plus hidden equals the tiles of that edition (' + JSON.stringify({ shown, hid, tot }) + ')');
    ok(shown.all === 6 && hid.v2 === tot.v2 - 6 && shown.v1 === 0 && hid.v1 === tot.v1, 'edition: the collection note does not count tiles that the edition chip already removes');
    await ep.click('[data-ed="v2"]'); const before = await lib(), nh = await noteN();
    await ep.click('[data-own-off]'); await ep.waitForTimeout(150);
    ok(await lib() === before + nh, 'edition: "Show everything" adds exactly the number of tiles the note gave (' + nh + ')');
    // a link from the search shows its tile whatever edition was saved
    await ep.evaluate(() => { try { localStorage.clear(); localStorage.setItem('hts.hon.edition.v1', 'v2'); } catch (e) {} });
    await ep.goto(base + 'builder.html?n=ge&q=PZGR-LEHR&ed=v1'); await ep.waitForTimeout(400);
    ok(await ep.locator('#edChips .chip.on').innerText() === 'First edition' && await ep.locator('.lcard', { hasText: 'PZGR-LEHR' }).count() >= 1 && await ep.evaluate(() => localStorage.getItem('hts.hon.edition.v1')) === 'v2', 'edition: a search link with ed= shows its tile and leaves the saved choice alone');
    await ep.goto(base + 'builder.html?n=ge&q=PZGR-LEHR'); await ep.waitForTimeout(400);
    ok(await ep.locator('#edChips .chip.on').innerText() === 'All' && await ep.locator('.lcard', { hasText: 'PZGR-LEHR' }).count() >= 1, 'edition: a link with no ed= shows its tile too (the saved choice is set aside for that visit)');
    ok(eperrs.length === 0, 'edition: no console errors ' + eperrs.join('|'));
    await ep.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await ep.close();
  }
  // scenario filters: kind, army size, needs
  {
    const vm = require('vm'); const ctx = { window: {} }; vm.createContext(ctx);
    ['hon-library', 'hon-needs'].forEach(f => vm.runInContext(fs.readFileSync(path.join(root, 'data', f + '.js'), 'utf8'), ctx));
    const libDocs = ctx.window.HTS_LIB.docs, NEEDS = ctx.window.HTS_NEEDS;
    const fp = await b.newPage({ viewport: { width: 1280, height: 900 } }); fp.on('dialog', d => d.accept());
    const fperrs = []; fp.on('pageerror', e => fperrs.push(e.message)); fp.on('console', m => { if (m.type() === 'error') fperrs.push(m.text()); });
    const go = async qs => { await fp.goto(base + 'scenarios.html' + qs); await fp.waitForTimeout(350); };
    const rows = () => fp.locator('.hrow').count();
    const chipN = async sel => { const o = {}; for (const t of await fp.locator(sel + ' .chip').allInnerTexts()) { const m = /^(.*?)\s+(\d+)$/.exec(t.replace(/\n/g, ' ').trim()); o[m[1]] = Number(m[2]); } return o; };
    await fp.goto(base + 'scenarios.html'); await fp.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await go('?b=bro');
    ok(await fp.locator('#kinds .chip').count() === 3 && await fp.locator('#sizes .chip').count() === 5 && await fp.locator('#needsSel').count() === 1, 'scenario filters: Kind, Army size and Needs are on the page');
    let z = await chipN('#sizes');
    ok(z['Up to 150'] === 0 && z['151 to 300'] === 2 && z['Over 300'] === 6 && z['Not stated'] === 4 && z.All === 12, 'scenario filters: Big Red One sizes read from the Armies line (' + JSON.stringify(z) + ')');
    await fp.click('[data-fz="le300"]');
    ok(await rows() === 2 && (await fp.locator('.hrow .ht').allInnerTexts()).join('|') === 'Plain Carnage|Chicken Game', 'scenario filters: 151 to 300 lists Plain Carnage and Chicken Game');
    await fp.click('[data-fz="none"]');
    ok(await rows() === 4 && /4 of 12 entries/.test(await fp.locator('#stat').innerText()), 'scenario filters: Not stated holds the four rules entries and the count is shown');
    await fp.click('[data-fz="all"]');
    let k = await chipN('#kinds');
    ok(k.Official === 12 && k['Fan made'] === 0, 'scenario filters: every box scenario is official');
    await fp.click('[data-fk="fan"]');
    ok(await rows() === 0 && await fp.locator('.empty2').count() === 1, 'scenario filters: Fan made on a box booklet lists nothing and says so');
    await fp.click('#btnClear'); ok(await rows() === 12 && await fp.locator('#btnClear').isHidden(), 'scenario filters: Clear filters resets the three filters');
    // other lists: first edition, fan made, Stalingrad
    const inList = (g, f) => libDocs.filter(d => g.indexOf(d.group) >= 0).filter(f).length;
    await go('?b=v1'); k = await chipN('#kinds'); z = await chipN('#sizes');
    const v1g = ['scenarios', 'single', 'gazettes'], fan1 = inList(v1g, d => d.ed === 'Community');
    ok(fan1 === 2 && k['Fan made'] === fan1 && k.Official === inList(v1g, () => true) - fan1, 'scenario filters: the first edition list marks its ' + fan1 + ' community documents as fan made (' + JSON.stringify(k) + ')');
    ok(z['Not stated'] > z['Up to 150'] + z['151 to 300'] + z['Over 300'] && z['Not stated'] + z['Up to 150'] + z['151 to 300'] + z['Over 300'] === z.All, 'scenario filters: first edition entries without a points figure fall under Not stated (' + JSON.stringify(z) + ')');
    await fp.click('[data-fk="fan"]'); ok(await rows() === fan1, 'scenario filters: Fan made narrows the first edition list to its community documents');
    await go('?b=fan'); k = await chipN('#kinds'); z = await chipN('#sizes');
    ok(k['Fan made'] === 43 && k.Official === 0 && z['Up to 150'] === 2 && z['Not stated'] > 0, 'scenario filters: the fan made list is all fan made, with two up to 150 (' + JSON.stringify(z) + ')');
    await fp.click('[data-fz="le150"]');
    const two = libDocs.find(d => d.id === 'fan-two-bridges');
    const manoir = libDocs.find(d => d.id === 'fan-the-la-manoir-farmhouse-6-june-1944'), tl = (await fp.locator('.hrow .ht').allInnerTexts()).map(t => t.replace(/…|\.\.\./g, ''));
    ok(await rows() === 2 && tl.indexOf(two.title.replace(/…|\.\.\./g, '')) >= 0 && tl.indexOf(manoir.title.replace(/…|\.\.\./g, '')) >= 0, 'scenario filters: the 95 point and the 140 point fan scenarios are the two up to 150');
    await fp.locator('.hhead').first().click();
    ok(/Army size/.test(await fp.locator('.hbody:not([hidden])').innerText()), 'scenario filters: an opened library entry says where its army size comes from');
    await go('?b=hos'); k = await chipN('#kinds');
    ok(k.Official === 25 && k['Fan made'] === 0, 'scenario filters: Stalingrad documents are official');
    await go('?b=omaha&z=gt300');
    ok((await fp.locator('.hrow .ht').allInnerTexts()).some(t => /Big River/i.test(t)) && await rows() === 4, 'scenario filters: the Omaha scenario with armies written as (Task Force, 495) is read too');
    // Needs
    await go('?b=bro');
    const opts = async () => fp.locator('#needsSel option').evaluateAll(o => o.map(x => ({ v: x.value, t: x.textContent, d: x.disabled })));
    let o1 = await opts();
    ok(o1.length === 2 && o1[1].v === 'CB' && /Big Red One \(8\)/.test(o1[1].t), 'scenario filters: Needs lists only products a listed scenario needs (' + o1.map(x => x.t).join(', ') + ')');
    let allOk = true, msg = '';
    for (const bx of ['bro', 'omaha', 'caen', 'ws', 'v1', 'fan', 'hos']) {
      await go('?b=' + bx);
      const ol = await opts();
      const want = new Set(); const ids = await fp.evaluate(() => window.HTS_SCEN_UI.load().entries.map(e => [e.id, !!e.v1]));
      ids.forEach(([id, v1]) => (NEEDS[(v1 ? 'lib' : bx) + ':' + id] || []).forEach(c => (Array.isArray(c) ? c : [c]).forEach(x => want.add(x))));
      const got = ol.filter(x => x.v).map(x => x.v);
      if (got.length !== want.size || got.some(x => !want.has(x))) { allOk = false; msg += bx + ' '; }
      for (const o of ol.filter(x => x.v && !x.d).slice(0, 3)) {
        await fp.selectOption('#needsSel', o.v); await fp.waitForTimeout(80);
        const n = Number(/\((\d+)\)$/.exec(o.t)[1]);
        if (await rows() !== n || n < 1) { allOk = false; msg += bx + ':' + o.v + ' '; }
        await fp.selectOption('#needsSel', '');
      }
    }
    ok(allOk, 'scenario filters: on every list Needs offers exactly the products its scenarios need, and each count matches its results ' + msg);
    // filters combine with each other, the type chips and the search box
    await go('?b=bro'); await fp.selectOption('#needsSel', 'CB');
    ok(await rows() === 8 && /4 with no needs tagged are left out/.test(await fp.locator('#stat').innerText()), 'scenario filters: Needs CB lists the 8 tagged scenarios and says 4 untagged ones are left out');
    await fp.click('[data-type="Campaign"]');
    ok(await rows() === 6, 'scenario filters: Needs plus the Campaign type chip (6)');
    await fp.fill('#q', 'caumont'); await fp.waitForTimeout(300);
    ok(await rows() === 3 && (await fp.locator('.hrow .ht').first().innerText()).startsWith('Caumont'), 'scenario filters: Needs, type and search words combine (the three scenarios that mention Caumont, Caumont first)');
    await fp.click('[data-fk="fan"]'); ok(await rows() === 0, 'scenario filters: adding Fan made to those gives none');
    await fp.click('[data-fk="all"]'); await fp.click('[data-fz="le300"]'); ok(await rows() === 0, 'scenario filters: Caumont is over 300, so 151 to 300 gives none');
    await fp.click('[data-fz="gt300"]'); ok(await rows() === 3, 'scenario filters: and Over 300 gives them');
    const u = new URL(fp.url());
    ok(u.searchParams.get('n') === 'CB' && u.searchParams.get('z') === 'gt300' && u.searchParams.get('t') === 'Campaign' && u.searchParams.get('q') === 'caumont' && !u.searchParams.get('k'), 'scenario filters: the filters are kept in the URL like the other state (' + u.search + ')');
    await fp.goto(fp.url()); await fp.waitForTimeout(350);
    ok(await rows() === 3 && await fp.locator('#needsSel').inputValue() === 'CB' && await fp.locator('[data-fz="gt300"].on').count() === 1 && await fp.locator('[data-type="Campaign"].on').count() === 1, 'scenario filters: the URL restores the filters');
    await fp.fill('#q', ''); await fp.waitForTimeout(300);
    // the box switch keeps what still applies and drops what does not
    await fp.click('[data-box="caen"]'); await fp.waitForTimeout(250);
    ok(await fp.locator('#needsSel').inputValue() === 'CB' && /^[1-9]\d* of 8 entries/.test(await fp.locator('#stat').innerText()) && !/[?&]t=/.test(fp.url()), 'scenario filters: switching box drops a type chip the box lacks and keeps Needs CB where it applies');
    await go('?b=bro&n=ECG'); ok(await fp.locator('#needsSel').inputValue() === '' && await rows() === 12, 'scenario filters: a Needs product that this list does not offer is ignored');
    // My collection
    await fp.evaluate(() => { try { localStorage.setItem('hts.hon.own.v1', JSON.stringify({ own: { CB: true }, only: true })); } catch (e) {} });
    await go('?b=omaha&z=gt300');
    const hid = async () => { const m = /^(\d+) scenarios? (is|are) hidden/.exec((await fp.locator('#ownnote').innerText()).trim()); return m ? Number(m[1]) : 0; };
    const nHid = await hid();
    ok(nHid === 4 && await rows() === 0, 'scenario filters: the collection note counts the 4 Omaha scenarios that My collection hides under Over 300 (' + nHid + ')');
    await fp.click('[data-fz="none"]'); ok(await hid() === 0 && await rows() === 8, 'scenario filters: under Not stated the collection note counts nothing and 8 entries show');
    await fp.click('[data-fz="gt300"]'); await fp.click('[data-own-off]'); await fp.waitForTimeout(150);
    ok(await rows() === nHid, 'scenario filters: "Show everything" adds exactly the number of scenarios the note gave');
    await fp.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    // phone
    await fp.setViewportSize({ width: 390, height: 844 });
    for (const th of ['light', 'dark']) {
      await go('?b=v1&z=le300&k=official'); await fp.evaluate(t => document.documentElement.setAttribute('data-theme', t), th);
      ok(await fp.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1) && await fp.locator('#needsSel').isVisible(), 'scenario filters: no sideways scroll at 390px in the ' + th + ' theme');
    }
    ok(fperrs.length === 0, 'scenario filters: no console errors ' + fperrs.join('|'));
    await fp.close();
  }
  // trackers
  const cp = require('child_process');
  let trk = ''; try { trk = cp.execSync('python3 tools/units_tracker.py --strict', { cwd: root }).toString(); } catch (e) { trk = 'FAILED ' + e.stdout; }
  ok(/gaps 0/.test(trk), 'unit tracker: every unit has a History entry or a recorded exclusion');
  ok(fs.existsSync(path.join(root, 'docs', 'lowres-images.csv')) && fs.existsSync(path.join(root, 'docs', 'units-tracker.csv')), 'docs/ trackers exist');
  await b.close(); srv.close();
})();
