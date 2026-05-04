const cron = require("node-cron");

const scrapeRiyasewana = require("../scrapers/riyasewanaScraper");
const scrapeIkman = require("../scrapers/ikmanScraper");

const startCronJobs = () => {
  console.log("⏰ Cron Job Started...");

  // 🔥 every 2 days at 2AM
  cron.schedule("0 2 */2 * *", async () => {
    console.log("🌙 Running scraper (every 2 days at 2AM)...");

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