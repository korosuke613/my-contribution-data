// This can be a typescript file as well

// Helper library written for useful postprocessing tasks with Flat Data
// Has helper functions for manipulating csv, txt, json, excel, zip, and image files
import {
  readJSON,
  removeFile,
  writeJSON,
} from "https://deno.land/x/flat@0.0.10/mod.ts";

type Week = {
  contributionDays: {
    contributionCount: number;
    date: string;
    contributionLevel: string;
    color: string;
  }[];
  firstDay: string
};

const getDays = async (
  json: {
    data: {
      user: {
        contributionsCollection: { contributionCalendar: { weeks: Week[] } };
      };
    };
  },
) => {
  // Step 2: Filter specific data we want to keep and write to a new JSON file
  const weeks: Week[] =
    json.data.user.contributionsCollection.contributionCalendar.weeks;

  const contributionDays = weeks.map((week) => (
    week.contributionDays.map((day) => ({
      date: day.date,
      contributionCount: day.contributionCount,
      contributionLevel: day.contributionLevel,
      url:
        `https://github.com/korosuke613?tab=overview&from=${day.date}&to=${day.date}`,
      color: day.color,
    }))
  )).flat();

  // Step 3. Write a new JSON file with our filtered data
  const newFilename = `contribution-days.json`; // name of a new file to be saved
  await writeJSON(newFilename, contributionDays); // create a new JSON file with just the Bitcoin price
  console.log("Wrote a post process file");
};

const getWeeks = async (
  json: {
    data: {
      user: {
        contributionsCollection: { contributionCalendar: { weeks: Week[] } };
      };
    };
  },
) => {
  // Step 2: Filter specific data we want to keep and write to a new JSON file
  const weeks: Week[] =
    json.data.user.contributionsCollection.contributionCalendar.weeks;

  const suppresWeeks = weeks.map((week) => {
    const allContributionCount = week.contributionDays.map((day) => (day.contributionCount));
    const total = allContributionCount.reduce((sum, element) => sum + element, 0);
    const lastDay = week.contributionDays[week.contributionDays.length - 1].date

    return {
      date: week.firstDay,
      contributionCount: total,
      url:
        `https://github.com/korosuke613?tab=overview&from=${week.firstDay}&to=${lastDay}`,
    }
  });

  // Step 3. Write a new JSON file with our filtered data
  const newFilename = `contribution-weeks.json`; // name of a new file to be saved
  await writeJSON(newFilename, suppresWeeks); // create a new JSON file with just the Bitcoin price
  console.log("Wrote a post process file");
};

// Step 1: Read the downloaded_filename JSON
const filename = Deno.args[0]; // Same name as downloaded_filename `const filename = 'btc-price.json';`
const json = await readJSON(filename);
console.log(json);

await getDays(json);
await getWeeks(json);
