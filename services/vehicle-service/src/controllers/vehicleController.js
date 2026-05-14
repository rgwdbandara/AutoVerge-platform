const Vehicle = require("../models/Vehicle");
const VehicleInquiry = require("../models/VehicleInquiry");
const evaluateAutoTrust = require("../../autotrust");
const searchVehiclesByImage = require("../imageSearch/searchByImage");
const generateImageEmbeddings = require("../imageSearch/generateImageEmbeddings");
const analyzeImageWithGPT = require("../services/openaiVisionService");
const extractFeaturesFromFile = require("../imageSearch/extractFeaturesFromFile");



const ADMIN_EMAILS = [
  "admin@gmail.com",
  "bwathsala24@gmail.com",
  "bwathsala24@gamil.com",
];

const isAdminUser = (user) => {
  const email = user?.email?.toLowerCase().trim();
  const role = user?.role || user?.public_metadata?.role || user?.metadata?.role;

  return ADMIN_EMAILS.includes(email) || role === "admin";
};

exports.submitVehicleInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      budget,
      hasTradeIn,
      consentToUpdates,
      message,
      source,
    } = req.body || {};

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "Name, email, phone and message are required" });
    }

    const vehicle = await Vehicle.findById(id).select("_id title contact");

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const normalizedBudget = Number(budget);
    const inquiry = await VehicleInquiry.create({
      vehicleId: vehicle._id,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      budget: Number.isFinite(normalizedBudget) && normalizedBudget > 0 ? normalizedBudget : null,
      hasTradeIn: Boolean(hasTradeIn),
      consentToUpdates: consentToUpdates !== false,
      message: String(message).trim(),
      source: source || "car-details",
    });

    res.status(201).json({
      message: "Inquiry submitted successfully",
      inquiryId: inquiry._id,
    });
  } catch (error) {
    console.error("SUBMIT INQUIRY ERROR:", error);
    res.status(500).json({ message: "Failed to submit inquiry" });
  }
};

exports.getSellerInquiries = async (req, res) => {
  try {
    const sellerClerkId = req.user.sub;

    // Get all vehicles owned by this seller
    const sellerVehicles = await Vehicle.find({ sellerClerkId }).select("_id title");

    if (!sellerVehicles.length) {
      return res.json([]);
    }

    const vehicleIds = sellerVehicles.map((v) => v._id);

    // Get all inquiries for these vehicles
    const inquiries = await VehicleInquiry.find({ vehicleId: { $in: vehicleIds } })
      .sort({ createdAt: -1 })
      .lean();

    // Enhance inquiries with vehicle titles
    const enriched = inquiries.map((inq) => {
      const vehicle = sellerVehicles.find((v) => v._id.toString() === inq.vehicleId.toString());
      return {
        ...inq,
        vehicleTitle: vehicle?.title || "Unknown vehicle",
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error("GET SELLER INQUIRIES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch inquiries" });
  }
};

exports.getUnreadInquiryCount = async (req, res) => {
  try {
    const sellerClerkId = req.user.sub;

    const sellerVehicles = await Vehicle.find({ sellerClerkId }).select("_id").lean();

    if (!sellerVehicles.length) {
      return res.json({ unreadCount: 0 });
    }

    const vehicleIds = sellerVehicles.map((vehicle) => vehicle._id);
    const unreadCount = await VehicleInquiry.countDocuments({
      vehicleId: { $in: vehicleIds },
      readAt: null,
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error("UNREAD INQUIRY COUNT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch unread inquiry count" });
  }
};

exports.markMyInquiriesAsRead = async (req, res) => {
  try {
    const sellerClerkId = req.user.sub;

    const sellerVehicles = await Vehicle.find({ sellerClerkId }).select("_id").lean();

    if (!sellerVehicles.length) {
      return res.json({ message: "No inquiries to mark as read", updatedCount: 0 });
    }

    const vehicleIds = sellerVehicles.map((vehicle) => vehicle._id);
    const result = await VehicleInquiry.updateMany(
      {
        vehicleId: { $in: vehicleIds },
        readAt: null,
      },
      {
        $set: { readAt: new Date() },
      }
    );

    res.json({ message: "Inquiries marked as read", updatedCount: result.modifiedCount || result.nModified || 0 });
  } catch (error) {
    console.error("MARK INQUIRIES READ ERROR:", error);
    res.status(500).json({ message: "Failed to mark inquiries as read" });
  }
};

exports.markAsSold = async (req, res) => {
  try {
    const sellerClerkId = req.user.sub;
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (vehicle.sellerClerkId !== sellerClerkId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    vehicle.status = "sold";
    await vehicle.save();

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const sellerClerkId = req.user.sub;
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (vehicle.sellerClerkId !== sellerClerkId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await vehicle.deleteOne();

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete listing" });
  }
};

exports.deleteListingByAdmin = async (req, res) => {
  try {
    if (!isAdminUser(req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    await vehicle.deleteOne();

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("ADMIN DELETE ERROR:", error);
    res.status(500).json({ message: "Failed to delete listing" });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const sellerClerkId = req.user.sub;
    const oldVehicle = await Vehicle.findById(req.params.id);

    if (!oldVehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (oldVehicle.sellerClerkId !== sellerClerkId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const enrichedImages = req.body.images
      ? await generateImageEmbeddings(req.body.images)
      : oldVehicle.images;

    // Preserve existing contact info if not provided in update
    const userEmail = req.user?.email || req.user?.primary_email_address || "";
    const contact = {
      name: req.body?.contact?.name || oldVehicle.contact?.name || "",
      email: req.body?.contact?.email || oldVehicle.contact?.email || userEmail,
      phone: req.body?.contact?.phone || oldVehicle.contact?.phone || "",
    };

    const updatedData = {
      ...req.body,
      images: enrichedImages,
      contact,
    };

    const autoTrustResult = await evaluateAutoTrust(updatedData, oldVehicle);

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        ...updatedData,
        autoTrustGrade: autoTrustResult.grade,
        trustLevel: autoTrustResult.trustLevel,
        gradeReason: autoTrustResult.gradeReason,
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
    const sellerId = req.user.sub;

    if (!sellerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log("FETCHING CARS FOR USER:", sellerId);

    const vehicles = await Vehicle.find({ sellerClerkId: sellerId })
      .sort({ createdAt: -1 })
      .lean();

    const vehicleIds = vehicles.map((vehicle) => vehicle._id);
    const inquiryCounts = vehicleIds.length
      ? await VehicleInquiry.aggregate([
          { $match: { vehicleId: { $in: vehicleIds } } },
          { $group: { _id: "$vehicleId", count: { $sum: 1 } } },
        ])
      : [];

    const inquiryCountMap = new Map(
      inquiryCounts.map((item) => [item._id.toString(), item.count])
    );

    const enrichedVehicles = vehicles.map((vehicle) => ({
      ...vehicle,
      inquiryCount: inquiryCountMap.get(vehicle._id.toString()) || 0,
      viewCount: vehicle.views || 0,
    }));

    console.log("FOUND VEHICLES:", enrichedVehicles.length);

    res.json(enrichedVehicles);
  } catch (error) {
    console.error("MY LISTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch your listings" });
  }
};

exports.getExpiredListings = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      sellerClerkId: req.user.sub,
      expiresAt: { $lte: new Date() },
    }).sort({ expiresAt: -1 });

    res.json(vehicles);
  } catch (error) {
    console.error("EXPIRED LISTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch expired listings" });
  }
};

exports.getMyPendingListings = async (req, res) => {
  try {
    const sellerId = req.user.sub;

    const vehicles = await Vehicle.find({
      sellerClerkId: sellerId,
      status: "pending",
    }).sort({ createdAt: -1 });

    res.json(vehicles);
  } catch (error) {
    console.error("PENDING LISTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch pending listings" });
  }
};

exports.approveListing = async (req, res) => {
  try {
    const role =
      req.user?.role ||
      req.user?.public_metadata?.role ||
      req.user?.metadata?.role;

    if (role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: "active", isExpired: false },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(vehicle);
  } catch (error) {
    console.error("APPROVE LISTING ERROR:", error);
    res.status(500).json({ message: "Approval failed" });
  }
};

exports.reactivateListing = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (vehicle.sellerClerkId !== req.user.sub) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 30);

    vehicle.expiresAt = newExpiryDate;
    vehicle.isExpired = false;
    vehicle.status = "active";

    await vehicle.save();

    res.json(vehicle);
  } catch (error) {
    console.error("REACTIVATE ERROR:", error);
    res.status(500).json({ message: "Failed to reactivate listing" });
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
    const {
      search,
      make,
      bodyType,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
    } = req.query;

    const query = {
      status: "active",
    };

    // price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // exact filters
    if (make) query.brand = { $regex: make, $options: "i" };
    if (bodyType) query.bodyType = { $regex: bodyType, $options: "i" };
    if (fuelType) query.fuelType = { $regex: fuelType, $options: "i" };
    if (transmission) query.transmission = { $regex: transmission, $options: "i" };

    // smart search
    if (search) {
      const words = search.trim().split(/\s+/);

      query.$and = words.map((word) => ({
        $or: [
          { title: { $regex: word, $options: "i" } },
          { brand: { $regex: word, $options: "i" } },
          { model: { $regex: word, $options: "i" } },
          { fuelType: { $regex: word, $options: "i" } },
          { transmission: { $regex: word, $options: "i" } },
          { bodyType: { $regex: word, $options: "i" } },
          { description: { $regex: word, $options: "i" } },
          { "location.city": { $regex: word, $options: "i" } },
          { "location.district": { $regex: word, $options: "i" } },
        ],
      }));
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });

    res.json(vehicles);
  } catch (error) {
    console.error("FILTER ERROR:", error);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

exports.getPendingListingsForAdmin = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    res.json(vehicles);
  } catch (error) {
    console.error("ADMIN PENDING LISTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch pending listings" });
  }
};

exports.getAllListingsForAdmin = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    console.error("ADMIN ALL LISTINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch all listings" });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const [total, active, pending, rejected] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ status: "active" }),
      Vehicle.countDocuments({ status: "pending" }),
      Vehicle.countDocuments({ status: "rejected" }),
    ]);

    res.json({ total, active, pending, rejected });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

exports.approveListingByAdmin = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    vehicle.status = "active";
    await vehicle.save();

    res.json({ message: "Listing approved", vehicle });
  } catch (error) {
    console.error("ADMIN APPROVE ERROR:", error);
    res.status(500).json({ message: "Failed to approve listing" });
  }
};

exports.rejectListingByAdmin = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Listing not found" });
    }

    vehicle.status = "rejected";
    await vehicle.save();

    res.json({ message: "Listing rejected", vehicle });
  } catch (error) {
    console.error("ADMIN REJECT ERROR:", error);
    res.status(500).json({ message: "Failed to reject listing" });
  }
};

exports.createListing = async (req, res) => {
  try {
    const sellerClerkId = req.user.sub;

    if (!sellerClerkId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log("CREATING LISTING FOR USER:", sellerClerkId);
    console.log("BODY RECEIVED:", req.body);

    const enrichedImages = await generateImageEmbeddings(req.body.images || []);

    // Calculate expiry date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Use user email from auth token as fallback for contact email
    const userEmail = req.user?.email || req.user?.primary_email_address || "";

    const vehicleData = {
      sellerClerkId,
      status: "pending",
      title: req.body.title || `${req.body.brand} ${req.body.model}`,
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      price: req.body.price,
      interestRate: req.body.interestRate,
      loanTerm: req.body.loanTerm,
      downPayment: req.body.downPayment,
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
      contact: {
        name: req.body?.contact?.name || "",
        email: req.body?.contact?.email || userEmail,
        phone: req.body?.contact?.phone || "",
      },
      location: {
        city: req.body?.location?.city || "",
        district: req.body?.location?.district || "",
      },
      images: enrichedImages,
      expiresAt,
      isExpired: false,
    };

    const autoTrustResult = await evaluateAutoTrust(vehicleData);

    const vehicle = await Vehicle.create({
      ...vehicleData,
      autoTrustGrade: autoTrustResult.grade,
      trustLevel: autoTrustResult.trustLevel,
      gradeReason: autoTrustResult.gradeReason,
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
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // 1. Vision analysis: decide whether this is actually a vehicle image
    const detected = await analyzeImageWithGPT(file);

    if (!detected.isVehicle) {
      return res.status(200).json({
        success: false,
        isVehicle: false,
        message:
          "Please upload a vehicle image. The uploaded image does not appear to contain a car or vehicle.",
        results: [],
      });
    }

    // 2. CNN features (vehicle images only)
    const featureData = await extractFeaturesFromFile(file);
    const featureVector = featureData.feature_vector;

    console.log("🧠 VECTOR:", featureVector.length);

    // 3. Search
    const results = await searchVehiclesByImage(
      featureVector,
      "unknown",
      true,
      detected
    );

    res.json({
      success: true,
      isVehicle: true,
      detected,
      totalMatches: results.length,
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
};