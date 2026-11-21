# Outfit Score Normalization

This document defines how individual item scores and the compatibility
score are placed on the same scale before calculating the final outfit
score.

## Execution layer

Score normalization and final score calculation are performed by the
backend. The API returns the final score and any relevant breakdown for
display.

## 1. Normalize the item scores

Each item score is already out of 100. The system calculates the average so
that the number of selected clothing items does not change the scale:

```text
item average = (top score + bottom score + outer-layer score + shoes score) / number of selected items
```

The outer layer is included only when it is selected.

Example:

```text
top:    80
bottom: 90
shoes:  85

item average = (80 + 90 + 85) / 3
             = 85/100
```


## 2. Normalize compatibility

The compatibility score is calculated out of 10. It is converted to the
same 0–100 scale:

```text
normalized compatibility = (compatibility score / 10) × 100
```

## 3. Apply the weights

The final score gives:

- item suitability: 90%
- outfit compatibility: 10%

```text
final score = (item average × 0.90) + (normalized compatibility × 0.10)
```

Example:

```text
item average:              85
compatibility score:       7/10
normalized compatibility:  70/100

final score = (85 × 0.90) + (70 × 0.10) = 76.5 + 7 = 83.5/100
```
