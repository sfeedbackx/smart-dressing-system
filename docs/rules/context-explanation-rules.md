# Still need not finalized
# Recommendation Explanation Rules

The explanation should be short, visual, and optionally expandable. The
user should understand the recommendation quickly without reading a long
paragraph.

## 1. Information hierarchy

The screen shows:

```text
1. outfit
2. situation summary
3. short explanation
4. warning indicators, only when needed
```

Example:

```text
Today's outfit

Interview · 12:00
Cold · Rainy

[shirt] White Oxford shirt
[bottom] Dark formal trousers
[coat] Gray wool coat
[shoes] Black formal shoes

✓ Formal and warm outfit
⚠ Preferred waterproof coat unavailable
```

## 2. Indicators

| Meaning | Indicator |
|---|---|
| event or activity | calendar or briefcase |
| temperature | thermometer |
| rain | rain cloud |
| preferred color | color dot or palette |
| good match | checkmark |
| warning | warning triangle |
| unavailable item | crossed-out clothing icon |
| replacement | swap arrows |
| weather unavailable | cloud with question mark |

Every icon must have a short text label or accessible description. Icons
alone must not carry essential meaning.

## 3. Short explanations

Use one short sentence for the main reason:

```text
Formal clothes and warm protection were selected for your interview.
```

For weather:

```text
A water-resistant layer was selected because rain is likely.
```

For preferences:

```text
Your preferred gray color was used.
```

For variety:

```text
This outfit avoids items worn yesterday.
```

The system does not show every calculation by default.

## 4. Warning indicators

Warnings are visible near the affected item and summarized near the outfit
status.

Non-critical warning:

```text
⚠ No waterproof coat available.
  A clean water-resistant jacket was selected.
```

Critical warning:

```text
🔴 Complete outfit unavailable.
   No clean formal shoes were found.
```

Each warning explains:

```text
problem
→ consequence
→ selected alternative, if available
```

## 5. Recommendation statuses

```text
✓ Complete
⚠ Acceptable with warning
🔴 Cannot create a complete outfit
```

Color supports the indicator but must not be its only meaning.

## 6. Rejected item explanations

The system does not show a long list of every rejected item. It explains
only relevant exclusions:

```text
⚠ Navy waterproof coat unavailable
```

Relevant reasons include:

- dirty
- in laundry
- unsuitable for the activity
- unsuitable for the weather
- recently worn, only when variety affected the choice

## 7. Preference explanations

Mention preferences only when they influenced the result:

```text
● Preferred color: gray
```

If a preferred color was not used, explain it only when useful:

```text
Your preferred color was not selected because it was not suitable for the rain.
```

Preferred style is mentioned only when it meaningfully affected the choice.

## 8. Score visibility

The exact numerical score remains hidden by default. The interface shows
simple descriptions:

```text
✓ Strong match
⚠ Acceptable alternative
```

Detailed scores may appear in an expanded explanation or prototype/debug
view:

```text
Match: 83/100
Compatibility: 8/10
```

## 9. Replacement explanation

After a manual replacement:

```text
↔ Item replaced
⚠ This jacket provides less rain protection than the previous one.
```

The system preserves the user's choice and explains its consequence without
automatically undoing it.

## 10. Progressive detail

```text
default:
short sentence + relevant indicator

expanded:
item reasons + warnings + score details
```

The main principle is:

```text
show the outfit first
use icons for quick understanding
use small text for reasons
show warnings clearly
hide technical scores unless requested
```

