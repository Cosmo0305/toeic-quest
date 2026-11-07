---
name: kenney-asset-finder
description: Search, compare, and translate Kenney game asset packs from the preview catalogue. Use when a request asks what Kenney assets are available or which pack fits a game; not for unrelated asset libraries.
---

# Kenney Asset Finder

Use Kenney's preview catalogue as the starting point:
<https://kenney.nl/data/itch/preview/>

## Search workflow

1. Read the current catalogue rather than relying on a remembered list. From the project root, run `node .agents/skills/kenney-asset-finder/scripts/fetch_catalog.mjs`; use `--search <term>` and/or `--category <category>` to narrow it, or `--markdown` to produce a Markdown table. The `#content` section contains one link per pack; the link `id` is the English pack title, its `package` class includes a category, and its relative `href` points to a preview image under `Previews/`.
2. Match the user's goal to pack titles and categories. Search both the original English words and relevant synonyms or Traditional Chinese terms. Keep the official English title unchanged in results.
3. When a title is not enough to establish what a pack contains, inspect its preview image. For more detail, look for the matching pack on Kenney's asset pages: <https://kenney.nl/assets> or Kenney's itch.io page.
4. Return a compact table with the English title, Traditional Chinese translation, category, and a short description. For a request for the full catalogue, enumerate all current pack links and group the table by category.

## Accuracy

- The preview catalogue is an index of names, categories, and thumbnails; it does not provide a detailed description for every pack.
- Describe only what the title, category, preview, or a linked Kenney product page supports. Label a title-based description as an inference when the preview or product details were not inspected.
- Link to the catalogue and, when useful, to the individual preview or product page so the user can inspect the source.
- Do not imply that a pack has been downloaded or added to the project. Asset discovery is separate from downloading or integrating files.
