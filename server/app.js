const express = require("express");
const path = require("node:path");
const { createJsonRepositories } = require("./repositories/json-repository");
const { createRecommendationService } = require("./services/recommendation-service");
const { createRecommendationLogger } = require("./services/recommendation-logger");
const { createRecommendationController } = require("./controllers/recommendation-controller");
const { createRecommendationRouter } = require("./routes/recommendation-routes");

function createApp() {
  const app = express();
  const repositories = createJsonRepositories();
  const service = createRecommendationService(repositories, createRecommendationLogger());
  const controller = createRecommendationController(service);

  app.use(express.json({ limit: "16kb" }));
  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
  app.get("/api/scenarios", (_request, response) => {
    response.json(repositories.scenarios.list().map(({ id, name }) => ({ id, name })));
  });
  app.get("/api/wardrobe", (_request, response) => response.json(repositories.wardrobe.list()));
  app.get("/api/profile", (_request, response) => response.json(repositories.profile.get()));
  app.use("/api", createRecommendationRouter(controller));
  app.use(express.static(path.resolve(__dirname, "..")));

  app.use((error, _request, response, _next) => {
    if (error instanceof SyntaxError && error.status === 400) {
      return response.status(400).json({
        error: { code: "INVALID_JSON", message: "Request body must contain valid JSON." },
      });
    }
    return response.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "The server could not process the request." },
    });
  });

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createApp().listen(port, () => {
    console.log(`SmartDress API listening on http://localhost:${port}`);
  });
}

module.exports = { createApp };
