function formatScore(score) {
  return Number.isFinite(score) ? score.toFixed(1) : "n/a";
}

function createRecommendationLogger(logger = console) {
  function logRecommendation({ scenario, context, candidatesByCategory, outfit, score, warnings, status, replacement }) {
    logger.log("\n========== SmartDress recommendation ==========");
    logger.log(`Scenario: ${scenario.name} (${scenario.id})`);
    if (replacement) {
      logger.log(`Replacement: ${replacement.category} → ${replacement.itemId}`);
    }

    logger.log("\n1. Context transformation");
    logger.log(`  Event: ${context.eventType} → activity=${context.activity}, formality=${context.formality}`);
    logger.log(`  Temperature: ${context.weather.temperature.temperature ?? "unknown"}°C → ${context.temperature}, warmth=${context.requirements.warmth}`);
    logger.log(`  Rain probability: ${context.weather.precipitation.rainProbability ?? "unknown"}% → ${context.precipitation}, water resistance=${context.requirements.waterResistance}`);
    logger.log(`  Required categories: ${context.requirements.requiredCategories.join(", ")}`);
    logger.log(`  Preferences: style=${context.preferences.style || "none"}, colors=${context.preferences.colors.join(", ") || "none"}`);

    logger.log("\n2. Available item scores");
    for (const [category, candidates] of Object.entries(candidatesByCategory)) {
      logger.log(`  ${category}:`);
      for (const candidate of candidates) {
        const matches = Object.entries(candidate.matches)
          .map(([name, value]) => `${name}=${value.toFixed(2)}`)
          .join(", ");
        logger.log(`    ${candidate.item.name}: ${formatScore(candidate.score)}/100 (${matches})`);
      }
    }

    logger.log("\n3. Selected outfit");
    for (const [category, item] of Object.entries(outfit)) {
      logger.log(`  ${category}: ${item.name}`);
    }
    logger.log(`  Item average: ${formatScore(score.itemAverage)}/100`);
    logger.log(`  Compatibility: ${score.compatibility.toFixed(1)}/10`);
    logger.log(`  Final score: ${formatScore(score.finalScore)}/100`);
    logger.log(`  Status: ${status}`);
    if (warnings.length) logger.log(`  Warnings: ${warnings.join(" | ")}`);
    logger.log("================================================\n");
  }

  return { logRecommendation };
}

module.exports = { createRecommendationLogger };
