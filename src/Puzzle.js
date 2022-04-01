import PuzzleLibrary from './PuzzleLibrary';

function isSolved(puzzle) {
  return puzzle.every((row, rowIndex) => {
    return row.every((cell, columnIndex) => {
      const valid = cellIsValid(cell);
      return valid;
    })
  });
}

function filled(cell) {
  return cell.filled || cell.annotation === "filled";
}

function cellContents(cell) {
  if (cell.hint === null) {
    if (cell.annotation === "unfilled") {
      return "・";
    } else {
      return null;
    }
  } else {
    return cell.hint;
  }
}

function emojiPreviewOfPuzzle(puzzle) {
  return puzzle.map((row) =>
    row.map((cell) => {
      const cellState = state(cell);
      if (cellState === "filled") {
        return "⬛️";
      }
      if (cellState === "unfilled") {
        return "🔳";
      }
      if (cellState === "undecided") {
        return "⬜️";
      }
    }).join("")
  ).join("\n");
}

function emojiPreviewOfPuzzles(puzzles) {
  return puzzles.map((puzzle) =>
    emojiPreviewOfPuzzle(puzzle)
  ).join("\n\n");
}

function allSolutions(puzzle) {
  // console.log(emojiPreviewOfPuzzle(puzzle));
  if (isSolved(puzzle)) {
    // console.log(`Found a soltuion!`);
    return [copyPuzzle(puzzle)];
  }
  const rowCount = puzzle.length;
  const columnCount = puzzle[0].length;
  const mostConstrainedCell = findMostConstrainedCell(puzzle);
  // console.log(`mostConstrainedCell (${numPossibilities(mostConstrainedCell)} possibilities) ${JSON.stringify(mostConstrainedCell)}`);
  const undecidedNeighbors = neighborIndecies(mostConstrainedCell.rowIndex, mostConstrainedCell.columnIndex, rowCount, columnCount).filter((coords) => {
    const neighbor = puzzle[coords[0]][coords[1]];
    return state(neighbor) === "undecided";
  });
  // console.log(`undecidedNeighbors ${JSON.stringify(undecidedNeighbors)}`);
  return allCombinations(undecidedNeighbors.length, numLeftToFill(mostConstrainedCell)).map((indiciesToFill) => {
    // console.log(`Try filling ${JSON.stringify(indiciesToFill)}`);
    let solutions = [];
    const stillSolvable = undecidedNeighbors.map((neighbor, index) => {
      if (indiciesToFill.includes(index)) {
        return annotateCell(neighbor[0], neighbor[1], puzzle, "filled");
      } else {
        return annotateCell(neighbor[0], neighbor[1], puzzle, "unfilled");
      }
    }).reduce((restOfPuzzleStillSolvable, cellStillSolvable) => restOfPuzzleStillSolvable && cellStillSolvable);
    if (stillSolvable) {
      // console.log("Still solvable. Keep going down this path.")
      solutions = allSolutions(puzzle);
    } else {
      // console.log("No longer solvable. Undo.")
      solutions = [];
    }
    undecidedNeighbors.map((neighbor, index) => {
      return annotateCell(neighbor[0], neighbor[1], puzzle, null);
    });
    return solutions;
  });
}

function allCombinations(n, k) {
  if (k === 0) {
    // console.log(`allCombinations(${n}, ${k}) -> [[]]`);
    return [[]];
  }
  if (n === 0) {
    // console.log(`allCombinations(${n}, ${k}) -> []`);
    return [];
  }
  if (k > n) {
    // console.log(`allCombinations(${n}, ${k}) -> []`);
    return [];
  }
  const result = allCombinations(n-1, k).concat(allCombinations(n-1, k-1).map((combos) => combos.concat(n-1)));
  // console.log(`allCombinations(${n}, ${k}) -> ${JSON.stringify(result)}`);
  return result;
}

function state(cell) {
  let result = null;
  if (cell.hint === null) {
    if (cell.annotation === "filled") {
      result = "filled";
    } else if (cell.annotation === "unfilled") {
      result = "unfilled";
    } else if (cell.annotation === null) {
      result = "undecided";
    }
  } else {
    if (cell.filled) {
      result = "filled";
    } else {
      result = "unfilled";
    }
  }
  if (!result) {
    // console.log("null state");
    // console.log(cell);
  }
  return result;
}

function findMostConstrainedCell(puzzle) {
  return allCells(puzzle).filter((cell) => cell.hint !== null && cell.numUndecidedNeighbors > 0).reduce((mostConstrained, cell) => {
    const oldCellPossibilities = numPossibilities(mostConstrained);
    const newCellPossibilites = numPossibilities(cell);
    // console.log(`${cell.rowIndex}-${cell.columnIndex} (${cell.hint}) : ${newCellPossibilites} possibilities`);
    if (newCellPossibilites > 0 && newCellPossibilites < oldCellPossibilities) {
      return cell;
    } else {
      return mostConstrained
    }
  });
}

function allCells(puzzle) {
  return puzzle.reduce((result, row) => result.concat(row));
}

function numPossibilities(cell) {
  const n = cell.numUndecidedNeighbors;
  const k = numLeftToFill(cell);
  const result = choose(n, k);
  // console.log(`numPossibilities for ${cell.rowIndex}-${cell.columnIndex} is ${n} choose ${k} -> ${result}`)
  return result;
}

function choose(n, k) {
  if (k === 0) {
    return 1;
  }
  if (n === 0) {
    return 0;
  }
  let result = 1;
  for (let i = 0; i < k; i++) {
    result *= n-i;
  }
  for (let i = k; i > 1; i--) {
    result /= i;
  }
  return result;
}

function numLeftToFill(cell) {
  if (cell.filled) {
    const numLeftToUnfill = cell.hint - cell.numUnfilledNeighbors;
    return cell.numUndecidedNeighbors - numLeftToUnfill;
  } else {
    return cell.hint - cell.numFilledNeighbors;
  }
}

function nextUndecidedCell(puzzle) {
  const numRows = puzzle.length;
  const numColumns = puzzle[0].length;
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
      const cell = puzzle[rowIndex][columnIndex];
      if (cell.hint === null && cell.annotation === null) {
        return [rowIndex, columnIndex];
      }
    }
  }
  return null;
}

function neighborIndecies(rowIndex, columnIndex, rowCount, columnCount) {
  const result = [
    [rowIndex - 1, columnIndex - 1],
    [rowIndex - 1, columnIndex + 0],
    [rowIndex - 1, columnIndex + 1],
    [rowIndex + 0, columnIndex - 1],
    // [rowIndex + 0, columnIndex + 0],
    [rowIndex + 0, columnIndex + 1],
    [rowIndex + 1, columnIndex - 1],
    [rowIndex + 1, columnIndex + 0],
    [rowIndex + 1, columnIndex + 1],
  ].filter((coords) => {
    return coords[0] >= 0 && coords[0] < rowCount && coords[1] >= 0 && coords[1] < columnCount;
  });
  return result;
}

function cellIsValid(cell) {
  if (cell.hint === null) {
    return true;
  } else {
    return numNeighborsOfRequiredType(cell) === cell.hint;
  }
}

function numNeighborsOfRequiredType(cell) {
  if (cell.filled) {
    return cell.numUnfilledNeighbors + cell.numUndecidedNeighbors;
  } else {
    return cell.numFilledNeighbors;
  }
}

function generateEmptyPuzzle(numRows, numColumns) {
  return Array(numRows).fill(null).map(() => {
    return Array(numColumns).fill(null).map(() => {
      return emptyCell();
    });
  });
}

function emptyCell() {
  return { hint: null };
}

function copyPuzzle(puzzle) {
  return JSON.parse(JSON.stringify(puzzle));
}

function forEachNeighbor(rowIndex, columnIndex, puzzle, callback) {
  const numRows = puzzle.length;
  const numColumns = puzzle[0].length;
  neighborIndecies(rowIndex, columnIndex, numRows, numColumns).map((coords) => {
    const neighbor = puzzle[coords[0]][coords[1]];
    callback(neighbor);
  });
}

function loadPuzzle(puzzle) {
  const numRows = puzzle.length;
  const numColumns = puzzle[0].length;
  let result = copyPuzzle(puzzle);
  result.numRows = numRows;
  result.numColumns = numColumns;
  result.map((row, rowIndex) => {
    row.map((cell, columnIndex) => {
      let numFilledNeighbors = 0;
      let numUnfilledNeighbors = 0;
      let numUndecidedNeighbors = 0;
      forEachNeighbor(rowIndex, columnIndex, puzzle, (neighbor) => {
        if (neighbor.filled) {
          numFilledNeighbors += 1;
        } else if (neighbor.hint === null) {
          numUndecidedNeighbors += 1;
        } else {
          numUnfilledNeighbors += 1;
        }
      });
      cell.annotation = null;
      cell.numFilledNeighbors = numFilledNeighbors;
      cell.numUnfilledNeighbors = numUnfilledNeighbors;
      cell.numUndecidedNeighbors = numUndecidedNeighbors;
      cell.rowIndex = rowIndex;
      cell.columnIndex = columnIndex;
    });
  });
  return result;
}

function loadAllPuzzles() {
  return PuzzleLibrary.ALL.map((puzzle) => {
    return loadPuzzle(puzzle);
  });
}

function annotateCell(rowIndex, columnIndex, puzzle, newAnnotation) {
  // console.log(`annotateCell(${rowIndex}, ${columnIndex}, ${newAnnotation})`)
  const cell = puzzle[rowIndex][columnIndex];
  const oldAnnotation = cell.annotation;
  if (oldAnnotation === "filled") {
    forEachNeighbor(rowIndex, columnIndex, puzzle, (neighbor) => {
      neighbor.numFilledNeighbors -= 1;
      neighbor.numUndecidedNeighbors += 1;
    });
  } else if (oldAnnotation === "unfilled") {
    forEachNeighbor(rowIndex, columnIndex, puzzle, (neighbor) => {
      neighbor.numUnfilledNeighbors -= 1;
      neighbor.numUndecidedNeighbors += 1;
    });
  }

  cell.annotation = newAnnotation;

  if (newAnnotation === "filled") {
    forEachNeighbor(rowIndex, columnIndex, puzzle, (neighbor) => {
      neighbor.numFilledNeighbors += 1;
      neighbor.numUndecidedNeighbors -= 1;
    });
  } else if (newAnnotation === "unfilled") {
    forEachNeighbor(rowIndex, columnIndex, puzzle, (neighbor) => {
      neighbor.numUnfilledNeighbors += 1;
      neighbor.numUndecidedNeighbors -= 1;
    });
  }

  let stillSolvable = true;
  forEachNeighbor(rowIndex, columnIndex, puzzle, (neighbor) => {
    if (!cellStillSolvable(neighbor)) {
      // console.log(`cell is not solvable: ${JSON.stringify(neighbor)}`);
      stillSolvable = false;
    }
  });
  return stillSolvable;
}

function cellStillSolvable(cell) {
  if (cell.hint === null) {
    return true
  } else {
    if (cell.filled) {
      return cell.numUnfilledNeighbors <= cell.hint && cell.numUnfilledNeighbors + cell.numUndecidedNeighbors >= cell.hint;
    } else {
      return cell.numFilledNeighbors <= cell.hint && cell.numFilledNeighbors + cell.numUndecidedNeighbors >= cell.hint;
    }
  }
}

export default {
  allSolutions,
  annotateCell,
  cellIsValid,
  copyPuzzle,
  emptyCell,
  filled,
  generateEmptyPuzzle,
  isSolved,
  loadAllPuzzles,
  loadPuzzle,
  numNeighborsOfRequiredType,
  cellContents,
};