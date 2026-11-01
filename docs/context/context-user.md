# User Context

This section defines only information related to the user.

## Purpose

The user context describes the user's preferences and declared needs that
can affect the recommendation or the interaction with the system.

## Information included

### Preferred style

The user selects a preferred clothing style:

- casual
- classic
- sporty

### Preferred colors

The user selects colors they like. These preferences influence the ranking
of otherwise suitable clothing items.

### Interaction need

The user may indicate what they want to do at the moment:

- receive a recommendation
- compare alternatives
- replace an item

This information can affect how the interface presents the recommendation.
It does not describe the wardrobe itself.

## Information excluded

The system does not use gender, age, height, skin tone, or other demographic
characteristics as recommendation inputs. They are not necessary for the
current project because the user provides the clothes that can be considered.

Body measurements, material sensitivities, and accessibility needs are not
implemented in the current prototype. They could be considered in a larger
real system only if they are shown to be necessary.

## Real system

In the real system, the user enters their preferred style, and  preferred
colors, during onboarding. The user can update
these values later. The information is stored locally on the phone and is
used by the adaptation rules.

The interaction need is selected during use when the user requests an
action, such as a quick recommendation or an item replacement.

## Prototype

The prototype does not implement onboarding. It uses a predefined user
profile for the demonstration. The profile simulates information that would
have been entered by the user in the real system.


