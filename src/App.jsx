import React, { useEffect, useMemo, useState } from "react";

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });

  const lines = useMemo(
    () => [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ],
    []
  );

  const { winner, winningLine, isDraw } = useMemo(() => {
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], winningLine: [a, b, c], isDraw: false };
      }
    }
    const filled = squares.every((s) => s !== null);
    return { winner: null, winningLine: [], isDraw: filled };
  }, [squares, lines]);

  useEffect(() => {
    if (winner || isDraw) {
      setScores((prev) => {
        if (winner === "X") return { ...prev, X: prev.X + 1 };
        if (winner === "O") return { ...prev, O: prev.O + 1 };
        if (isDraw) return { ...prev, Draws: prev.Draws + 1 };
        return prev;
      });
    }
  }, [winner, isDraw]);

  const handleClick = (i) => {
    if (squares[i] || winner) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext((x) => !x);
  };

  const newRound = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const resetAll = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setScores({ X: 0, O: 0, Draws: 0 });
  };

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "Draw!"
    : `Turn: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Tic-Tac-Toe</h1>
          <p className={`mt-2 text-lg ${winner ? "text-emerald-400" : isDraw ? "text-amber-400" : "text-slate-300"}`}>{status}</p>
        </header>

        <Board
          squares={squares}
          winningLine={winningLine}
          onClick={handleClick}
          disabled={Boolean(winner)}
        />

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <Stat label="Player X" value={scores.X} accent="text-sky-400" />
          <Stat label="Draws" value={scores.Draws} accent="text-amber-400" />
          <Stat label="Player O" value={scores.O} accent="text-pink-400" />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={newRound}
            className="flex-1 rounded-md bg-slate-800 hover:bg-slate-700 active:bg-slate-600 transition-colors px-4 py-2 font-medium"
          >
            New Round
          </button>
          <button
            onClick={resetAll}
            className="flex-1 rounded-md bg-rose-600 hover:bg-rose-500 active:bg-rose-700 transition-colors px-4 py-2 font-medium"
          >
            Reset All
          </button>
        </div>

        <footer className="mt-6 text-center text-xs text-slate-400">
          Tips: Click a square to place your mark. X starts each round.
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-md bg-slate-800/70 px-4 py-3">
      <div className={`text-sm ${accent}`}>{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Board({ squares, onClick, winningLine, disabled }) {
  return (
    <div
      className="grid grid-cols-3 gap-2 select-none"
      role="grid"
      aria-label="Tic Tac Toe Board"
    >
      {squares.map((value, idx) => {
        const isWinnerCell = winningLine?.includes(idx);
        return (
          <Square
            key={idx}
            value={value}
            onClick={() => onClick(idx)}
            disabled={disabled || Boolean(value)}
            highlight={isWinnerCell}
            index={idx}
          />
        );
      })}
    </div>
  );
}

function Square({ value, onClick, disabled, highlight, index }) {
  const base = "aspect-square flex items-center justify-center rounded-md text-4xl font-bold transition-all";
  const idle = "bg-slate-800 hover:bg-slate-700 active:scale-[0.98]";
  const off = "bg-slate-800 opacity-60 cursor-not-allowed";
  const win = "bg-emerald-600/30 ring-2 ring-emerald-400";
  const textColor = value === "X" ? "text-sky-400" : value === "O" ? "text-pink-400" : "text-slate-200";

  return (
    <button
      type="button"
      className={`${base} ${disabled && !value ? off : idle} ${highlight ? win : ""} ${textColor}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Cell ${index + 1} ${value ? `contains ${value}` : "empty"}`}
    >
      <span className="drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">{value}</span>
    </button>
  );
}

export default App;
