const scrapeRiyasewana = require("../scrapers/riyasewanaScraper");

exports.runScraper = async (req, res) => {
  await scrapeRiyasewana();
  res.json({ message: "Scraping completed" });
};