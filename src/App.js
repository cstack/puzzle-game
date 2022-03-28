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
    const puzzle = this.addEmptyAnnotations(PuzzleLibrary.PUZZLE1);
    this.state = {
      puzzle: puzzle,
      solved: false,
      showDetails: false
    };
  }

  render() {
    const solved = this.state.solved;
    const neighborCounts = Puzzle.checkPuzzle(this.state.puzzle);
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
      if (Puzzle.isSolved(puzzle)) {
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
