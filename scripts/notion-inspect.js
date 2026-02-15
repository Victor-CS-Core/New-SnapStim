/**
 * Notion Page Inspector
 * 
 * Inspects a Notion page to determine its structure,
 * find databases, and show properties.
 * 
 * Usage: node scripts/notion-inspect.js
 */

import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function inspectPage() {
  const pageId = process.env.NOTION_PAGE_ID;
  
  if (!pageId) {
    console.error('❌ NOTION_PAGE_ID not set in .env');
    return;
  }

  try {
    console.log(`\n🔍 Inspecting page: ${pageId}\n`);

    // Get page info
    const page = await notion.pages.retrieve({ page_id: pageId });
    console.log('📄 Page Info:');
    console.log(`   Object Type: ${page.object}`);
    console.log(`   Parent Type: ${page.parent.type}`);
    console.log(`   Created: ${page.created_time}`);
    console.log(`   Last Edited: ${page.last_edited_time}`);
    
    // Check if it's a database
    if (page.object === 'page' && page.parent.type === 'database_id') {
      console.log(`   Parent Database: ${page.parent.database_id}`);
    }

    // Get blocks (children) of the page
    console.log('\n📦 Blocks on this page:');
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 50,
    });

    if (blocks.results.length === 0) {
      console.log('   (empty page)');
    } else {
      blocks.results.forEach((block, index) => {
        console.log(`   ${index + 1}. ${block.type} (ID: ${block.id})`);
        
        // If it's a database, get its properties
        if (block.type === 'child_database') {
          console.log(`      Database ID: ${block.id}`);
          console.log(`      ⭐ Found embedded database!`);
        }
      });
    }

    // Check for databases on the page
    const databases = blocks.results.filter(b => b.type === 'child_database');
    
    if (databases.length > 0) {
      console.log('\n🗄️  Found Database(s):');
      
      for (const db of databases) {
        const dbId = db.id;
        console.log(`\n   Database ID: ${dbId}`);
        
        // Get database schema
        const database = await notion.databases.retrieve({ database_id: dbId });
        console.log(`   Title: ${database.title?.[0]?.plain_text || 'Untitled'}`);
        console.log(`   Properties:`);
        
        if (database.properties) {
          for (const [propName, propInfo] of Object.entries(database.properties)) {
            console.log(`      - ${propName} (${propInfo.type})`);
          }
        }
        
        // Get existing entries
        const entries = await notion.databases.query({
          database_id: dbId,
          page_size: 5,
        });
        
        console.log(`   \n   Entries: ${entries.results.length} (showing up to 5)`);
        
        entries.results.forEach((entry, idx) => {
          const props = entry.properties;
          const title = Object.values(props).find(p => p.type === 'title');
          const titleText = title?.title?.[0]?.plain_text || 'Untitled';
          console.log(`      ${idx + 1}. ${titleText}`);
        });
        
        // Save database ID to .env suggestion
        console.log(`\n   💡 Add to .env: NOTION_DATABASE_ID=${dbId}`);
      }
    }

    console.log('\n✨ Inspection complete!');

  } catch (error) {
    console.error('❌ Error inspecting page:');
    console.error(error.message);
    
    if (error.code === 'object_not_found') {
      console.log('\n⚠️  Make sure the page is shared with your integration');
    }
  }
}

inspectPage();
