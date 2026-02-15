/**
 * Notion Connection Test Script
 *
 * This script tests the connection to Notion and lists available pages
 * that have been shared with the integration.
 *
 * Usage: node scripts/notion-test.js
 */

import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function testConnection() {
  try {
    console.log("🔗 Testing Notion connection...\n");

    // Test 1: List users to verify connection
    console.log("1️⃣ Fetching workspace users...");
    const users = await notion.users.list();
    console.log(
      `✅ Connected! Found ${users.results.length} user(s) in workspace\n`,
    );

    // Test 2: Search for pages
    console.log("2️⃣ Searching for pages shared with this integration...");
    const response = await notion.search({
      filter: {
        property: "object",
        value: "page",
      },
      sort: {
        direction: "descending",
        timestamp: "last_edited_time",
      },
    });

    if (response.results.length === 0) {
      console.log("⚠️  No pages found.");
      console.log("\nℹ️  To see pages here, you need to:");
      console.log("   1. Go to a Notion page");
      console.log('   2. Click "..." (more options) in the top right');
      console.log('   3. Click "Add connections"');
      console.log("   4. Select your integration\n");
    } else {
      console.log(`✅ Found ${response.results.length} page(s):\n`);

      response.results.forEach((page, index) => {
        if (page.object === "page") {
          const title =
            page.properties?.title?.title?.[0]?.plain_text ||
            page.properties?.Name?.title?.[0]?.plain_text ||
            "Untitled";
          const url = page.url;
          const id = page.id;

          console.log(`   ${index + 1}. ${title}`);
          console.log(`      ID: ${id}`);
          console.log(`      URL: ${url}`);
          console.log("");
        }
      });

      console.log(
        "\n💡 Copy one of these IDs to your .env file as NOTION_PAGE_ID",
      );
    }

    console.log("\n✨ Connection test complete!");
  } catch (error) {
    console.error("❌ Error connecting to Notion:");
    console.error(error.message);

    if (error.code === "unauthorized") {
      console.log("\n⚠️  Your Notion token might be invalid or expired.");
      console.log(
        "   Check your integration at: https://www.notion.so/my-integrations",
      );
    }
  }
}

// Run the test
testConnection();
