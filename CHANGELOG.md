# Changelog

## v0.3.0 — 2026-09-15
- Renamed CLI's `--json` flag to `--format json` for consistency with a
  planned future `--format csv` option (docs not yet updated — see #2)
- Added `GET /r/:code` redirect endpoint to the API

## v0.2.0 — 2026-09-05
- Added REST API (`src/api.js`) alongside the existing CLI
- Added hit counting for links

## v0.1.0 — 2026-08-20
- Initial release: `add`, `list`, `stats` CLI commands
- JSON file storage
