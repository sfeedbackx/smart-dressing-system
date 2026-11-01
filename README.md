# SmartDress

SmartDress is a mobile-first outfit recommendation prototype. It adapt to context to recommend
outfit for the user.

## Project flow

```text
context → situation → outfit requirements → clothing matching → outfit scoring → recommendation → explanation and warnings
```

## Technology

The prototype uses:

- HTML
- CSS
- vanilla JavaScript
- predefined JavaScript data

The recommendation logic is kept separate from the interface so that it can
be tested and understood independently.

## Project structure

```text
ihm/
├── index.html
├── reset.css
├── styles.css
├── js/
└── docs/
```

The `js/` directory contains the implementation modules:

```text
js/
├── data.js
├── context.js
├── scoring.js
├── recommendation.js
└── ui.js
```

## Implementation order

1. Create the wardrobe, profile, weather, agenda, and scenario data.
2. Create a baisic interface
3. Transform raw context into an interpreted situation.
4. Implement clothing matching and scoring.
5. Build and select the best complete outfit.
6. Add fallback statuses and warning messages.
7. Connect the recommendation engine to the interface.
8. refine the interface to follow norms and patterns.
9. Test all demonstration scenarios.

## Documentation

Read the complete project documentation in [docs/](./docs/).

Start with the [development guide](./docs/development/development-guide.md),
then read the individual theory documents below.

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
