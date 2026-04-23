const puppeteer = require("puppeteer");
const Listing = require("../models/Listing");

const scrapeRiyasewana = async () => {
  try {
    console.log("🔄 Scraping Riyasewana with Puppeteer...");

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();



    await page.goto("https://riyasewana.com/search/cars", {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector(".v-list");
    await new Promise(resolve => setTimeout(resolve, 3000));

    const listings = await page.evaluate(() => {
      const data = [];
      const items = document.querySelectorAll("ul.v-list > li");

      items.forEach((el) => {
        const title =
          el.querySelector(".v-card-title")?.innerText.trim() || "";

        const priceText =
          el.querySelector(".v-card-price")?.innerText.trim() || "";

        const year =
          el.querySelector(".v-card-year")?.innerText.trim() || "";

        const meta =
          el.querySelector(".v-card-meta")?.innerText.trim() || "";

        const price = Number(priceText.replace(/[^0-9]/g, ""));

        if (price) {
          data.push({
            title,
            price,
            year,
            meta,
            source: "riyasewana",
          });
        }
      });

      return data;
    });

    console.log(`Found ${listings.length} listings`);

    for (const item of listings) {
      // Extract brand and model from title
      const words = item.title.split(" ");
      const brand = words[0] || "";
      const model = words[1] || "";

      // Extract mileage from meta
      let mileage = null;
      if (item.meta) {
        const mileageMatch = item.meta.match(/[\d,]+ km/);
        mileage = mileageMatch
          ? Number(mileageMatch[0].replace(/[^0-9]/g, ""))
          : null;
      }

      const exists = await Listing.findOne({
        title: item.title,
        price: item.price,
        year: item.year,
      });
      if (!exists) {
        await Listing.create({ ...item, brand, model, mileage });
      }
    }

    await browser.close();

    console.log("✅ Riyasewana data saved");
  } catch (error) {
    console.error("Scraping error ❌", error.message);
  }
};

module.exports = scrapeRiyasewana;