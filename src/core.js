// Core logic for linkbox. Deliberately simple — a JSON file on disk acts as
// the "database" so the whole project stays small and dependency-light.
// This is a demo repo for the CAB432 Repository Custodian agent, not a
// production URL shortener.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.LINKBOX_DB_PATH || path.join(__dirname, "..", "data", "db.json");

const CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

function loadDb() {
  if (!fs.existsSync(DB_PATH)) {
    return { links: {} };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function saveDb(db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function addLink(url, customCode) {
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error(`Invalid URL: "${url}" — must start with http:// or https://`);
  }

  const db = loadDb();
  const code = customCode || generateCode();

  if (db.links[code]) {
    throw new Error(`Code "${code}" is already in use`);
  }

  db.links[code] = {
    code,
    url,
    hits: 0,
    created_at: new Date().toISOString(),
  };
  saveDb(db);
  return db.links[code];
}

export function getLink(code) {
  const db = loadDb();
  return db.links[code] || null;
}

export function listLinks() {
  const db = loadDb();
  return Object.values(db.links);
}

export function recordHit(code) {
  const db = loadDb();
  const link = db.links[code];
  if (!link) return null;
  link.hits += 1;
  saveDb(db);
  return link;
}
