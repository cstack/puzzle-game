import Puzzle from './Puzzle';
import PuzzleLibrary from './PuzzleLibrary';

describe('checkPuzzle', () => {
  describe('for a puzzle that has not be started', () => {
    it('returns correct data structure', () => {
      expect(Puzzle.checkPuzzle(PuzzleLibrary.PUZZLE1)).toEqual([
        [
          {requiredNeighbors: null},
          {requiredNeighbors: null},
          {requiredNeighbors: null},
          {requiredNeighbors: null},
          {requiredNeighbors: null}
        ],
        [
          {requiredNeighbors: 4, actualNeighbors: 4, neighborsShouldBeFilled: false},
          {requiredNeighbors: 4, actualNeighbors: 7, neighborsShouldBeFilled: false},
          {requiredNeighbors: null},
          {requiredNeighbors: 8, actualNeighbors: 0, neighborsShouldBeFilled: true},
          {requiredNeighbors: null},
        ],
        [
          {requiredNeighbors: null},
          {requiredNeighbors: null},
          {requiredNeighbors: null},
          {requiredNeighbors: null},
          {requiredNeighbors: null}
        ],
        [
          {requiredNeighbors: null},
          {requiredNeighbors: null},
          {requiredNeighbors: 4, actualNeighbors: 0, neighborsShouldBeFilled: true},
          {requiredNeighbors: null},
          {requiredNeighbors: 2, actualNeighbors: 5, neighborsShouldBeFilled: false},
        ],
        [
          {requiredNeighbors: 4, actualNeighbors: 0, neighborsShouldBeFilled: true},
          {requiredNeighbors: null},
          {requiredNeighbors: null},
          {requiredNeighbors: null},
          {requiredNeighbors: null},
        ],
        [
          {requiredNeighbors: null},
          {requiredNeighbors: 4, actualNeighbors: 1, neighborsShouldBeFilled: true},
          {requiredNeighbors: 3, actualNeighbors: 0, neighborsShouldBeFilled: true},
          {requiredNeighbors: null},
          {requiredNeighbors: 3, actualNeighbors: 0, neighborsShouldBeFilled: true},
        ],
        [
          {requiredNeighbors: 2, actualNeighbors: 3, neighborsShouldBeFilled: false},
          {requiredNeighbors: null},
          {requiredNeighbors: null},
          {requiredNeighbors: 3, actualNeighbors: 0, neighborsShouldBeFilled: true},
          {requiredNeighbors: null},
        ],
      ]);
    });
  });
});