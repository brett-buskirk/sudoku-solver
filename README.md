# Sudoku Solver #

A small browser app that solves Sudoku puzzles, built with plain HTML, CSS, and
JavaScript (no dependencies or build step). It started as an early
learning project and has since been cleaned up and given a more reliable solver.

## Features ##

- 100 built-in puzzles grouped by difficulty (Easy, Moderate, Difficult,
  Epic), plus an empty board for typing in your own.
- A backtracking solver that correctly solves any valid puzzle, including the
  hardest ones.
- Validation with clear messages for invalid puzzles (a repeated digit) and
  puzzles that have no solution.
- Given clues and computed answers are shown in different colours.
- Keyboard arrow-key navigation between cells, and a Clear button that resets
  the current puzzle to its starting position.
- Installable as a Progressive Web App (PWA) that works offline.

## Running it ##

The app is hosted at **https://brett-buskirk.github.io/sudoku-solver/**. Pick a
puzzle (or enter your own values) and click **Solve**.

You can also install it: most browsers will offer an "Install" / "Add to Home
Screen" option, after which it launches in its own window and works offline.

To run it locally, serve the folder over HTTP (for example
`python3 -m http.server`) and open the printed address. Opening `index.html`
directly from disk works for solving too, but the offline/installable PWA
features require it to be served over HTTP(S).

## Project layout ##

- `index.html` — page structure.
- `css/sudoku.css` — styling and the 9x9 grid layout.
- `javascript/puzzles.js` — the built-in puzzle data.
- `javascript/sudoku.js` — the solver (`solveSudoku`).
- `javascript/main.js` — builds the board and wires up the UI.
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA manifest, service worker
  (offline caching), and app icons.

## License ##

Released under the [MIT License](LICENSE).
