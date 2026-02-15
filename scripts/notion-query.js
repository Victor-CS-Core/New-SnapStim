/**
 * Query Database Pages
 * Gets existing pages to understand the database schema
 */

import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function queryDatabase() {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    console.error("❌ NOTION_DATABASE_ID not set in .env");
    return;
  }

  try {
    console.log(`\n🔍 Querying database: ${databaseId}\n`);

    // Try to query the database using dataSources
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      page_size: 3,
    });

    console.log(`📊 Found ${response.results.length} page(s)\n`);

    if (response.results.length > 0) {
      console.log("📋 First Page Structure:");
      const firstPage = response.results[0];
      console.log(JSON.stringify(firstPage, null, 2));

      console.log("\n\n📝 Page Properties:");
      for (const [propName, propValue] of Object.entries(
        firstPage.properties,
      )) {
        console.log(`   - "${propName}" (type: ${propValue.type})`);
      }
    } else {
      console.log("⚠️  Database is empty. Let me try to get the schema...");

      // Try the data source database
      const db = await notion.databases.retrieve({ database_id: databaseId });
      if (db.data_sources && db.data_sources.length > 0) {
        const sourceId = db.data_sources[0].id;
        console.log(`\n🔗 Trying data source: ${sourceId}`);
        const sourceDb = await notion.databases.retrieve({
          database_id: sourceId,
        });
        console.log(JSON.stringify(sourceDb, null, 2));
      }
    }

    console.log("\n✨ Query complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Code:", error.code);
    if (error.body) {
      console.error("Details:", JSON.stringify(error.body, null, 2));
    }
  }
}

queryDatabase();
