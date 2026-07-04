# Roadmap

Sudoku Solver is a small, finished browser app (plain HTML/CSS/JavaScript, no
build step). It reached `v1.0.0` and does what it set out to do: reliably solve
any valid puzzle, offline-capable as a PWA. It is in **maintenance mode** — no
large feature push is planned.

## Maintenance

- Keep the app working on current browsers.
- Fix any solver or validation bugs that surface.
- Refresh the service worker cache version when files change so offline installs
  update cleanly.

## Nice-to-haves

Genuine, optional improvements — none blocking, none scheduled:

- [ ] Add a "generate a random puzzle" option so users aren't limited to the
      built-in set.
- [ ] Show a step-by-step solve (highlight cells as they are filled) instead of
      revealing the finished grid all at once.
