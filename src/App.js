import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './water.css';
import './App.css';

const PUZZLE1 = [
  [{filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}],
  [{filled: true, hint: 4}, {filled: true, hint: 4}, {filled: false, hint: null}, {filled: false, hint: 8}, {filled: false, hint: null}],
  [{filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}],
  [{filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: 4}, {filled: false, hint: null}, {filled: true, hint: 2}],
  [{filled: false, hint: 4}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: null}],
  [{filled: false, hint: null}, {filled: false, hint: 4}, {filled: false, hint: 3}, {filled: false, hint: null}, {filled: false, hint: 3}],
  [{filled: true, hint: 2}, {filled: false, hint: null}, {filled: false, hint: null}, {filled: false, hint: 3}, {filled: false, hint: null}],
];

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

class App extends React.Component {
  constructor(props) {
    super(props);
    const puzzle = this.addEmptyAnnotations(PUZZLE1);
    this.state = {
      puzzle: puzzle,
      solved: false,
      showDetails: false
    };
  }

  render() {
    const solved = this.state.solved;
    const neighborCounts = checkPuzzle(this.state.puzzle);
    return (
      <div className="App">
        <VictoryBanner visible={this.state.solved} />
        <Grid
          puzzle={this.state.puzzle}
          neighborCounts={neighborCounts}
          showDetails={this.state.showDetails}
          handleCellClicked={this.handleCellClicked.bind(this)}
        />
        <ControlPanel showDetails={this.state.showDetails} onToggleShowDetails={this.toggleShowDetails.bind(this)} />
      </div>
    );
  }

  toggleShowDetails() {
    this.setState({showDetails: !this.state.showDetails});
  }

  addEmptyAnnotations(puzzle) {
    return puzzle.map((row) => {
      return row.map((cell) => {
        return Object.assign(cell, {annotation: null})
      })
    });
  }

  handleCellClicked(rowIndex, columnIndex) {
    if (this.state.solved) {
      // No more interaction after solved
      return;
    }
    const puzzle = this.state.puzzle.slice();
    const cell = puzzle[rowIndex][columnIndex];
    if (cell.hint === null) {
      const oldAnnotation = cell.annotation;
      const newAnnotation = this.cycleAnnotation(oldAnnotation);
      puzzle[rowIndex][columnIndex].annotation = newAnnotation;
      this.setState({puzzle: puzzle});
      if (isSolved(puzzle)) {
        this.setState({solved: true});
      }
    } else {
      // Cannot add annotations to cells with hints"
    }
  }

  cycleAnnotation(oldAnnotation) {
    switch(oldAnnotation) {
      case(null) :
        return "filled";
      case("filled"):
        return "empty";
      case("empty"):
        return null;
    }
  }
}

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="ControlPanel">
        <HowToPlay />
        <DetailsToggle showDetails={this.props.showDetails} onChange={this.props.onToggleShowDetails} />
      </div>
    );
  }
}

class HowToPlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  render() {
    let contents = [];
    return (
      <div className="HowToPlay">
        <Collapsible buttonText="How to Play" text="Black squares with white text tell you how many neighbors are white. White cells with black text tell you how many neighbors are white. You can mark a cell as black or white. A '・' is a reminder to yourself that you know the cell is white."/>
      </div>
    );
  }

  toggle() {
    this.setState({expanded: !this.state.expanded});
  }
}

class Collapsible extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  render() {
    let contentClassName = "content"
    if (this.state.expanded) {
      contentClassName += " visible";
    } else {
      contentClassName += " invisible";
    }
    return (
      <div className="Collapsible">
        <button type="button" className="collapsible" onClick={this.toggle.bind(this)}>{this.props.buttonText}</button>
        <div className={contentClassName}>
          <p>{this.props.text}</p>
        </div>
      </div>
    );
  }

  toggle() {
    this.setState({expanded: !this.state.expanded});
  }
}



class DetailsToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="DetailsToggle" onClick={this.props.onChange}>
        <input name="showDetails" type="checkbox" checked={this.props.showDetails} onChange={() => {}}/>
        <label htmlFor="showDetails">Show Hints</label>
      </div>
    );
  }
}

class VictoryBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.visible) {
      return (
        <div className="VictoryBanner">
          🎉 Solved! 🎉
        </div>
      );
    } else {
      return null;
    }
    
  }
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const rows = this.props.puzzle.map((row, rowIndex) => {
      return (
        <Row
          key={rowIndex}
          rowIndex={rowIndex}
          cells={row}
          neighborCounts={this.props.neighborCounts[rowIndex]}
          showDetails={this.props.showDetails}
          handleCellClicked={this.props.handleCellClicked}
        />
      );
    });
    return (
      <div className="Grid">
        {rows}
      </div>
    );
  }
}

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const rowIndex = this.props.rowIndex;
    const cells = this.props.cells.map((cell, columnIndex) => {
      const key = `${rowIndex}-${columnIndex}`;
      return (
        <Cell
          key={key}
          value={cell}
          checkResult={this.props.neighborCounts[columnIndex]}
          showDetails={this.props.showDetails}
          onClick={() => this.props.handleCellClicked(rowIndex, columnIndex)}
        />
      );
    });
    return (
      <div className="Row">
        {cells}
      </div>
    );
  }
}

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const hint = this.props.value.hint;
    const annotation = this.props.value.annotation;
    const filled = this.props.value.filled || annotation === "filled";
    const showDetails = this.props.showDetails;
    let checkResult = this.props.checkResult;

    let colorClass = null;
    if (filled) {
      colorClass = "cell-black";
    } else {
      colorClass = "cell-white";
    }
    const className = `Cell ${colorClass}`;
    let text = null;
    if (hint === null) {
      if (annotation === "filled") {
        text = "";
      } else if (annotation === "empty") {
        text = "・"
      } else if (annotation === null) {
        text = "";
      }
    } else {
      text = hint;
    }

    let neighborIndicator = null;
    if (checkResult.requiredNeighbors === null) {
      neighborIndicator = null;
    } else {
      if (cellIsValid(checkResult)) {
        neighborIndicator = "✅";
      } else {
        neighborIndicator = checkResult.actualNeighbors;
      }
    }

    let contents = []
    contents.push(<span key="text">{text}</span>);
    if (showDetails) {
      contents.push(<span key="neighbor-count" className="neighbor-count">{neighborIndicator}</span>);
    }
    return (
      <div className={className} onClick={this.props.onClick}>
        {contents}
      </div>
    );
  }
}

export default App;
