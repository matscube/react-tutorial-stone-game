import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={'square ' + props.style}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i, isColored) {
    return (<Square
      key={i}
      style={isColored ? 'colored' : ''}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />);
  }

  render() {
    let square = [];
    for (var row = 0; row < 3; row++) {
      let line = [];
      for (var col = 0; col < 3; col++) {
        const n = row * 3 + col;
        const colored = this.props.winnerLine.includes(n);
        line.push(this.renderSquare(n, colored));
      }
      square.push(
        <div key={row} className="board-row">
          {line}
        </div>
      );
    }
    return (
      <div>
        {square}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: -1,
        player: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      historyOrderIsAsc: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        position: i,
        player: squares[i],
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleHistory() {
    this.setState({
      historyOrderIsAsc: !this.state.historyOrderIsAsc,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      let content;
      if (move === 0) {
        content = '';
      } else {
        const pos2d = position2d(step.position);
        content = step.player + ' ' + pos2d.col + ' ' + pos2d.row;
      }
      const style = move === this.state.stepNumber ?
        'bold' : '';
      return (
        <li key={move}>
          <button className={style} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
          : {content}
        </li>
      )
    });

    const movesDisplay = this.state.historyOrderIsAsc ? moves : moves.reverse()

    let status;
    let winnerLine;
    if (winner) {
      status = 'Winner: ' + winner.player;
      winnerLine = winner.line;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      winnerLine = [];
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winnerLine={winnerLine}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button
              onClick={() => this.toggleHistory()}
            >
              Toggle history order
            </button>
          </div>
          <ol>{movesDisplay}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        line: lines[i],
        player: squares[a],
      };
    }
  }
  return null;
}

function position2d(position) {
  return {
    col: position % 3,
    row: parseInt(position / 3),
  }
}