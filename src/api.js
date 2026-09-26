import express from "express";
import { addLink, getLink, listLinks, recordHit } from "./core.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.post("/links", (req, res) => {
  try {
    const { url, code } = req.body;
    const link = addLink(url, code);
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/links", (_req, res) => {
  res.json(listLinks());
});

app.get("/links/:code", (req, res) => {
  const link = getLink(req.params.code);
  if (!link) return res.status(404).json({ error: "Not found" });
  res.json(link);
});

// Redirect endpoint — visiting this actually "uses" the short link and
// increments its hit count, separate from /links/:code which just inspects it.
app.get("/r/:code", (req, res) => {
  const link = recordHit(req.params.code);
  if (!link) return res.status(404).json({ error: "Not found" });
  res.redirect(link.url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`linkbox API listening on :${PORT}`);
});
