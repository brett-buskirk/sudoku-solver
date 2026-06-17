(() => {
const gid = (id) => document.getElementById(id)

const board = gid('board')
const select = gid('select')
const status = gid('status')

const SIZE = 9
const inputs = []

// Build the 9x9 grid of inputs. Thicker borders between 3x3 boxes are applied
// in CSS via the box-* classes added here.
function buildBoard() {
  for (let i = 0; i < SIZE * SIZE; i++) {
    const row = Math.floor(i / SIZE)
    const col = i % SIZE

    const cell = document.createElement('div')
    cell.className = 'cell'
    if (col % 3 === 0) cell.classList.add('box-left')
    if (col === SIZE - 1) cell.classList.add('box-right')
    if (row % 3 === 0) cell.classList.add('box-top')
    if (row === SIZE - 1) cell.classList.add('box-bottom')

    const input = document.createElement('input')
    input.type = 'text'
    input.inputMode = 'numeric'
    input.maxLength = 1
    input.setAttribute('aria-label', `Row ${row + 1}, column ${col + 1}`)

    cell.appendChild(input)
    board.appendChild(cell)
    inputs.push(input)
  }
}

// Populate the puzzle dropdown from the puzzles list.
function buildSelect() {
  puzzles.forEach((_, i) => {
    const option = document.createElement('option')
    option.value = String(i)
    option.textContent = `Puzzle ${i + 1}`
    select.appendChild(option)
  })
}

function setStatus(message, type) {
  status.textContent = message || ''
  status.className = 'status' + (type ? ` ${type}` : '')
}

// Load a preset puzzle. Givens are marked so they can be styled and so a
// later Solve can colour only the computed digits.
function loadPuzzle(index) {
  const values = puzzles[index].flat()
  inputs.forEach((input, i) => {
    const value = values[i]
    input.value = value === 0 ? '' : String(value)
    input.classList.toggle('given', value !== 0)
    input.classList.remove('solved')
  })
  setStatus('')
}

// Read the board into a flat array of 81 numbers (0 for empty).
function readBoard() {
  return inputs.map(input => {
    const value = parseInt(input.value, 10)
    return Number.isNaN(value) ? 0 : value
  })
}

function solve() {
  const grid = readBoard()
  const result = solveSudoku(grid)

  if (result.error) {
    setStatus(result.error, 'error')
    return
  }

  result.solved.forEach((value, i) => {
    const wasEmpty = inputs[i].value === ''
    inputs[i].value = String(value)
    inputs[i].classList.toggle('solved', wasEmpty)
  })
  setStatus('Solved!', 'success')
}

function clearBoard() {
  inputs.forEach(input => {
    input.value = ''
    input.classList.remove('given', 'solved')
  })
  select.selectedIndex = -1
  setStatus('')
}

// Restrict input to a single digit 1-9 and clear any styling on edit.
board.addEventListener('input', (e) => {
  const input = e.target
  if (input.tagName !== 'INPUT') return
  input.value = input.value.replace(/[^1-9]/g, '').slice(0, 1)
  input.classList.remove('given', 'solved')
})

// Arrow-key navigation between cells.
board.addEventListener('keydown', (e) => {
  const index = inputs.indexOf(e.target)
  if (index === -1) return
  const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowUp: -SIZE, ArrowDown: SIZE }
  const move = moves[e.key]
  if (move === undefined) return
  const next = inputs[index + move]
  if (next) {
    next.focus()
    next.select()
    e.preventDefault()
  }
})

select.addEventListener('change', (e) => loadPuzzle(Number(e.target.value)))
gid('solve').addEventListener('click', solve)
gid('clear').addEventListener('click', clearBoard)

buildBoard()
buildSelect()
loadPuzzle(0)
})()
