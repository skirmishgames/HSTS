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
