const CATEGORY_LABELS = {
  top: "Top",
  bottom: "Bottom",
  outerLayer: "Outer layer",
  shoes: "Shoes",
};

const COLORS = {
  hotSoft: "#c0392b",
  mildSoft: "#fff7e8",
  coldSoft: "#e8f1fb",
};

const TEMP_COLORS = {
  hot: COLORS.hotSoft,
  mild: COLORS.mildSoft,
  cold: COLORS.coldSoft,
};

const ACTIVITY_LABELS = {
  interview: "Interview",
  lecture: "Lecture",
  sport: "Sport",
  party: "Party",
  everyday: "Everyday",
};

const state = {
  scenarioId: null,
  scenarios: [],
  wardrobe: [],
  profile: null,
  recommendation: null,
  activeCategory: "top",
  selectedReplacementId: null,
  outfit: {},
};

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error?.message || "The server request failed.");
  }
  return body;
}

function showError(error) {
  document.querySelector("#status-badge").textContent = "⚠ Unavailable";
  document.querySelector("#status-badge").classList.add("warning");
  document.querySelector("#explanation").textContent = error.message;
  document.querySelector("#explanation").classList.add("warning");
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
  return {
    eventLabel,
    weather,
    backgroundColor: TEMP_COLORS[situation.temperature] || COLORS.mildSoft,
  };
}

function renderContext(situation) {
  const labels = formatSituation(situation);
  document.querySelector(".context-card").style.background = labels.backgroundColor;
  document.querySelector("#context-summary").textContent = labels.eventLabel;
  document.querySelector("#context-tags").innerHTML = `
    <span class="context-tag">${labels.weather}</span>
    <span class="context-tag">${ACTIVITY_LABELS[situation.eventType] || situation.activity}</span>
  `;
}

function renderOutfit(recommendation) {
  state.recommendation = recommendation;
  state.outfit = recommendation.outfit;
  const entries = Object.entries(recommendation.outfit);
  console.log(entries)
  const renderCard = ([category, item]) => `
    <article class="clothing-card clothing-${category}">
      <div class="clothing-image">${item.image ? `<img src="${item.image}" alt="${item.name}">` : "Add clothing image"}</div>
      <strong>${item.name}</strong>
      <small>${item.formality} · ${item.color}</small>
    </article>
  `;
  const leftCategories = new Set(["top", "bottom"]);
  document.querySelector("#outfit-side-left").innerHTML = entries
    .filter(([category]) => leftCategories.has(category))
    .map(renderCard)
    .join("");
  document.querySelector("#outfit-side-right").innerHTML = entries
    .filter(([category]) => !leftCategories.has(category))
    .map(renderCard)
    .join("");
  const order = ["top", "shoes", "bottom", "outerLayer"];
  const sorted = order.map((category) => entries.find(([key]) => key === category)).filter(Boolean);
  document.querySelector("#outfit-center").innerHTML = `
    <div class="outfit-art">
      ${sorted.map(([, item]) => item.image
        ? `<img src="${item.image}" alt="">`
        : `<span class="art-placeholder">${item.name}</span>`).join("")}
    </div>
  `;

  const badge = document.querySelector("#status-badge");
  const warning = recommendation.status !== "complete";
  badge.textContent = warning ? "⚠ Needs attention" : "✓ Complete";
  badge.classList.toggle("warning", warning);
  const explanation = document.querySelector("#explanation");
  explanation.classList.toggle("warning", warning);
  explanation.textContent = recommendation.warnings.length
    ? `${recommendation.explanation} ${recommendation.warnings.join(" ")}`
    : recommendation.explanation;
}

function renderScenarios() {
  const options = state.scenarios
    .map((scenario) => `<option value="${scenario.id}">${scenario.name}</option>`)
    .join("");
  document.querySelector("#scenario-select").innerHTML = options;
  document.querySelector("#scenario-select-bar").innerHTML = options;
  document.querySelector("#scenario-select").value = state.scenarioId;
  document.querySelector("#scenario-select-bar").value = state.scenarioId;
}

function renderWardrobe() {
  document.querySelector("#wardrobe-list").innerHTML = state.wardrobe.map((item) => `
    <article class="wardrobe-row">
      <div class="clothing-image">${item.image ? `<img src="${item.image}" alt="${item.name}">` : "Add clothing image"}</div>
      <div class="item-copy"><strong>${item.name}</strong><small>${CATEGORY_LABELS[item.category]} · ${item.color}</small></div>
      <span class="status ${item.status !== "clean" ? "unavailable" : ""}">${item.status === "clean" ? "Available" : "Unavailable"}</span>
    </article>
  `).join("");
}

function renderPreferences() {
  document.querySelector("#preferred-style").textContent = state.profile.preferredStyle;
  document.querySelector("#preferred-colors").innerHTML = state.profile.preferredColors
    .map((color) => `<span class="color-pill">${color}</span>`).join("");
}

function renderReplacement() {
  const situation = state.recommendation?.situation;
  if (!situation) return;
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

  const alternatives = state.wardrobe.filter(
    (item) => item.category === state.activeCategory && item.status !== "dirty" && item.status !== "inLaundry",
  );
  document.querySelector("#available-count").textContent =
    `${alternatives.length} item${alternatives.length === 1 ? "" : "s"} available · Select one`;
  document.querySelector("#alternative-list").innerHTML = alternatives.map((item) => `
    <label class="alternative-card ${item.id === state.selectedReplacementId ? "is-selected" : ""}">
      <input type="radio" name="replacement" value="${item.id}" ${item.id === state.selectedReplacementId ? "checked" : ""}>
      <div class="clothing-image">${item.image ? `<img src="${item.image}" alt="${item.name}">` : "Add clothing image"}</div>
      <div class="item-copy"><strong>${item.name}</strong><small>${item.formality} · ${item.warmth} · ${item.color}</small></div>
    </label>
  `).join("");
  document.querySelector("#apply-replace").disabled = !state.selectedReplacementId;
}

async function loadRecommendation() {
  try {
    const recommendation = await requestJson("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioId: state.scenarioId }),
    });
    renderContext(recommendation.situation);
    renderOutfit(recommendation);
  } catch (error) {
    showError(error);
  }
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

async function changeScenario(event) {
  state.scenarioId = event.target.value;
  document.querySelector("#scenario-select").value = state.scenarioId;
  document.querySelector("#scenario-select-bar").value = state.scenarioId;
  await loadRecommendation();
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

document.querySelector("#scenario-select").addEventListener("change", changeScenario);
document.querySelector("#scenario-select-bar").addEventListener("change", changeScenario);
document.querySelector("#another-button").addEventListener("click", async () => {
  const excludedIds = Object.values(state.outfit).map((item) => item.id).filter(Boolean);
  try {
    const recommendation = await requestJson("/api/recommendations/alternatives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioId: state.scenarioId, excludedIds }),
    });
    renderContext(recommendation.situation);
    renderOutfit(recommendation);
  } catch (error) {
    showError(error);
  }
});

document.querySelector("#confirm-button").addEventListener("click", (event) => {
  event.currentTarget.textContent = "✓ Outfit saved";
});
document.querySelector("#cancel-replace").addEventListener("click", () => showView("today"));
document.querySelector("#alternative-list").addEventListener("change", (event) => {
  state.selectedReplacementId = event.target.value;
  renderReplacement();
});
document.querySelector("#apply-replace").addEventListener("click", async () => {
  if (!state.selectedReplacementId) return;
  try {
    const recommendation = await requestJson("/api/recommendations/replacements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioId: state.scenarioId,
        category: state.activeCategory,
        itemId: state.selectedReplacementId,
      }),
    });
    state.selectedReplacementId = null;
    renderContext(recommendation.situation);
    renderOutfit(recommendation);
    showView("today");
  } catch (error) {
    showError(error);
  }
});

async function initialize() {
  try {
    [state.scenarios, state.wardrobe, state.profile] = await Promise.all([
      requestJson("/api/scenarios"),
      requestJson("/api/wardrobe"),
      requestJson("/api/profile"),
    ]);
    state.scenarioId = state.scenarios[0]?.id;
    renderScenarios();
    renderWardrobe();
    renderPreferences();
    await loadRecommendation();
  } catch (error) {
    showError(error);
  }
}

initialize();
