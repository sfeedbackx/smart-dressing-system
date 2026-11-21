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
const NEUTRAL_COLORS = new Set(["black", "white", "gray", "navy", "beige", "brown"]);

function isItemAvailable(item) {
  return Boolean(item) && !UNAVAILABLE_STATUSES.has(item.status);
}

function filterAvailableItems(items, category) {
  return items.filter((item) => isItemAvailable(item) && (!category || item.category === category));
}

function calculateVarietyMatch(lastWorn, referenceDate = new Date()) {
  if (!lastWorn) return 1;
  const wornDate = new Date(`${lastWorn}T00:00:00`);
  const currentDate = new Date(referenceDate);
  if (Number.isNaN(wornDate.getTime()) || Number.isNaN(currentDate.getTime())) return 0.5;
  const daysSinceWorn = Math.max(0, Math.floor((currentDate - wornDate) / 86400000));
  if (daysSinceWorn <= 1) return 0.2;
  if (daysSinceWorn <= RECENT_WEAR_DAYS) return 0.7;
  return 1;
}

function calculateItemScore(item, requirements, preferences, referenceDate) {
  const formality = FORMALITY_MATCHES[requirements.formality]?.[item.formality] ?? 0;
  const waterResistance =
    requirements.waterResistance === "notRequired" || requirements.waterResistance === "unknown"
      ? 0.5
      : WATER_RESISTANCE_MATCHES[requirements.precipitation]?.[item.waterResistance] ?? 0.5;
  const warmth =
    requirements.warmth === "unknown"
      ? 0.5
      : WARMTH_MATCHES[requirements.temperature]?.[item.warmth] ?? 0.5;
  const style =
    !preferences.style || !item.style
      ? 0.5
      : item.style === preferences.style
        ? 1
        : COMPATIBLE_STYLES[preferences.style]?.has(item.style)
          ? 0.7
          : 0.2;
  const color =
    !preferences.colors?.length
      ? 0.5
      : preferences.colors.includes(item.color)
        ? 1
        : NEUTRAL_COLORS.has(item.color)
          ? 0.5
          : 0.2;
  const matches = {
    formality,
    waterResistance,
    warmth,
    style,
    color,
    variety: calculateVarietyMatch(item.lastWorn, referenceDate),
  };
  return {
    item,
    score:
      formality * 30 +
      waterResistance * 25 +
      warmth * 20 +
      style * 10 +
      color * 10 +
      matches.variety * 5,
    matches,
  };
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
  const styles = new Set(items.map((item) => item.style));
  const styleScore =
    styles.size === 1 ? 2 : items.every((item) => item.style !== "sporty") ? 1.5 : 0.5;
  const colors = new Set(items.map((item) => item.color));
  const strongColors = [...colors].filter((color) => !NEUTRAL_COLORS.has(color));
  const colorScore = (strongColors.length <= 1 ? 1 : 0.5) * 2;
  const protectionScore = items.some((item) => item.waterResistance === "waterproof")
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
    return { itemAverage: 0, compatibility: 0, normalizedCompatibility: 0, finalScore: 0 };
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

module.exports = { filterAvailableItems, calculateItemScore, calculateOutfitScore };
