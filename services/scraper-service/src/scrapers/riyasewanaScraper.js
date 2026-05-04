const puppeteer = require("puppeteer");
const Listing = require("../models/Listing");
const ImportedListing = require("../models/ImportedListing");

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

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

    // 📸 Wait for images to load
    try {
      await page.waitForSelector("img", { timeout: 5000 }).catch(() => {
        console.warn("⚠️  No images found on page");
      });
    } catch (err) {
      console.warn("⚠️  Image wait timeout", err.message);
    }

    // Scroll to load lazy images
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 2);
    });
    await new Promise((r) => setTimeout(r, 2000));

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

        // Extract image with robust selectors and lazy-loading support
        let image = null;
        const imgEl = el.querySelector("img");
        if (imgEl) {
          // Try src, data-src (lazy loading), or fallback
          image = imgEl.src || imgEl.dataset.src || imgEl.getAttribute("src");
        }

        // Debug: log if image is missing
        if (!image && title) {
          console.log(`📷 Missing image for: ${title}`);
        }

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
    console.log(`📸 Sample images from Riyasewana:`, listings.slice(0, 3).map(l => ({ title: l.title, image: l.image })));

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
  images: [
    {
      url: item.image || PLACEHOLDER_IMAGE,
      tag: "front",
    },
  ],
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