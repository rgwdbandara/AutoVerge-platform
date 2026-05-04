const ImportedListing = require("../models/ImportedListing");
const Vehicle = require("../models/Vehicle");
const generateImageEmbeddings = require("../../../vehicle-service/src/imageSearch/generateImageEmbeddings");

// 🔹 GET all imported listings
exports.getAllImported = async (req, res) => {
  try {
    const listings = await ImportedListing.find({
      status: "pending",
    }).sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching listings" });
  }
};

// 🔹 IGNORE listing
exports.ignoreListing = async (req, res) => {
  try {
    await ImportedListing.findByIdAndUpdate(req.params.id, {
      status: "ignored",
    });

    res.json({ message: "Listing ignored" });
  } catch (err) {
    res.status(500).json({ message: "Error ignoring listing" });
  }
};

exports.getSingleImported = async (req, res) => {
  try {
    const listing = await ImportedListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: "Error fetching listing" });
  }
};

exports.publishListing = async (req, res) => {
  try {
    const listing = await ImportedListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Imported listing not found" });
    }

    if (listing.status === "published") {
      return res.status(409).json({ message: "Listing has already been published" });
    }

    if (listing.status === "ignored") {
      return res.status(400).json({ message: "Ignored listings cannot be published" });
    }

    // Extract image URLs and convert to standard format
    const imageUrls = listing.images?.map((img) => img.url) || [];
    const imagesWithUrls = imageUrls.map((url) => ({
      url,
      tag: "imported",
    }));

    // Generate embeddings for imported car images
    const enrichedImages = await generateImageEmbeddings(imagesWithUrls);

    const vehiclePayload = {
      sellerClerkId: req.body?.sellerClerkId || "admin-imported",
      title:
        listing.title?.trim() ||
        `${listing.brand || ""} ${listing.model || ""}`.trim() ||
        "Imported Listing",
      brand: listing.brand || "",
      model: listing.model || "",
      year: listing.year || undefined,
      price: Number(listing.price) || 0,
      mileage: listing.mileage || undefined,
      fuelType: listing.fuelType || "",
      transmission: listing.transmission || "",
      description: listing.description || "",
      condition: "Good",
      status: "active",
      serviceHistory: "Unknown",
      images: enrichedImages,
    };

    const vehicle = await Vehicle.create(vehiclePayload);

    try {
      listing.status = "published";
      await listing.save();
    } catch (statusError) {
      await Vehicle.findByIdAndDelete(vehicle._id);
      throw statusError;
    }

    return res.status(201).json({
      message: "Listing published successfully",
      vehicle,
      importedListing: listing,
    });
  } catch (err) {
    console.error("PUBLISH LISTING ERROR:", err);
    return res.status(500).json({ message: "Error publishing listing" });
  }
};