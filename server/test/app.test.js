const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../app");

let server;
let baseUrl;

test.before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => {
  server.close();
});

test("returns a recommendation for every scenario", async () => {
  const scenariosResponse = await fetch(`${baseUrl}/api/scenarios`);
  const scenarios = await scenariosResponse.json();
  assert.equal(scenarios.length, 7);

  for (const scenario of scenarios) {
    const response = await fetch(`${baseUrl}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioId: scenario.id }),
    });
    const recommendation = await response.json();
    assert.equal(response.status, 200);
    assert.equal(recommendation.scenario.id, scenario.id);
    assert.ok(["complete", "acceptable_with_warning", "blocked"].includes(recommendation.status));
  }
});

test("rejects missing scenario IDs", async () => {
  const response = await fetch(`${baseUrl}/api/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error.code, "INVALID_REQUEST");
});

test("supports item replacement", async () => {
  const response = await fetch(`${baseUrl}/api/recommendations/replacements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenarioId: "rainy-interview",
      category: "outerLayer",
      itemId: "gray-wool-coat",
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.outfit.outerLayer.id, "gray-wool-coat");
});

test("returns a complete alternative outfit with no current item IDs", async () => {
  const firstResponse = await fetch(`${baseUrl}/api/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId: "rainy-interview" }),
  });
  const first = await firstResponse.json();
  const excludedIds = Object.values(first.outfit).map((item) => item.id);

  const alternativeResponse = await fetch(`${baseUrl}/api/recommendations/alternatives`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId: "rainy-interview", excludedIds }),
  });
  const alternative = await alternativeResponse.json();
  assert.equal(alternativeResponse.status, 200);
  for (const [category, item] of Object.entries(alternative.outfit)) {
    assert.ok(!excludedIds.includes(item.id), `${category} should differ from the current outfit`);
  }
});
