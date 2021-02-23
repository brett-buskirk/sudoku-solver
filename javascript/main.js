const gid = (elementId) => document.getElementById(elementId)
const qsa = (selector) => document.querySelectorAll(selector)
const qs = (selector) => document.querySelector(selector)

const cells = qsa('.cell input')
const errorMsg = gid('error-msg')

function mapPuzzleToBoard(puzzle) {
  const selectedPuzzle = puzzles[puzzle].flat().map(value => value === 0 ? null : value)
  for (let i = 0; i < 81; i++) {
    qs(`#cell-${i} input`).value = selectedPuzzle[i]
  }
}

function getPuzzleFromBoard() {
  const puzzleValues = []
  const puzzle = []
  for (let i = 0; i < 81; i++) {
    const value = qs(`#cell-${i} input`).value
    puzzleValues.push( value ? Number(value) : 0)
  }
  for (let i = 0; i < 81; i += 9) {
    puzzle.push(puzzleValues.slice(i, i + 9))
  }
  return puzzle
}

gid('select').onchange = ((e) => {
  const puzzleIndex = Number(e.target.value.slice(3))
  mapPuzzleToBoard(puzzleIndex)
})

gid('solve').onclick = (() => {
  const puzzle = getPuzzleFromBoard()
  const solvedPuzzle = Puzzle.solve(puzzle)
  if (typeof solvedPuzzle === 'string') {
    errorMsg.style.display = 'block'
  } else {
    const puzzleValues = solvedPuzzle.puzzle.map(cell => cell.value)
    for (let i = 0; i < 81; i++) {
      qs(`#cell-${i} input`).value = puzzleValues[i]
    }
  }
})

errorMsg.onclick = (() => {
  errorMsg.style.display = 'none'
})

mapPuzzleToBoard(0)