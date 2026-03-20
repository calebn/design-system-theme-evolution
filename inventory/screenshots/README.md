# Component Screenshots

This directory stores screenshots of Figma component frames for use in documentation, visual review, and cataloging.

## How to Capture Screenshots

### Option A: Figma Desktop MCP (Cursor)

In a Cursor conversation with the Figma Desktop MCP enabled, run `get_screenshot` for each component node ID:

```
get_screenshot({ nodeId: "1623:3480" })  // Button
get_screenshot({ nodeId: "1770:9407" })  // Star
// ...etc
```

The screenshots appear as embedded images in the response but cannot be automatically saved to disk from within the MCP tool.

### Option B: Figma REST API (Recommended for batch)

Use the Figma REST API to export all component images in one request:

```bash
# Set your Figma personal access token
FIGMA_TOKEN="your-personal-access-token"
FILE_KEY="8J2B4UtoSMRvkLqBqyoZjB"

# Request image URLs for all node IDs (comma-separated)
NODE_IDS="1623-3480,1770-9407,1770-9371,..."

curl -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/$FILE_KEY?ids=$NODE_IDS&format=png&scale=1" \
  | jq '.images'
```

Then download each image URL with `curl` or `wget`.

See `../src/capture-screenshots.ts` for a ready-to-run script (requires `FIGMA_TOKEN` env variable).

## Naming Convention

Files should be named `{figma-id-with-hyphens}.png`, e.g.:
- `1623-3480.png` — Button
- `1770-9407.png` — Star

## Notes

- Target: 71 component screenshots (one per Figma frame in `data/components.json`)
- Expected size: ~50–100 KB per PNG, ~5–7 MB total
- If the repo grows too large, add `screenshots/*.png` to `.gitattributes` with Git LFS
