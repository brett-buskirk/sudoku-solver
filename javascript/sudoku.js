class Cell {
  constructor(row, column, block, value) {
    this.row = row
    this.column = column
    this.block = block
    this.value = value
    this.possibles = value ? [value] : [1, 2, 3, 4, 5, 6, 7, 8, 9]
    this.solving = false
  }

  removePossibles(values) {
    values.forEach(value => {
      if (this.possibles.includes(value)) {
        const idx = this.possibles.indexOf(value)
        this.possibles.splice(idx, 1)
      }
    })
  }

  setValue(value) {
    if (this.possibles.includes(value)) {
      this.value = value
      this.possibles = []
    }
  }
}

class Puzzle {
  constructor(initialValues) {
    const puzzle = []
    for (let i = 1; i < 82; i++) {
      let row = Math.ceil(i/9)
      let column = i - ((row - 1) * 9)
      let bCol = Math.ceil(column/3)
      let bRow = Math.ceil(row/3)
      let block = bCol + (bRow * 2) - (3 - bRow)
      puzzle.push(new Cell(row, column, block, initialValues[row - 1][column - 1]))
    }
    this.puzzle = puzzle
  }

  copyPuzzle() {
    const copiedPuzzle = []
    this.puzzle.forEach(cell => {
      const copiedCell = new Cell(cell.row, cell.column, cell.block, cell.value)
      copiedCell.possibles = [...cell.possibles]
      copiedPuzzle.push(copiedCell)
    })
    return copiedPuzzle
  }

  checkVectors(vectorType = 'row') {
    for (let i = 0; i < 9; i++) {
      const vector = this.puzzle.filter(cell => cell[vectorType] === i + 1)
      const values = vector.filter(cell => cell.value > 0).map(cell => cell.value)
      vector.forEach(cell => cell.removePossibles(values))
    }
    if (vectorType === 'row') this.checkVectors('column')
    if (vectorType === 'column') this.checkVectors('block')
    return this
  }

  checkSingles(vectorType = 'row') {
    for (let i = 0; i < 9; i++) {
      const vector = this.puzzle.filter(cell => cell[vectorType] === i + 1)
      const values = vector ? vector.map(cell => cell.possibles).flat().sort() : []
      values.forEach(value => {
        const numOfValues = values.filter(num => num === value).length
        if (numOfValues === 1) vector.forEach(cell => {
          if (cell.possibles.includes(value)) cell.possibles = [value]
        })
      })
    }
    if (vectorType === 'row') this.checkSingles('column')
    if (vectorType === 'column') this.checkSingles('block')
    return this
  }

  checkPairs(vectorType = 'row') {
    const pairMatches = (pair1, pair2) => {
      return (pair1[0] === pair2[0] && pair1[1] === pair2[1])
    }

    for (let i = 0; i < 9; i++) {
      const vector = this.puzzle.filter(cell => cell[vectorType] === i + 1)
      const possibles = vector.map(cell => cell.possibles)
      const pairs = possibles.filter(possible => possible.length === 2)
      const matchedPairs = new Set()
      for (let pair1 of pairs.entries()) {
        pairs.forEach((pair2, idx) => {
          if (idx !== pair1[0] && pairMatches(pair1[1], pair2)) {
            matchedPairs.add(pair2[0]).add(pair2[1])
          }
        })
      }
      const removals = Array.from(matchedPairs)
      vector.forEach(cell => {
        if (cell.possibles.length > 2) cell.removePossibles(removals)
      })
    }
    if (vectorType === 'row') this.checkPairs('column')
    if (vectorType === 'column') this.checkPairs('block')
    return this
  }

  checkBlocks(vectorType = 'row') {
    const setPossibles = (block, filterFunc) => {
      return [...new Set(block.filter(filterFunc).map(cell => cell.possibles).flat().sort())]
    }
    for (let i = 0; i < 9; i++) {
      // Isolate a block
      const block = this.puzzle.filter(cell => cell.block === i + 1)
      // For each row/column in that block:
      const positions = [...new Set(block.map(cell => cell[vectorType]))]
      // position = row/column number (not index)
      for (let position of positions.values()) {
        // Find all the unique possibles in that row/column
        const possibles = setPossibles(block, cell => cell[vectorType] === position)
        // Find all the unique possibles in the other rows/columns
        const otherVectorPossibles = setPossibles(block, cell => cell[vectorType] !== position)
        // Isolate the remaining row/column from the current block
        const remainingVector = this.puzzle.filter(cell => cell[vectorType] == position && cell.block !== i + 1)
        // Check the other two rows/columns for the existence of these possibles
        for (let possible of possibles.values()) {
          // If the number does not exist among the possibles:
          if (!otherVectorPossibles.includes(possible)) {
            // Remove that number from the possibles of the remaining row outside of that block
            remainingVector.forEach(cell => cell.removePossibles([possible]))
          }
        }
      }
    }
    if (vectorType === 'row') this.checkBlocks('column')
    return this
  }


  checkSolutions() {
    let solving = false
    this.puzzle.forEach(cell => {
      if (cell.value === 0 && cell.possibles.length === 1) {
        cell.setValue(cell.possibles[0])
        solving = true
      }
    })
    return solving
  }

  runChecks() {
    let solving = true
    while (solving) {
      solving = this
        .checkVectors()
        .checkSingles()
        .checkPairs()
        .checkBlocks()
        .checkSolutions()
    }
    this.randomChecking()
    return this
  }
  
  randomChecking() {
    const randomIndex = (length) => Math.floor(Math.random() * length)
    const potentials = this.puzzle.filter(cell => cell.possibles.length)
    if (potentials.length) {
      const { possibles } = potentials[0]
      const check = possibles[randomIndex(possibles.length)]
      potentials[0].setValue(check)
      this.runChecks()
    }
  }

  static solve(puzzle) {
    try {
      let solving = true
      let counter = 1
      while (solving) {
        if (counter++ > 100) throw new Error('Invalid puzzle.')
        var solution = new Puzzle(puzzle).runChecks()
        solving = !!solution.puzzle.filter(cell => cell.value === 0).length
      }
      return solution
    } catch(e) {
      console.error(e.message)
      return e.message
    }
  }
}

module.exports = { Cell, Puzzle }