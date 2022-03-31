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

function allSolutions(puzzle) {
  const coords = nextBlankCell(puzzle);
  if (coords === null) {
    // Filled the entire grid. Check if this is a solution.
    const isSolution = isSolved(puzzle);
    if (isSolution) {
      return [copyPuzzle(puzzle)];
    } else {
      return [];
    }
  }

  // First try filling in the blank cell
  annotateCell(coords[0], coords[1], puzzle, "filled");
  const solutionsIfFilled = allSolutions(puzzle);
  annotateCell(coords[0], coords[1], puzzle, null);

  // Then try marking the cell unfilled
  annotateCell(coords[0], coords[1], puzzle, "unfilled");
  const solutionsIfUnfilled = allSolutions(puzzle);
  annotateCell(coords[0], coords[1], puzzle, null);

  const solutions = solutionsIfFilled.concat(solutionsIfUnfilled);
  return solutions;
}

function nextBlankCell(puzzle) {
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
    return cell.numNeighbors - cell.numFilledNeighbors;
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
      let numNeighbors = 0;
      let numFilledNeighbors = 0;
      forEachNeighbor(rowIndex, columnIndex, puzzle, (neighbor) => {
        numNeighbors += 1;
        if (neighbor.filled) {
          numFilledNeighbors += 1;
        }
      });
      cell.annotation = null;
      cell.numNeighbors = numNeighbors;
      cell.numFilledNeighbors = numFilledNeighbors;
      cell.numUnfilledNeighbors = 0;
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
  const cell = puzzle[rowIndex][columnIndex];
  const oldAnnotation = cell.annotation;
  if (oldAnnotation === "filled") {
    forEachNeighbor(rowIndex, columnIndex, puzzle, (neighbor) => {
      neighbor.numFilledNeighbors -= 1;
    });
  } else if (oldAnnotation === "unfilled") {
    forEachNeighbor(rowIndex, columnIndex, puzzle, (neighbor) => {
      neighbor.numUnfilledNeighbors -= 1;
    });
  }

  cell.annotation = newAnnotation;

  if (newAnnotation === "filled") {
    forEachNeighbor(rowIndex, columnIndex, puzzle, (neighbor) => {
      neighbor.numFilledNeighbors += 1;
    });
  } else if (newAnnotation === "unfilled") {
    forEachNeighbor(rowIndex, columnIndex, puzzle, (neighbor) => {
      neighbor.numUnfilledNeighbors += 1;
    });
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
};