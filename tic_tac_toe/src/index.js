import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    const winningSquareStyle = {
        backgroundColor: '#ccc'
    };

      return (
        <button className="square"
                onClick={props.onClick}
                style={props.winningSquare ? winningSquareStyle : null}
        >
            { props.value }
        </button>
      );

  }

  class Board extends React.Component {
    renderSquare(i) {
        let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
        return (
            <Square value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}
                    winningSquare = {winningSquare}
            />
            );
    }

    renderSquares(){

        let boardSquares = [];
        for(let row = 0; row < 3; row++){
            let boardRow = [];
            for(let col = 0; col < 3; col++){
                boardRow.push(<span key={(row * 3) + col}>{this.renderSquare((row * 3) + col)}</span>);
            }
            boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
        }

        const items = [];
        let iCount=0;
        for(let i=0;i<3;i++) {
            for (let j = 0; j < 3; j++) {
                items.push("<div className=\"board-row\">")
                items.push(this.renderSquare(j + iCount))
                items.push("</div>")
            }

            iCount+=3;
        }
        return (
            <div>
                {items}
            </div>
        )
    }

    render() {

        let boardSquares = [];
        for(let row = 0; row < 3; row++){
            let boardRow = [];
            for(let col = 0; col < 3; col++){
                boardRow.push(<span key={(row * 3) + col}>{this.renderSquare((row * 3) + col)}</span>);
            }
            boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
        }


        return (


        <div>

            {boardSquares}

          {/*<div className="board-row">*/}
          {/*  {this.renderSquare(0)} {this.renderSquare(1)}   {this.renderSquare(2)}*/}
          {/*</div>*/}
          {/*<div className="board-row">*/}
          {/*  {this.renderSquare(3)} {this.renderSquare(4)}   {this.renderSquare(5)}*/}
          {/*</div>*/}
          {/*<div className="board-row">*/}
          {/*  {this.renderSquare(6)} {this.renderSquare(7)}   {this.renderSquare(8)}*/}
          {/*</div>*/}
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
              }],
              trackMove : [{
                  moves: Array(9).fill(-1),
              }],
              xIsNext: true,
              stepNumber: 0,
              clickedSquare: [0,0],
              ascending: true,
          };
      }

      jumpTo(step){
          this.setState({
              stepNumber: step,
              xIsNext: (step % 2) === 0,
          });

      }

      sortHandleClick(){
          this.setState({
              ascending: !this.state.ascending
          });
      }

      handleClick(i) {

          //immuate the objects
          const history = this.state.history.slice(0, this.state.stepNumber + 1);
          const trackMove = this.state.trackMove.slice(0, this.state.stepNumber + 1);

          const current = history[history.length - 1];
          const squares = current.squares.slice();
          if (calculateWinner(squares).winner || squares[i]) {
              return;
          }
          squares[i] = this.state.xIsNext ? 'X' : 'O';
          //alert('i='+i+' row='+(i<2 ?1 : 1 + i / 3)+' , col='+(i<3 ? i +1 : i % 3))
          this.setState({
              history: history.concat([{
                  squares: squares,
              }]),
              trackMove: trackMove.concat([{
                  moves: (' (row='+Math.floor((i % 3) + 1)+' , col='+Math.floor((i / 3) + 1) +') , value='+squares[i]),
              }]),
              stepNumber: history.length,
              currentIndex : i,
              xIsNext: !this.state.xIsNext,
          });
      }

    render() {

        const active = {
            fontWeight: 'bold'
        };

        const inactive = {
            fontWeight: 'normal'
        };

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const ascending = this.state.ascending;


        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move +this.state.trackMove[move].moves:
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} style={this.state.stepNumber === move ? active : inactive}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner.winner) {
            status = 'Winner: ' + winner.winner;
        } else if(winner.isDraw){
            status = 'Well Played! Match Draw!'
        }
        else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares}
                   onClick={(i) => this.handleClick(i)}
                   winner={winner && winner.winningSquares}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{ascending ? moves : moves.reverse()}</ol>
              <button onClick={() => this.sortHandleClick()}>Toggle Sort Order</button>
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
                winner: squares[a],
                winningSquares: lines[i],
                isDraw:false
            };
        }


    }
    let isDraw = true;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            isDraw = false;
            break;
        }
    }
    return {
        winner: null,
        winningSquares:null,
        isDraw: isDraw,
    };
}