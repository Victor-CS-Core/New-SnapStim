/**
 * Notion Changelog Sync Script
 * 
 * Syncs changelog entries from docs/CHANGELOG.md to a Notion page.
 * Adds entries as blocks on the page.
 * 
 * Usage: node scripts/notion-changelog.js
 */

import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

/**
 * Parse changelog markdown file into entries
 */
function parseChangelog(markdown) {
  const entries = [];
  const lines = markdown.split('\n');
  
  let currentEntry = null;
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (currentEntry) {
        currentEntry.description.push(line);
      }
      continue;
    }
    
    // Look for version headers (## [Version X.X.X] - YYYY-MM-DD)
    const versionMatch = line.match(/^##\s+\[?(v?\d+\.\d+\.\d+)\]?\s*-\s*(.+)/i);
    
    if (versionMatch && !inCodeBlock) {
      // Save previous entry
      if (currentEntry) {
        entries.push(currentEntry);
      }
      
      // Start new entry
      currentEntry = {
        version: versionMatch[1],
        date: versionMatch[2].trim(),
        description: [],
        changes: {
          added: [],
          changed: [],
          fixed: [],
          removed: []
        }
      };
    } else if (currentEntry) {
      // Parse change categories
      if (line.startsWith('### Added') || line.startsWith('### ✨ Added')) {
        currentEntry.currentCategory = 'added';
      } else if (line.startsWith('### Changed') || line.startsWith('### 🔄 Changed')) {
        currentEntry.currentCategory = 'changed';
      } else if (line.startsWith('### Fixed') || line.startsWith('### 🐛 Fixed')) {
        currentEntry.currentCategory = 'fixed';
      } else if (line.startsWith('### Removed') || line.startsWith('### ❌ Removed')) {
        currentEntry.currentCategory = 'removed';
      } else if (line.startsWith('- ') && currentEntry.currentCategory) {
        // Add to current category
        currentEntry.changes[currentEntry.currentCategory].push(line.substring(2).trim());
      } else if (line.trim()) {
        // General description line
        currentEntry.description.push(line);
      }
    }
  }
  
  // Don't forget the last entry
  if (currentEntry) {
    entries.push(currentEntry);
  }
  
  return entries;
}

/**
 * Create blocks for an entry
 */
function createBlocksForEntry(entry) {
  const blocks = [];
  
  // Add heading
  blocks.push({
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [{
        type: 'text',
        text: { content: `Version ${entry.version} - ${entry.date}` }
      }]
    }
  });
  
  // Add changes by category
  if (entry.changes.added.length > 0) {
    blocks.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{
          type: 'text',
          text: { content: '✨ Added' }
        }]
      }
    });
    
    entry.changes.added.forEach(item => {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: item }
          }]
        }
      });
    });
  }
  
  if (entry.changes.changed.length > 0) {
    blocks.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{
          type: 'text',
          text: { content: '🔄 Changed' }
        }]
      }
    });
    
    entry.changes.changed.forEach(item => {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: item }
          }]
        }
      });
    });
  }
  
  if (entry.changes.fixed.length > 0) {
    blocks.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{
          type: 'text',
          text: { content: '🐛 Fixed' }
        }]
      }
    });
    
    entry.changes.fixed.forEach(item => {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: item }
          }]
        }
      });
    });
  }
  
  if (entry.changes.removed.length > 0) {
    blocks.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{
          type: 'text',
          text: { content: '❌ Removed' }
        }]
      }
    });
    
    entry.changes.removed.forEach(item => {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: item }
          }]
        }
      });
    });
  }
  
  // Add divider
  blocks.push({
    object: 'block',
    type: 'divider',
    divider: {}
  });
  
  return blocks;
}

/**
 * Sync an entry to Notion
 */
async function syncEntry(pageId, entry) {
  try {
    console.log(`   ✨ Adding: Version ${entry.version}`);
    
    const blocks = createBlocksForEntry(entry);
    
    // Append blocks to page
    await notion.blocks.children.append({
      block_id: pageId,
      children: blocks
    });
    
    return true;
  } catch (error) {
    console.error(`   ❌ Error syncing ${entry.version}:`, error.message);
    return false;
  }
}

/**
 * Main sync function
 */
async function main() {
  try {
    const pageId = process.env.NOTION_PAGE_ID;
    
    if (!pageId) {
      console.error('❌ NOTION_PAGE_ID not set in .env file');
      return;
    }
    
    console.log('📖 Reading CHANGELOG.md...\n');
    
    const changelogPath = 'docs/CHANGELOG.md';
    if (!fs.existsSync(changelogPath)) {
      console.error(`❌ File not found: ${changelogPath}`);
      return;
    }
    
    const content = fs.readFileSync(changelogPath, 'utf-8');
    const entries = parseChangelog(content);
    
    console.log(`✅ Found ${entries.length} changelog entry/entries\n`);
    
    console.log('🔄 Syncing to Notion...\n');
    
    let successCount = 0;
    for (const entry of entries) {
      console.log(`📝 ${entry.version} (${entry.date})`);
      const success = await syncEntry(pageId, entry);
      if (success) successCount++;
    }
    
    console.log(`\n✨ Sync complete! Added ${successCount}/${entries.length} entries`);
    console.log(`📎 View at: https://notion.so/${pageId.replace(/-/g, '')}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
