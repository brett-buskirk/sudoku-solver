# Sudoku Solver #

A small browser app that solves Sudoku puzzles, built with plain HTML, CSS, and
JavaScript (no dependencies or build step). It started as a project I made while
learning to code at [The Last Mile](https://thelastmile.org/) in 2020 and has
since been cleaned up and given a more reliable solver.

## Features ##

- 15 built-in puzzles, plus the ability to type in your own.
- A backtracking solver that correctly solves any valid puzzle, including the
  hardest ones.
- Validation with clear messages for invalid puzzles (a repeated digit) and
  puzzles that have no solution.
- Given clues and computed answers are shown in different colours.
- Keyboard arrow-key navigation between cells and a Clear button.

## Running it ##

Open `index.html` in any browser, pick a puzzle (or enter your own values), and
click **Solve**.

## Project layout ##

- `index.html` — page structure.
- `css/sudoku.css` — styling and the 9x9 grid layout.
- `javascript/puzzles.js` — the built-in puzzle data.
- `javascript/sudoku.js` — the solver (`solveSudoku`).
- `javascript/main.js` — builds the board and wires up the UI.
