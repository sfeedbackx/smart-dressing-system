# Fallback, Minimum Score, and Warning Rules

This document defines when a recommended outfit can be shown and how the
system communicates limitations.

## 1. Minimum final score

The final outfit score is between `0` and `100`:

| Score | Interpretation | Action |
|---:|---|---|
| 80–100 | Very good match | Show normally |
| 65–79 | Acceptable match | Show normally |
| 50–64 | Weak match | Show with a non-critical warning |
| Below 50 | Very poor match | Do not recommend automatically |

The minimum score for an automatic recommendation is:

```text
50/100
```

The score alone is not sufficient. An outfit must also satisfy the critical
constraints. For example, an outfit scoring `70` is still rejected if it
contains a dirty item or misses a required category.

## 2. Critical warnings

A critical warning means that the outfit must not be presented as a normal
complete recommendation.

Critical situations include:

- no clean item in a required category
- a dirty or in-laundry item would be required
- no complete outfit can be created
- strongly unsuitable clothing for the activity
- missing essential weather protection when no alternative exists

Example:

```text
No clean formal shoes are available. A complete interview outfit cannot be created.
```

The system may show partial options, but it must clearly state that the
outfit is incomplete or unsuitable.

```text
recommendation status: blocked
```

## 3. Non-critical warnings

A non-critical warning means that an outfit exists, but it is not ideal.

Non-critical situations include:

- no waterproof coat, but a moderately water-resistant jacket exists
- preferred color is unavailable
- preferred style is unavailable
- an item was worn recently
- weather data is unavailable
- final score is between `50` and `64`

Example:

```text
No waterproof coat is available. A clean water-resistant jacket was selected.
```

```text
recommendation status: available with warning
```

## 4. Decision order

The system evaluates a recommendation in this order:

```text
1. Check critical constraints
2. Build and score valid outfits
3. Check the minimum score
4. Add non-critical warnings
5. Display the result
```

Critical constraints are independent of the score:

```text
score: 75
dirty shoes → critical, reject
```

A low score does not necessarily mean a critical failure:

```text
score: 58
no preferred color → non-critical, show with explanation
```

## 5. Recommendation statuses

```text
COMPLETE → score is at least 65 and there is no important compromise

ACCEPTABLE_WITH_WARNING → score is between 50 and 64 or a non-critical compromise exists

BLOCKED → a critical constraint failed or the score is below 50
```

The score measures outfit quality, while critical warnings determine
whether the outfit is allowed to be recommended as a complete outfit.

