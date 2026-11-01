# Weather Context

This section defines only weather information.

## Raw weather data

The system uses:

- temperature
- rain probability

## Interpreted weather

The adaptation rules interpret temperature as:

- cold: below 10 °C
- mild: from 10 °C to 24 °C
- hot: 25 °C or more

They interpret rain probability as:

- dry: below 50%
- rainy: 50% or more

These thresholds are initial assumptions for the project.

## Real system

The weather values come from an external weather API. The phone's location
is used to request local weather. The weather service is the only external
service used by the system.

## Prototype

The prototype does not call a weather API. The selected scenario provides
fixed temperature and rain probability values that simulate the real weather
data.


