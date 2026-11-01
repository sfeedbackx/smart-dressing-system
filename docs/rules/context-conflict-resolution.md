# Rule Conflict Resolution

This document defines how the system resolves conflicts between activity,
weather, comfort, and user preferences.

## 1. Rule categories

### Absolute rules

These cannot normally be violated:

```text
clean item
correct category
complete basic outfit
```

A dirty item can never be selected just because it has the preferred color.

### Strong requirements

These should normally be respected:

```text
activity suitability
essential weather protection
basic temperature comfort
```

For example:

```text
interview → avoid sporty clothing heavy rain → prefer waterproof protection
```

### Soft preferences

These can be sacrificed when necessary:

```text
preferred color
preferred style
recent-wear variety
exact warmth level
```

## 2. Priority order

The theoretical priority is:

```text
1. Availability
2. Required categories
3. Activity suitability
4. Weather protection
5. Temperature comfort
6. Outfit compatibility
7. Preferred style
8. Preferred colors
9. Variety
```

A preferred color cannot override a clean, suitable, weather-protective item.

## 3. Conflict examples

### Hot and formal

The system respects the formal activity while avoiding heavy clothing:

```text
light formal top
light formal bottom
formal shoes
no outer layer
```

### Rainy and sporty

The system keeps the sporty activity while adding protection:

```text
sport top
sport trousers
water-resistant sport jacket
running shoes with the best available protection
```

The system should not replace the entire outfit with formal rainwear.


### Interview and no formal shoes

The system may select the cleanest classic shoes if they are reasonably
acceptable. It displays a warning for a small compromise and blocks the
complete recommendation if no acceptable shoes exist. It must not call
sporty shoes formal.

### Rainy and no waterproof coat

The system selects the best clean water-resistant alternative, displays a
warning, and does not claim full rain protection.

### Activity and user style conflict

Activity requirements take priority. For sport, the system may choose
sporty clothes with neutral or preferred colors, but should not recommend a
formal suit.

## 4. Relaxation order

When no perfect outfit exists, relax rules in this order:

```text
1. Variety
2. Preferred colors
3. Preferred style
4. Exact warmth or water resistance
5. Compatibility
6. Activity suitability, only as a last resort
```

These should not be relaxed automatically:

```text
availability
required category
basic completeness
```

## 5. Conflict severity

Not every conflict blocks the outfit:

```text
no preferred color → non-critical warning
```

But:

```text
no clean item in a required category → critical warning
```

The system sacrifices personal preferences before comfort, activity
suitability, or essential weather protection.

## 6. Conflict-resolution flow

```text
1. Identify all active requirements
2. Classify them as absolute, strong, or soft
3. Remove outfits violating absolute rules
4. Penalize or remove outfits violating strong requirements
5. Rank remaining outfits
6. Relax soft requirements if necessary
7. Explain every important compromise
```

