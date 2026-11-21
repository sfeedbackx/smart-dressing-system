# SmartDress API Contract

The Express API is the boundary between the frontend and recommendation
logic. The frontend consumes the response and does not calculate a second
result locally.

## Recommendation

```http
POST /api/recommendations
Content-Type: application/json
```

For this static prototype, the frontend sends only the selected scenario ID.
The backend loads the corresponding scenario, wardrobe, and profile data from
JSON.

```http
POST /api/recommendations
```

### Request body

```json
{
  "scenarioId": "rainy-interview"
}
```

The scenario ID is the only recommendation input sent by the frontend. The
scenario data remains on the backend.

### Success response

```json
{
  "status": "acceptable_with_warning",
  "scenario": {
    "id": "rainy-interview",
    "name": "Rainy interview"
  },
  "situation": {
    "eventType": "interview",
    "activity": "formal",
    "temperature": "cold",
    "precipitation": "rainy"
  },
  "outfit": {
    "top": {},
    "bottom": {},
    "outerLayer": {},
    "shoes": {}
  },
  "score": {
    "final": 78,
    "itemAverage": 80,
    "compatibility": 6
  },
  "warnings": [
    "No clean waterproof coat was available."
  ],
  "explanation": "A clean water-resistant coat was selected instead."
}
```

The exact clothing objects are returned by the backend so the frontend can
render names, attributes, and image paths without duplicating data access.

## Replacement

```http
POST /api/recommendations/replacements
Content-Type: application/json
```

Request body:

```json
{
  "scenarioId": "rainy-interview",
  "category": "outerLayer",
  "itemId": "gray-wool-coat"
}
```

The backend loads the scenario and interprets its context, keeps the
situation and other outfit items unchanged, recalculates the complete outfit,
and returns the same response shape.

## Complete outfit alternative

```http
POST /api/recommendations/alternatives
Content-Type: application/json
```

```json
{
  "scenarioId": "rainy-interview",
  "excludedIds": [
    "gray-wool-sweater",
    "dark-formal-trousers",
    "brown-ankle-boots",
    "gray-wool-coat"
  ]
}
```

The backend excludes the current items while recalculating. This endpoint
can change items across multiple categories and returns a complete alternative
outfit rather than replacing only one category.

## Status values

```text
complete
acceptable_with_warning
blocked
```

The backend determines the status. The frontend only displays it.

## Errors

### Invalid request

```http
400 Bad Request
```

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "A valid scenarioId is required."
  }
}
```

The frontend must show an explicit error state instead of silently using a
local or outdated recommendation.

## Supporting data endpoints

The presentation layer uses these read-only endpoints to populate the static
interface:

```http
GET /api/scenarios
GET /api/wardrobe
GET /api/profile
GET /api/health
```

The recommendation rules are not exposed through these endpoints. They remain
inside the backend domain and application services.
