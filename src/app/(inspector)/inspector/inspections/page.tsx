"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

interface Inspection {
  id: number
  title: string
  status: "passed" | "failed" | "pending"
  date: string
  inspector: string
}

const inspections: Inspection[] = [
  { id: 1, title: "Inspection A", status: "passed", date: "2024-01-01", inspector: "John Doe" },
  { id: 2, title: "Inspection B", status: "failed", date: "2024-02-15", inspector: "Jane Smith" },
  { id: 3, title: "Inspection C", status: "pending", date: "2024-03-20", inspector: "Alice Johnson" },
]

export default function InspectionListPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit" | null>(null)

  const handleViewDetails = (inspection: Inspection) => {
    setSelectedInspection(inspection)
    setModalMode("view")
    setIsDialogOpen(true)
  }

  const handleEdit = (inspection: Inspection) => {
    setSelectedInspection(inspection)
    setModalMode("edit")
    setIsDialogOpen(true)
  }

  const renderStatusBadge = (status: Inspection["status"]) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-500 text-white">PASSED</Badge>
      case "failed":
        return <Badge className="bg-red-500 text-white">FAILED</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 text-black">PENDING</Badge>
      default:
        return <Badge>{status.toUpperCase()}</Badge>
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell>{inspection.title}</TableCell>
                  <TableCell>{renderStatusBadge(inspection.status)}</TableCell>
                  <TableCell>{inspection.date}</TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(inspection)}
                      className="mr-2"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(inspection)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "view" ? "Inspection Details" : "Edit Inspection"}
            </DialogTitle>
            <DialogDescription>
              {modalMode === "view"
                ? "Detailed information about the inspection."
                : "Modify the inspection details below."}
            </DialogDescription>
          </DialogHeader>

          {selectedInspection && (
            <div className="space-y-4">
              <p><strong>Title:</strong> {selectedInspection.title}</p>
              <p><strong>Status:</strong> {selectedInspection.status}</p>
              <p><strong>Date:</strong> {selectedInspection.date}</p>
              <p><strong>Inspector:</strong> {selectedInspection.inspector}</p>

              {modalMode === "edit" && (
                <div className="mt-4">
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
