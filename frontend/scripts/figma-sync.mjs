#!/usr/bin/env node
/**
 * Figma token sync script for Agri-AI Design Lab.
 *
 * Usage: FIGMA_PAT=... Figma file IDs stored in config/figma.json (see below).
 * The script fetches styles/components metadata and exports JSON & changelog markdown
 * into the design system root specified in .bmad/custom/modules/agri-ai-design-lab/config.yaml.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const CONFIG_PATH = path.resolve('config/figma.json');
const DESIGN_ROOT = path.resolve('design');
const EXPORT_DIR = path.join(DESIGN_ROOT, 'tokens');
const CHANGELOG_PATH = path.join(EXPORT_DIR, 'figma-sync-changelog.md');

const FIGMA_API = 'https://api.figma.com/v1';
const FIGMA_PAT = process.env.FIGMA_PAT;

if (!FIGMA_PAT) {
  console.error('Missing FIGMA_PAT environment variable. Export it before running this script.');
  process.exit(1);
}

if (!fs.existsSync(CONFIG_PATH)) {
  console.error(`Missing ${CONFIG_PATH}. Create it with { "files": [{ "id": "FIGMA_FILE_ID", "name": "Design System" }] }`);
  process.exit(1);
}

/**
 * Load configuration describing which Figma files/libraries to sync.
 */
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
if (!config.files?.length) {
  console.error('No Figma files defined in config/figma.json.');
  process.exit(1);
}

fs.mkdirSync(EXPORT_DIR, { recursive: true });

/**
 * Fetch styles and components metadata for a file.
 */
async function fetchFileMetadata(fileId) {
  const response = await fetch(`${FIGMA_API}/files/${fileId}?geometry=paths`, {
    headers: {
      'X-Figma-Token': FIGMA_PAT,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch file ${fileId}: ${response.status} ${text}`);
  }

  return response.json();
}

/**
 * Normalize style data into lightweight token format.
 */
function extractTokens(figmaDoc) {
  const { styles = {}, components = {} } = figmaDoc;
  const tokens = Object.entries(styles).map(([id, style]) => ({
    id,
    name: style.name,
    type: style.style_type,
    description: style.description,
    updatedAt: style.updated_at,
  }));

  const compSummary = Object.entries(components).map(([id, component]) => ({
    id,
    name: component.name,
    description: component.description,
    updatedAt: component.updated_at,
  }));

  return { tokens, components: compSummary };
}

async function run() {
  const changelogLines = [];
  for (const file of config.files) {
    try {
      console.log(`Syncing Figma file: ${file.name} (${file.id})`);
      const data = await fetchFileMetadata(file.id);
      const normalized = extractTokens(data);

      const outputPath = path.join(EXPORT_DIR, `${file.name.replace(/\s+/g, '-').toLowerCase()}-tokens.json`);
      fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
      changelogLines.push(`- ${new Date().toISOString()}: Synced ${file.name} (${normalized.tokens.length} tokens, ${normalized.components.length} components).`);
    } catch (error) {
      console.error(`Error syncing ${file.name}:`, error.message);
      changelogLines.push(`- ${new Date().toISOString()}: FAILED ${file.name} -> ${error.message}`);
    }
  }

  const header = '# Figma Sync Changelog\n\n';
  const existing = fs.existsSync(CHANGELOG_PATH) ? fs.readFileSync(CHANGELOG_PATH, 'utf8') : header;
  const content = existing.startsWith('#') ? existing : header + existing;
  fs.writeFileSync(CHANGELOG_PATH, `${content}\n${changelogLines.join('\n')}\n`);

  console.log('Figma sync complete. Outputs stored in', EXPORT_DIR);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
