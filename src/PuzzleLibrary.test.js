import Puzzle from './Puzzle';
import PuzzleLibrary from './PuzzleLibrary';

function emojiPreviewOfSolution(solution) {
  return solution.map((row) =>
    row.map((cell) =>
      Puzzle.filled(cell) ? "⬛️" : "⬜️"
    ).join("")
  ).join("\n");
}

function emojiPreviewOfSolutions(solutions) {
  return solutions.map((solution) =>
    emojiPreviewOfSolution(solution)
  ).join("\n\n");
}

describe('numberOfSolutions', () => {
  it('works for a puzzle with 1 solution', () => {
    const puzzle = Puzzle.loadPuzzle([
      [
        { hint: 3, filled: true },
        { hint: null, },
      ],
      [
        { hint: null, },
        { hint: null, },
      ],
    ]);
    const solutions = Puzzle.allSolutions(puzzle);
    expect(solutions.length).toEqual(1);
  });
  it('works for a puzzle with multiple solutions', () => {
    const puzzle = Puzzle.loadPuzzle([
      [
        { hint: 2, filled: true },
        { hint: null, },
      ],
      [
        { hint: null, },
        { hint: null, },
      ],
    ]);
    const solutions = Puzzle.allSolutions(puzzle);
    expect(solutions.length).toEqual(3);
  });
  it('works for a puzzle with 0 solutions', () => {
    const puzzle = Puzzle.loadPuzzle([
      [
        { hint: 3, filled: true },
        { hint: 3, filled: true },
      ],
      [
        { hint: null, },
        { hint: null, },
      ],
    ]);
    const solutions = Puzzle.allSolutions(puzzle);
    expect(solutions.length).toEqual(0);
  });
});