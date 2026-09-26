# linkbox

A tiny URL shortener — CLI and REST API, backed by a single JSON file. Built
as a small, self-contained demo project for exercising a repository-management agent against.

## Features

- Shorten a URL to a random or custom short code
- List all links and their hit counts
- Look up stats for any link
- REST API alongside the CLI, sharing the same core logic
- Zero external database — everything lives in `data/db.json`

## Install

```bash
npm install
```

## Quickstart

**CLI:**

```bash
node src/cli.js add https://example.com
node src/cli.js list
node src/cli.js stats <code>
```

**API:**

```bash
node src/api.js
# in another terminal:
curl -X POST localhost:3000/links -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
curl localhost:3000/links
```

See [`docs/cli-usage.md`](docs/cli-usage.md) and [`docs/api.md`](docs/api.md)
for full command/endpoint reference, and [`docs/architecture.md`](docs/architecture.md)
for how the pieces fit together.

## Project status

This is a demo project maintained as part of an assignment
(QUT CAB432). See `CHANGELOG.md` for
version history and open issues for known problems and planned work.
