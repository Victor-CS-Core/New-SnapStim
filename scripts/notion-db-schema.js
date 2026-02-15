/**
 * Database Schema Inspector
 * Retrieves the exact schema of a Notion database
 */

import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function inspectDatabase() {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    console.error("❌ NOTION_DATABASE_ID not set in .env");
    return;
  }

  try {
    console.log(`\n🔍 Inspecting database: ${databaseId}\n`);

    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });

    console.log("📊 Database Info:");
    console.log(`   Title: ${database.title?.[0]?.plain_text || "Untitled"}`);
    console.log(`   Object: ${database.object}`);
    console.log(`   Created: ${database.created_time}`);
    console.log(`   Last Edited: ${database.last_edited_time}`);

    console.log("\n� Raw Database Object:");
    console.log(JSON.stringify(database, null, 2));

    console.log("\n�📋 Properties:");

    if (database.properties) {
      for (const [propName, propInfo] of Object.entries(database.properties)) {
        console.log(`   - "${propName}"`);
        console.log(`     Type: ${propInfo.type}`);
        if (propInfo[propInfo.type]) {
          const config = propInfo[propInfo.type];
          if (config.options) {
            console.log(
              `     Options: ${config.options.map((o) => o.name).join(", ")}`,
            );
          }
        }
        console.log("");
      }
    }

    console.log("✨ Inspection complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.body) {
      console.error("Details:", JSON.stringify(error.body, null, 2));
    }
  }
}

inspectDatabase();
