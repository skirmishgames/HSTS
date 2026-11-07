// Smoke test. Run: node test/smoke.js  (needs playwright; serves the repo on a local port)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.json': 'application/json' };
const srv = http.createServer((req, res) => {
  let p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (p.endsWith('/')) p += 'index.html';
  fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); res.end(b); });
});
function ok(c, m) { if (!c) { console.error('FAIL: ' + m); process.exitCode = 1; } else console.log('ok: ' + m); }
(async () => {
  await new Promise(r => srv.listen(0, r));
  const url = 'http://127.0.0.1:' + srv.address().port + '/index.html';
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
  await up.goto(url.replace('index.html', 'units.html') + '?n=us&q=' + q);
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
  ok(await up.locator('#boxes button.on').textContent() === 'Big Red One', 'game box filter shows Big Red One');
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
  await rp.goto(url.replace('index.html', 'rules.html'));
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
  const hurl = url.replace('index.html', 'history.html');
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
  await sp.goto(url.replace('index.html', 'scenarios.html'));
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
  ok(hrefs.length === 2 && hrefs.every(h => h.startsWith('index.html#b=')), 'open row shows American and German builder links');
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
    await lp.goto(url.replace('index.html', 'units.html') + '?n=' + n + '&q=' + encodeURIComponent(q));
    await lp.waitForTimeout(150);
    if (await lp.locator('.ucard').count() < 1) bad.push(id + ':' + q);
  }
  ok(bad.length === 0, 'history find links all return tiles ' + bad.join(','));
  await rp.close();
  // tokens page
  const base = url.replace('index.html', '');
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
  ok(await hrp.locator('.eqcard').count() === 12, 'equipment shows 12 cards across boxes');
  await hrp.click('[data-nation="ge"]');
  ok(await hrp.locator('.hrow').count() === 4, 'German heroes page lists 4 hero tiles');
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
  ok(await hrp.locator('.hrow').count() === 3 && await hrp.locator('.eqcard').count() === 7, 'heroes: Big Red One German 3 heroes, 7 equipment cards');
  await hrp.click('[data-nation="us"]'); await hrp.click('[data-box="promo"]');
  ok(await hrp.locator('.hrow').count() === 3 && await hrp.locator('.eqcard').count() === 0, 'heroes: promo filter shows 3 US heroes and no equipment');
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
  ok(await sp.locator('.hrow').count() === 5, 'omaha scenarios: 5 entries');
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
  ok(await xp.locator('.hrow').count() === 4, 'expansions: 4 V2 boxes are in the tool');
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
  ok(xImgs.length === 22 && xImgs.every(f => fs.existsSync(path.join(root, f))), 'expansions: every preview image exists (' + xImgs.length + ')');
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
  ok(await ip.locator('.gcard').count() === 50, 'icons: 50 entries across both boxes');
  await ip.fill('#q', 'sniper'); await ip.waitForTimeout(250);
  ok(await ip.locator('.gcard').count() === 1 && await ip.locator('.gcard img').count() >= 1, 'icons: search finds Sniper with its picture');
  await ip.fill('#q', ''); await ip.locator('#boxes [data-box="omaha"]').click();
  ok(await ip.locator('.gcard').count() === 17, 'icons: Bloody Omaha has 17 entries');
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
  const wanted = { bro: ['rules', 'free', 'multi', 'plain', 'chicken', 'night', 'caumont', 'quesnay', 'surrounded', 'windy', 'pass', 'tracker'], omaha: ['landings', 'part1', 'part2', 'little', 'big'] };
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
  await b.close(); srv.close();
})();
