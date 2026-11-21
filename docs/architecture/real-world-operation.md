# SmartDress Real-World Operation

The prototype uses predefined scenarios, but the real SmartDress system
would receive context from external and device services.

## Real-world data sources

The backend can obtain:

- agenda events from the phone calendar or calendar integration
- temperature and rain probability from a weather API
- location from the phone, only to request local weather
- wardrobe and preferences from the user's account or local storage
- current time from a trusted server or the user's device

The browser does not need to send the complete context in the real system.
It can request the current recommendation, while backend integrations
collect and refresh the context.

## Real-world update cycle

The backend does not know that weather changed automatically. A backend
weather adapter periodically requests new weather data from the external
weather API. It stores the latest valid value with a timestamp and compares
it with the previous context.

```text
Weather API refresh
→ backend detects a relevant change
→ context is reinterpreted
→ recommendation is recalculated
→ frontend receives the updated result
```

Recommendations should be recalculated when:

- the application opens
- a relevant calendar event starts or ends
- the calendar changes
- refreshed weather changes the temperature or rain state
- wardrobe availability changes
- preferences change
- the user requests another outfit
- the user replaces an item

The backend should not recalculate on every small event if the recommendation
would remain unchanged. A weather refresh can be periodic, for example every
30 to 60 minutes, with a shorter interval for rapidly changing conditions.

## Backend-to-frontend communication

The frontend waits for a response after each request and then renders it.
For later real-time behavior, the backend can notify the frontend with:

- polling: the frontend periodically asks for the latest recommendation
- Server-Sent Events: the backend pushes recommendation updates
- WebSockets: the backend maintains a bidirectional connection

Server-Sent Events are sufficient when updates mainly travel from the
backend to the frontend. The frontend still remains presentation-only.

## Prototype mapping

The prototype simulates this behavior with fixed JSON scenarios:

```text
User selects a scenario
→ frontend sends { "scenarioId": "rainy-interview" }
→ Express loads the scenario JSON
→ backend interprets and scores the context
→ backend returns a recommendation
→ frontend updates the static interface
```

The scenario ID replaces the real-world context collection only for the
demonstration. The backend remains responsible for interpretation,
matching, scoring, warnings, and the final recommendation in both versions.
