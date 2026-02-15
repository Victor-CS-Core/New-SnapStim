/**
 * Notion Documentation Sync Script
 * 
 * This script syncs documentation files from the docs/ folder to Notion pages.
 * It converts markdown to Notion blocks and updates the specified page.
 * 
 * Usage: node scripts/notion-sync.js [file]
 * Example: node scripts/notion-sync.js docs/CHANGELOG.md
 */

import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

/**
 * Convert markdown heading to Notion heading block
 */
function markdownToNotionBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }
    
    // Headers
    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{
            type: 'text',
            text: { content: line.substring(2).trim() }
          }]
        }
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{
            type: 'text',
            text: { content: line.substring(3).trim() }
          }]
        }
      });
    } else if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{
            type: 'text',
            text: { content: line.substring(4).trim() }
          }]
        }
      });
    }
    // Bullet lists
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            type: 'text',
            text: { content: line.substring(2).trim() }
          }]
        }
      });
    }
    // Code blocks
    else if (line.startsWith('```')) {
      const language = line.substring(3).trim() || 'plain text';
      i++;
      let codeContent = '';
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeContent += lines[i] + '\n';
        i++;
      }
      blocks.push({
        object: 'block',
        type: 'code',
        code: {
          rich_text: [{
            type: 'text',
            text: { content: codeContent.trim() }
          }],
          language: language
        }
      });
    }
    // Regular paragraphs
    else {
      // Handle bold, italic, and code inline
      const richText = parseInlineFormatting(line);
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: richText
        }
      });
    }
    
    i++;
  }
  
  return blocks;
}

/**
 * Parse inline formatting (bold, italic, code)
 */
function parseInlineFormatting(text) {
  // Simple parsing - can be enhanced for more complex cases
  const richText = [];
  
  // For now, return plain text
  // TODO: Add support for **bold**, *italic*, `code`
  if (text.trim()) {
    richText.push({
      type: 'text',
      text: { content: text }
    });
  }
  
  return richText;
}

/**
 * Sync a markdown file to Notion
 */
async function syncFileToNotion(filePath, pageId) {
  try {
    console.log(`\n📄 Reading file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    
    console.log(`📝 Converting markdown to Notion blocks...`);
    const blocks = markdownToNotionBlocks(content);
    
    console.log(`🔄 Syncing to Notion page ${pageId}...`);
    
    // Get existing page content to clear it
    const existingBlocks = await notion.blocks.children.list({
      block_id: pageId,
    });
    
    // Delete existing blocks
    if (existingBlocks.results.length > 0) {
      console.log(`🗑️  Clearing ${existingBlocks.results.length} existing block(s)...`);
      for (const block of existingBlocks.results) {
        await notion.blocks.delete({ block_id: block.id });
      }
    }
    
    // Add new blocks (Notion API limits to 100 blocks per request)
    if (blocks.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < blocks.length; i += batchSize) {
        const batch = blocks.slice(i, i + batchSize);
        await notion.blocks.children.append({
          block_id: pageId,
          children: batch,
        });
        console.log(`✅ Added blocks ${i + 1} to ${Math.min(i + batchSize, blocks.length)}`);
      }
    }
    
    // Update page title
    await notion.pages.update({
      page_id: pageId,
      properties: {
        title: {
          title: [{
            text: {
              content: `${fileName} - SnapStim ProjectUI`
            }
          }]
        }
      }
    });
    
    console.log(`\n✨ Successfully synced ${fileName} to Notion!`);
    console.log(`📎 View at: https://notion.so/${pageId.replace(/-/g, '')}`);
    
  } catch (error) {
    console.error('❌ Error syncing to Notion:');
    console.error(error.message);
    
    if (error.code === 'object_not_found') {
      console.log('\n⚠️  Page not found. Make sure:');
      console.log('   1. The page ID in .env is correct');
      console.log('   2. The page is shared with your integration');
    }
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (!process.env.NOTION_TOKEN) {
    console.error('❌ NOTION_TOKEN not found in .env file');
    return;
  }
  
  if (!process.env.NOTION_PAGE_ID) {
    console.error('❌ NOTION_PAGE_ID not set in .env file');
    console.log('\n💡 Run "npm run notion:test" first to find your page ID');
    return;
  }
  
  // Sync specific file or default to CHANGELOG
  const fileToSync = args[0] || 'docs/CHANGELOG.md';
  const pageId = process.env.NOTION_PAGE_ID;
  
  await syncFileToNotion(fileToSync, pageId);
}

// Run the sync
main();
