# Sunday Music

Phone app (installable web app) for Farmington Bay 6th Ward sacrament meeting music.
Open https://farmingtonbay6th.github.io/sunday-music/ and add it to your home screen.

Pick the Sunday, choose hymns, chorister/organist, optional special music and notes, then tap Save.
Entries go straight into the ward music spreadsheet through a Google Apps Script web app.

Files: `index.html` (the whole app), `manifest.webmanifest`, `sw.js` (app-shell cache only), `icons/`.
When changing `index.html`, bump `CACHE` in `sw.js` so installed copies update.
