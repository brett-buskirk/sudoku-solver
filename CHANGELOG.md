# Changelog

All notable changes to sudoku-solver are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-06-17

First tagged release of the Sudoku Solver.

### Added

- Backtracking solver that solves any valid puzzle, including the hardest ones.
- 100 built-in puzzles grouped by difficulty (Easy, Moderate, Difficult, Epic),
  plus an empty board for entering your own.
- Input validation with clear messages for invalid puzzles (a repeated digit)
  and puzzles that have no solution.
- Distinct colouring for given clues versus computed answers.
- Keyboard arrow-key navigation between cells and a Clear button that resets the
  current puzzle to its starting position.
- Installable Progressive Web App (manifest + service worker) that works fully
  offline.
- SVG favicon and app icons.
- MIT license.

[Unreleased]: https://github.com/brett-buskirk/sudoku-solver/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/brett-buskirk/sudoku-solver/releases/tag/v1.0.0
