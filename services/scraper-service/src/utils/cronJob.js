const cron = require("node-cron");

const scrapeRiyasewana = require("../scrapers/riyasewanaScraper");
const scrapeIkman = require("../scrapers/ikmanScraper");

const startCronJobs = () => {
  console.log("⏰ Cron Job Started...");

  // 🔥 every 10 minutes run
  cron.schedule("0 2 * * *", async () => {
    console.log("🌙 Running daily scraper (2AM job)...");

    try {
      await scrapeRiyasewana();
      await scrapeIkman();

      console.log("✅ Scheduled scraping completed");
    } catch (err) {
      console.error("❌ Cron scraping error:", err.message);
    }
  });
};

module.exports = startCronJobs;