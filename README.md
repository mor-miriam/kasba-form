# shipment-form

MIRIAM House of Design — supplier shipment declaration form.

One page, one Make webhook, four personal links. The link a supplier receives uses an
opaque code, so the supplier's name never appears in the URL.

| Supplier | Link | Language |
|---|---|---|
| Kasba (מתפרה) | `/q7m2k/` | Hebrew |
| NYI Fabrics | `/v4kdz/` | English |
| OBA Blinds | `/h8rnp/` | English |
| Coulisse | `/t5xwb/` | English |

Legacy `?s=kasba` style links still work, so anything already sent out keeps working.

Opening the page without a valid code shows a "use your personal link" notice.
The links are unguessable, not secret — the site is public.

Files: `index.html` · `a1.js` (config + i18n) · `a2.js` (app logic) · `s1.css` `s2.css`

## After editing index.html

The `/<code>/` folders are generated copies of `index.html`. Regenerate them with:

```
python3 build.py
```

Codes are defined in both `build.py` (CODES) and `a1.js` (CODES) — keep them in sync.
