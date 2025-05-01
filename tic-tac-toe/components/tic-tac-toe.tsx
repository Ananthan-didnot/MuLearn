"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)

  // Use the current state from history
  const currentSquares = history[currentMove]

  function handleClick(i: number) {
    // If there's a winner or the square is already filled, return early
    if (calculateWinner(currentSquares) || currentSquares[i]) {
      return
    }

    // Create a copy of the squares array
    const nextSquares = currentSquares.slice()

    // Set the value of the clicked square based on whose turn it is
    nextSquares[i] = xIsNext ? "X" : "O"

    // Update history and state
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
    setXIsNext(!xIsNext)
  }

  function jumpTo(move: number) {
    setCurrentMove(move)
    setXIsNext(move % 2 === 0)
  }

  function resetGame() {
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
    setXIsNext(true)
  }

  // Determine game status
  const winner = calculateWinner(currentSquares)
  let status

  if (winner) {
    status = `Winner: ${winner}`
  } else if (currentSquares.every((square) => square !== null)) {
    status = "Game ended in a draw!"
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`
  }

  return (
    <Card className="p-6 w-full max-w-md">
      <div className="mb-4 text-xl font-medium text-center">{status}</div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {currentSquares.map((square, index) => (
          <Square key={index} value={square} onSquareClick={() => handleClick(index)} />
        ))}
      </div>

      <div className="flex justify-between">
        <Button onClick={resetGame} variant="outline">
          Restart Game
        </Button>

        {currentMove > 0 && (
          <Button onClick={() => jumpTo(0)} variant="secondary">
            Go to Start
          </Button>
        )}
      </div>

      {history.length > 1 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Game History:</h3>
          <div className="flex flex-wrap gap-2">
            {history.map(
              (_, move) =>
                move > 0 && (
                  <Button
                    key={move}
                    variant={move === currentMove ? "default" : "outline"}
                    size="sm"
                    onClick={() => jumpTo(move)}
                  >
                    Move #{move}
                  </Button>
                ),
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

// Square component for individual cells
function Square({ value, onSquareClick }: { value: string | null; onSquareClick: () => void }) {
  return (
    <button
      className={`h-20 w-full flex items-center justify-center text-3xl font-bold rounded-md border-2 border-border transition-colors ${
        value ? (value === "X" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-red-100 dark:bg-red-900/30") : "hover:bg-muted"
      }`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

// Helper function to calculate winner
function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

