#!/usr/bin/env node
// linkbox CLI.
//
// NOTE (deliberate doc drift for the Repository Custodian demo): this file
// implements `--format json` as a value flag. docs/cli-usage.md still
// documents the older `--json` boolean flag from before this was renamed.
// That mismatch is intentional — it's what the agent's doc-drift sweep is
// meant to catch. Do not "fix" this by aligning them; that defeats the demo.

import { addLink, getLink, listLinks } from "./core.js";

function parseFlags(args) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional };
}

function printLinksTable(links) {
  if (links.length === 0) {
    console.log("No links yet. Add one with: linkbox add <url>");
    return;
  }
  console.log("CODE      URL                                      HITS");
  for (const link of links) {
    console.log(
      `${link.code.padEnd(10)}${link.url.slice(0, 40).padEnd(41)}${link.hits}`
    );
  }
}

function main() {
  const [, , command, ...rest] = process.argv;
  const { flags, positional } = parseFlags(rest);

  switch (command) {
    case "add": {
      const [url] = positional;
      if (!url) {
        console.error("Usage: linkbox add <url> [--code <custom-code>]");
        process.exit(1);
      }
      const link = addLink(url, flags.code);
      if (flags.format === "json") {
        console.log(JSON.stringify(link, null, 2));
      } else {
        console.log(`Created: ${link.code} -> ${link.url}`);
      }
      break;
    }

    case "list": {
      const links = listLinks();
      if (flags.format === "json") {
        console.log(JSON.stringify(links, null, 2));
      } else {
        printLinksTable(links);
      }
      break;
    }

    case "stats": {
      const [code] = positional;
      if (!code) {
        console.error("Usage: linkbox stats <code> [--format json]");
        process.exit(1);
      }
      const link = getLink(code);
      if (!link) {
        console.error(`No such code: ${code}`);
        process.exit(1);
      }
      if (flags.format === "json") {
        console.log(JSON.stringify(link, null, 2));
      } else {
        console.log(`${link.code} -> ${link.url}`);
        console.log(`Hits: ${link.hits}`);
        console.log(`Created: ${link.created_at}`);
      }
      break;
    }

    default: {
      console.log("linkbox — a tiny URL shortener\n");
      console.log("Usage:");
      console.log("  linkbox add <url> [--code <custom-code>] [--format json]");
      console.log("  linkbox list [--format json]");
      console.log("  linkbox stats <code> [--format json]");
      process.exit(command ? 1 : 0);
    }
  }
}

main();
