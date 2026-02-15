export type ProgramType = "tacting" | "intraverbal" | "lr" | "vpmts" | "seriation" | "sorting";

// In-memory storage for recent stimuli per program to prevent repetition
const recentStimuliHistory: Record<string, string[]> = {};
const MAX_HISTORY_SIZE = 3; // Keep last 3 sessions worth of stimuli

function getRecentStimuli(programId: string): string[] {
  return recentStimuliHistory[programId] || [];
}

function addToHistory(programId: string, stimuli: string[]) {
  if (!recentStimuliHistory[programId]) {
    recentStimuliHistory[programId] = [];
  }
  
  const beforeCount = recentStimuliHistory[programId].length;
  
  // Add new stimuli to the beginning of the array
  recentStimuliHistory[programId] = [...stimuli, ...recentStimuliHistory[programId]];
  
  // Keep only the most recent items (limit to prevent infinite growth)
  // Assuming ~4-12 items per session, keep last 36-40 items max
  const maxItems = 40;
  if (recentStimuliHistory[programId].length > maxItems) {
    recentStimuliHistory[programId] = recentStimuliHistory[programId].slice(0, maxItems);
  }
  
  console.log(`📝 HISTORY UPDATE:`);
  console.log(`   Program: ${programId}`);
  console.log(`   Added ${stimuli.length} new stimuli: ${stimuli.join(', ')}`);
  console.log(`   History size: ${beforeCount} → ${recentStimuliHistory[programId].length} items`);
  console.log(`   Total programs tracked: ${Object.keys(recentStimuliHistory).length}`);
}

// Export for debugging purposes
export function getRecentStimuliForDebug() {
  return recentStimuliHistory;
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(str: string): string {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildSystemPrompt(program: ProgramType, fields: Record<string, any>): string {
  const total = Number(fields.numTrials ?? fields.count ?? 12);
  const arraySize = Number(fields.arraySize ?? 4);

  let prompt: string;
  let excludeList = fields.exclude || fields.usedLabels || fields.recentStimuli;
  let excludeText = "";
  if (Array.isArray(excludeList) && excludeList.length > 0) {
    excludeText = ` IMPORTANT: Do NOT include any of the following previously used items: ${excludeList.join(", ")}. Generate completely different items.`;
  }
  switch (program) {
    case "intraverbal":
      prompt = `You generate JSON only. Produce an array of ${total} objects with keys: "prompt", "answer". Keep them short, kid-friendly.`;
      break;
    case "tacting":
    case "lr": {
      // If title or description is present, include it in the prompt for context
      const context = [fields.title, fields.description].filter(Boolean).join(". ");
      if (context) {
        // For specific categories, generate items that belong to that category
        prompt = `Category: ${context}.${excludeText} Generate EXACTLY ${total} specific items that belong to the category "${context}". Be accurate and factual. For example:
- If category is "Planets": Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune
- If category is "Emotions": Happy, Sad, Angry, Excited, Scared, Surprised, Confused, Proud
- If category is "MLB teams": Yankees, Red Sox, Dodgers, Giants, Cubs, Cardinals, Phillies, Braves
- If category is "US States": California, Texas, Florida, New York, Pennsylvania, Illinois, Ohio, Georgia
- If category is "Animals": Dog, Cat, Lion, Elephant, Giraffe, Zebra, Tiger, Bear

OUTPUT FORMAT: Return as a numbered list separated by commas.
EXAMPLE OUTPUT: 1. Mercury, 2. Venus, 3. Earth, 4. Mars, 5. Jupiter, 6. Saturn, 7. Uranus, 8. Neptune
STRICT RULES: Output ONLY the numbered list, no prose, no code fences, no extra text. Items must be factually accurate and belong to the specified category.`;
      } else {
        // Fallback for when no specific category is provided
        prompt = `${excludeText} List ${total} concrete everyday nouns (e.g., \"apple\", \"bus\") as a numbered list, separated by commas.\nOUTPUT FORMAT EXAMPLE: 1. Cat, 2. Dog, 3. Pig, 4. Cow, 5. Horse\nSTRICT RULES: Output ONLY a single numbered list, no prose, no code fences, no extra text.`;
      }
      break;
    }
    case "vpmts": {
      // Use VPMTS-specific fields
      const numCategories = Number(fields.numberOfCategories || fields.numberOfDifferentGroups || 3);
      const itemsPerCategory = Number(fields.numberOfExemplars || fields.stimuliPerGroup || 2);
      const totalItems = numCategories * itemsPerCategory;
      const context = fields.programDescription || fields.description || fields.title || "";
      const categoryHint = context ? `Topic: "${context}". ` : "";
      const matchingType = fields.matchingType || "Class";

      if (matchingType === "Identical") {
        const categoryInstructions = context 
          ? `Generate categories related to "${context}". For example, if the topic is "Animals", use categories like "Farm Animals", "Wild Animals", "Pets", etc.`
          : `Use concrete, kid-friendly categories like "Farm Animals", "Vehicles", "Foods", etc.`;
        
        prompt = `You generate JSON only. ${categoryHint}${excludeText} Create EXACTLY ${numCategories} different categories. For "Identical" matching, each category uses the SAME exact image. Total output must be EXACTLY ${totalItems} items.

CONTEXT INSTRUCTIONS: ${categoryInstructions}

CRITICAL REQUIREMENTS:
- EXACTLY ${numCategories} categories total
- EXACTLY 2 items per category (both identical)
- EXACTLY ${totalItems} total items  
- Each item: {"category": "Category Name", "key": "identical_item"}
- For identical matching: both items in a category must have the same key
- Categories should be relevant to the topic "${context}" if provided
- Each category appears exactly twice with identical keys

EXAMPLE (for 2 categories, 2 identical items each):
[
  {"category": "Farm Animals", "key": "cow"},
  {"category": "Farm Animals", "key": "cow"},
  {"category": "Vehicles", "key": "car"},
  {"category": "Vehicles", "key": "car"}
]

VERIFICATION: Count your items - you must have ${numCategories} categories with 2 identical items each = ${totalItems} total items.`;
      } else if (matchingType === "Non-Identical") {
        const categoryInstructions = context 
          ? `Generate specific item types related to "${context}". For example, if the topic is "Animals", use specific types like "Dogs", "Cats", "Birds", etc. with different breeds/varieties within each.`
          : `Use specific item types like "Dogs", "Cars", "Apples", etc. with different variations within each category.`;
        
        prompt = `You generate JSON only. ${categoryHint}${excludeText} For "Non-Identical" matching, each category must be ONE SPECIFIC TYPE OF ITEM with different variations of that same item. Each category should be a single, specific item type (like "Dogs", "Cars", "Apples") with different breeds/models/varieties within that category.

CONTEXT INSTRUCTIONS: ${categoryInstructions}

CRITICAL REQUIREMENTS:
- EXACTLY ${numCategories} categories total
- EXACTLY ${itemsPerCategory} items per category (no more, no less)  
- EXACTLY ${totalItems} total items
- Each category must be ONE specific item type relevant to "${context}" if provided
- Within each category, all items must be different variations of that same type
- Each item: {"category": "Specific Item Type", "key": "variation_name"}

CORRECT EXAMPLE (for 3 categories, 2 variations each):
[
  {"category": "Dogs", "key": "golden_retriever"},
  {"category": "Dogs", "key": "beagle"},
  {"category": "Cars", "key": "sedan"},
  {"category": "Cars", "key": "convertible"},  
  {"category": "Apples", "key": "red_apple"},
  {"category": "Apples", "key": "green_apple"}
]

WRONG EXAMPLE (this would be "Class" matching, not "Non-Identical"):
[
  {"category": "Animals", "key": "dog"},
  {"category": "Animals", "key": "cat"},
  {"category": "Vehicles", "key": "car"},
  {"category": "Vehicles", "key": "truck"}
]

VERIFICATION: Count your items - you must have ${numCategories} categories with ${itemsPerCategory} items each = ${totalItems} total items.`;
      } else {
        // Class matching (original behavior)
        const categoryInstructions = context 
          ? `Generate broad classification categories related to "${context}". For example, if the topic is "Animals", use broad classes like "Mammals", "Reptiles", "Birds", etc.`
          : `Use broad classification categories like "Mammals", "Vehicles", "Foods", etc.`;
          
        prompt = `You generate JSON only. ${categoryHint}${excludeText} For "Class" matching, each category must be a BROAD CLASSIFICATION that contains different types of items within that class. Each category should be a general class/group (like "Mammals", "Vehicles", "Foods") with different specific items within that classification.

CONTEXT INSTRUCTIONS: ${categoryInstructions}

CRITICAL REQUIREMENTS:
- EXACTLY ${numCategories} categories total
- EXACTLY ${itemsPerCategory} items per category (no more, no less)
- EXACTLY ${totalItems} total items
- Each category must be a BROAD CLASS/GROUP relevant to "${context}" if provided
- Within each category, items must be different types belonging to that class
- Each item: {"category": "Broad Class Name", "key": "specific_item_name"}

CORRECT EXAMPLE (for 3 categories, 2 items each):
[
  {"category": "Mammals", "key": "dog"},
  {"category": "Mammals", "key": "elephant"},
  {"category": "Reptiles", "key": "snake"},
  {"category": "Reptiles", "key": "lizard"},
  {"category": "Birds", "key": "eagle"},
  {"category": "Birds", "key": "parrot"}
]

WRONG EXAMPLE (this would be "Non-Identical" matching, not "Class"):
[
  {"category": "Dogs", "key": "golden_retriever"},
  {"category": "Dogs", "key": "beagle"},
  {"category": "Cats", "key": "persian"},
  {"category": "Cats", "key": "siamese"}
]

VERIFICATION: Count your items - you must have ${numCategories} categories with ${itemsPerCategory} items each = ${totalItems} total items.`;
      }
      break;
    }
    case "seriation":
    case "sorting":
    default:
      prompt = `You generate JSON only.${excludeText} Produce an array of ${total} objects with key: "label".`;
      break;
  }
  return `${prompt}\nOUTPUT RULES: Return ONLY a valid JSON array (not a stringified array), no prose, no code fences, no extra text. Do NOT wrap the array in quotes. Do NOT escape the array. Output must be a valid JSON array, not a string.`;
}

function buildUserPrompt(program: ProgramType, fields: Record<string, any>): string {
  // If no description/prompt is entered, use the title as the prompt
  const title = fields.title ? `Title: ${fields.title}.` : "";
  const mode = fields.mode ? `Mode: ${fields.mode}.` : "";
  let description = fields.description;
  if (!description && fields.title) {
    description = fields.title;
  }
  const descText = description ? `Spec: ${description}.` : "";
  return `${title} ${mode} ${descText} JSON ONLY. NO prose.`;
}

function tryParseJSON(text: string): any {
  // 0) Remove code fences & trim
  let stripped = text
    .replace(/^\s*```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  // Helper: single parse
  const parseOnce = (s: string) => {
    try { return JSON.parse(s); } catch { return undefined; }
  };

  // 1) Try raw parse
  let parsed: any = parseOnce(stripped);
  if (parsed !== undefined) {
    // If parsed is a string that itself looks like JSON, parse again
    if (typeof parsed === "string") {
      const again = parseOnce(parsed.trim());
      if (again !== undefined) parsed = again;
    }
    // If parsed is an array of JSON-escaped strings, parse each element
    if (Array.isArray(parsed) && typeof parsed[0] === "string") {
      const maybeObjs = parsed.map((s: string) => parseOnce(s));
      if (maybeObjs.every((x) => x && typeof x === "object")) {
        return maybeObjs;
      }
    }
    return parsed;
  }

  // 2) Try to extract the first JSON array [...] and parse
  const arrMatch = stripped.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    parsed = parseOnce(arrMatch[0]);
    if (parsed !== undefined) {
      if (typeof parsed === "string") {
        const again = parseOnce(parsed.trim());
        if (again !== undefined) return again;
      }
      if (Array.isArray(parsed) && typeof parsed[0] === "string") {
        const maybeObjs = parsed.map((s: string) => parseOnce(s));
        if (maybeObjs.every((x) => x && typeof x === "object")) {
          return maybeObjs;
        }
      }
      return parsed;
    }
  }

  // 3) Try to extract the first JSON object {...} and parse
  const objMatch = stripped.match(/\{[\s\S]*\}/);
  if (objMatch) {
    parsed = parseOnce(objMatch[0]);
    if (parsed !== undefined) return parsed;
  }

  // 4) Try to parse the entire stripped text as JSON first
  try {
    const arr = JSON.parse(stripped);
    if (Array.isArray(arr) && arr.every((o) => typeof o === "object" && o.label)) {
      return arr;
    }
  } catch {}

  // Last-ditch: treat each non-empty line as a label
  const lines = stripped.split("\n").map((s) => s.trim()).filter(Boolean);
  // If lines start with 'Label:', parse them as label objects
  if (lines.every((s) => /^Label:/i.test(s))) {
    return lines.map((s) => ({ label: s.replace(/^Label:\s*/i, "") }));
  }
  // If any line looks like a stringified JSON array, parse it
  for (const line of lines) {
    if (/^\[.*\]$/.test(line)) {
      try {
        const arr = JSON.parse(line);
        if (Array.isArray(arr) && arr.every((o) => typeof o === "object" && o.label)) {
          return arr;
        }
      } catch {}
    }
  }
  // Otherwise, fallback to previous behavior (bulleted list)
  return lines.map((s) => ({ label: s.replace(/^[-*]\s*/, "") }));
}



export async function createStimuli(program: ProgramType, fields: Record<string, any>) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("Missing REPLICATE_API_TOKEN");

  // Create a unique program identifier for history tracking
  const programId = `${program}-${fields.title || fields.description || 'default'}`.toLowerCase().replace(/\s+/g, '-');
  
  // Get recent stimuli to exclude
  const recentStimuli = getRecentStimuli(programId);
  
  // Add recent stimuli to the exclude list
  const enhancedFields = {
    ...fields,
    recentStimuli: recentStimuli
  };
  
  console.log(`🔍 PROGRAM TRACKING INFO:`);
  console.log(`   Program ID: ${programId}`);
  console.log(`   Program Type: ${program}`);
  console.log(`   Program Title/Description: ${fields.title || fields.description || 'default'}`);
  console.log(`   Excluding ${recentStimuli.length} recent stimuli from previous sessions`);
  console.log(`   Total programs being tracked: ${Object.keys(recentStimuliHistory).length}`);
  console.log(`   All tracked programs: ${Object.keys(recentStimuliHistory).join(', ')}`);
  
  if (recentStimuli.length > 0) {
    console.log(`   Recent stimuli to avoid: ${recentStimuli.slice(0, 10).join(', ')}${recentStimuli.length > 10 ? '...' : ''}`);
  }

  const sys = buildSystemPrompt(program, enhancedFields);
  const user = buildUserPrompt(program, enhancedFields);
  const model = "meta/meta-llama-3-8b-instruct"; // cheap & decent; can swap later

  let res, data, outputText, json;
  try {
    res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait" // wait for completion
      },
      body: JSON.stringify({
        input: { prompt: `${sys}\n\n${user}` }
      })
    });
  } catch (err) {
    console.error("Fetch error:", err);
    throw new Error("Failed to reach Replicate API");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`Replicate error: ${res.status} ${res.statusText} ${text}`);
    throw new Error(`Replicate error: ${res.status} ${res.statusText} ${text}`);
  }

  try {
    data = await res.json();
  } catch (err) {
    console.error("Failed to parse response JSON:", err);
    throw new Error("Malformed response from Replicate API");
  }

  outputText = Array.isArray(data?.output)
    ? data.output.join("\n")
    : (data?.output || data?.output_text || "");

  // Log raw output for debugging
  console.log("Raw Replicate output:", outputText);

  // Post-process: Remove code fences, extra quotes, and stringified arrays
  let cleaned = outputText
    .replace(/```json[\s\S]*?```/gi, "") // remove code fences
    .replace(/^"|"$/g, "") // remove wrapping quotes
    .replace(/\\"/g, '"') // unescape quotes
    .trim();

  // Join lines that look like a broken JSON array
  if (cleaned.split('\n').length > 1 && cleaned.replace(/\s/g, '').startsWith('[') && cleaned.replace(/\s/g, '').endsWith(']')) {
    cleaned = cleaned.replace(/\n/g, '');
  }

  // If cleaned looks like a stringified array, parse it
  if (/^\[.*\]$/.test(cleaned)) {
    try {
      json = JSON.parse(cleaned);
    } catch {
      json = tryParseJSON(cleaned);
    }
  } else {
    json = tryParseJSON(cleaned);
  }

  const programLower = program.toLowerCase();

  if (programLower === "intraverbal") {
    const arr = Array.isArray(json) ? json : [];
    const items = arr
      .map((o: any) => ({
        prompt: capitalizeFirstLetter(String(o?.prompt ?? o?.q ?? o?.question ?? "").trim()),
        answer: capitalizeFirstLetter(String(o?.answer ?? o?.a ?? "").trim())
      }))
      .filter((o: any) => o.prompt && o.answer);
    
    // Track stimuli history for future exclusion
    const stimuliLabels = items.map(item => `${item.prompt}: ${item.answer}`);
    addToHistory(programId, stimuliLabels);
    
    return { type: "intraverbal", items, fields: { ...fields } };
  }

  if (programLower === "vpmts") {
    const arr = Array.isArray(json) ? json : [];
    let items: Array<{ category: string; key: string }> = [];
    // Use VPMTS-specific fields
    const numCategories = Number(fields.numberOfCategories || fields.numberOfDifferentGroups || 3);
    const itemsPerCategory = Number(fields.numberOfExemplars || fields.stimuliPerGroup || 2);
    const expectedTotal = numCategories * itemsPerCategory;
    const matchingType = fields.matchingType || "Class";

    console.log(`VPMTS Processing: Expected ${numCategories} categories, ${itemsPerCategory} items each, ${expectedTotal} total`);

    if (arr.length && typeof arr[0] === "string") {
      // got list of category names; expand each category with correct number of items
      const categories = arr.slice(0, numCategories); // Ensure we only use the requested number of categories
      for (const cat of categories) {
        for (let i = 1; i <= itemsPerCategory; i++) {
          items.push({
            category: capitalizeFirstLetter(cat),
            key: capitalizeFirstLetter(`${cat.toLowerCase().replace(/\s+/g, "-")}-${i}`)
          });
        }
      }
    } else {
      // got objects - ensure we get exactly the right number of categories and items per category
      const categoryCounts: Record<string, number> = {};
      const categoryOrder: string[] = [];
      
      // First pass: collect items from AI response
      for (const o of arr) {
        const category = String(o?.category ?? o?.group ?? o?.label ?? "Group");
        const key = String(o?.key ?? o?.item ?? o?.name ?? "item");
        
        // Initialize category tracking
        if (!categoryCounts[category]) {
          categoryCounts[category] = 0;
          categoryOrder.push(category);
        }
        
        // Only add if we haven't reached the limit for this category AND haven't exceeded total categories
        if (categoryCounts[category] < itemsPerCategory && categoryOrder.length <= numCategories) {
          categoryCounts[category]++;
          items.push({
            category: capitalizeFirstLetter(category),
            key: capitalizeFirstLetter(key)
          });
        }
        
        // Stop processing if we have enough categories (but continue to fill them)
        if (categoryOrder.length >= numCategories && Object.values(categoryCounts).every(count => count >= itemsPerCategory)) {
          break;
        }
      }
      
      // Second pass: ensure each category has exactly the required number of items
      const finalCategoryOrder = categoryOrder.slice(0, numCategories);
      
      for (const category of finalCategoryOrder) {
        const currentCount = categoryCounts[category] || 0;
        
        // Fill missing items for this category with more natural names
        for (let i = currentCount; i < itemsPerCategory; i++) {
          const itemNumber = i + 1;
          const baseCategory = category.toLowerCase();
          
          // Generate more natural padding names based on category type
          let paddedKey;
          if (baseCategory.includes("animal") || baseCategory.includes("pet")) {
            const animalNames = ["dog", "cat", "bird", "fish", "rabbit", "hamster", "turtle"];
            paddedKey = animalNames[i] || `${baseCategory} ${itemNumber}`;
          } else if (baseCategory.includes("vehicle") || baseCategory.includes("car") || baseCategory.includes("transport")) {
            const vehicleNames = ["car", "truck", "bus", "bike", "train", "plane", "boat"];
            paddedKey = vehicleNames[i] || `${baseCategory} ${itemNumber}`;
          } else if (baseCategory.includes("food") || baseCategory.includes("fruit") || baseCategory.includes("snack")) {
            const foodNames = ["apple", "banana", "bread", "milk", "pizza", "cookie", "orange"];
            paddedKey = foodNames[i] || `${baseCategory} ${itemNumber}`;
          } else {
            // Generic padding for other categories
            paddedKey = `${baseCategory} item ${itemNumber}`;
          }
          
          items.push({
            category: capitalizeFirstLetter(category),
            key: capitalizeFirstLetter(paddedKey)
          });
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      }
      
      // If we don't have enough categories, create additional ones based on matching type
      let fallbackCategories: string[];
      
      if (matchingType === "Non-Identical") {
        // For Non-Identical: specific item types with variations
        fallbackCategories = ["Dogs", "Cats", "Cars", "Trucks", "Apples", "Roses", "Chairs", "Balls"];
      } else if (matchingType === "Class") {
        // For Class: broad categories with different items
        fallbackCategories = ["Mammals", "Reptiles", "Birds", "Vehicles", "Foods", "Toys", "Colors", "Shapes"];
      } else {
        // For Identical: simple categories
        fallbackCategories = ["Animals", "Vehicles", "Foods", "Toys", "Colors", "Shapes", "Sports", "Clothing"];
      }
      
      while (finalCategoryOrder.length < numCategories) {
        const categoryIndex = finalCategoryOrder.length;
        const newCategory = fallbackCategories[categoryIndex] || `Group ${categoryIndex + 1}`;
        finalCategoryOrder.push(newCategory);
        categoryCounts[newCategory] = 0;
        
        // Add items for this new category based on matching type
        for (let i = 0; i < itemsPerCategory; i++) {
          const itemNumber = i + 1;
          let key;
          
          if (matchingType === "Non-Identical") {
            // Generate variations of the same item type
            if (newCategory === "Dogs") {
              const dogBreeds = ["golden_retriever", "beagle", "bulldog", "poodle", "labrador"];
              key = dogBreeds[i] || `dog_breed_${itemNumber}`;
            } else if (newCategory === "Cats") {
              const catBreeds = ["persian", "siamese", "tabby", "maine_coon", "bengal"];
              key = catBreeds[i] || `cat_breed_${itemNumber}`;
            } else if (newCategory === "Cars") {
              const carTypes = ["sedan", "convertible", "hatchback", "coupe", "wagon"];
              key = carTypes[i] || `car_type_${itemNumber}`;
            } else if (newCategory === "Trucks") {
              const truckTypes = ["pickup", "semi", "dump", "fire", "delivery"];
              key = truckTypes[i] || `truck_type_${itemNumber}`;
            } else if (newCategory === "Apples") {
              const appleTypes = ["red_apple", "green_apple", "yellow_apple", "pink_apple", "gala_apple"];
              key = appleTypes[i] || `apple_type_${itemNumber}`;
            } else {
              key = `${newCategory.toLowerCase()}_variation_${itemNumber}`;
            }
          } else if (matchingType === "Class") {
            // Generate different items within the same class
            if (newCategory === "Mammals") {
              const mammals = ["dog", "cat", "elephant", "whale", "rabbit"];
              key = mammals[i] || `mammal_${itemNumber}`;
            } else if (newCategory === "Reptiles") {
              const reptiles = ["snake", "lizard", "turtle", "crocodile", "iguana"];
              key = reptiles[i] || `reptile_${itemNumber}`;
            } else if (newCategory === "Birds") {
              const birds = ["eagle", "parrot", "owl", "robin", "penguin"];
              key = birds[i] || `bird_${itemNumber}`;
            } else if (newCategory === "Vehicles") {
              const vehicles = ["car", "truck", "bus", "bike", "train"];
              key = vehicles[i] || `vehicle_${itemNumber}`;
            } else if (newCategory === "Foods") {
              const foods = ["apple", "banana", "bread", "milk", "pizza"];
              key = foods[i] || `food_${itemNumber}`;
            } else {
              key = `${newCategory.toLowerCase()}_item_${itemNumber}`;
            }
          } else {
            // Identical matching - simple items
            if (newCategory === "Animals") {
              const animalNames = ["dog", "cat", "bird", "fish", "rabbit"];
              key = animalNames[i] || `animal ${itemNumber}`;
            } else if (newCategory === "Vehicles") {
              const vehicleNames = ["car", "truck", "bus", "bike", "train"];
              key = vehicleNames[i] || `vehicle ${itemNumber}`;
            } else {
              key = `item ${itemNumber}`;
            }
          }
          
          items.push({
            category: capitalizeFirstLetter(newCategory),
            key: capitalizeFirstLetter(key)
          });
          categoryCounts[newCategory]++;
        }
      }
      
      console.log(`VPMTS Result: Got ${Object.keys(categoryCounts).length} categories, ${items.length} total items`);
      console.log(`Categories with counts:`, categoryCounts);
      console.log(`Expected: ${numCategories} categories with ${itemsPerCategory} items each`);
      
      // Validation check
      const actualCategories = Object.keys(categoryCounts).length;
      const allCategoriesHaveCorrectCount = Object.values(categoryCounts).every(count => count === itemsPerCategory);
      
      if (actualCategories !== numCategories || !allCategoriesHaveCorrectCount || items.length !== expectedTotal) {
        console.warn(`VPMTS Validation Warning:`);
        console.warn(`- Expected: ${numCategories} categories, got: ${actualCategories}`);
        console.warn(`- Expected: ${itemsPerCategory} items per category`);
        console.warn(`- Expected total: ${expectedTotal}, got: ${items.length}`);
        console.warn(`- Category distribution:`, categoryCounts);
      } else {
        console.log(`✅ VPMTS validation passed: ${actualCategories} categories with ${itemsPerCategory} items each = ${items.length} total`);
      }
    }
    // Group by category
    const grouped: Record<string, string[]> = {};
    for (const item of items) {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item.key);
    }
    // Convert to array of { category: [keys...] }
    const groupedItems = Object.entries(grouped).map(([category, keys]) => ({ [category]: keys }));
    
    // Track stimuli history for future exclusion  
    const stimuliLabels = items.map(item => item.key);
    addToHistory(programId, stimuliLabels);
    
    return { type: "vpmts", items: groupedItems, fields: { ...fields } };
  }

  // default: label-only (tacting, lr, sorting, seriation)
  let arr = Array.isArray(json) ? json : [];
  let items: Array<{ label: string } | Record<string, string>> = [];

  // Try to parse a numbered list (e.g., "1. Cat, 2. Dog, 3. Pig")
  if (typeof json === 'string') {
    // Remove code fences, trim, and split by comma
    const numberedList = json.replace(/```[\s\S]*?```/g, '').trim().split(',');
    const parsedItems = numberedList.map((entry: string, idx: number) => {
      // Extract the label after the number and dot
      const match = entry.match(/\d+\.\s*(.+)/);
      if (match && match[1]) {
        const label = match[1].trim();
        if (label) {
          return { [`stimuli ${idx + 1}`]: capitalizeFirstLetter(label) };
        }
      }
      return null;
    }).filter((o): o is Record<string, string> => !!o && typeof Object.values(o)[0] === 'string');
    items = parsedItems;
  }

  // If not a string, fallback to previous logic
  if (!items.length) {
    // If array is of strings, convert to label objects
    if (arr.length && typeof arr[0] === "string") {
      arr = arr.map((s: string) => ({ label: capitalizeFirstLetter(String(s).trim()) }));
    }
    // If array is of objects, ensure each has a 'label' property as a string
    const mappedItems = arr
      .map((o: any) => {
        if (typeof o === "object" && o !== null && typeof o.label === "string") {
          return { label: capitalizeFirstLetter(o.label.trim()) };
        } else if (typeof o === "string") {
          return { label: capitalizeFirstLetter(o.trim()) };
        } else if (o && (o.name || o.value)) {
          return { label: capitalizeFirstLetter(String(o.name || o.value).trim()) };
        }
        return null;
      })
      .filter((o): o is { label: string } => !!o && typeof o.label === 'string');
    items = mappedItems;
  }

  // Fallback: if items look like broken stringified label objects, extract with regex (robust for large/fragmented arrays)
  let regexExtracted: any[] = [];
  if (!items.length && Array.isArray(json)) {
    // Join all label strings, remove brackets and whitespace
    const asString = json.join('').replace(/\[|\]/g, '').replace(/\s+/g, '');
    // Extract all valid label objects
    const matches = [...asString.matchAll(/\{"label":"(.*?)"\}/g)];
    if (matches.length) {
      regexExtracted = matches.map((m) => ({ label: m[1] }));
    }
  }
  // If regexExtracted found any, always return those
  if (regexExtracted.length) {
    const cleanedItems = regexExtracted.map((o) => ({ label: capitalizeFirstLetter(String(o.label).trim()) }));
    
    // Track stimuli history for future exclusion
    const stimuliLabels = cleanedItems.map(item => item.label);
    addToHistory(programId, stimuliLabels);
    
    // Always return a clean, compact array of label objects
    return {
      type: "label",
      items: cleanedItems
    };
  }
  // Final pretty-print/clean step for items
  // Always return items as { label: "..." }
  let prettyItems = items;
  // If items are in the { "stimuli N": "..." } format, convert to { label: "..." }
  if (items.length && items[0] && Object.keys(items[0])[0].startsWith('stimuli ')) {
    prettyItems = items.map((o: any) => ({ label: capitalizeFirstLetter(String(Object.values(o)[0]).trim()) }));
  }
  // If items is a single object with a string value that looks like a list, split it
  if (
    prettyItems.length === 1 &&
    typeof Object.values(prettyItems[0])[0] === 'string' &&
    /\d+\.\s*\w+/.test(Object.values(prettyItems[0])[0])
  ) {
    // Remove brackets if present
    let listStr = Object.values(prettyItems[0])[0].replace(/^[\[]|[\]]$/g, '');
    // Split by comma and parse each entry
    const splitItems = listStr.split(',').map((entry) => {
      const match = entry.match(/\d+\.\s*(.+)/);
      if (match && match[1]) {
        return { label: capitalizeFirstLetter(match[1].trim()) };
      }
      return null;
    }).filter((o): o is { label: string } => !!o && typeof o.label === 'string');
    prettyItems = splitItems;
  }
  prettyItems = prettyItems.filter((o: any) => o.label);
  
  // Track stimuli history for future exclusion
  const stimuliLabels = prettyItems.map((item: any) => item.label);
  addToHistory(programId, stimuliLabels);
  
  return { type: "label", items: prettyItems, fields: { ...fields } };
}

export async function createTeachingInstructions(program: ProgramType, fields: Record<string, any>) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("Missing REPLICATE_API_TOKEN");

  // Build a system prompt for teaching instructions
  let context = [fields.title, fields.programDescription, fields.description].filter(Boolean).join(". ");
  let sys = `You are an expert special education teacher. Write clear, step-by-step teaching instructions for a 1:1 session for the following program type: ${program}. ${context ? "Program context: " + context + "." : ""} The instructions should be concise, actionable, and easy for a paraprofessional to follow. Do not include any JSON or code, just the instructions.`;

  const model = "meta/meta-llama-3-8b-instruct";
  let res, data, outputText;
  try {
    res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait"
      },
      body: JSON.stringify({
        input: { prompt: sys }
      })
    });
  } catch (err) {
    console.error("Fetch error (teaching instructions):", err);
    throw new Error("Failed to reach Replicate API");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`Replicate error: ${res.status} ${res.statusText} ${text}`);
    throw new Error(`Replicate error: ${res.status} ${res.statusText} ${text}`);
  }
  try {
    data = await res.json();
  } catch (err) {
    console.error("Failed to parse response JSON (teaching instructions):", err);
    throw new Error("Malformed response from Replicate API");
  }
  outputText = Array.isArray(data?.output)
    ? data.output.join("\n")
    : (data?.output || data?.output_text || "");
  // Remove code fences and trim
  let cleaned = outputText.replace(/```[a-z]*[\s\S]*?```/gi, "").trim();
  return cleaned;
}
