const Vehicle = require("../models/Vehicle");
const evaluateAutoTrust = require("../../autotrust");
const searchVehiclesByImage = require("../imageSearch/searchByImage");
const prepareImageForSearch = require("../imageSearch/prepareImageForSearch");
const extractFeaturesFromCNNService = require("../imageSearch/cnnClient");
const generateImageEmbeddings = require("../imageSearch/generateImageEmbeddings");
const detectViewTypeFromFile = require("../imageSearch/detectViewTypeFromFile");
const analyzeImageMetaFromFile = require("../imageSearch/analyzeImageMetaFromFile");

exports.markAsSold = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // if (vehicle.sellerClerkId !== req.user.sub) {
    //   return res.status(403).json({ message: "Not authorized" });
    // }

    vehicle.status = "sold";
    await vehicle.save();

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // if (vehicle.sellerClerkId !== req.user.sub) {
    //   return res.status(403).json({ message: "Not authorized" });
    // }

    await vehicle.deleteOne();

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete listing" });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const oldVehicle = await Vehicle.findById(req.params.id);

    if (!oldVehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const enrichedImages = req.body.images
      ? await generateImageEmbeddings(req.body.images)
      : oldVehicle.images;

    const updatedData = {
      ...req.body,
      images: enrichedImages,
    };

    const autoTrustResult = await evaluateAutoTrust(updatedData, oldVehicle);

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        ...updatedData,
        autoTrustGrade: autoTrustResult.grade,
        trustLevel: autoTrustResult.trustLevel,
        autoTrustCheckResults: autoTrustResult.checks,
      },
      { new: true }
    );

    res.json(updatedVehicle);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Failed to update listing" });
  }
};

exports.getMyListings = async (req, res) => {
  try {
    const sellerId = req.user?.sub || "test-seller-001";

    const vehicles = await Vehicle.find({
      sellerClerkId: sellerId,
    }).sort({ createdAt: -1 });

    res.json(vehicles);
  } catch (error) {
    console.error("MY LISTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch your listings" });
  }
};

exports.getSingleListing = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch listing" });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: "active" }).sort({
      createdAt: -1,
    });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

exports.createListing = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const enrichedImages = await generateImageEmbeddings(req.body.images || []);

    const vehicleData = {
      sellerClerkId: req.user?.sub || "test-seller-001",
      title: req.body.title || `${req.body.brand} ${req.body.model}`,
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      price: req.body.price,
      mileage: req.body.mileage,
      color: req.body.color,
      bodyType: req.body.bodyType,
      seats: req.body.seats,
      fuelType: req.body.fuelType,
      transmission: req.body.transmission,
      description: req.body.description,
      condition: req.body.condition,
      accidentHistory: req.body.accidentHistory,
      serviceHistory: req.body.serviceHistory,
      previousOwners: req.body.previousOwners,
      extraFeatures: req.body.extraFeatures,
      images: enrichedImages,
    };

    const autoTrustResult = await evaluateAutoTrust(vehicleData);

    const vehicle = await Vehicle.create({
      ...vehicleData,
      autoTrustGrade: autoTrustResult.grade,
      trustLevel: autoTrustResult.trustLevel,
      autoTrustCheckResults: autoTrustResult.checks,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: "Failed to create listing" });
  }
};

exports.searchByImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const preparedImage = await prepareImageForSearch(req.file);

    const cnnResponse = await extractFeaturesFromCNNService(req.file);
    const metaResponse = await analyzeImageMetaFromFile(req.file);

    const queryViewType = metaResponse.view_type || "unknown";
    const queryIsExterior =
      typeof metaResponse.is_exterior === "boolean"
        ? metaResponse.is_exterior
        : true;
    const queryBodyTypeHint = "unknown";

    const matches = await searchVehiclesByImage(
      cnnResponse.feature_vector,
      queryViewType,
      queryIsExterior,
      queryBodyTypeHint
    );

    res.status(200).json({
      message: "Similar vehicles found successfully",
      uploadedImage: {
        originalName: preparedImage.originalName,
        mimeType: preparedImage.mimeType,
        size: preparedImage.size,
      },
      queryAnalysis: {
        detectedViewType: queryViewType,
        isExterior: queryIsExterior,
        bodyTypeHint: queryBodyTypeHint,
      },
      cnn: {
        filename: cnnResponse.filename,
        contentType: cnnResponse.content_type,
        featureLength: cnnResponse.feature_length,
        cropStrategy: cnnResponse.crop_strategy,
        featureVectorPreview: cnnResponse.feature_vector_preview,
      },
      totalMatches: matches.length,
      matches,
    });
  } catch (error) {
    console.error("IMAGE SEARCH ERROR:", error.message);
    res.status(500).json({
      message: "Failed to search by image",
      error: error.message,
    });
  }
};