#!/usr/bin/env node
/**
 * Notion playbook sync stub.
 *
 * Converts Markdown playbooks into Notion blocks using the official API once credentials are supplied.
 * Currently validates configuration and prints a payload preview for manual execution.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const SOURCE_PATH = process.argv[2] ?? 'docs/agri-ai-design-lab/playbooks/playbook-smart-irrigation-2025-11-10.md';

if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  console.error('Set NOTION_TOKEN and NOTION_DATABASE_ID in your environment before running.');
  process.exit(1);
}

if (!fs.existsSync(SOURCE_PATH)) {
  console.error(`Source file not found: ${SOURCE_PATH}`);
  process.exit(1);
}

const content = fs.readFileSync(SOURCE_PATH, 'utf8');

/**
 * Minimal markdown splitter – replace with robust parser as needed.
 */
function toParagraphBlocks(markdown) {
  return markdown
    .split(/\n\n+/)
    .filter(Boolean)
    .map((chunk) => ({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: chunk.slice(0, 2000) } }],
      },
    }));
}

const payload = {
  parent: { database_id: NOTION_DATABASE_ID },
  properties: {
    Name: {
      title: [
        {
          type: 'text',
          text: { content: path.basename(SOURCE_PATH) },
        },
      ],
    },
    Status: { select: { name: 'Draft' } },
  },
  children: toParagraphBlocks(content).slice(0, 90),
};

console.log('Preview payload for Notion API:');
console.log(JSON.stringify(payload, null, 2));
console.log('\nTo publish, run:');
console.log('curl -X POST https://api.notion.com/v1/pages \\');
console.log('  -H "Authorization: Bearer $NOTION_TOKEN" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -H "Notion-Version: 2022-06-28" \\');
console.log(`  --data @<(node scripts/notion-sync.mjs ${SOURCE_PATH} --print-payload)`);

