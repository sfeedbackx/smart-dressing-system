# Demonstration Scenarios

Each scenario demonstrates one adaptation idea. A scenario is a fixed
context used for presentation. Start and end describe the demonstration
flow, not a separate feature or a real-time simulation.

## 1. Rainy interview

### Goal

Demonstrate the combination of weather and activity.

### Start

```text
Current time: 11:00
Event: interview, 12:00–13:00
Temperature: 7 °C
Rain probability: 80%
```

The interpreted situation is:

```text
cold + rainy + formal
```

### Adaptation

The system recommends:

- formal top
- formal bottom
- waterproof outer layer
- formal shoes

### End

The interface shows:

```text
Outfit chosen for: Interview at 12:00
```

The demonstration ends when the complete outfit and its explanation are
visible.

## 2. Hot lecture day

### Goal

Demonstrate weather adaptation and the effect of recent wear.

### Start

```text
Current time: 08:00
Event: lecture, 09:00–11:00
Temperature: 30 °C
Rain probability: 0%
```

The interpreted situation is:

```text
hot + dry + casual
```

One suitable top was worn yesterday.

### Adaptation

The system recommends:

- a light top that was not recently worn
- a light bottom
- no outer layer
- comfortable shoes

The recently worn top remains available for replacement but is ranked
lower.

### End

The interface shows a light outfit selected for a hot lecture day.

## 3. Busy agenda

### Goal

Demonstrate that the current time changes the reference event and the
recommendation.

### Start

The scenario opens with:

```text
Lecture:    09:00–11:00
Interview:  14:00–15:00
Sport:      18:00–19:00
Temperature: 18 °C
Rain probability: 10%
```

### Presentation flow

At 10:00, the lecture is in progress:

```text
Reference event: lecture
Recommendation: casual outfit
```

At 12:00, the lecture has ended and the interview is the next event:

```text
Reference event: interview
Recommendation: formal outfit
```

At 16:00, the interview has ended and sport is the next event:

```text
Reference event: sport
Recommendation: sporty outfit
```

### End

The audience sees:

```text
current time changes
→ reference event changes
→ recommendation changes
```

## 4. Unavailable clothing item

### Goal

Demonstrate that an unavailable clothing item is not recommended.

### Start

```text
Current time: 07:30
Event: lecture, 09:00–11:00
Temperature: 9 °C
Rain probability: 90%
```

The preferred waterproof coat has:

```text
status: dirty
```

The interpreted situation is:

```text
cold + rainy + casual
```

### Adaptation

The system excludes the dirty coat and selects the best clean alternative.
It displays:

```text
The preferred coat is unavailable. A clean alternative was selected.
```

### End

The final outfit contains only clean items. The demonstration ends when
the unavailable item has been excluded and an alternative is shown.

## 5. Weather unavailable

### Goal

Demonstrate transparent handling of incomplete context.

### Start

```text
Current time: 18:00
Event: party, 20:00–23:00
Weather: unavailable
```

The agenda and wardrobe are available, but weather data is missing.

### Adaptation

The interface shows:

```text
Weather information is unavailable.
```

The recommendation uses:

- party formality
- user preferences
- clean wardrobe items

The system does not claim that the outfit is rainproof or warm enough.

### End

The interface shows the warning, the recommendation, and an explanation
that weather was not considered.

## 6. Changing weather

### Goal

Demonstrate adaptation to different weather states while the activity and
wardrobe remain unchanged.

This scenario uses predefined states, not a slider.

### Start

```text
Activity: everyday
Wardrobe: unchanged
```

### Presentation flow

Cold state:

```text
Temperature: 7 °C
Rain probability: 10%
Recommendation: warm top + warm bottom + outer layer
```

Mild state:

```text
Temperature: 18 °C
Rain probability: 10%
Recommendation: lighter clothes + optional outer layer
```

Hot state:

```text
Temperature: 30 °C
Rain probability: 0%
Recommendation: light top + light bottom + no outer layer
```

### End

The audience sees:

```text
same activity + same wardrobe
→ different weather
→ different outfit
```

## 7. Changing activity

### Goal

Demonstrate that activity changes outfit requirements while weather and
wardrobe remain unchanged.

### Start

```text
Temperature: 18 °C
Rain probability: 10%
```

### Presentation flow

```text
Lecture    → casual outfit
Interview  → formal outfit
Sport      → sporty and comfortable outfit
```

### End

The audience sees:

```text
same weather + same wardrobe
→ different activity
→ different outfit
```

