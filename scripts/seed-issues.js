// One-time local script: opens a realistic mix of issues on the real
// GitHub repo once you've pushed linkbox somewhere. NOT part of the
// deployed agent system — this just seeds demo data.
//
// Usage:
//   GITHUB_TOKEN=ghp_xxx GITHUB_REPO_OWNER=you GITHUB_REPO_NAME=linkbox \
//     node scripts/seed-issues.js
//
// Requires a token with `repo` scope (or fine-grained "Issues: write").
// This is a throwaway personal token for seeding — it is NOT the same
// token your MCP server uses at runtime (that one lives in Secrets Manager).

import { Octokit } from "@octokit/rest";

const token = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_REPO_OWNER;
const repo = process.env.GITHUB_REPO_NAME;

if (!token || !owner || !repo) {
  console.error(
    "Set GITHUB_TOKEN, GITHUB_REPO_OWNER, and GITHUB_REPO_NAME environment variables first."
  );
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

// Deliberate mix: real bugs, a docs issue matching the planted drift, a
// vague report, a near-duplicate, feature requests, and a support question —
// the same variety the plan called for, and consistent with the mock data
// already used in the MCP server's stub tools.
const ISSUES = [
  {
    title: "CLI crashes when URL has no scheme",
    body: "Running `linkbox add example.com` (no `http://`) throws a raw stack trace instead of a helpful error message.",
    labels: ["bug"],
  },
  {
    title: "docs/cli-usage.md references --json flag that no longer exists",
    body: "The docs still show `linkbox list --json`, but as of v0.3.0 the CLI uses `--format json` instead. See CHANGELOG.md v0.3.0.",
    labels: ["documentation"],
  },
  {
    title: "it doesn't work",
    body: "installed it and nothing happens when i run the command",
    labels: [],
  },
  {
    title: "Add fails silently for malformed URLs",
    body: "Similar to #1 maybe? Tried `linkbox add notaurl` and got an unhelpful error, not sure if this is the same bug or different.",
    labels: ["bug"],
  },
  {
    title: "Feature request: --delete command to remove a link",
    body: "There's no way to remove a short link once created. Would be useful to have `linkbox delete <code>`.",
    labels: ["enhancement"],
  },
  {
    title: "Hit count can be lost under concurrent requests",
    body: "If two requests hit `GET /r/:code` at almost the same time, the hit count only increments once instead of twice — looks like a read-modify-write race on data/db.json.",
    labels: ["bug"],
  },
  {
    title: "README doesn't mention the --code option for custom short codes",
    body: "The Quickstart section only shows `linkbox add <url>` — it doesn't mention you can pass `--code` for a custom short code, even though docs/cli-usage.md does.",
    labels: ["documentation"],
  },
  {
    title: "Feature request: optional expiry for links",
    body: "Would be nice to set an expiry date on a link so it stops resolving after a certain time.",
    labels: ["enhancement"],
  },
  {
    title: "Confusing error when custom --code is already taken",
    body: "`linkbox add https://example.com --code abc123` when `abc123` is taken just says 'Code \"abc123\" is already in use' — could suggest an alternative code instead of just failing.",
    labels: ["bug"],
  },
  {
    title: "How do I run this in production?",
    body: "Is the JSON file storage safe to use for a real deployment, or should I be hooking up a real database? Docs don't mention this.",
    labels: ["question"],
  },
];

async function main() {
  console.log(`Seeding ${ISSUES.length} issues into ${owner}/${repo}...`);

  for (const issue of ISSUES) {
    const { data } = await octokit.issues.create({
      owner,
      repo,
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
    });
    console.log(`  #${data.number} — ${issue.title}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Failed to seed issues:", err.message);
  process.exit(1);
});
