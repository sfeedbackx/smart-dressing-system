# SmartDress

SmartDress is a mobile-first outfit recommendation prototype. It adapts to
context to recommend an outfit for the user.

## Project flow

```text
JSON data → Express API → context interpretation → outfit requirements
→ clothing matching → outfit scoring → recommendation → JSON response → UI rendering
```

## Technology

The prototype uses:

- HTML
- CSS
- vanilla JavaScript
- Express for the backend API
- JSON files for the data layer

The recommendation logic and static scenario data run on the backend. The
frontend sends the selected scenario ID, waits for the response, and renders
it; it does not interpret context or calculate scores.

## Project structure

```text
ihm/
├── server/
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── domain/
│   ├── repositories/
│   └── data/
├── index.html
├── reset.css
├── styles.css
├── js/
│   └── ui.js
└── docs/
```

The backend is organized into tiers:

- API tier: routes and controllers
- Application tier: recommendation orchestration
- Domain tier: context interpretation, matching, scoring, and rules
- Data tier: JSON repositories for wardrobe, profiles, and scenarios

The public frontend contains only presentation and API-client code.

## Running the prototype

From the repository root:

```bash
cd server
npm start
```

Then open `http://localhost:3000`. The same Express application serves the
frontend and the `/api` endpoints.

Each recommendation request also prints a demonstrator trace in the server
terminal. It shows the context transformation, every available candidate's
score components, the selected outfit, compatibility score, final score,
warnings, and status.

## Implementation order

1. Define the JSON data and data access layer.
2. Create the Express API structure.
3. Implement context interpretation in the backend.
4. Implement clothing matching and scoring in the backend.
5. Build and select the best complete outfit.
6. Add fallback statuses and warning messages.
7. Connect the frontend to the API.
8. Refine the mobile interface.
9. Test all demonstration scenarios through the API and UI.

## Documentation

Read the complete project documentation in [docs/](./docs/).

Start with the [development guide](./docs/development/development-guide.md),
then read the individual theory documents below.

Architecture documents:

- [N-tier architecture](./docs/architecture/n-tier-architecture.md)
- [API contract](./docs/architecture/api-contract.md)
- [Real-world operation](./docs/architecture/real-world-operation.md)

Important documents:

- [Wardrobe](./docs/context/context-wardrobe.md)
- [Situation rules](./docs/rules/context-situation-rules.md)
- [Matching rules](./docs/rules/context-matching-rules.md)
- [Scenarios](./docs/context/scenarios.md)
- [Sources and design references](./docs/design/sources.md)

## Prototype scenarios

The prototype demonstrates:

- rainy interview
- hot lecture
- busy agenda
- unavailable clothing
- unavailable weather
- changing weather
- changing activity
