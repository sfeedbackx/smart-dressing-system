# Agenda Context

This section defines how the system selects the event relevant to the
outfit recommendation.

## Event information

Each agenda event has:

- event type
- start time
- duration
- end time

```text
end time = start time + duration
```

## Reference event

The current time determines which event is relevant.

### Event in progress

If:

```text
start time <= current time < end time
```

the event in progress is the reference event.

### Next event

If no event is in progress, the system selects the earliest event whose
start time is after the current time.

This lets the user prepare for the next event before it starts.

### Ended events

An event is ignored when:

```text
end time <= current time
```

### No remaining event

If no event is in progress and no future event remains, the system uses a
default everyday/casual situation.

## Recalculation

The reference event and recommendation are recalculated:

- when the application opens
- when the current event ends
- when the agenda changes
- when the user requests another outfit

## Example

```text
Lecture:    09:00–11:00
Interview:  14:00–15:00
Sport:      18:00–19:00
```

```text
10:00 → lecture
12:00 → interview
14:30 → interview
16:00 → sport
20:00 → default everyday/casual situation
```

## Prototype and real system

In the real system, events come from the user's phone calendar.

In the prototype, the selected scenario provides a predefined agenda.
Overlapping events are not included in the prototype.

