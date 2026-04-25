const scrapeRiyasewana = require("../scrapers/riyasewanaScraper");
const scrapeIkman = require("../scrapers/ikmanScraper");

exports.runScraper = async (req, res) => {
  await scrapeRiyasewana();
  await scrapeIkman();

  res.json({
    message: "Scraping completed",
    sources: ["riyasewana", "ikman"],
  });
};