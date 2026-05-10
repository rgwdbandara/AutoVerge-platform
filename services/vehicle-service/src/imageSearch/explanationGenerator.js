/**
 * Intelligent Match Explanation Generator
 * 
 * Generates detailed, vehicle-specific explanations for recommendations
 * based on detected brand, model, body type, and matching confidence
 */

const normalize = (str) =>
  (str || "")
    .toString()
    .toLowerCase()
    .replace(/[-\s]/g, "")
    .replace(/[^a-z0-9]/g, "");

const brandAliases = {
  mercedes: "mercedesbenz",
  mercedesbenz: "mercedesbenz",
  benz: "mercedesbenz",
};

const normalizeBrand = (brand) => {
  const clean = normalize(brand);
  return brandAliases[clean] || clean;
};

const isModelRelated = (detectedModel, vehicleModel) => {
  const detected = normalize(detectedModel);
  const vehicle = normalize(vehicleModel);

  if (!detected || !vehicle) return false;
  if (detected === vehicle) return true;
  if (detected.includes(vehicle) || vehicle.includes(detected)) return true;

  const detectedParts = detected.split(/(?=\d)|(?<=\d)/).filter(Boolean);
  const vehicleParts = vehicle.split(/(?=\d)|(?<=\d)/).filter(Boolean);

  return (
    detectedParts.some((part) => vehicle.includes(part)) ||
    vehicleParts.some((part) => detected.includes(part))
  );
};

const normalizeBodyType = (bodyType) => normalize(bodyType).replace(/crossover/g, "suv");

/**
 * Generate intelligent explanation based on match factors
 */
const generateMatchExplanation = (
  vehicle,
  detected,
  matchScore,
  matchCategory
) => {
  // Extract normalized values
  const dbBrand = vehicle.brand ? normalizeBrand(vehicle.brand) : "";
  const gptBrand = detected?.brand ? normalizeBrand(detected.brand) : "";
  const brandMatch = dbBrand && gptBrand && (dbBrand.includes(gptBrand) || gptBrand.includes(dbBrand));
  const modelMatch = detected?.model && vehicle.model && isModelRelated(detected.model, vehicle.model);
  const detectedBodyType = detected?.type ? normalize(detected.type) : "";
  const vehicleBodyType = vehicle.bodyType ? normalize(vehicle.bodyType) : "";
  const bodyTypeMatch =
    detectedBodyType && vehicleBodyType && normalizeBodyType(vehicleBodyType).includes(normalizeBodyType(detectedBodyType));

  const detectedModel = normalize(detected?.model);
  const vehicleModel = normalize(vehicle?.model);
  const sameFamily =
    detectedModel &&
    vehicleModel &&
    (detectedModel.includes(vehicleModel) || vehicleModel.includes(detectedModel));

  const brandLabel = vehicle.brand || "vehicle";
  const modelLabel = vehicle.model || "model";
  const bodyLabel = vehicle.bodyType || "body type";

  // Priority 1: Exact Match - Brand + Model + Body Type
  if (brandMatch && modelMatch && bodyTypeMatch) {
    return `Exact match: same ${brandLabel} ${modelLabel} ${bodyLabel} platform detected with matching body proportions and front-end styling.`;
  }

  // Priority 2: Brand + Model Match (strong indicator)
  if (brandMatch && modelMatch) {
    return `Strong match: same ${brandLabel} ${modelLabel} family detected with matching grille structure and exterior proportions.`;
  }

  // Priority 3: Brand + Body Type Match
  if (brandMatch && bodyTypeMatch) {
    const bodyDesc = getBodyTypeDescription(vehicle.bodyType, "features");
    return `Brand and body type match: same ${brandLabel} ${bodyLabel} category with ${bodyDesc} and similar silhouette.`;
  }

  // Priority 4: Model + Body Type Match (no brand detected)
  if (modelMatch && bodyTypeMatch) {
    const bodyDesc = getBodyTypeDescription(vehicle.bodyType, "structure");
    return `Model and body type match: ${modelLabel} ${bodyLabel} with similar ${bodyDesc} and compact proportions detected.`;
  }

  // Priority 5: Brand Match Only
  if (brandMatch) {
    return `Same brand detected: ${brandLabel} styling language, front fascia, and exterior cues align with the uploaded image.`;
  }

  // Priority 6: Body Type Match
  if (bodyTypeMatch) {
    const bodyDesc = getBodyTypeDescription(vehicle.bodyType, "silhouette");
    return `Body type match: ${bodyLabel} silhouette with ${bodyDesc} and comparable vehicle proportions detected.`;
  }

  // Priority 7: Same family / related model cues
  if (sameFamily && brandMatch) {
    return `Related family match: same ${brandLabel} platform family with closely related model cues and similar cabin-to-body proportions.`;
  }

  // Priority 8: High Confidence Visual Match
  if (matchScore >= 0.85) {
    return `Strong visual similarity: matching roofline, headlight geometry, grille shape, and overall stance detected.`;
  }

  // Priority 9: Moderate Visual Match
  if (matchScore >= 0.75) {
    return `Moderate visual similarity: similar body shape, front styling, and exterior proportions detected.`;
  }

  // Priority 10: General Match
  return `Recommended match: visual features and vehicle characteristics align with the uploaded image based on combined brand, model, and body-type analysis.`;
};

/**
 * Get body type-specific descriptive text
 */
const getBodyTypeDescription = (bodyType, context = "design") => {
  const type = normalize(bodyType);

  const descriptions = {
    sedan: {
      design: "with sleek three-box design",
      features: "proportions with typical four-door layout",
      structure: "body structure with horizontal roofline",
      silhouette: "sedan silhouette with distinctive proportions",
    },
    wagon: {
      design: "with extended cargo area design",
      features: "with extended cargo section and roof rails",
      structure: "body with elongated rear cargo area",
      silhouette: "wagon profile with extended cargo space",
    },
    hatchback: {
      design: "with compact rear hatch design",
      features: "with integrated rear hatch and glass",
      structure: "body with rear-mounted hatch door",
      silhouette: "compact hatchback profile",
    },
    suv: {
      design: "with high ground clearance design",
      features: "with elevated driving position and roof rails",
      structure: "body with raised stance and robust build",
      silhouette: "SUV profile with elevated stance",
    },
    pickup: {
      design: "with open cargo bed design",
      features: "with visible cargo bed and cab structure",
      structure: "body with separate cargo bed",
      silhouette: "pickup truck profile with cargo bed",
    },
    coupe: {
      design: "with sporty two-door design",
      features: "with sleek side profile and aggressive styling",
      structure: "body with low roofline and sporty proportions",
      silhouette: "sporty coupe silhouette",
    },
    van: {
      design: "with spacious van design",
      features: "with elongated body and multiple passenger doors",
      structure: "body with boxy passenger compartment",
      silhouette: "van profile with boxy cargo area",
    },
  };

  // Find matching body type
  for (const [key, texts] of Object.entries(descriptions)) {
    if (type.includes(key) || key.includes(type)) {
      return texts[context] || texts.design;
    }
  }

  return "styling cues";
};

/**
 * Generate intelligent matched features based on match factors
 */
const generateIntelligentFeatures = (
  detected,
  vehicle,
  matchScore,
  matchCategory
) => {
  const features = new Set();

  const addFeatures = (...items) => {
    items.filter(Boolean).forEach((item) => features.add(item));
  };

  // View-specific features
  if (detected?.viewType) {
    const view = (detected.viewType || "").toLowerCase();

    if (view.includes("front")) {
      addFeatures("front grille", "headlight design", "front bumper");
    } else if (view.includes("side")) {
      addFeatures("side profile", "wheel design", "body line");
    } else if (view.includes("rear")) {
      addFeatures("rear silhouette", "tail lights", "rear bumper");
    } else if (view.includes("angled")) {
      addFeatures("body proportions", "lighting design", "exterior contour");
    }
  }

  // Brand-specific styling cues
  if (detected?.brand) {
    const brand = (detected.brand || "").toLowerCase();

    if (brand.includes("toyota")) {
      addFeatures("Toyota styling", "reliable proportions");
    } else if (brand.includes("mercedes")) {
      addFeatures("Mercedes design language", "premium styling");
    } else if (brand.includes("honda")) {
      addFeatures("Honda engineering cues", "practical design");
    } else if (brand.includes("ford")) {
      addFeatures("Ford truck design", "rugged proportions");
    } else if (brand.includes("bmw")) {
      addFeatures("BMW design", "sporty proportions");
    }
  }

  // Body type features
  if (vehicle.bodyType) {
    const bodyType = normalize(vehicle.bodyType);

    if (bodyType.includes("sedan")) {
      addFeatures("four-door layout", "sedan proportions", "window design");
    } else if (bodyType.includes("wagon")) {
      addFeatures("extended cargo area", "roof rails", "wagon design");
    } else if (bodyType.includes("hatchback")) {
      addFeatures("rear hatch", "compact proportions", "hatchback styling");
    } else if (bodyType.includes("suv")) {
      addFeatures("elevated ground clearance", "roof rails", "SUV stance");
    } else if (bodyType.includes("pickup")) {
      addFeatures("cargo bed design", "cab structure", "truck proportions");
    }
  }

  // Confidence-based features
  if (matchScore >= 0.95) {
    addFeatures("strong overall alignment", "distinctive styling match");
  } else if (matchScore >= 0.85) {
    addFeatures("high visual similarity", "matching proportions");
  } else if (matchScore >= 0.75) {
    addFeatures("shape similarity", "visible element match");
  }

  // Return as array, limit to 5 features
  return Array.from(features)
    .filter((f) => f && f.length > 0)
    .slice(0, 5);
};

module.exports = {
  generateMatchExplanation,
  generateIntelligentFeatures,
};
