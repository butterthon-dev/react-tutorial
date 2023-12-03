import { useState } from 'react';

// 盤面のマス
// - export: 関数を外部からアクセスできるようにする
// - default: このコードを使用する他のファイルに、これがこのファイルのメイン関数であるということを伝え
function Square({ value, isWinner, onSquareClick }) {
  return (
    <button className={isWinner ? "square winner" : "square"} onClick={onSquareClick}>
      { value }
    </button>)
}

// 盤面
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // 対象のマス目が埋まっている または 既に勝者が決定している場合は何もしない
    if (squares[i] || judge(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  // 勝者を判定する
  const judgeResult = judge(squares);

  // 判定結果から勝者のプレイヤー名を取得する
  const winner = calculateWinner(squares, judgeResult);

  // 全部の盤面が埋まったかどうか
  let isAllSquareFilled = squares.every((square) => square !== null);

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isAllSquareFilled) {
      status = 'Draw';
  } else {
    status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
  }

  /**
   * 盤面のマスを描画する
   * @param {*} i 
   * @returns 
   */
  const renderSquares = (i) => {
    let rowSquares = [];
    for (let x = 0; x < 3; x++) {
      // 盤面のマス目の位置
      const position = i * 3 + x;

      // 勝者のマス目かどうか
      const isWinnerSquare = judgeResult && judgeResult.includes(position);

      // 盤面のマス目を描画
      rowSquares.push(
        <Square key={position} value={squares[position]} isWinner={isWinnerSquare} onSquareClick={() => handleClick(position)} />
      );
    }
    return rowSquares;
  }

  /**
   * 盤面の行を描画する
   * @returns 
   */
  const renderRow = () => {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      rows.push((
          <div className="board-row" key={i}>
            {renderSquares(i)}
          </div>
      ))
    }
    return rows;
  }

  return (
    <>
      <div className="status">{status}</div>
      {renderRow()}
    </>
  )
}

/**
 * 勝者を判定する
 * @param {*} squares 
 * @returns 
 */
function judge(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

/**
 * 判定結果をもとに勝者のプレイヤー名を返す
 * @param {*} squares 
 * @param {*} judgeResult 
 * @returns 
 */
function calculateWinner(squares, judgeResult) {
  if (judgeResult) {
    return squares[judgeResult[0]];
  }
  return judgeResult;
}

export default function Game() {
  const [history, setHisotry] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquare = history[currentMove];

  function handlePlay(nextSquares) {
    // // [...history, nextSquares] というコードは、history のすべての要素の後に nextSquares が繋がった新しい配列を作成するという意味。
    // // （この ...history はスプレッド構文であり、「history のすべての項目をここに列挙せよ」という意味）
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHisotry(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = "You are at move #...";
    }
    else if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquare} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{ moves }</ol>
      </div>
    </div>
  )
}
