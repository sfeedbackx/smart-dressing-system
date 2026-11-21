# Platform Context

The platform is the device and interface used to access SmartDress.

## Real system

The real system uses:

- a smartphone
- touchscreen interaction
- a mobile application
- the phone clock
- the phone calendar
- GPS, used only to request weather
- a network connection for the weather API

The application is designed for a small screen and requires limited
interaction.

## Prototype

The prototype is:

- a mobile-first web page
- opened in a browser
- touch-friendly
- connected to an Express backend
- based on fixed scenario data stored in JSON

The prototype does not use real GPS, the phone calendar, or a weather API.
The selected scenario simulates the data that those services would provide
in the real system. The browser requests the selected scenario from the
Express API; it does not interpret the scenario or calculate a score.

## Platform constraints

The interface shall:

- show the recommendation clearly on a small screen
- avoid complex controls
- reduce the number of actions needed
- adapt its presentation when the user needs a quick decision

