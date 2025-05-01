"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { subMonths, format } from "date-fns"
import type { Transaction } from "@/lib/types"

interface OverviewProps {
  transactions: Transaction[]
}

export function Overview({ transactions }: OverviewProps) {
  const chartData = useMemo(() => {
    // Get the last 6 months
    const today = new Date()
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(today, 5 - i)
      return {
        month: format(date, "MMM"),
        fullMonth: format(date, "MMMM"),
        year: format(date, "yyyy"),
        date,
      }
    })

    // Group transactions by month
    return months.map(({ month, fullMonth, year, date }) => {
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthTransactions = transactions.filter(
        (t) => new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd,
      )

      const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      return {
        name: month,
        fullMonth,
        year,
        income,
        expenses,
      }
    })
  }, [transactions])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
          labelFormatter={(label, payload) => {
            if (payload && payload.length > 0) {
              return `${payload[0].payload.fullMonth} ${payload[0].payload.year}`
            }
            return label
          }}
        />
        <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

