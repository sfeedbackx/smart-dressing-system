# Wardrobe

The wardrobe is a separate domain resource. It contains the clothes that
the recommendation system can consider.
## Clothing categories

Each outfit contains one item from each category:

- top
- bottom
- outer layer
- shoes

The outer layer may be omitted in hot weather when it is not needed.

Examples include:

- top: T-shirt, shirt, blouse, sweater
- bottom: jeans, trousers, skirt, shorts
- outer layer: coat, jacket, cardigan
- shoes: sneakers, boots, formal shoes

## Item information

Each clothing item has:

- name
- category
- color
- warmth level
- water resistance
- formality level
- status
- last worn date

The item attributes have the following purpose:

- color supports the user's color preferences
- warmth level supports cold, mild, and hot weather adaptation
- water resistance supports rainy-weather protection
- formality level supports event suitability
- last worn date supports variety and avoids repeated recommendations

Recent wear is a soft ranking preference, not an absolute exclusion. A
recently worn item remains available as a replacement when appropriate.

## Status

An item can have one of these statuses:

- clean: available
- dirty: unavailable
- in laundry: unavailable

Only clean items can normally be recommended.

If an important item is unavailable, the system should explain the
substitution instead of silently presenting an impossible outfit:

```text
The preferred coat is unavailable. A clean alternative was selected.
```

## Real system

In the real system, the user enters their clothing items and describes
their attributes. The user can update an item's status and its last worn
date. The wardrobe data is stored locally on the phone.

## Prototype

The prototype uses a predefined wardrobe. The user does not add new
clothing items. Clean and unavailable items are included to demonstrate
availability handling.

### Predefined clothing items

The prototype uses the following wardrobe:

| Name | Category | Color | Warmth | Water resistance | Formality | Status | Last worn |
|---|---|---|---|---|---|---|---|
| White Oxford shirt | top | white | light | none | formal | clean | 2026-10-28 |
| Blue cotton T-shirt | top | blue | light | none | casual | clean | 2026-10-31 |
| Gray wool sweater | top | gray | warm | low | classic | clean | 2026-10-25 |
| Sport performance T-shirt | top | black | light | low | sporty | clean | 2026-10-27 |
| Beige chinos | bottom | beige | medium | none | classic | clean | 2026-10-26 |
| Dark formal trousers | bottom | navy | medium | low | formal | clean | 2026-10-24 |
| Blue jeans | bottom | blue | medium | low | casual | clean | 2026-10-30 |
| Black sport trousers | bottom | black | light | low | sporty | clean | 2026-10-29 |
| Navy waterproof coat | outer layer | navy | warm | waterproof | classic | dirty | 2026-10-30 |
| Gray wool coat | outer layer | gray | warm | moderate | formal | clean | 2026-10-22 |
| Beige casual jacket | outer layer | beige | medium | moderate | casual | clean | 2026-10-20 |
| Lightweight sport jacket | outer layer | black | light | waterproof | sporty | clean | 2026-10-18 |
| Black formal shoes | shoes | black | medium | low | formal | clean | 2026-10-24 |
| White sneakers | shoes | white | light | none | casual | clean | 2026-10-31 |
| Brown ankle boots | shoes | brown | warm | moderate | classic | clean | 2026-10-21 |
| Sport running shoes | shoes | gray | light | low | sporty | clean | 2026-10-28 |

This dataset deliberately includes:

- a dirty preferred waterproof coat for the unavailable-item scenario
- warm and water-resistant alternatives for cold and rainy weather
- light items and no required outer layer for hot weather
- formal, casual, classic, and sporty items for different activities
- recently worn items so variety affects ranking without making them
  unavailable

The prototype should use these fixed items for all demonstration
scenarios. Item status and last-worn dates may be changed by the scenario
logic, but users do not add new items.

## Role in recommendation

The wardrobe is filtered and ranked according to this priority:

1. availability
2. event suitability
3. weather protection
4. user preferences
5. variety

The system first removes items that cannot be used, then selects the best
outfit for the interpreted situation.

The recommendation combines wardrobe data with the event, weather, and
user context:

```text
availability → event suitability → weather protection → user preferences → variety
```

Examples:

```text
interview + cold + rainy → formal clothes + warm items + waterproof outer layer
```

```text
lecture + hot + dry → light clothes + comfortable shoes + no outer layer
```

Preferred colors only influence the ranking of otherwise suitable items.
A clean suitable item is preferred over an unavailable item in a favorite
color.

When the user replaces an item, alternatives are selected from the same
category and ranked using the same rules. If no ideal item exists, the
system should state the limitation:

```text
No clean waterproof coat is available. A clean regular jacket was selected.
```

The system must handle cases where no clean item exists in a required
category, no formal item is available for an interview, or weather data is
unavailable. When weather is unavailable, the recommendation must not
claim that it is rainproof or warm enough.
