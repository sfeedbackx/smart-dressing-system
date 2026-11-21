function sendError(response, error) {
  const status = error.code === "SCENARIO_NOT_FOUND" ? 404 : error.code === "INVALID_REQUEST" ? 400 : 500;
  response.status(status).json({
    error: {
      code: error.code || "INTERNAL_ERROR",
      message: error.message,
    },
  });
}

function createRecommendationController(service) {
  function recommend(request, response) {
    const { scenarioId } = request.body || {};
    if (typeof scenarioId !== "string" || !scenarioId.trim()) {
      const error = new Error("A valid scenarioId is required.");
      error.code = "INVALID_REQUEST";
      return sendError(response, error);
    }
    try {
      return response.json(service.recommend(scenarioId));
    } catch (error) {
      return sendError(response, error);
    }
  }

  function replace(request, response) {
    const { scenarioId, category, itemId } = request.body || {};
    try {
      if (typeof scenarioId !== "string" || !scenarioId.trim()) {
        const error = new Error("A valid scenarioId is required.");
        error.code = "INVALID_REQUEST";
        throw error;
      }
      return response.json(service.recommend(scenarioId, { category, itemId }));
    } catch (error) {
      return sendError(response, error);
    }
  }

  function alternative(request, response) {
    const { scenarioId, excludedIds } = request.body || {};
    try {
      if (typeof scenarioId !== "string" || !scenarioId.trim()) {
        const error = new Error("A valid scenarioId is required.");
        error.code = "INVALID_REQUEST";
        throw error;
      }
      if (!Array.isArray(excludedIds) || excludedIds.some((itemId) => typeof itemId !== "string")) {
        const error = new Error("excludedIds must be an array of item IDs.");
        error.code = "INVALID_REQUEST";
        throw error;
      }
      return response.json(service.recommend(scenarioId, null, excludedIds));
    } catch (error) {
      return sendError(response, error);
    }
  }

  return { recommend, replace, alternative };
}

module.exports = { createRecommendationController };
