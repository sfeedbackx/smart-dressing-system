# Clothing Replacement Rules

This document defines how the user replaces one item in a recommended
outfit.

## 1. Replacement behavior

The user replaces one clothing item while the other outfit items remain
unchanged.

Example:

```text
Current outfit:
White Oxford shirt
Dark formal trousers
Gray wool coat
Black formal shoes

User action:
Replace coat
```

The system shows only clean alternatives from the `outer layer` category.

## 2. Replacement process

The system:

1. keeps the current situation unchanged
2. keeps the other clothing items unchanged
3. limits alternatives to the same category
4. removes unavailable items
5. scores alternatives against the situation
6. checks compatibility with the unchanged items
7. recalculates the complete outfit score
8. displays a warning if the replacement makes the outfit weaker

Alternatives are evaluated using:

- activity
- weather
- temperature
- compatibility with the remaining outfit
- preferred colors
- preferred style
- variety

## 3. User choice

The replacement is evaluated as part of the complete outfit, not alone.
The system should allow the user to select an alternative even when it is
not the highest-ranked option, but must explain important consequences.

Example:

```text
This jacket is less suitable for the rain than the current coat.
```

The system must not silently replace the user's manual choice again.

## 4. No alternative

If no other clean alternative is suitable, the original outfit remains
unchanged and the system displays:

```text
No other clean outer-layer is suitable for this situation.
```

## 5. Replacement status

After replacement, the recommendation can be:

```text
COMPLETE
ACCEPTABLE_WITH_WARNING
BLOCKED
```

The user's manual choice is preserved, while any serious problem is clearly
communicated.

