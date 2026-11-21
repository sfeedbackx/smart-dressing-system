# Development Guide

This guide defines how SmartDress should be developed.

## Technology choices

The prototype uses:

- HTML for the interface structure
- CSS for the mobile-first visual design
- vanilla JavaScript for rendering and API interaction
- Node.js and Express for the backend API
- JSON files for the predefined wardrobe, profile, and scenario data
- browser DevTools for debugging and responsive testing
- Git and GitHub for version control and collaboration

## Project structure

```text
ihm/
├── server/
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── domain/
│   └── data/
├── public/
│   ├── index.html
│   ├── reset.css
│   ├── styles.css
│   └── js/
│       └── ui.js
└── docs/
    ├── context/
    ├── rules/
    ├── design/
    └── development/
```

## File responsibilities

### `index.html`

Contains the page structure and the elements required by the interface. It
should not contain recommendation calculations.

### `reset.css`

Contains global browser normalization rules. Avoid placing feature-specific
styles here.

### `styles.css`

Contains the mobile-first layout, components, responsive rules, colors,
icons, status indicators, and visual states.

### `server/data/`

Contains JSON data and repository code that reads it:

- wardrobe items
- user profile
- demonstration scenarios
- agenda events

Data access must remain separate from domain rules. Domain code must not read
JSON files directly.

### `server/domain/context.service.js`

Transforms raw context into an interpreted situation on the backend:

```text
time + event + weather + user profile → activity + temperature + precipitation + preferences
```

### `server/domain/scoring.service.js`

Calculates on the backend:

- attribute match values
- item scores
- compatibility score
- normalized final outfit score

### `server/services/recommendation.service.js`

Coordinates the recommendation flow:

```text
situation → requirements → available items → candidate outfits → scores and warnings → selected recommendation
```

### `public/js/ui.js`

Updates the interface and handles user interaction:

- scenario selection
- outfit display
- warning indicators
- explanations
- item replacement
- preference display

The UI layer calls the Express API and renders its response. It must not
import or duplicate context, matching, scoring, or recommendation rules.

## Naming conventions

### Files and folders

Use lowercase kebab-case:

```text
development-guide.md context-situation-rules.md
```

JavaScript files use lowercase names that describe their responsibility:

```text
recommendation.js
```

### JavaScript variables and functions

Use `camelCase`:

```js
const selectedOutfit = buildRecommendation(situation);
function calculateItemScore(item, requirements) {}
```

Use verbs for functions:

```text
interpretSituation
calculateCompatibility
selectBestOutfit
renderWarning
```

### Constants

Use `UPPER_SNAKE_CASE` for fixed values:

```js
const MINIMUM_RECOMMENDATION_SCORE = 50;
const TIE_THRESHOLD = 2;
```

### Data properties

Use `camelCase` consistently:

```js
{
  name: "Gray wool coat",
  category: "outerLayer",
  warmth: "warm",
  waterResistance: "moderate",
  formality: "formal",
  lastWorn: "2026-10-22"
}
```

Use stable identifiers when an item or scenario needs to be referenced:

```js
{
  id: "gray-wool-coat",
  name: "Gray wool coat"
}
```

### Status and category values

Use explicit lowercase values:

```text
top
bottom
outerLayer
shoes

clean
dirty
inLaundry
```

Avoid mixing equivalent values such as `outer layer`, `outer_layer`, and
`coat` for the same category.

## N-tier architecture

Keep these responsibilities separate:

```text
presentation → API → application → domain → data
```

The presentation tier renders API responses, selects a static demo scenario,
and sends its scenario ID with user actions. It does not contain the
scenario values. The API tier contains Express routes and controllers. The
application tier orchestrates use cases. The domain tier contains context,
matching, scoring, fallback, and explanation rules. The data tier reads JSON
through repositories.

Recommendation logic must not manipulate the DOM. The backend returns
explicit results containing the recommendation status, selected outfit,
situation, score, warnings, and explanation. Invalid inputs and failed
recommendations must be returned as explicit errors.

## UI conventions

The interface is mobile-first and touch-friendly:

- show the outfit before technical details
- use short text and clear visual hierarchy
- use icons with text labels or accessible descriptions
- never use color as the only warning indicator
- keep technical scores hidden unless the user expands details
- explain important compromises near the affected item

## Development workflow

1. Update the relevant theory document when a rule changes.
2. Update JSON data or the appropriate backend tier.
3. Test the affected scenario through the API.
4. Check normal, warning, and blocked states.
5. Test frontend rendering and mobile interactions.
6. Keep unrelated changes out of the same commit.

## Testing priorities

Every recommendation change should be checked against:

- rainy interview
- hot lecture
- busy agenda
- unavailable clothing
- weather unavailable
- changing weather
- changing activity

Also verify:

- dirty and in-laundry items are never selected
- hot weather can omit the outer layer
- replacement alternatives stay in the same category
- warnings explain compromises
- the same situation produces a stable result
- the frontend does not recalculate or reinterpret the API response

## Documentation and collaboration

Use the root `README.md` as the entry point for the project. Keep detailed
rules in the document dedicated to that rule instead of duplicating them in
multiple files. Keep API details in
[api-contract.md](../architecture/api-contract.md).

When a rule is still undecided, record it in
[context-deferred-topics.md](../rules/context-deferred-topics.md) rather than silently choosing an implementation detail.
