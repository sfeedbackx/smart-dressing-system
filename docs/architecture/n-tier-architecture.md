# SmartDress N-tier Architecture

## Purpose

SmartDress separates presentation, HTTP access, application orchestration,
domain rules, and data access. This prevents the browser interface from
becoming responsible for recommendation decisions.

## Architecture

```text
Mobile browser
    ↓ HTTP/JSON
Express API
    ↓
Application services
    ↓
Domain services
    ↓
JSON repositories
    ↓
JSON data files
```

## Tiers

### Presentation tier

The frontend contains HTML, CSS, and presentation JavaScript. It displays
recommendations, warnings, explanations, loading states, and errors. It
selects a static demo scenario and sends its scenario ID.

The frontend does not contain scenario values, interpret weather, calculate
scores, or choose an outfit. The backend owns the scenario data and receives
only the selected ID.

### API tier

Express routes expose HTTP endpoints. Controllers validate request input,
call application services, and serialize results as JSON. The API tier must
not contain detailed clothing or scoring rules.

### Application tier

Application services coordinate complete use cases. For a recommendation,
the service loads the selected scenario, profile, and wardrobe, then calls
domain services in the required order.

### Domain tier

Domain services contain context interpretation, situation and outfit
requirements, clothing matching, compatibility, scoring, fallback decisions,
warnings, and explanations. They do not depend on Express, HTTP, browser
APIs, or the DOM.

### Data tier

Repositories load JSON files and expose functions such as:

```text
getScenarioById(id)
getUserProfile()
getWardrobe()
```

Only repositories know JSON file paths and storage formats.

## Request flow

```text
POST /api/recommendations
→ route → controller → recommendation service
→ scenario and data repositories → domain services
→ JSON response → frontend rendering
```

The domain layer must remain testable without starting Express. The frontend
must remain testable with a response fixture.
