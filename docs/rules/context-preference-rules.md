# User Preference Rules

This document defines how user preferences personalize the outfit without
overriding event, weather, or availability requirements.

## 1. Preference data

For this project, the user context contains only:

```text
preferred style
preferred colors
```

Explicit clothing exclusions are not part of the prototype model. The user
provides styles and colors they generally like, rather than a list of items
they refuse to wear.

## 2. Role of the event and weather

The event defines what is appropriate:

```text
interview → formal
sport → sporty
```

Weather and temperature define what is practical:

```text
cold → warm clothing
rainy → water-resistant protection
hot → light clothing
```

Preferences personalize valid choices but do not override these
requirements.

## 3. Preferred colors

A preferred color gives a bonus only when the item already matches the
situation and works with the other selected colors.

```text
clean formal navy shirt
→ suitable + preferred-color bonus
```

The user may like several colors in general, but the system should not
combine every preferred color automatically. It first checks color
compatibility, then applies the preference bonus.

## 4. Preferred style

Preferred style is secondary. It helps choose between items that are already
valid for the event and weather.

```text
user prefers sporty + interview
→ formal outfit
→ sporty preference has only a limited influence
```

For an everyday situation, preferred style can have more influence because
there is no strong event requirement.

## 5. Priority

The recommendation priority is:

```text
1. Availability
2. Event/activity suitability
3. Weather and temperature
4. Outfit compatibility
5. Preferred colors
6. Preferred style
7. Variety
```

The main principle is:

```text
event defines what is appropriate
weather defines what is practical
colors personalize valid choices
style helps choose between valid choices
```

