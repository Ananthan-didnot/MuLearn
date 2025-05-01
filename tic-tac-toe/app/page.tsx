import TicTacToe from "@/components/tic-tac-toe"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <h1 className="text-4xl font-bold mb-8 text-center">Tic-Tac-Toe</h1>
      <TicTacToe />
    </main>
  )
}

