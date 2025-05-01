"use client"

import { format } from "date-fns"
import { ArrowDownIcon, ArrowUpIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Transaction, Category } from "@/lib/types"

interface RecentTransactionsProps {
  transactions: Transaction[]
  categories: Category[]
  onDelete: (id: string) => void
}

export function RecentTransactions({ transactions, categories, onDelete }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No transactions yet</p>
          <p className="text-xs text-muted-foreground">Add a transaction to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const category = categories.find((c) => c.id === transaction.categoryId)

        return (
          <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center space-x-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: category?.color + "20" }}
              >
                {transaction.type === "expense" ? (
                  <ArrowDownIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <ArrowUpIcon className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium leading-none">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {category?.name} • {format(new Date(transaction.date), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-medium ${transaction.type === "expense" ? "text-red-500" : "text-green-500"}`}
              >
                {transaction.type === "expense" ? "-" : "+"}${transaction.amount.toFixed(2)}
              </span>
              <Button variant="ghost" size="icon" onClick={() => onDelete(transaction.id)} className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

