const UNAVAILABLE_STATUSES = new Set(["dirty", "inLaundry"]);
const RECENT_WEAR_DAYS = 2;

const FORMALITY_MATCHES = {
  formal: { formal: 1, classic: 0.8, casual: 0.3, sporty: 0 },
  classic: { formal: 0.9, classic: 1, casual: 0.6, sporty: 0.2 },
  casual: { formal: 0.3, classic: 0.8, casual: 1, sporty: 0.6 },
  sporty: { formal: 0, classic: 0.2, casual: 0.6, sporty: 1 },
  social: { formal: 0.9, classic: 1, casual: 0.5, sporty: 0.1 },
};

const WARMTH_MATCHES = {
  cold: { warm: 1, medium: 0.6, light: 0.2 },
  mild: { warm: 0.5, medium: 1, light: 0.8 },
  hot: { warm: 0, medium: 0.5, light: 1 },
};

const WATER_RESISTANCE_MATCHES = {
  rainy: { waterproof: 1, moderate: 0.7, low: 0.3, none: 0 },
  dry: { waterproof: 0.5, moderate: 0.5, low: 0.5, none: 0.5 },
};

const COMPATIBLE_STYLES = {
  casual: new Set(["casual", "classic"]),
  classic: new Set(["classic", "formal", "casual"]),
  sporty: new Set(["sporty"]),
};

function isItemAvailable(item) {
  return item && !UNAVAILABLE_STATUSES.has(item.status);
}

function filterAvailableItems(items, category) {
  if (!Array.isArray(items)) {
    throw new TypeError("Items must be an array.");
  }

  return items.filter(
    (item) => isItemAvailable(item) && (!category || item.category === category),
  );
}

function matchFormality(itemFormality, requiredFormality) {
  return FORMALITY_MATCHES[requiredFormality]?.[itemFormality] ?? 0;
}

function matchWarmth(itemWarmth, temperature) {
  return WARMTH_MATCHES[temperature]?.[itemWarmth] ?? 0.5;
}

function matchWaterResistance(itemWaterResistance, precipitation) {
  return WATER_RESISTANCE_MATCHES[precipitation]?.[itemWaterResistance] ?? 0.5;
}

function matchStyle(itemStyle, preferredStyle) {
  if (!preferredStyle || !itemStyle) return 0.5;
  if (itemStyle === preferredStyle) return 1;
  if (COMPATIBLE_STYLES[preferredStyle]?.has(itemStyle)) return 0.7;
  return 0.2;
}

function matchColor(itemColor, preferredColors = []) {
  if (!Array.isArray(preferredColors) || preferredColors.length === 0) return 0.5;
  if (preferredColors.includes(itemColor)) return 1;
  if (["black", "white", "gray", "navy", "beige", "brown"].includes(itemColor)) {
    return 0.5;
  }
  return 0.2;
}

function calculateVarietyMatch(lastWorn, referenceDate = new Date()) {
  if (!lastWorn) return 1;
  const wornDate = new Date(`${lastWorn}T00:00:00`);
  const currentDate = new Date(referenceDate);
  if (Number.isNaN(wornDate.getTime()) || Number.isNaN(currentDate.getTime())) return 0.5;

  const daysSinceWorn = Math.max(
    0,
    Math.floor((currentDate - wornDate) / (24 * 60 * 60 * 1000)),
  );
  if (daysSinceWorn <= 1) return 0.2;
  if (daysSinceWorn <= RECENT_WEAR_DAYS) return 0.7;
  return 1;
}

function calculateItemScore(
  item,
  requirements,
  preferences = {},
  referenceDate = new Date(),
) {
  if (!item || !requirements) {
    throw new TypeError("An item and requirements are required.");
  }

  const matches = {
    formality: matchFormality(item.formality, requirements.formality),
    waterResistance:
      requirements.waterResistance === "notRequired" ||
      requirements.waterResistance === "unknown"
        ? 0.5
        : matchWaterResistance(item.waterResistance, requirements.precipitation || "dry"),
    warmth:
      requirements.warmth === "unknown"
        ? 0.5
        : matchWarmth(item.warmth, requirements.temperature || "mild"),
    style: matchStyle(item.style, preferences.style),
    color: matchColor(item.color, preferences.colors),
    variety: calculateVarietyMatch(item.lastWorn, referenceDate),
  };

  const score =
    matches.formality * 30 +
    matches.waterResistance * 25 +
    matches.warmth * 20 +
    matches.style * 10 +
    matches.color * 10 +
    matches.variety * 5;

  return {
    item,
    score,
    matches,
  };
}

function calculateColorCompatibility(items) {
  const colors = new Set(items.map((item) => item.color));
  if (colors.size <= 1) return 1;

  const neutralColors = new Set(["black", "white", "gray", "navy", "beige", "brown"]);
  const strongColors = [...colors].filter((color) => !neutralColors.has(color));
  return strongColors.length <= 1 ? 1 : 0.5;
}

function calculateCompatibilityScore(outfit) {
  const items = Object.values(outfit).filter(Boolean);
  if (items.length < 3) return 0;

  const formalityValues = items.map((item) => item.formality);
  const formalityScore =
    new Set(formalityValues).size === 1 ||
    (formalityValues.includes("formal") && formalityValues.includes("classic"))
      ? 3
      : 1.5;
  const styleScore =
    new Set(items.map((item) => item.style)).size === 1
      ? 2
      : items.every((item) => item.style !== "sporty")
        ? 1.5
        : 0.5;
  const colorScore = calculateColorCompatibility(items) * 2;
  const protectionScore =
    items.some((item) => item.waterResistance === "waterproof")
      ? 2
      : items.some((item) => item.waterResistance === "moderate")
        ? 1.5
        : 1;

  return Math.min(10, formalityScore + styleScore + colorScore + protectionScore);
}

function calculateOutfitScore(scoredItems, outfit) {
  const scores = Object.entries(outfit)
    .filter(([, item]) => item)
    .map(([category]) => scoredItems[category]?.score)
    .filter((score) => typeof score === "number");

  if (scores.length < 3) {
    return {
      itemAverage: 0,
      compatibility: 0,
      normalizedCompatibility: 0,
      finalScore: 0,
    };
  }

  const itemAverage = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const compatibility = calculateCompatibilityScore(outfit);
  const normalizedCompatibility = compatibility * 10;

  return {
    itemAverage,
    compatibility,
    normalizedCompatibility,
    finalScore: itemAverage * 0.9 + normalizedCompatibility * 0.1,
  };
}
