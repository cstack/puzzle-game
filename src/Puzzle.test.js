import Puzzle from './Puzzle';
import PuzzleLibrary from './PuzzleLibrary';

describe('isSolved', () => {
  describe('for a puzzle that has not be started', () => {
    const puzzle = Puzzle.loadPuzzle([
      [
        { hint: 2, filled: false },
        { hint: 2, filled: false },
      ],
      [
        { hint: null, },
        { hint: null, },
      ],
    ]);
    it('is not solved', () => {
      expect(Puzzle.isSolved(puzzle)).toBe(false);
    });
  });

  describe('for a solved puzzle', () => {
    const puzzle = Puzzle.loadPuzzle([
      [
        { hint: 2, filled: false },
        { hint: 2, filled: false },
      ],
      [
        { hint: null, },
        { hint: null, },
      ],
    ]);
    Puzzle.annotateCell(1, 0, puzzle, "filled");
    Puzzle.annotateCell(1, 1, puzzle, "filled");
    it('is is solved', () => {
      expect(Puzzle.isSolved(puzzle)).toBe(true);
    });
  });
});