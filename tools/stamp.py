#!/usr/bin/env python3
"""Add or update ?v=<version> on every local css, js and data link in the html pages.
Browsers and GitHub Pages cache these files. Without a version stamp a visitor can get a new page
with an old stylesheet. Run before each release: python3 tools/stamp.py hts-v28"""
import glob, re, sys
v = sys.argv[1] if len(sys.argv) > 1 else None
if not v:
    sys.exit('usage: stamp.py <version>')
pat = re.compile(r'((?:href|src)="(?:css|js|data)/[^"?#]+\.(?:css|js))(?:\?v=[^"]*)?"')
n = 0
for f in sorted(glob.glob('*.html')):
    s = open(f).read()
    t = pat.sub(lambda m: m.group(1) + '?v=' + v + '"', s)
    if t != s:
        open(f, 'w').write(t); n += 1
print('stamped', n, 'pages with', v)
