/*
 * Sudoku solver.
 *
 * The board is represented as a flat array of 81 integers in row-major order,
 * where 0 marks an empty cell. Solving uses constraint validation of the given
 * clues followed by backtracking search with the "minimum remaining values"
 * heuristic, which solves any valid 9x9 puzzle (including the hardest known
 * ones) effectively instantly.
 */

const SIZE = 9

// Precompute the 20 peer indices (same row, column and 3x3 box) for every cell.
const PEERS = (() => {
  const peers = []
  for (let i = 0; i < SIZE * SIZE; i++) {
    const row = Math.floor(i / SIZE)
    const col = i % SIZE
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    const set = new Set()
    for (let k = 0; k < SIZE; k++) {
      set.add(row * SIZE + k)        // row peers
      set.add(k * SIZE + col)        // column peers
    }
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        set.add((boxRow + r) * SIZE + (boxCol + c)) // box peers
      }
    }
    set.delete(i)
    peers.push([...set])
  }
  return peers
})()

// Are the puzzle's given clues internally consistent (no duplicate in any
// row, column or box)?
function hasValidClues(board) {
  for (let i = 0; i < board.length; i++) {
    const value = board[i]
    if (value === 0) continue
    for (const peer of PEERS[i]) {
      if (board[peer] === value) return false
    }
  }
  return true
}

// May `value` be placed at index `i` without conflicting with a peer?
function isSafe(board, i, value) {
  for (const peer of PEERS[i]) {
    if (board[peer] === value) return false
  }
  return true
}

// Find the empty cell with the fewest legal candidates (MRV heuristic).
// Returns -1 when the board is full. Returns the cell index, and via `out`
// the candidate count, so a dead end (0 candidates) can be detected early.
function findBestCell(board, out) {
  let best = -1
  let bestCount = SIZE + 1
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== 0) continue
    let count = 0
    for (let value = 1; value <= SIZE; value++) {
      if (isSafe(board, i, value)) count++
    }
    if (count < bestCount) {
      bestCount = count
      best = i
      if (count <= 1) break // can't do better than 0 or 1
    }
  }
  out.count = bestCount
  return best
}

function backtrack(board) {
  const out = { count: 0 }
  const cell = findBestCell(board, out)
  if (cell === -1) return true       // no empty cells: solved
  if (out.count === 0) return false  // dead end: empty cell with no candidates

  for (let value = 1; value <= SIZE; value++) {
    if (!isSafe(board, cell, value)) continue
    board[cell] = value
    if (backtrack(board)) return true
    board[cell] = 0
  }
  return false
}

/*
 * Solve a puzzle.
 *
 * Accepts either a flat array of 81 numbers or a 9x9 array of arrays.
 * Returns { solved: number[81] } on success, or { error: string } when the
 * input is malformed, the given clues conflict, or no solution exists.
 */
function solveSudoku(input) {
  const board = Array.isArray(input[0]) ? input.flat() : input.slice()

  if (board.length !== SIZE * SIZE) {
    return { error: 'A puzzle must have exactly 81 cells.' }
  }
  if (!board.every(v => Number.isInteger(v) && v >= 0 && v <= 9)) {
    return { error: 'Cells may only contain the digits 1-9.' }
  }
  if (!hasValidClues(board)) {
    return { error: 'This puzzle is invalid - a digit is repeated in a row, column or box.' }
  }

  const working = board.slice()
  if (!backtrack(working)) {
    return { error: 'This puzzle has no solution.' }
  }
  return { solved: working }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { solveSudoku, hasValidClues }
}
