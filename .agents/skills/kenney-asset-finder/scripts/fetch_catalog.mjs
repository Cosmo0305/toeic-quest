#!/usr/bin/env node

const CATALOG_URL = "https://kenney.nl/data/itch/preview/";
const args = process.argv.slice(2);

function readOption(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1] ?? null;
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function getAttribute(attributes, name) {
  const match = attributes.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match ? decodeEntities(match[2]) : null;
}

const response = await fetch(CATALOG_URL, {
  headers: { "user-agent": "KenneyAssetFinder/1.0 (catalog index)" },
});

if (!response.ok) {
  throw new Error(`Kenney catalogue request failed: HTTP ${response.status}`);
}

const html = await response.text();
const packs = [];

for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
  const attributes = match[1];
  const classes = (getAttribute(attributes, "class") ?? "").split(/\s+/).filter(Boolean);
  const title = getAttribute(attributes, "id");
  const href = getAttribute(attributes, "href");

  if (!classes.includes("package") || !title || !href || !href.startsWith("Previews/")) continue;

  packs.push({
    title,
    category: classes.find((value) => value !== "package") ?? "Other",
    previewUrl: new URL(href, CATALOG_URL).href,
  });
}

if (packs.length === 0) {
  throw new Error("No packs found. The catalogue markup may have changed.");
}

const search = readOption("--search")?.toLocaleLowerCase();
const category = readOption("--category")?.toLocaleLowerCase();
const filtered = packs.filter((pack) => {
  const matchesSearch = !search || pack.title.toLocaleLowerCase().includes(search);
  const matchesCategory = !category || pack.category.toLocaleLowerCase() === category;
  return matchesSearch && matchesCategory;
});

if (args.includes("--markdown")) {
  console.log("| English pack | Category | Preview |");
  console.log("|---|---|---|");
  for (const pack of filtered) {
    console.log(`| ${pack.title.replaceAll("|", "\\|")} | ${pack.category} | [Preview](${pack.previewUrl}) |`);
  }
} else {
  const counts = filtered.reduce((result, pack) => {
    result[pack.category] = (result[pack.category] ?? 0) + 1;
    return result;
  }, {});
  console.log(JSON.stringify({ source: CATALOG_URL, count: filtered.length, categories: counts, packs: filtered }, null, 2));
}
