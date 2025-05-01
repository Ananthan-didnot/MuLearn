export interface Transaction {
  id: string
  description: string
  amount: number
  date: Date
  categoryId: string
  type: "income" | "expense"
}

export interface Category {
  id: string
  name: string
  color: string
}

