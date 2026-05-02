const puppeteer = require("puppeteer");
const Listing = require("../models/Listing");
const ImportedListing = require("../models/ImportedListing");

const scrapeRiyasewana = async () => {
  try {
    console.log("🔄 Scraping Riyasewana...");

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto("https://riyasewana.com/search/cars", {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector(".v-list");
    await new Promise((r) => setTimeout(r, 3000));

    const listings = await page.evaluate(() => {
      const data = [];
      const items = document.querySelectorAll("ul.v-list > li");

      items.forEach((el) => {
        const title =
          el.querySelector(".v-card-title")?.innerText.trim() || "";

        const priceText =
          el.querySelector(".v-card-price")?.innerText.trim() || "";

        const yearText =
          el.querySelector(".v-card-year")?.innerText.trim() || "";

        const meta =
          el.querySelector(".v-card-meta")?.innerText.trim() || "";

        const imgEl = el.querySelector("img");
        const image = imgEl ? imgEl.src : null;

        const price = Number(priceText.replace(/[^0-9]/g, ""));

        const year = Number(yearText.replace(/[^0-9]/g, "")); // ✅ FIXED

        if (price) {
          data.push({
            title,
            price,
            year,
            meta,
            source: "riyasewana",
            image,
          });
        }
      });

      return data;
    });

    console.log(`Found ${listings.length} listings`);

    for (const item of listings) {
      const words = item.title.split(" ");
      const brand = words[0] || "";
      const model = words[1] || "";

      let mileage = null;
      if (item.meta) {
        const match = item.meta.match(/[\d,]+ km/);
        mileage = match
          ? Number(match[0].replace(/[^0-9]/g, ""))
          : null;
      }

      const exists = await Listing.findOne({
        title: item.title,
        price: item.price,
        year: item.year,
      });

      if (!exists) {
  const newData = {
    ...item,
    brand,
    model,
    mileage,
  };

  // 🔹 price estimation
  await Listing.create(newData);

  // 🔹 import system
  const importExists = await ImportedListing.findOne({
    sourceUrl: item.title + "_" + item.year + "_" + item.price + "_" + Date.now()
  });

  if (!importExists) {
   await ImportedListing.create({
  source: "riyasewana",
  sourceUrl: item.title + "_" + Date.now(),
  title: item.title,
  brand,
  model,
  year: item.year,
  price: item.price,
  mileage,
  images: item.image
    ? [{ url: item.image, tag: "front" }]
    : [],
  description: "",
});
  }
}
    }

    await browser.close();
    console.log("✅ Scraping done");
  } catch (err) {
    console.error("❌ Scraping error:", err.message);
  }
};

module.exports = scrapeRiyasewana;