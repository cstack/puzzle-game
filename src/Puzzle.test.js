import Puzzle from './Puzzle';
import PuzzleLibrary from './PuzzleLibrary';

describe('isSolved', () => {
  describe('for a puzzle that has not be started', () => {
    const puzzle = Puzzle.loadPuzzle(PuzzleLibrary.PUZZLE1);
    it('is not solved', () => {
      expect(Puzzle.isSolved(puzzle)).toBe(false);
    });
  });
});