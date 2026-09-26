# API Reference

Base URL: `http://localhost:3000` (or whatever `PORT` is set to)

## `GET /health`

Health check. Returns `{ "status": "ok" }`.

## `POST /links`

Creates a new short link.

**Body:**
```json
{ "url": "https://example.com", "code": "optional-custom-code" }
```

**Response (201):**
```json
{ "code": "aZ3xQ1", "url": "https://example.com", "hits": 0, "created_at": "..." }
```

**Response (400):** if the URL is missing/invalid, or the custom code is already taken.

## `GET /links`

Returns an array of all stored links.

## `GET /links/:code`

Returns a single link's details, or `404` if the code doesn't exist. This
endpoint does **not** increment the hit count — it's a read-only lookup.

## `GET /r/:code`

Redirects to the link's target URL and increments its hit count. This is the
"actually visiting the short link" endpoint, as opposed to `/links/:code`
which just inspects it. Returns `404` if the code doesn't exist.
