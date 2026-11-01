# Theory Validation

This checklist verifies the current theory against the demonstration
scenarios. Detailed color compatibility, style compatibility, and temporal
implementation behavior are intentionally deferred.

## Validation flow

The complete theoretical flow is:

```text
raw context → interpreted situation → outfit requirements → filter unavailable items → score clothing items → build compatible outfits → normalize and calculate final scores → apply fallback and warning rules → explain the recommendation
```

## Scenario checks

### 1. Rainy interview

```text
7 °C + 80% rain + interview → cold + rainy + formal → formal, warm, and rain-protective requirements
```

The dirty navy waterproof coat is excluded. The clean gray wool coat is the
formal alternative, but it is only moderately water-resistant. The theory
therefore produces a valid formal outfit with a non-critical warning rather
than claiming full waterproof protection.

**Result:** supported with a documented weather-protection compromise.

### 2. Hot lecture day

```text
30 °C + dry + lecture → hot + dry + casual → light clothes, no outer layer, comfortable shoes
```

The recently worn suitable top remains available but receives a lower
variety score.

**Result:** supported.

### 3. Busy agenda

The reference event changes according to the current time:

```text
10:00 → lecture → casual recommendation
12:00 → interview → formal recommendation
16:00 → sport → sporty recommendation
```

**Result:** supported by the agenda and situation rules.

### 4. Unavailable clothing item

The dirty preferred coat is filtered before scoring. A clean alternative is
selected and the substitution is explained.

**Result:** supported.

### 5. Weather unavailable

The system keeps the party/activity requirements and user preferences, but
does not apply temperature or rain requirements. It displays the weather
warning and does not claim weather protection.

**Result:** supported.

### 6. Changing weather

With the activity and wardrobe unchanged:

```text
7 °C  → warm clothes + outer layer
18 °C → lighter clothes + optional outer layer
30 °C → light clothes + no outer layer
```

**Result:** supported.

### 7. Changing activity

With weather and wardrobe unchanged:

```text
lecture   → casual
interview → formal
sport     → sporty and comfortable
```

**Result:** supported.

## Deferred topics

The following topics remain recorded for the implementation phase:

- detailed color compatibility
- detailed style compatibility
- exact recalculation triggers and temporal behavior
- technical representation of the rules

The core theory is validated for the current scenarios. The rainy interview
scenario should either keep its explicit compromise warning or later add a
clean formal waterproof coat to the prototype wardrobe.

