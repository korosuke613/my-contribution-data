// This can be a typescript file as well

// Helper library written for useful postprocessing tasks with Flat Data
// Has helper functions for manipulating csv, txt, json, excel, zip, and image files
import {
  readJSON,
  removeFile,
  writeJSON,
} from "https://deno.land/x/flat@0.0.10/mod.ts";

// Step 1: Read the downloaded_filename JSON
const filename = Deno.args[0]; // Same name as downloaded_filename `const filename = 'btc-price.json';`
const json = await readJSON(filename);
console.log(json);

// Step 2: Filter specific data we want to keep and write to a new JSON file
const weeks: {
  contributionDays: { contributionCount: number; date: string }[];
}[] = json.data.user.contributionsCollection.contributionCalendar.weeks;

const contributionDays = weeks.map((week) => (
  week.contributionDays.map((day) => ({
    contributionCount: day.contributionCount,
    date: day.date,
    url: `https://github.com/korosuke613?tab=overview&from=${day.date}&to=${day.date}`
  }))
)).flat();

// Step 3. Write a new JSON file with our filtered data
const newFilename = `contribution-days.json`; // name of a new file to be saved
await writeJSON(newFilename, contributionDays); // create a new JSON file with just the Bitcoin price
console.log("Wrote a post process file");

// Optionally delete the original file
// await removeFile('./btc-price.json') // equivalent to removeFile('btc-price.json')
