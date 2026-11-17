const CATEGORY_LABELS = {
  top: "Top",
  bottom: "Bottom",
  outerLayer: "Outer layer",
  shoes: "Shoes",
};

const ACTIVITY_LABELS = {
  interview: "Interview",
  lecture: "Lecture",
  sport: "Sport",
  party: "Party",
  everyday: "Everyday",
};

const state = {
  scenarioId: selectedScenarioId,
  activeCategory: "top",
  selectedReplacementId: null,
  outfit: {},
};

function getScenario() {
  return Object.values(scenarios).find((scenario) => scenario.id === state.scenarioId);
}

function getSituation() {
  return getScenarioContext(getScenario(), userProfile);
}

function getScoredItems(situation) {
  return wardrobe
    .filter((item) => item.status === "clean")
    .map((item) => ({
      ...calculateItemScore(item, situation.requirements, situation.preferences, new Date("2026-11-17")),
      category: item.category,
    }));
}

function createRecommendation() {
  const situation = getSituation();
  const scoredItems = getScoredItems(situation);
  const outfit = {};
  const scores = {};

  situation.requirements.requiredCategories.forEach((category) => {
    const candidates = scoredItems
      .filter((entry) => entry.category === category)
      .sort((first, second) => second.score - first.score);
    if (candidates[0]) {
      outfit[category] = candidates[0].item;
      scores[category] = candidates[0];
    }
  });

  return { situation, outfit, scores, score: calculateOutfitScore(scores, outfit) };
}

function formatSituation(situation) {
  const event = situation.referenceEvent;
  const eventType = String(event?.type || "").toLowerCase();
  const eventLabel = event
    ? `${ACTIVITY_LABELS[eventType] || event.type} · ${event.startTime}`
    : "Free day";
  const weather = situation.weather.available
    ? `${situation.weather.temperature.temperature}°C · ${situation.precipitation === "rainy" ? "Rain" : "Clear"}`
    : "Weather unavailable";
  return { eventLabel, weather };
}

function renderContext(situation) {
  const labels = formatSituation(situation);
  document.querySelector("#context-summary").textContent = labels.eventLabel;
  document.querySelector("#context-tags").innerHTML = `
    <span class="context-tag">${labels.weather}</span>
    <span class="context-tag">${ACTIVITY_LABELS[situation.eventType] || situation.activity}</span>
  `;
}

function renderOutfit(recommendation) {
  state.outfit = recommendation.outfit;
  const entries = Object.entries(recommendation.outfit);
  const renderCard = ([category, item]) => `
    <article class="clothing-card clothing-${category}">
      <div class="clothing-image">${item.image ? `<img src="${item.image}" alt="${item.name}">` : "Add clothing image"}</div>
      <span class="slot">${CATEGORY_LABELS[category]}</span>
      <strong>${item.name}</strong>
      <small>${item.formality} · ${item.color}</small>
    </article>
  `;
  const leftCategories = new Set(["top", "bottom"]);
  const left = entries.filter(([category]) => leftCategories.has(category));
  const right = entries.filter(([category]) => !leftCategories.has(category));
  document.querySelector("#outfit-side-left").innerHTML = left.map(renderCard).join("");
  document.querySelector("#outfit-side-right").innerHTML = right.map(renderCard).join("");
  document.querySelector("#outfit-center").innerHTML = `
    <div class="outfit-art">
      ${entries.map(([, item]) => item.image
        ? `<img src="${item.image}" alt="">`
        : `<span class="art-placeholder">${item.name}</span>`).join("")}
    </div>
  `;

  const isWarning = recommendation.score.finalScore < 65 ||
    (recommendation.situation.precipitation === "rainy" &&
      recommendation.outfit.outerLayer?.waterResistance !== "waterproof");
  const badge = document.querySelector("#status-badge");
  badge.textContent = isWarning ? "⚠ Needs attention" : "✓ Complete";
  badge.classList.toggle("warning", isWarning);
  const explanation = document.querySelector("#explanation");
  explanation.classList.toggle("warning", isWarning);
  explanation.textContent = recommendation.situation.weather.available
    ? recommendation.situation.precipitation === "rainy"
      ? "An outer layer was added because rain is expected."
      : recommendation.situation.temperature === "hot"
        ? "Light pieces were chosen to keep you cool."
        : "An outfit matching your schedule and the weather was selected."
    : "Weather is unavailable, so this outfit is based on your schedule only.";
}

function renderToday() {
  const recommendation = createRecommendation();
  renderContext(recommendation.situation);
  renderOutfit(recommendation);
}

function renderScenarios() {
  const options = Object.values(scenarios).map((scenario) =>
    `<option value="${scenario.id}">${scenario.name}</option>`,
  ).join("");
  document.querySelector("#scenario-select").innerHTML = options;
  document.querySelector("#scenario-select-bar").innerHTML = options;
  document.querySelector("#scenario-select").value = state.scenarioId;
  document.querySelector("#scenario-select-bar").value = state.scenarioId;
}

function renderWardrobe() {
  document.querySelector("#wardrobe-list").innerHTML = wardrobe.map((item) => `
    <article class="wardrobe-row">
      <div class="clothing-image">${item.image ? `<img src="${item.image}" alt="${item.name}">` : "Add clothing image"}</div>
      <div class="item-copy"><strong>${item.name}</strong><small>${CATEGORY_LABELS[item.category]} · ${item.color}</small></div>
      <span class="status ${item.status !== "clean" ? "unavailable" : ""}">${item.status === "clean" ? "Available" : "Unavailable"}</span>
    </article>
  `).join("");
}

function renderPreferences() {
  document.querySelector("#preferred-style").textContent = userProfile.preferredStyle;
  document.querySelector("#preferred-colors").innerHTML = userProfile.preferredColors
    .map((color) => `<span class="color-pill">${color}</span>`).join("");
}

function renderReplacement() {
  const situation = getSituation();
  const current = state.outfit[state.activeCategory];
  const labels = formatSituation(situation);
  document.querySelector("#replace-context").innerHTML =
    `<div class="context-main"><span>${labels.eventLabel}</span><strong>${labels.weather}</strong></div>`;
  document.querySelector("#category-tabs").innerHTML = Object.entries(CATEGORY_LABELS).map(([category, label]) =>
    `<button class="category-tab ${category === state.activeCategory ? "is-active" : ""}" type="button" data-category="${category}">${label}</button>`,
  ).join("");
  document.querySelector("#replace-current").innerHTML = current
    ? `<div><span class="eyebrow">You are replacing</span><strong>${current.name}</strong></div><span class="muted">The rest stays the same.</span>`
    : "<span class=\"muted\">No item in this category.</span>";

  const alternatives = filterAvailableItems(wardrobe, state.activeCategory);
  document.querySelector("#available-count").textContent = `${alternatives.length} item${alternatives.length === 1 ? "" : "s"} available · Select one`;
  document.querySelector("#alternative-list").innerHTML = alternatives.map((item) => `
    <label class="alternative-card ${item.id === state.selectedReplacementId ? "is-selected" : ""}">
      <input type="radio" name="replacement" value="${item.id}" ${item.id === state.selectedReplacementId ? "checked" : ""}>
      <div class="clothing-image">${item.image ? `<img src="${item.image}" alt="${item.name}">` : "Add clothing image"}</div>
      <div class="item-copy"><strong>${item.name}</strong><small>${item.formality} · ${item.warmth} · ${item.color}</small></div>
    </label>
  `).join("");
  document.querySelector("#apply-replace").disabled = !state.selectedReplacementId;
}

function showView(viewName) {
  document.querySelectorAll(".view").forEach((view) => {
    const active = view.id === `${viewName}-view`;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });
  document.querySelectorAll(".screen-nav-item").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === viewName);
  });
  if (viewName === "replace") renderReplacement();
}

document.addEventListener("click", (event) => {
  const navItem = event.target.closest("[data-view]");
  if (navItem) showView(navItem.dataset.view);
  const category = event.target.closest("[data-category]");
  if (category) {
    state.activeCategory = category.dataset.category;
    state.selectedReplacementId = null;
    renderReplacement();
  }
});

function changeScenario(event) {
  state.scenarioId = event.target.value;
  document.querySelector("#scenario-select").value = state.scenarioId;
  document.querySelector("#scenario-select-bar").value = state.scenarioId;
  renderToday();
}

document.querySelector("#scenario-select").addEventListener("change", changeScenario);
document.querySelector("#scenario-select-bar").addEventListener("change", changeScenario);

document.querySelector("#another-button").addEventListener("click", () => {
  const current = state.outfit.top;
  const alternatives = filterAvailableItems(wardrobe, "top").filter((item) => item.id !== current?.id);
  if (alternatives[0]) state.outfit.top = alternatives[0];
  renderOutfit({ ...createRecommendation(), outfit: state.outfit });
});

document.querySelector("#confirm-button").addEventListener("click", (event) => {
  event.currentTarget.textContent = "✓ Outfit saved";
});

document.querySelector("#cancel-replace").addEventListener("click", () => showView("today"));
document.querySelector("#alternative-list").addEventListener("change", (event) => {
  state.selectedReplacementId = event.target.value;
  renderReplacement();
});
document.querySelector("#apply-replace").addEventListener("click", () => {
  const replacement = wardrobe.find((item) => item.id === state.selectedReplacementId);
  if (replacement) state.outfit[state.activeCategory] = replacement;
  state.selectedReplacementId = null;
  renderOutfit({ ...createRecommendation(), outfit: state.outfit });
  showView("today");
});

renderScenarios();
renderToday();
renderWardrobe();
renderPreferences();
