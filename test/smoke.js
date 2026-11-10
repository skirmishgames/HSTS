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
  ok(await up.locator('#boxes button.on').textContent() === 'All boxes' && await up.locator('#boxes button').count() === 5, 'game box filter offers All boxes plus four boxes');
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

  // My collection filter in the builder
  await tp.goto(base + 'builder.html'); await tp.evaluate(() => { try { localStorage.removeItem('hts.hon.own.v1'); } catch (e) {} }); await tp.reload(); await tp.waitForTimeout(400);
  const own0 = await tp.locator('.lcard').count();
  ok((await tp.textContent('#ownState')).includes('showing everything'), 'collection: not set by default');
  await tp.click('#btnOwn'); await tp.check('[data-own="CB"]'); await tp.click('#ownClose'); await tp.waitForTimeout(200);
  const own1 = await tp.locator('.lcard').count();
  ok(own0 > own1 && own1 === 6, 'collection: only Big Red One tiles after ticking CB (' + own0 + ' to ' + own1 + ')');
  ok((await tp.textContent('#ownState')).startsWith('1 of 8'), 'collection: status line counts products');
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
      ok(await ap.locator('.warnings p:not(.bad)').filter({ hasNotText: 'SP instead of a cost' }).count() === 0, 'caen ' + id + ' ' + key + ' has no slot warnings');
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
  ok(await xp.locator('.hrow').count() === 158, 'expansions: 158 products listed');
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
  await mpg.locator('.mcard', { hasText: 'House 2x2' }).locator('[data-add]').click();
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
  ok(await mpg.locator('.mcard').count() === 80, 'maps: all boxes lists 80 pieces');
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
  await mpg.locator('.mcard', { hasText: 'House 1x1' }).locator('.mthumb').click();
  ok(await mpg.locator('#mmodal:not([hidden]) img').count() === 2, 'maps: viewer shows both sides');
  await mpg.keyboard.press('Escape');
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
  // icon glossary and rules compendium
  const ip = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const iperrs = []; ip.on('pageerror', e => iperrs.push(e.message)); ip.on('console', m => { if (m.type() === 'error') iperrs.push(m.text()); });
  await ip.goto(base + 'icons.html'); await ip.waitForTimeout(300);
  ok(await ip.locator('.gcard').count() === 63, 'icons: 63 entries across all three boxes');
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
  ok(await hm.locator('#boxGrid .boxcard').count() === 4 && await hm.locator('#boxGrid .boxcard[href="box.html?b=ws"]').count() === 1 && await hm.locator('#boxGrid .boxcard[href="box.html?b=hon1"]').count() === 1 && await hm.locator('.hero-link[href="box.html?b=bro"]').count() === 1, 'landing: Big Red One as the main box, two battle packs, War Stories and the first edition as option tiles');
  ok(await hm.locator('.gocard').count() === 12, 'landing: twelve shortcuts');
  ok((await hm.locator('.boxcard img').evaluateAll(a => a.every(i => i.complete && i.naturalWidth > 0))) && (await hm.locator('.hero-art').evaluate(i => i.complete && i.naturalWidth > 0)), 'landing: box art loads');
  ok(await hm.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), 'landing: no sideways scroll on a phone');
  const gohrefs = await hm.locator('.gocard').evaluateAll(a => a.map(x => x.getAttribute('href')));
  const missingPages = gohrefs.filter(h => !fs.existsSync(path.join(root, h.split('?')[0])));
  ok(missingPages.length === 0, 'landing: every shortcut goes to a page that exists ' + missingPages.join(','));
  await hm.goto(base + 'box.html?b=bro'); await hm.goto(base + 'index.html#b=abc'); await hm.waitForTimeout(300);
  ok(/builder\.html/.test(hm.url()), 'old army links on index.html#b= forward to the builder');
  for (const bx of ['bro', 'omaha', 'caen', 'ws', 'hon1']) {
    await hm.goto(base + 'box.html?b=' + bx); await hm.waitForTimeout(250);
    const hrefs = await hm.locator('#boxLinks a').evaluateAll(a => a.map(x => x.getAttribute('href')));
    const miss = hrefs.filter(h => !fs.existsSync(path.join(root, h.split('?')[0])));
    ok(hrefs.length >= (bx === 'hon1' || bx === 'ws' ? 1 : 8) && miss.length === 0, 'box ' + bx + ': links go to pages that exist (' + hrefs.length + ')');
    ok(await hm.locator('.bh-art').evaluate(i => i.complete && i.naturalWidth > 0), 'box ' + bx + ': art loads');
    ok(await hm.locator('#boxOther li').count() === 4, 'box ' + bx + ': links to the other four boxes');
  }
  await hm.goto(base + 'box.html?b=caen'); await hm.waitForTimeout(250);
  ok(await hm.locator('#boxExp a').count() === 2, 'box caen: Windsor & Jupiter links');
  const boxData = await hm.evaluate(() => JSON.parse(JSON.stringify(window.HTS_BOXES)));
  const wantScen = { bro: 'scenarios.html?b=bro', omaha: 'scenarios.html?b=omaha', caen: 'scenarios.html?b=caen', ws: 'scenarios.html?b=ws' };
  ok(boxData.boxes.filter(x => !x.edition).every(x => x.links.some(l => l.href === wantScen[x.id]) && fs.existsSync(path.join(root, x.art))), 'box data: each box links to its scenarios and has art');
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
  ok(await hm.locator('.hrow').count() === 42 && /42 of 42/.test(await hm.locator('#stat').innerText()), 'scenarios fan made: 42 entries');
  ok(await hm.locator('.hrow .hbadges .hb', { hasText: 'Fan made' }).count() === 42 && /not official/i.test(await hm.locator('#srcnote').innerText()), 'scenarios fan made: every entry is badged fan made and the note says not official');
  ok(await hm.locator('[data-type="Small armies"]').count() === 1 && await hm.locator('[data-type="Tournament"]').count() === 1 && await hm.locator('[data-type="Campaign"]').count() === 1, 'scenarios fan made: type chips');
  await hm.fill('#q', 'Wittmann'); await hm.waitForTimeout(400);
  ok(await hm.locator('.hrow').count() >= 2, 'scenarios fan made: search finds Wittmann scenarios');
  ok(await hm.locator('#boxes button[data-box="hos"]').count() === 1, 'scenarios page: Heroes of Stalingrad button');
  await hm.goto(base + 'scenarios.html?b=hos'); await hm.waitForTimeout(400);
  ok(await hm.locator('.hrow').count() === 16 && /Eastern Front/.test(await hm.locator('#srcnote').innerText()), 'scenarios Stalingrad: 16 documents, note names the Eastern Front');
  ok(await hm.locator('[data-type="Mini campaign"]').count() === 1 && await hm.locator('[data-type="Battlefield Stories"]').count() === 1, 'scenarios Stalingrad: type chips');
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
  // look and feel: self-hosted fonts and nav icons on every page
  const navPages = ['index', 'box', 'builder', 'units', 'rules', 'scenarios', 'scenario', 'tokens', 'icons', 'heroes', 'cards', 'maps', 'expansions', 'history', 'guides'];
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
  ok(LIB.n === 202 && LIB.g === 11, 'documents: 202 documents in 11 groups');
  ok(await gp.locator('.dcard').count() === 202, 'documents: every document is listed');
  const missingLib = [];
  for (const [id, n, pdf] of LIB.ids) { for (let k = 1; k <= n; k++) { if (!fs.existsSync(path.join(root, 'img/hon/lib/' + id + '/p' + String(k).padStart(2, '0') + '.webp'))) missingLib.push(id + k); } if (pdf && !fs.existsSync(path.join(root, pdf))) missingLib.push(pdf); }
  ok(missingLib.length === 0, 'documents: every page picture and PDF exists ' + missingLib.slice(0, 5).join(','));
  const FANC = await gp.evaluate(() => { const d = window.HTS_LIB.docs.filter(x => x.group === 'fanmade'); return { n: d.length, pdf: d.filter(x => x.pdf).length, bad: d.filter(x => x.ed !== 'Community' || !x.kind || !/^Fan made|^OPJH/.test(x.credit)).length, big: d.filter(x => x.pdf && /MB/.test(x.pdf.size) && parseFloat(x.pdf.size) > 20).length }; });
  ok(FANC.n === 42 && FANC.pdf === 33 && FANC.bad === 0 && FANC.big === 0, 'documents: 42 fan made documents, 33 with a PDF, all labelled community and fan made, no PDF over 20 MB ' + JSON.stringify(FANC));
  await gp.goto(base + 'guides.html?d=fan-the-bunker'); await gp.waitForTimeout(400);
  ok(/Fan made/.test(await gp.locator('.smeta').innerText()) && /not official/i.test(await gp.locator('.snote').first().innerText()) && await gp.locator('a[download]').count() === 1, 'fan made document: labelled unofficial, has a PDF');
  await gp.goto(base + 'guides.html?d=fan-t1-encounter-on-the-road'); await gp.waitForTimeout(400);
  ok(await gp.locator('a[download]').count() === 0 && /no PDF to download/i.test(await gp.locator('#out').innerText()), 'fan made document without a good layout: web only, no PDF');
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
  // trackers
  const cp = require('child_process');
  let trk = ''; try { trk = cp.execSync('python3 tools/units_tracker.py --strict', { cwd: root }).toString(); } catch (e) { trk = 'FAILED ' + e.stdout; }
  ok(/gaps 0/.test(trk), 'unit tracker: every unit has a History entry or a recorded exclusion');
  ok(fs.existsSync(path.join(root, 'docs', 'lowres-images.csv')) && fs.existsSync(path.join(root, 'docs', 'units-tracker.csv')), 'docs/ trackers exist');
  await b.close(); srv.close();
})();
