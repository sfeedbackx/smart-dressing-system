# Outfit Tie-Breaking Rules

This document defines how the system chooses between outfits with equal or
nearly equal final scores.

## 1. Tie definition

Two outfits are treated as tied when their final-score difference is at
most 2 points:

```text
absolute(score A - score B) ≤ 2
```

For example, scores of `82` and `81` are treated as a practical tie.

## 2. Tie-breaking priority

When outfits are tied, compare them in this order:

1. better activity match
2. better weather protection
3. better temperature comfort
4. better outfit compatibility
5. more preferred colors, if the combination remains compatible
6. closer preferred style
7. greater variety, favoring items worn less recently

### Activity match

Choose the outfit more appropriate for the event:

```text
interview: formal outfit > casual outfit
```

### Weather protection

If activity suitability is equivalent, choose the outfit that protects
better against the current weather:

```text
waterproof coat > moderately water-resistant jacket
```

### Temperature comfort

Choose the outfit whose warmth is more appropriate:

```text
cold: warm outfit > light outfit
hot:  light outfit > warm outfit
```

### Compatibility

Choose the outfit with more coherent:

- colors
- styles
- formality
- weather protection

### Preferences and variety

If the outfits remain equivalent, then the user's preferred style, then items that were worn less recently.

## 3. Stable final choice

If all tie-breakers remain equal, use the earliest outfit in the
predefined wardrobe order. The result must not be random, so the same
situation produces the same recommendation.

## 4. Decision process

```text
1. Compare final scores
2. If the difference is greater than 2, choose the higher score
3. If the difference is at most 2, compare:
   activity → weather → temperature → compatibility → color → style → variety
4. If still equal, use stable predefined order
```

Tie-breaking chooses the most meaningful outfit when scores are practically
equivalent; it does not repair a serious difference in activity or weather
suitability.

