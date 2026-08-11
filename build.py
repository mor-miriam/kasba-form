#!/usr/bin/env python3
"""Generates one folder per supplier code from index.html.
Run after editing index.html:  python3 build.py
Codes live in CODES below and must match CODES in a1.js."""
import pathlib

CODES = {
    "q7m2k": "kasba",
    "v4kdz": "nyi",
    "h8rnp": "oba",
    "t5xwb": "coulisse",
}

root = pathlib.Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")

for code in CODES:
    out = html.replace("<head>", '<head>\n<base href="../">', 1)
    out = out.replace('<script src="a1.js">',
                      '<script>window.SUP="%s";</script>\n<script src="a1.js">' % code, 1)
    d = root / code
    d.mkdir(exist_ok=True)
    (d / "index.html").write_text(out, encoding="utf-8")
    print("built", code)
