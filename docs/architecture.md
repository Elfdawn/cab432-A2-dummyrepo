# Architecture

linkbox is intentionally minimal — three files share one storage layer:

- **`src/core.js`** — all the actual logic (creating links, looking them up,
  recording hits). Reads and writes a single JSON file (`data/db.json`) as
  its storage backend. No database server, no ORM — this keeps the whole
  project small enough to reason about in one sitting.
- **`src/cli.js`** — a thin command-line wrapper around `core.js`, for
  interactive/scripted use.
- **`src/api.js`** — a thin Express wrapper around the same `core.js`
  functions, for HTTP access. Adds one extra endpoint (`GET /r/:code`) that
  the CLI doesn't have, since "visiting" a link only makes sense over HTTP.

Both the CLI and the API call the exact same functions in `core.js` — there's
no logic duplicated between them. If you're investigating a bug reported
against either the CLI or the API, `core.js` is almost always where the
actual behavior lives.

## Storage

`data/db.json` is a flat JSON object: `{ "links": { "<code>": { ... } } }`.
This is not safe for concurrent writes from multiple processes — fine for a
demo/single-user tool, not something to build on for real traffic.
