"use client"

import { useMemo } from "react"
import { Progress } from "@/components/ui/progress"
import type { Transaction, Category } from "@/lib/types"

interface BudgetSummaryProps {
  transactions: Transaction[]
  categories: Category[]
}

export function BudgetSummary({ transactions, categories }: BudgetSummaryProps) {
  const categoryExpenses = useMemo(() => {
    // Only include expenses in the summary
    const expenses = transactions.filter((t) => t.type === "expense")

    // Group expenses by category
    const categoryTotals = new Map<string, number>()

    expenses.forEach((transaction) => {
      const { categoryId, amount } = transaction
      const currentTotal = categoryTotals.get(categoryId) || 0
      categoryTotals.set(categoryId, currentTotal + amount)
    })

    // Convert to array and sort by amount (descending)
    return Array.from(categoryTotals.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId)
        return {
          categoryId,
          categoryName: category?.name || "Uncategorized",
          categoryColor: category?.color || "#888888",
          amount,
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }, [transactions, categories])

  const totalExpenses = useMemo(() => {
    return transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  if (categoryExpenses.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No expense data yet</p>
          <p className="text-xs text-muted-foreground">Add expenses to see budget summary</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categoryExpenses.map((item) => {
        const percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0

        return (
          <div key={item.categoryId} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.categoryColor }} />
                <span className="text-sm font-medium">{item.categoryName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">${item.amount.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
              </div>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        )
      })}
    </div>
  )
}

