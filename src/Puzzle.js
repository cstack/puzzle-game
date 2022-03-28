function checkPuzzle(puzzle) {
  const rowCount = puzzle.length;
  const columnCount = puzzle[0].length;
  const neighborCounts = Array(rowCount).fill(null).map(() => Array(columnCount).fill(null).map(() => {
    return {
      unfilledNeighbors: 0,
      filledNeighbors: 0,
      filled: false,
      hint: null,
    };
  }));
  puzzle.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const filled = cell.filled || cell.annotation === "filled";
      neighborCounts[rowIndex][columnIndex].filled = filled;
      neighborCounts[rowIndex][columnIndex].hint = cell.hint;
      neighborIndecies(rowIndex, columnIndex, rowCount, columnCount).forEach((coords) => {
        if (filled) {
          neighborCounts[coords[0]][coords[1]].filledNeighbors += 1;
        } else {
          neighborCounts[coords[0]][coords[1]].unfilledNeighbors += 1;
        }
      });
    })
  });
  return neighborCounts.map((row) => {
    return row.map((checkResult) => {
      if (checkResult.hint === null) {
        return {
          requiredNeighbors: null,
        }
      } else {
        return {
          requiredNeighbors: checkResult.hint,
          neighborsShouldBeFilled: !checkResult.filled,
          actualNeighbors: checkResult.filled ? checkResult.unfilledNeighbors : checkResult.filledNeighbors,
        }
      }
    });
  });
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

function isSolved(puzzle) {
  const neighborCounts = checkPuzzle(puzzle);
  return neighborCounts.every((row, rowIndex) => {
    return row.every((cell, columnIndex) => {
      return cellIsValid(cell);
    });
  });
}

function cellIsValid(checkResult) {
  if (checkResult.requiredNeighbors !== null) {
    return checkResult.requiredNeighbors === checkResult.actualNeighbors;
  } else {
    return true;
  }
}

export default {
  cellIsValid,
  checkPuzzle,
  isSolved,
};