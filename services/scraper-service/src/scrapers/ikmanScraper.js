const puppeteer = require("puppeteer");
const Listing = require("../models/Listing");
const ImportedListing = require("../models/ImportedListing");

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

const scrapeIkman = async () => {
  let browser;

  try {
    console.log("🔄 Scraping Ikman (multi-page)...");

    browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"],
      defaultViewport: null,
    });

    const page = await browser.newPage();

    let allListings = [];

    // 🔥 MULTI PAGE LOOP
    for (let i = 1; i <= 3; i++) {
      console.log(`📄 Scraping Ikman page ${i}...`);

      await page.goto(
        `https://ikman.lk/en/ads/sri-lanka/cars?page=${i}`,
        {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        }
      );

      // ⏳ wait for page load
      await new Promise((resolve) => setTimeout(resolve, 6000));

      // 📸 Wait for images to load and trigger lazy loading by scrolling
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const listings = await page.evaluate(() => {
        const links = Array.from(
          document.querySelectorAll("a[href*='/en/ad/']")
        );

        const data = [];

        links.forEach((link) => {
          const text = link.innerText;
          if (!text) return;

          const priceMatch = text.match(/Rs\.?\s?[\d,]+/);
          const price = priceMatch
            ? Number(priceMatch[0].replace(/[^0-9]/g, ""))
            : null;

          const titleLine = text.split("\n")[0] || "";

          const yearMatch = text.match(/\b(19|20)\d{2}\b/);
          const year = yearMatch ? Number(yearMatch[0]) : null;

          const mileageMatch = text.match(/[\d,]+\s?km/i);
          const mileage = mileageMatch
            ? Number(mileageMatch[0].replace(/[^0-9]/g, ""))
            : null;

          const url = link.href;

          // Extract image with fallback for lazy-loaded or missing images
          let image = null;
          const imageEl = link.querySelector("img");
          if (imageEl) {
            // Try src, data-src (lazy loading), or fallback
            image = imageEl.src || imageEl.dataset.src || imageEl.getAttribute("src");
          }

          // Debug: log if image is missing
          if (!image && titleLine) {
            console.log(`📷 Missing image for: ${titleLine}`);
          }

          if (titleLine && price) {
            data.push({
              title: titleLine,
              price,
              year,
              mileage,
              url,
              image,
            });
          }
        });

        return data;
      });

      console.log(`Page ${i} listings 👉`, listings.length);
      console.log(`📸 Sample images from page ${i}:`, listings.slice(0, 3).map(l => ({ title: l.title, image: l.image })));

      // 🔥 merge all pages
      allListings = [...allListings, ...listings];

      // ⏳ delay between pages (avoid blocking)
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    console.log("🔥 TOTAL Ikman listings 👉", allListings.length);

    // 💾 SAVE TO DB
    for (const item of allListings) {
      const words = item.title.split(" ");
      const brand = words[0] || "";
      const model = words[1] || "";

      const exists = await Listing.findOne({
        source: "ikman",
        url: item.url,
      });

      if (!exists) {
  const newData = {
    ...item,
    brand,
    model,
    source: "ikman",
  };

  // 🔹 save for price estimation
  await Listing.create(newData);

  // 🔹 save for import system
  const importExists = await ImportedListing.findOne({
  source: "ikman",
  sourceUrl: item.url,
});

  if (!importExists) {
    await ImportedListing.create({
  source: "ikman",
  sourceUrl: item.url + "_" + Date.now(),
  title: item.title,
  brand,
  model,
  year: item.year,
  price: item.price,
  mileage: item.mileage,
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

    console.log("✅ Ikman data saved");
  } catch (error) {
    console.error("❌ Ikman scraping error:", error.message);
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = scrapeIkman;