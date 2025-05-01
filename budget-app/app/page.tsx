import type { Metadata } from "next"
import DashboardPage from "@/components/dashboard-page"

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Manage your personal finances with ease",
}

export default function Home() {
  return <DashboardPage />
}

