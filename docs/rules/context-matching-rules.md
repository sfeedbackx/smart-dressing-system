# Clothing Matching and Ranking Rules

This document defines how the system compares clothing attributes with the
requirements produced by the interpreted situation.

## Execution layer

Filtering, matching, outfit construction, and scoring execute in backend
domain services. The frontend must not reproduce these rules or select a
different outfit from the returned response.

## Matching process

```text
raw context
→ situation
→ outfit requirements
→ filter impossible items
→ calculate attribute scores
→ calculate item scores
→ build possible outfits
→ calculate outfit scores
→ select the best valid outfit
```

## 1. Filter impossible items

Before calculating scores, the system removes:

- items from the wrong category
- items with status `dirty`
- items with status `in laundry`

Only clean items can be selected for the recommended outfit. A high
preference score must never make an unavailable item eligible.

## 2. Attribute match values

Each criterion receives a value between `0` and `1`:

```text
0    = no match
0.5  = partial match
1    = excellent match
```

### Formality

```text
formal situation + formal item  → 1.0
formal situation + classic item → 0.8
formal situation + casual item  → 0.3
formal situation + sporty item  → 0.0
```

### Warmth

For cold weather:

```text
warm   → 1.0
medium → 0.6
light  → 0.2
```

For hot weather:

```text
light  → 1.0
medium → 0.5
warm   → 0.0
```

### Water resistance

For rainy weather:

```text
waterproof → 1.0
moderate   → 0.7
low        → 0.3
none       → 0.0
```

For dry weather, water resistance does not provide an important advantage.

### Style

```text
exact preferred style → 1.0
compatible style     → 0.7
neutral style        → 0.5
contradictory style  → 0.2
```

### Color

```text
preferred color      → 1.0
compatible color     → 0.5
non-preferred color  → 0.2
```

Color cannot compensate for an unsuitable activity or weather match.

### Variety

```text
not worn recently     → 1.0
worn several days ago → 0.7
worn yesterday        → 0.2
```

Recent wear lowers the score but does not exclude the item.

## 3. Item score

Each eligible item receives a score out of 100:

```text
item score =
  (activity/formality match × 30)
+ (weather protection match × 25)
+ (temperature/warmth match × 20)
+ (preferred style match × 10)
+ (preferred color match × 10)
+ (variety match × 5)
```

The first three criteria represent the main situation requirements.
Style, color, and variety distinguish between otherwise suitable items.

Example:

```text
formality: 1.0 × 30 = 30
weather:    0.7 × 25 = 17.5
warmth:     1.0 × 20 = 20
style:      1.0 × 10 = 10
color:      1.0 × 10 = 10
variety:    1.0 × 5  = 5
total:                    92.5/100
```

## 4. Outfit score

The system evaluates complete outfits, not only individual items:

```text
outfit score =
  top score
+ bottom score
+ outer-layer score
+ shoes score
+ compatibility bonus
```

The outer-layer score is included only when an outer layer is required or
selected. A compatibility bonus may reward:

- coherent formality
- compatible styles
- acceptable color combinations
- complete weather protection

## 5. Priority and constraints

Weighted scoring ranks valid candidates. It must not violate these rules:

```text
dirty item       → never selected
wrong category   → never selected
hot weather      → warm items strongly penalized or excluded
sport activity   → formal shoes must not win only because of color
```

If no item perfectly matches, the highest-scoring clean alternative may be
selected and the compromise must be explained to the user.
