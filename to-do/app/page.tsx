"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Task {
  id: string
  text: string
  completed: boolean
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")

  const addTask = () => {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Math.random().toString(36).substr(2, 9),
        text: newTask,
        completed: false,
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleComplete = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">To-Do List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button onClick={addTask}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {tasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No tasks yet. Add one above!</p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleComplete(task.id)}
                        id={`task-${task.id}`}
                      />
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`cursor-pointer ${task.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.text}
                      </label>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} aria-label="Delete task">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

