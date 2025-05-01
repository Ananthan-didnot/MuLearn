"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { Transaction, Category } from "@/lib/types"

interface CategoryBreakdownProps {
  transactions: Transaction[]
  categories: Category[]
}

export function CategoryBreakdown({ transactions, categories }: CategoryBreakdownProps) {
  const chartData = useMemo(() => {
    // Only include expenses in the breakdown
    const expenses = transactions.filter((t) => t.type === "expense")

    // Group expenses by category
    const categoryTotals = new Map<string, number>()

    expenses.forEach((transaction) => {
      const { categoryId, amount } = transaction
      const currentTotal = categoryTotals.get(categoryId) || 0
      categoryTotals.set(categoryId, currentTotal + amount)
    })

    // Convert to chart data format
    return Array.from(categoryTotals.entries())
      .map(([categoryId, value]) => {
        const category = categories.find((c) => c.id === categoryId)
        return {
          name: category?.name || "Uncategorized",
          value,
          color: category?.color || "#888888",
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [transactions, categories])

  if (chartData.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No expense data yet</p>
          <p className="text-xs text-muted-foreground">Add expenses to see category breakdown</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, ""]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

