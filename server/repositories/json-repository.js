const fs = require("node:fs");
const path = require("node:path");

function readJson(fileName) {
  const filePath = path.join(__dirname, "..", "data", fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function createJsonRepositories() {
  const wardrobe = readJson("wardrobe.json");
  const profile = readJson("profile.json");
  const scenarios = readJson("scenarios.json");

  return {
    wardrobe: {
      list() {
        return wardrobe;
      },
      findById(itemId) {
        return wardrobe.find((item) => item.id === itemId) || null;
      },
    },
    profile: {
      get() {
        return profile;
      },
    },
    scenarios: {
      list() {
        return Object.values(scenarios);
      },
      findById(scenarioId) {
        return Object.values(scenarios).find((scenario) => scenario.id === scenarioId) || null;
      },
    },
  };
}

module.exports = { createJsonRepositories };
