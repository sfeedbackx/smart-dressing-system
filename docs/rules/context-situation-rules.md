# Situation-to-Outfit Rules

This document defines the basic transformation from raw context to outfit
requirements. Detailed matching, scoring, compatibility, and fallback rules
remain to be defined separately.

## Transformation

The system first transforms the raw context into an interpreted situation,
then transforms that situation into outfit requirements:

```text
raw context
→ situation
→ outfit requirements
→ clothing attributes
→ outfit recommendation
```

The situation contains:

```text
activity: formal | casual | sporty | social
temperature: cold | mild | hot | unknown
precipitation: rainy | dry | unknown
style preference
color preferences
```

## Context interpretation

The activity is interpreted as follows:

- interview: formal
- lecture: casual and comfortable
- sport: sporty and comfortable
- party: social, usually classic or formal
- no event: everyday/casual

Temperature is interpreted as:

- below 10 °C: cold
- 10–24 °C: mild
- 25 °C or more: hot

Rain probability is interpreted as:

- below 50%: dry
- 50% or more: rainy

## Basic outfit requirements

| Situation | Outfit requirements |
|---|---|
| Cold | warm top, medium or warm bottom, warm outer layer |
| Mild | light or medium clothing, optional outer layer |
| Hot | light top, light bottom, no outer layer |
| Rainy | water-resistant or waterproof outer layer and suitable shoes |
| Formal | formal or classic clothing and formal shoes |
| Casual | casual or classic clothing and comfortable shoes |
| Sporty | sporty clothing and running shoes |
| Social/party | formal or classic clothing and coordinated shoes |

Every outfit requires a top, bottom, and shoes. The outer layer is required
in cold weather, normally required in rainy weather, optional in mild
weather, and omitted in hot weather unless explicitly needed.

## Attribute matching

The requirements are matched against clothing attributes. The match does
not need to be exact: clean status and correct category are mandatory,
while color, style, exact warmth, water resistance, and recent wear help
rank otherwise suitable items.

If weather is unavailable, the system uses the activity and user
preferences without inventing temperature or rain requirements.
