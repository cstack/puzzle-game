import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './water.css';
import './App.css';
import Puzzle from './Puzzle';
import PuzzleLibrary from './PuzzleLibrary';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPuzzle: null,
      editingPuzzle: false,
    };
  }

  render() {
    let contents = null;
    if (this.state.editingPuzzle) {
      contents = <PuzzleEditor />
    } else if (this.state.selectedPuzzle === null) {
      contents = <PuzzlePicker puzzles={PuzzleLibrary.ALL} handlePuzzlePicked={this.handlePuzzlePicked.bind(this)} />;
    } else {
      contents = <PuzzleSolvingView puzzle={this.state.selectedPuzzle} onExitView={this.handleExitPuzzleSolvingView.bind(this)} />
    }
    return (
      <div className="App">
        {contents}
      </div>
    );
  }

  handlePuzzlePicked(puzzle) {
    this.setState({selectedPuzzle: puzzle});
  }

  handleExitPuzzleSolvingView() {
    this.setState({selectedPuzzle: null});
  }
}

class PuzzleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      puzzle: this.generateEmptyPuzzle(),
    };
  }

  render() {
    const rowCount = this.state.puzzle.length;
    const columnCount = this.state.puzzle[0].length;
    const neighborCounts = Puzzle.checkPuzzle(this.state.puzzle);
    return (
      <div className="PuzzleEditor">
        <div>
          <label>{rowCount} Rows: </label>
          <button onClick={() => { this.changeGridSize(true, -1); }}>-</button>
          <button onClick={() => { this.changeGridSize(true, 1); }}>+</button>
        </div>
        <div>
          <label>{columnCount} Columns: </label>
          <button onClick={() => { this.changeGridSize(false, -1); }}>-</button>
          <button onClick={() => { this.changeGridSize(false, 1); }}>+</button>
        </div>
        <button onClick={this.exportPuzzle.bind(this)}>Export</button>
        <Grid
          puzzle={this.state.puzzle}
          neighborCounts={neighborCounts}
          handleCellClicked={this.handleCellClicked.bind(this)}
        />
      </div>
    );
  }

  exportPuzzle() {
    console.log(JSON.stringify(this.state.puzzle));
  }

  emptyCell() {
    return { hint: null };
  }

  generateEmptyPuzzle() {
    return Array(5).fill(null).map(() => {
      return Array(5).fill(null).map(() => {
        return this.emptyCell();
      });
    });
  }

  changeGridSize(isRow, delta) {
    const rowCount = this.state.puzzle.length;
    const columnCount = this.state.puzzle[0].length;
    let puzzle = this.state.puzzle.slice();
    if (isRow) {
      const newRowCount = rowCount + delta;
      if (newRowCount < 1) {
        return;
      }
      if (delta > 0) {
        for (let i=0;i < delta;i++) {
          puzzle.push(Array(columnCount).fill(null).map(() => { return this.emptyCell(); }))
        }
      } else {
        for (let i=0; i < -delta;i++) {
          puzzle.pop();
        }
      }
    } else {
      const newColumnCount = columnCount + delta;
      if (newColumnCount < 1) {
        return;
      }
      if (delta > 0) {
        puzzle.forEach((row) => {
          for (let i=0;i < delta;i++) {
            row.push(this.emptyCell());
          }
        });
      } else {
        puzzle.forEach((row) => {
          for (let i=0; i < -delta;i++) {
            row.pop();
          }
        });
      }
    }
    this.setState({puzzle: puzzle});
  }

  handleCellClicked(rowIndex, columnIndex) {
    const puzzle = this.state.puzzle.slice();
    const cell = puzzle[rowIndex][columnIndex];
    puzzle[rowIndex][columnIndex] = this.cycleCell(cell);
    this.setState({puzzle: puzzle});
  }
  
  cycleCell(cell) {
    let newCell = {};
    if (cell.hint === null) {
      newCell = { filled: false, hint: 0 }; 
    } else if (cell.hint < 9) {
      newCell = { filled: cell.filled, hint: cell.hint + 1};
    } else if (cell.filled) {
      newCell = { hint: null };
    } else {
      newCell = { filled: true, hint: 0 };
    }
    return newCell;
  }
}

class PuzzlePicker extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let puzzles = this.props.puzzles.map((puzzle, puzzleId) => {
      return <MiniPuzzleView key={puzzleId} testid={`puzzle-${puzzleId}`} puzzle={puzzle} onClick={() => { this.props.handlePuzzlePicked(puzzle) } } />
    });
    return (
      <div className="PuzzlePicker">
        <h1>Pick a Puzzle:</h1>
        {puzzles}
      </div>
    );
  }
}

class MiniPuzzleView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const rows = this.props.puzzle.map((row, rowIndex) => {
      return <MiniPuzzleRow key={rowIndex} row={row} />;
    });
    return (
      <div className="MiniPuzzleView" data-testid={this.props.testid} onClick={this.props.onClick}>
        {rows}
      </div>
    );
  }
}

class MiniPuzzleRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cells = this.props.row.map((cell, columnIndex) => {
      return <MiniPuzzleCell key={columnIndex} cell={cell} />;
    });
    return (
      <div className="MiniPuzzleRow">
        {cells}
      </div>
    );
  }
}

class MiniPuzzleCell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let className = "MiniPuzzleCell";
    if (this.props.cell.filled) {
      className += " cell-black";
    } else {
      className += " cell-white";
    }
    return (
      <div className={className}>
      </div>
    );
  }
}

class PuzzleSolvingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      puzzle: this.props.puzzle.slice(),
      solved: false,
      showDetails: false
    };
  }

  render() {
    const solved = this.state.solved;
    const neighborCounts = Puzzle.checkPuzzle(this.state.puzzle);
    return (
      <div className="PuzzleSolvingView">
        <VictoryBanner visible={this.state.solved} />
        <Grid
          puzzle={this.state.puzzle}
          neighborCounts={neighborCounts}
          showDetails={this.state.showDetails}
          handleCellClicked={this.handleCellClicked.bind(this)}
        />
        <ControlPanel
          showDetails={this.state.showDetails}
          onToggleShowDetails={this.toggleShowDetails.bind(this)}
          onBackClicked={this.props.onExitView}
        />
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
      if (Puzzle.isSolved(puzzle)) {
        this.setState({solved: true});
      }
    } else {
      // Cannot add annotations to cells with hints"
    }
  }

  cycleAnnotation(oldAnnotation) {
    switch(oldAnnotation) {
      case(null):
      case(undefined):
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
        <button onClick={this.props.onBackClicked}>Back</button>
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
        <Collapsible buttonText="How to Play" text="Black squares with white text tell you how many neighbors are white. White squares with black text tell you how many neighbors are black. You can mark a square as black or white. A '・' is a reminder to yourself that you know the cell is white."/>
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
          testid={key}
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
      if (Puzzle.cellIsValid(checkResult)) {
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
      <div data-testid={this.props.testid} className={className} onClick={this.props.onClick}>
        {contents}
      </div>
    );
  }
}

export default App;
