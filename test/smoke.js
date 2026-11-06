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
