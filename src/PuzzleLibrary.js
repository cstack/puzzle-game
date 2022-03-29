const PUZZLE1 = [
  [{filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}],
  [{filled: true, hint: 4}, {filled: true, hint: 4}, {filled: false, hint: null}, {filled: false, hint: 8}, {filled: false, hint: null}],
  [{filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}],
  [{filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: 4}, {filled: false, hint: null}, {filled: true, hint: 2}],
  [{filled: false, hint: 4}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}],
  [{filled: false, hint: null}, {filled: false, hint: 4}, {filled: false, hint: 3}, {filled: false, hint: null}, {filled: false, hint: 3}],
  [{filled: true, hint: 2}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: 3}, {filled: false, hint: null}],
];

const PUZZLE2 = [
  [
    {hint: 0, filled: true},
    {hint: null},
    {hint: null},
    {hint: 3, filled: true},
    {hint: null},
    {hint: 3, filled: false},
    {hint: null},
  ],
  [
    {hint: null},
    {hint: null},
    {hint: 4, filled: false},
    {hint: null},
    {hint: 3, filled: false},
    {hint: null},
    {hint: 3, filled: false},
  ],
  [
    {hint: 2, filled: true},
    {hint: null},
    {hint: null},
    {hint: null},
    {hint: null},
    {hint: null},
    {hint: 4, filled: true},
  ],
  [
    {hint: null},
    {hint: 6, filled: true},
    {hint: 3, filled: false},
    {hint: null},
    {hint: null},
    {hint: 4, filled: false},
    {hint: null},
  ],
  [
    {hint: null},
    {hint: 2, filled: false},
    {hint: null},
    {hint: 3, filled: false},
    {hint: 3, filled: false},
    {hint: null},
    {hint: 2, filled: true},
  ],
];

const PUZZLE3 = [[{"filled":false,"hint":2},{"filled":false,"hint":3},{"hint":null},{"filled":false,"hint":2},{"hint":null},{"hint":null},{"filled":false,"hint":1}],[{"hint":null},{"hint":null},{"filled":false,"hint":3},{"hint":null},{"filled":true,"hint":6},{"hint":null},{"filled":true,"hint":3}],[{"hint":null},{"filled":false,"hint":5},{"hint":null},{"filled":false,"hint":3},{"hint":null},{"hint":null},{"hint":null}],[{"filled":true,"hint":3},{"hint":null},{"hint":null},{"hint":null},{"hint":null},{"hint":null},{"filled":false,"hint":5}],[{"filled":false,"hint":3},{"hint":null},{"hint":null},{"hint":null},{"filled":true,"hint":4},{"hint":null},{"hint":null}],[{"hint":null},{"filled":false,"hint":4},{"hint":null},{"filled":true,"hint":5},{"hint":null},{"hint":null},{"filled":false,"hint":4}],[{"filled":false,"hint":2},{"hint":null},{"hint":null},{"filled":true,"hint":4},{"hint":null},{"hint":null},{"filled":false,"hint":2}]];
const PUZZLE4 = [[{"hint":null},{"filled":true,"hint":5},{"hint":null},{"filled":true,"hint":3},{"hint":null},{"hint":null},{"filled":false,"hint":3}],[{"hint":null},{"hint":null},{"hint":null},{"hint":null},{"hint":null},{"hint":null},{"hint":null}],[{"hint":null},{"filled":true,"hint":3},{"hint":null},{"hint":null},{"filled":false,"hint":5},{"hint":null},{"filled":false,"hint":3}],[{"hint":null},{"hint":null},{"hint":null},{"filled":false,"hint":5},{"filled":false,"hint":4},{"hint":null},{"hint":null}],[{"filled":true,"hint":3},{"hint":null},{"filled":false,"hint":5},{"hint":null},{"hint":null},{"hint":null},{"filled":false,"hint":0}],[{"hint":null},{"hint":null},{"hint":null},{"hint":null},{"filled":true,"hint":2},{"hint":null},{"hint":null}]];

const ALL_WITH_KEYS = { PUZZLE1, PUZZLE2, PUZZLE3, PUZZLE4 };
const ALL = Object.values(ALL_WITH_KEYS);

export default { ALL: ALL, ...ALL_WITH_KEYS };