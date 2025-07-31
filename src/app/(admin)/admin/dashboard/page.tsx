"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, Users, ClipboardCheck } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold tracking-tight text-green-700">Admin Dashboard</h1>
      <p className="text-green-600">Overview of system activities and key metrics.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200 shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Inspections</CardTitle>
            <ClipboardCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">2,350</div>
            <p className="text-xs text-gray-500">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Active Workers</CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">150</div>
            <p className="text-xs text-gray-500">+5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Pending Approvals</CardTitle>
            <ClipboardCheck className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">12</div>
            <p className="text-xs text-yellow-600">Needs immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-teal-200 shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">Compliance Rate</CardTitle>
            <BarChart className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-800">98.5%</div>
            <p className="text-xs text-gray-500">Consistent performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-green-100">
          <CardHeader>
            <CardTitle className="text-green-700">Recent Inspections</CardTitle>
            <CardDescription className="text-green-500">Latest completed inspections.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-md border-2 border-dashed border-green-300 flex items-center justify-center text-green-400">
              Recent Inspections List
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-teal-100">
          <CardHeader>
            <CardTitle className="text-teal-700">Inspection Trends</CardTitle>
            <CardDescription className="text-teal-500">Monthly inspection volume.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-md border-2 border-dashed border-teal-300 flex items-center justify-center text-teal-400">
              <LineChart className="h-16 w-16" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
