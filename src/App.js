import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './water.css';
import './App.css';
import Puzzle from './Puzzle';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      puzzles: Puzzle.loadAllPuzzles(),
      selectedPuzzleIndex: null,
      editingEnabled: false,
      debug: false, // show debug menu
    };
  }

  render() {
    let contents = [];

    if (this.state.debug && this.state.selectedPuzzleIndex === null) {
      contents.push(<label key="edit-label">Edit</label>);
      contents.push(<input key="edit-toggle" type="checkbox" onClick={this.toggleEditing.bind(this)} />);
      contents.push(<button key="new-puzzle-button" onClick={this.newPuzzle.bind(this)}>New Puzzle</button>);
    }

    if (this.state.selectedPuzzleIndex === null) {
      contents.push(<h1 key="PuzzlePicker-title">Pick a Puzzle:</h1>);
      contents.push(<PuzzlePicker key="PuzzlePicker" puzzles={this.state.puzzles} handlePuzzlePicked={this.handlePuzzlePicked.bind(this)} />);
    } else {
      if (this.state.editingEnabled) {
        contents.push(<PuzzleEditor key="PuzzleEditor" puzzle={this.selectedPuzzle()} />);
      } else {
        contents.push(<PuzzleSolvingView key="PuzzleSolvingView" puzzle={this.selectedPuzzle()} onExitView={this.handleExitPuzzleSolvingView.bind(this)} />);
      }
    }
    return (
      <div className="App">
        {contents}
      </div>
    );
  }

  selectedPuzzle() {
    return this.state.puzzles[this.state.selectedPuzzleIndex];
  }

  toggleEditing() {
    this.setState({editingEnabled: !this.state.editingEnabled});
  }

  newPuzzle() {
    this.setState({
      editingEnabled: true,
      selectedPuzzle: Puzzle.loadEmptyPuzzle(5, 5),
    })
  }

  handlePuzzlePicked(puzzleIndex) {
    this.setState({selectedPuzzleIndex: puzzleIndex});
  }

  handleExitPuzzleSolvingView(puzzle) {
    const puzzles = this.state.puzzles.slice();
    puzzles[this.state.selectedPuzzleIndex] = puzzle;
    this.setState({
      selectedPuzzleIndex: null,
      puzzles: puzzles,
    });
  }
}

class PuzzleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      puzzle: props.puzzle,
    };
  }

  render() {
    const rowCount = this.state.puzzle.length;
    const columnCount = this.state.puzzle[0].length;
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
          handleCellClicked={this.handleCellClicked.bind(this)}
        />
      </div>
    );
  }

  exportPuzzle() {
    console.log(JSON.stringify(this.state.puzzle));
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
          puzzle.push(Array(columnCount).fill(null).map(() => { return Puzzle.emptyCell(); }))
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
            row.push(Puzzle.emptyCell());
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
      return <PuzzleIcon
        key={puzzleId}
        testid={`puzzle-${puzzleId}`}
        puzzleId={puzzleId}
        solved={Puzzle.isSolved(puzzle)}
        onClick={() => { this.props.handlePuzzlePicked(puzzleId) } }
      />;
    });
    return (
      <div className="PuzzlePicker">
        {puzzles}
      </div>
    );
  }
}

class PuzzleIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let className = "PuzzleIcon vertical-align";
    if (this.props.solved) {
      className += " solved";
    }
    return (
      <div className={className} data-testid={this.props.testid} onClick={this.props.onClick}>
        {this.props.puzzleId + 1}
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
    if (Puzzle.filled(this.props.cell)) {
      className += " cell-black";
    } else {
      className += " cell-white";
    }
    return (
      <div className={className}>
        {Puzzle.cellContents(this.props.cell)}
      </div>
    );
  }
}

class PuzzleSolvingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      puzzle: this.props.puzzle,
      solved: false,
      showDetails: false
    };
  }

  render() {
    const solved = this.state.solved;
    return (
      <div className="PuzzleSolvingView">
        <VictoryBanner visible={this.state.solved} />
        <Grid
          puzzle={this.state.puzzle}
          showDetails={this.state.showDetails}
          handleCellClicked={this.handleCellClicked.bind(this)}
        />
        <ControlPanel
          showDetails={this.state.showDetails}
          onToggleShowDetails={this.toggleShowDetails.bind(this)}
          onBackClicked={this.handleBackClicked.bind(this)}
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

  handleBackClicked() {
    this.props.onExitView(this.state.puzzle);
  }

  handleCellClicked(rowIndex, columnIndex) {
    if (this.state.solved) {
      // No more interaction after solved
      return;
    }
    const puzzle = Puzzle.copyPuzzle(this.state.puzzle);
    const cell = puzzle[rowIndex][columnIndex];
    if (cell.hint === null) {
      const oldAnnotation = cell.annotation;
      const newAnnotation = this.cycleAnnotation(oldAnnotation);
      Puzzle.annotateCell(rowIndex, columnIndex, puzzle, newAnnotation);
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
        return "unfilled";
      case("unfilled"):
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
    const cell = this.props.value;
    // const hint = this.props.value.hint;
    // const annotation = this.props.value.annotation;
    // const filled = cell.filled || cell.annotation === "filled";
    const showDetails = this.props.showDetails;
    // let checkResult = this.props.checkResult;

    let colorClass = null;
    if (cell.filled || cell.annotation === "filled") {
      colorClass = "cell-black";
    } else {
      colorClass = "cell-white";
    }
    const className = `Cell ${colorClass}`;

    let text = null;
    if (cell.hint === null) {
      if (cell.annotation === "filled") {
        text = "";
      } else if (cell.annotation === "unfilled") {
        text = "・"
      } else if (cell.annotation === null) {
        text = "";
      }
    } else {
      text = cell.hint;
    }

    let neighborIndicator = null;
    if (cell.hint === null) {
      neighborIndicator = null;
    } else {
      if (Puzzle.cellIsValid(cell)) {
        neighborIndicator = "✅";
      } else {
        neighborIndicator = Puzzle.numNeighborsOfRequiredType(cell);
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
