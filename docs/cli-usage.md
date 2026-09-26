# CLI Usage

linkbox provides three commands: `add`, `list`, and `stats`.

## Add a link

```
linkbox add <url> [--code <custom-code>]
```

Creates a new short link for `<url>`. If `--code` is omitted, a random
6-character code is generated. Fails if the code is already in use.

**Example:**

```
$ linkbox add https://example.com/some/long/path
Created: aZ3xQ1 -> https://example.com/some/long/path
```

## List links

```
linkbox list [--json]
```

Lists all links currently stored, along with their hit counts. Pass `--json`
for machine-readable output instead of the default table.

**Example:**

```
$ linkbox list --json
[
  { "code": "aZ3xQ1", "url": "https://example.com/...", "hits": 3, "created_at": "..." }
]
```

## View stats for a link

```
linkbox stats <code> [--json]
```

Shows the URL, hit count, and creation time for a given short code. Pass
`--json` for machine-readable output.

**Example:**

```
$ linkbox stats aZ3xQ1
aZ3xQ1 -> https://example.com/some/long/path
Hits: 3
Created: 2026-09-01T02:00:00.000Z
```
