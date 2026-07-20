# Contributing

This repository demonstrates one specific reporting pattern: one canvas, three
selectors, and bookmarks. It is not a general-purpose charting library, and it is not
meant to grow into one. That keeps the bar for design changes high and specific.

## Design changes need a stated source

Any change to how the report is designed, the chart type, the selector model, the
bookmark behaviour, or how a view presents its numbers, needs to be grounded in
something published, not personal preference. Acceptable sources:

- A published, peer-reviewed data visualization paper.
- An established reference work in the field (Edward Tufte, Stephen Few, and Alberto
  Cairo are the obvious names, but any similarly established author is fine).
- A documented practice from a named, renowned practitioner or organization working in
  data visualization or business intelligence.

State the source and the reasoning in the pull request description. A pull request
proposing a design change with no stated source will be asked for one before review.

## Changes that do not need a source

Bug fixes, typo fixes, dependency updates, accessibility fixes, and build or deployment
changes are not design changes and do not need a citation.

## Scope

A change that would turn this project into a general-purpose reporting tool, adding
chart types, adding a plugin system, generalizing past the one-canvas pattern, belongs
in a fork, not this repository. Open an issue first if a proposed change is close to
that line.

## Data and content

The demo data is fictional: an unnamed specialty tea and homeware shop, invented
campaigns, invented figures. Keep any addition fictional too; do not add real business
names, real data, or anything that could be mistaken for a real company's numbers.

## Keeping the documentation in sync

The full documentation lives in a separate repository,
[`BI-report-template-site-documentation`](https://github.com/C-Kapsalis/BI-report-template-site-documentation).
A change here that affects what a reader sees or does, a renamed control, a changed
bookmark, a new route, needs a matching update there. Mention it in the pull request
description if one is needed.
