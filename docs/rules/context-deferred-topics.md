# Deferred Topics for Implementation

The core project is complete. The following topics remain open so they can be
refined during implementation and tested against the real interface.

## 1. Detailed color compatibility

Define:

- neutral colors
- compatible color combinations
- conflicting combinations
- the number of strong colors allowed in one outfit
- the exact compatibility points

The implementation must keep two ideas separate:

```text
preferred color ≠ color compatibility
```

A user may like several colors individually without wanting all of them in
the same outfit.

## 2. Detailed style compatibility

Define:

- which styles combine naturally
- which mixed styles are acceptable
- which combinations are strong contradictions
- how style compatibility affects the outfit bonus

Event requirements remain more important than personal style.

## 3. Temporal behavior

Define when the recommendation is recalculated, including:

- application opening
- event starting or ending
- agenda changes
- weather changes
- wardrobe status changes
- user requesting a new outfit
- user replacing an item

The general adaptation principle is:

```text
context changes
→ situation is recalculated
→ outfit requirements are recalculated
→ recommendation is updated
```

## 4. Technical representation

During implementation, define:

- data structures for context, situation, clothing, and outfits
- how rule values are represented
- how scores and warnings are returned
- how scenario data is stored
- how the interface consumes recommendation results

These decisions are deliberately separated from the theory so that the
conceptual rules remain understandable.
