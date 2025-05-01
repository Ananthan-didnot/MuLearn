"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { AddTransactionForm } from "@/components/add-transaction-form"
import { BudgetSummary } from "@/components/budget-summary"
import { CategoryBreakdown } from "@/components/category-breakdown"
import type { Transaction, Category } from "@/lib/types"
import { defaultCategories } from "@/lib/data"

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions")
    const savedCategories = localStorage.getItem("categories")

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories))
  }, [categories])

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev])
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
  }

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category])
  }

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {balance >= 0 ? "You're doing great!" : "You're overspending"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total income for all time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total expenses for all time</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="add">Add Transaction</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview transactions={transactions} />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryBreakdown transactions={transactions} categories={categories} />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your most recent financial activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentTransactions
                    transactions={transactions.slice(0, 5)}
                    categories={categories}
                    onDelete={deleteTransaction}
                  />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Budget Summary</CardTitle>
                  <CardDescription>Your spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetSummary transactions={transactions} categories={categories} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>A complete history of your financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions transactions={transactions} categories={categories} onDelete={deleteTransaction} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
                <CardDescription>Record a new expense or income</CardDescription>
              </CardHeader>
              <CardContent>
                <AddTransactionForm
                  onAddTransaction={addTransaction}
                  categories={categories}
                  onAddCategory={addCategory}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

