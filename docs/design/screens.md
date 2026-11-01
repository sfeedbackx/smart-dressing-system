# Screens

The real system and the prototype do not have the same number of screens.
The real system includes setup and management screens, while the prototype
starts with predefined data and focuses on the adaptive recommendation.

## Real system screens

### 1. Onboarding

The user:

- selects a preferred style
- selects preferred colors
- enters initial wardrobe items
- provides consent for calendar, location, and weather access

Onboarding is described but not implemented in the prototype.

### 2. Today's outfit

The main screen shows:

- the interpreted situation
- the reference event
- a weather summary
- the recommended outfit
- a short explanation

### 3. Replace an item

The user selects one clothing slot and sees alternatives from the same
category.

### 4. Wardrobe management

The user can:

- add, edit, or remove clothing items
- change an item's status
- update its last worn date

### 5. Preferences

The user can update:

- preferred style
- preferred colors
- declared preferences

### 6. Context and permissions

The user can review access to:

- location, used to request weather
- calendar, used to identify events
- weather service
- locally stored personal data

Some permission dialogs may be provided by the phone's operating system
rather than by application screens.

## Prototype screens

The prototype implements:

1. Today's outfit
2. Replace an item
3. Wardrobe
4. Preferences

The prototype uses predefined profile and wardrobe data. It does not
implement onboarding, real permissions, automatic clothing recognition,
GPS, a phone calendar, or a real weather API.

## Screens not required

- Weather does not need a separate screen; it appears on Today's outfit.
- The agenda does not need a separate screen; the selected reference event
  appears on Today's outfit.
- Automatic clothing recognition does not need a setup screen because it is
  not part of the project.
- Scenarios do not need separate screens; a small scenario selector changes
  the data shown by the prototype.
- Validation can happen directly on Today's outfit.

