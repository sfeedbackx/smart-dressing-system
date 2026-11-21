# Reference Sources

`We do not need to apply every reference listed below.`


| Reference | Use it when working on |
|---|---|
| Material Design | mobile layout, cards, buttons, navigation, dialogs, spacing, and touch targets |
| WCAG 2.2 | contrast, text alternatives, keyboard access, focus states, and warning indicators |
| Nielsen heuristics | usability reviews, error prevention, feedback, consistency, and user control |
| ISO 9241 | human-centred design, ergonomics, and academic justification |
| Separation of concerns | keeping data, recommendation logic, and interface code separate |

The other design systems in this document are comparison references only.
We should not mix several complete design systems in the same prototype.

## Human-computer interaction and usability

### ISO 9241

Use ISO 9241 when documenting or reviewing:

- human-centred design
- usability and ergonomics
- mobile interaction constraints
- consistency and user control

### Nielsen Norman Group heuristics

The ten usability heuristics provide a practical checklist for evaluating
the interface:

- visibility of system status
- match between the system and the real world
- user control and freedom
- consistency and standards
- error prevention
- recognition rather than recall
- flexibility and efficiency
- minimalist design
- error recovery
- help and documentation

- [10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)

Use the heuristics during interface review. In particular, check that the
prototype shows recommendation status, explains warnings, prevents invalid
actions, remains consistent, and gives the user control over replacement.

## Accessibility and web standards

### WCAG

- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)

Use WCAG when implementing or reviewing:

- color contrast
- readable text
- keyboard access
- visible focus states
- text alternatives
- warnings that do not depend on color alone


## Established design systems

Design systems provide documented patterns, components, typography, spacing,
colors, interaction states, and accessibility guidance.

- [Material Design](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Microsoft Fluent 2](https://fluent2.microsoft.design/)
- [IBM Carbon Design System](https://carbondesignsystem.com/)
- [Atlassian Design System](https://atlassian.design/)
- [Shopify Polaris](https://polaris.shopify.com/)

For this mobile-first prototype, Material Design and Apple's Human
Interface Guidelines are the most relevant references for comparing mobile
navigation, cards, buttons, dialogs, status indicators, and touch targets.
The project should not copy a design system blindly; it should select the
patterns that fit SmartDress.

For this project, use Material Design as the primary visual and interaction
reference. Use the other design systems only to compare a pattern when a
specific design decision is unclear; do not combine their visual systems.

## Useful interaction patterns

The following established patterns are relevant to the prototype:

- recommendation card for the selected outfit
- item cards for clothing categories
- bottom navigation for the main mobile sections
- modal or sheet for replacing an item
- progressive disclosure for detailed explanations
- empty and unavailable states
- status indicators for complete, warning, and blocked recommendations
- confirmation or feedback after a replacement

These patterns should be evaluated using the usability and accessibility
references above.

## Architecture patterns

The implementation uses an N-tier architecture:

```text
JSON data → data repositories → domain services
→ application service → Express API → UI rendering
```

Use this principle when creating or modifying files:

```text
server/data → server/domain → server/services
→ server/controllers and routes → public/js/ui.js
```

Context interpretation, outfit requirements, matching, scoring, fallback
rules, and explanations execute in the backend. Domain modules must not
manipulate the DOM.

The frontend must not import domain modules or reimplement recommendation
rules. It sends HTTP requests to Express and renders the JSON response.

## When to consult each source

### During interface design

1. Consult Material Design for mobile components and layout patterns.
2. Consult WCAG for accessibility requirements.

### During interface review

1. Use Nielsen heuristics to evaluate usability.
2. Recheck WCAG requirements, especially contrast and non-color feedback.
3. Compare the result with the explanation and indicator rules in
   [context-explanation-rules.md](../rules/context-explanation-rules.md).

### During documentation and presentation

1. Use ISO 9241 to justify human-centred and ergonomic design decisions.
2. Keep SmartDress rules in the project documents.
3. Record any adopted pattern and its reason before implementation.
