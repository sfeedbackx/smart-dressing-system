const ACTIVITY_RULES = {
  interview: {
    activity: "formal",
    formality: "formal",
    comfort: "structured",
  },
  lecture: {
    activity: "casual",
    formality: "casual",
    comfort: "comfortable",
  },
  sport: {
    activity: "sporty",
    formality: "sporty",
    comfort: "comfortable",
  },
  party: {
    activity: "social",
    formality: "classic",
    comfort: "social",
  },
  everyday: {
    activity: "casual",
    formality: "casual",
    comfort: "comfortable",
  },
};

const TEMPERATURE_RULES = {
  cold: {
    warmth: "warm",
    outerLayer: "required",
  },
  mild: {
    warmth: "medium",
    outerLayer: "optional",
  },
  hot: {
    warmth: "light",
    outerLayer: "omitted",
  },
  unknown: {
    warmth: "unknown",
    outerLayer: "optional",
  },
};

const BASE_REQUIRED_CATEGORIES = ["top", "bottom", "shoes"];

function parseTimeToMinutes(time) {
  if (typeof time !== "string") {
    throw new TypeError("Time must be a string in HH:MM format.");
  }

  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    throw new RangeError(`Invalid time: ${time}. Expected HH:MM.`);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    throw new RangeError(`Invalid time: ${time}.`);
  }

  return hours * 60 + minutes;
}

function getReferenceEvent(agenda = [], currentTime) {
  if (!Array.isArray(agenda)) {
    throw new TypeError("Agenda must be an array.");
  }

  const now = parseTimeToMinutes(currentTime);
  const events = agenda.map((event) => {
    const start = parseTimeToMinutes(event.startTime);
    const end = parseTimeToMinutes(event.endTime);

    if (end <= start) {
      throw new RangeError(`Event "${event.id || event.type}" has an invalid time range.`);
    }

    return { event, start, end };
  });

  const currentEvent = events.find(({ start, end }) => start <= now && now < end);
  if (currentEvent) {
    return { ...currentEvent.event, state: "inProgress" };
  }

  const nextEvent = events
    .filter(({ start }) => start > now)
    .sort((first, second) => first.start - second.start)[0];

  return nextEvent ? { ...nextEvent.event, state: "upcoming" } : null;
}

function interpretActivity(eventType = "everyday") {
  const rule = ACTIVITY_RULES[eventType] || ACTIVITY_RULES.everyday;
  return {
    eventType,
    activity: rule.activity,
    formality: rule.formality,
    comfort: rule.comfort,
  };
}

function interpretTemperature(temperature) {
  if (typeof temperature !== "number" || !Number.isFinite(temperature)) {
    return {
      level: "unknown",
      temperature: null,
      ...TEMPERATURE_RULES.unknown,
    };
  }

  const level = temperature < 10 ? "cold" : temperature >= 25 ? "hot" : "mild";
  return {
    level,
    temperature,
    ...TEMPERATURE_RULES[level],
  };
}

function interpretPrecipitation(rainProbability) {
  if (typeof rainProbability !== "number" || !Number.isFinite(rainProbability)) {
    return {
      level: "unknown",
      rainProbability: null,
      waterResistance: "unknown",
    };
  }

  const level = rainProbability >= 50 ? "rainy" : "dry";
  return {
    level,
    rainProbability,
    waterResistance: level === "rainy" ? "required" : "notRequired",
  };
}

function interpretWeather(weather) {
  if (!weather) {
    return {
      available: false,
      temperature: interpretTemperature(),
      precipitation: interpretPrecipitation(),
    };
  }

  return {
    available: true,
    temperature: interpretTemperature(weather.temperature),
    precipitation: interpretPrecipitation(weather.rainProbability),
  };
}

function buildOutfitRequirements(activity, weather) {
  const requirements = {
    requiredCategories: [...BASE_REQUIRED_CATEGORIES],
    formality: activity.formality,
    activity: activity.activity,
    comfort: activity.comfort,
    temperature: weather.temperature.level,
    precipitation: weather.precipitation.level,
    warmth: weather.temperature.warmth,
    waterResistance: weather.precipitation.waterResistance,
    outerLayer:
      weather.precipitation.level === "rainy"
        ? "required"
        : weather.temperature.outerLayer,
  };

  if (
    weather.temperature.outerLayer === "required" ||
    weather.precipitation.level === "rainy"
  ) {
    requirements.requiredCategories.push("outerLayer");
  }

  return requirements;
}

function interpretContext({
  currentTime,
  agenda = [],
  weather = null,
  userProfile = {},
} = {}) {
  const referenceEvent = getReferenceEvent(agenda, currentTime);
  const activity = interpretActivity(referenceEvent?.type || "everyday");
  const interpretedWeather = interpretWeather(weather);

  return {
    currentTime,
    referenceEvent,
    activity: activity.activity,
    eventType: activity.eventType,
    formality: activity.formality,
    comfort: activity.comfort,
    temperature: interpretedWeather.temperature.level,
    precipitation: interpretedWeather.precipitation.level,
    weather: interpretedWeather,
    preferences: {
      style: userProfile.preferredStyle || null,
      colors: Array.isArray(userProfile.preferredColors)
        ? [...userProfile.preferredColors]
        : [],
    },
    requirements: buildOutfitRequirements(activity, interpretedWeather),
  };
}

function getScenarioContext(scenario, userProfile = {}) {
  if (!scenario || typeof scenario !== "object") {
    throw new TypeError("A scenario object is required.");
  }

  return interpretContext({
    currentTime: scenario.currentTime,
    agenda: scenario.agenda,
    weather: scenario.weather,
    userProfile,
  });
}
