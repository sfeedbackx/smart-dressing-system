const { interpretContext } = require("../domain/context");
const {
  filterAvailableItems,
  calculateItemScore,
  calculateOutfitScore,
} = require("../domain/scoring");

const VALID_CATEGORIES = new Set(["top", "bottom", "outerLayer", "shoes"]);

function getScenarioInputs(scenario) {
  return {
    ...scenario,
    weather: scenario.weather || scenario.weatherStates?.[0] || null,
    agenda:
      scenario.agenda?.length
        ? scenario.agenda
        : scenario.activityStates?.[0]
          ? [
              {
                id: scenario.activityStates[0],
                type: scenario.activityStates[0],
                startTime: "09:00",
                endTime: "10:00",
              },
            ]
          : [],
  };
}

function createRecommendation({ scenario, wardrobe, profile, replacement, excludedIds = [], logger }) {
  const context = interpretContext({
    ...getScenarioInputs(scenario),
    userProfile: profile,
  });
  const scoredItems = {};
  const candidatesByCategory = {};
  const outfit = {};
  const warnings = [];

  for (const category of context.requirements.requiredCategories) {
    const candidates = filterAvailableItems(wardrobe, category)
      .map((item) => calculateItemScore(item, context.requirements, context.preferences))
      .sort((first, second) => second.score - first.score);
    candidatesByCategory[category] = candidates;
    if (!candidates[0]) {
      warnings.push(`No available item was found for ${category}.`);
      continue;
    }

    const selected = replacement?.category === category
      ? candidates.find(({ item }) => item.id === replacement.itemId)
      : excludedIds.length
        ? candidates.find(({ item }) => !excludedIds.includes(item.id))
        : null;

    const chosen = selected || candidates[0];
    if (replacement?.category === category && !selected) {
      const error = new Error(`Item "${replacement.itemId}" is not available for ${category}.`);
      error.code = "INVALID_REQUEST";
      throw error;
    }
    outfit[category] = chosen.item;
    scoredItems[category] = chosen;
  }

  if (
    context.precipitation === "rainy" &&
    (!outfit.outerLayer || outfit.outerLayer.waterResistance !== "waterproof")
  ) {
    warnings.push("No clean waterproof coat was available.");
  }

  const score = calculateOutfitScore(scoredItems, outfit);
  const status =
    context.requirements.requiredCategories.some((category) => !outfit[category])
      ? "blocked"
      : warnings.length
        ? "acceptable_with_warning"
        : "complete";

  const recommendation = {
    status,
    scenario: { id: scenario.id, name: scenario.name },
    situation: {
      eventType: context.eventType,
      activity: context.activity,
      temperature: context.temperature,
      precipitation: context.precipitation,
      referenceEvent: context.referenceEvent,
      weather: context.weather,
    },
    outfit,
    score: {
      final: Math.round(score.finalScore),
      itemAverage: Math.round(score.itemAverage),
      compatibility: score.compatibility,
    },
    warnings,
    explanation: warnings.length
      ? "The best available items were selected."
      : "An outfit was selected.",
  };
  logger?.logRecommendation({
    scenario,
    context,
    candidatesByCategory,
    outfit,
    score,
    warnings,
    status,
    replacement,
  });
  return recommendation;
}

function validateReplacement(replacement) {
  if (!replacement || !VALID_CATEGORIES.has(replacement.category) || typeof replacement.itemId !== "string") {
    const error = new Error("A valid category and itemId are required.");
    error.code = "INVALID_REQUEST";
    throw error;
  }
}

function createRecommendationService(repositories, logger) {
  function recommend(scenarioId, replacement, excludedIds = []) {
    const scenario = repositories.scenarios.findById(scenarioId);
    if (!scenario) {
      const error = new Error(`Unknown scenarioId "${scenarioId}".`);
      error.code = "SCENARIO_NOT_FOUND";
      throw error;
    }
    if (replacement) validateReplacement(replacement);
    return createRecommendation({
      scenario,
      wardrobe: repositories.wardrobe.list(),
      profile: repositories.profile.get(),
      replacement,
      excludedIds,
      logger,
    });
  }

  return { recommend };
}

module.exports = { createRecommendationService };
