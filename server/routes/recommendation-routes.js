const express = require("express");

function createRecommendationRouter(controller) {
  const router = express.Router();
  router.post("/recommendations", controller.recommend);
  router.post("/recommendations/replacements", controller.replace);
  router.post("/recommendations/alternatives", controller.alternative);
  return router;
}

module.exports = { createRecommendationRouter };
