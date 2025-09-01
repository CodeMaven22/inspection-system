"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import axios from "axios"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

// Form validation schema
const formSchema = z.object({
    location: z.string().min(1, "Location is required"),
    client_name: z.string().min(1, "Client name is required"),
    point_checked: z.string().min(1, "Point checked status is required"),
    alarm_functional: z.boolean().default(false),
    call_points_accessible: z.boolean().default(false),
    emergency_lights_working: z.boolean().default(false),
    faults_identified_details: z.string().optional(),
    action_taken_details: z.string().optional(),
    management_book_initials: z.string().optional(),
    comments: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function NewFireAlarmInspectionPage() {
    const router = useRouter()
    const { user, tokens } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            location: "",
            client_name: "",
            point_checked: "",
            alarm_functional: false,
            call_points_accessible: false,
            emergency_lights_working: false,
            faults_identified_details: "",
            action_taken_details: "",
            management_book_initials: "",
            comments: "",
        },
    })

    const onSubmit = async (values: FormValues) => {
        if (!tokens) {
            toast.error("Authentication required")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/inspections/fire-alarm/",
                values,
                {
                    headers: {
                        Authorization: `Bearer ${tokens.access}`,
                        "Content-Type": "application/json",
                    },
                }
            )

            toast.success("Fire alarm inspection created successfully!")
            router.push("/admin/inspections/fire-alarm/")
        } catch (error: any) {
            console.error("Failed to create inspection:", error)
            toast.error(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Failed to create fire alarm inspection"
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            <div className="flex items-center mb-6">
                <Button variant="ghost" asChild className="mr-4">
                    <Link href="/admin/inspections/fire-alarm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold text-emerald-700">New Fire Alarm Inspection</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fire Alarm Inspection Details</CardTitle>
                    <CardDescription>
                        Fill out the form below to create a new fire alarm inspection
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Basic Information Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter location" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="client_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Client Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter client name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Point Checked */}
                            <FormField
                                control={form.control}
                                name="point_checked"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Point Checked *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select point checked status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="partial">Partial</SelectItem>
                                                <SelectItem value="na">Not Applicable</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Checkboxes Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="alarm_functional"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Alarm Functional</FormLabel>
                                                <FormDescription>
                                                    Is the fire alarm system functional?
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="call_points_accessible"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Call Points Accessible</FormLabel>
                                                <FormDescription>
                                                    Are all call points easily accessible?
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="emergency_lights_working"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Emergency Lights Working</FormLabel>
                                                <FormDescription>
                                                    Are emergency lights functioning properly?
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Faults and Actions Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="faults_identified_details"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Faults Identified</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe any faults identified..."
                                                    className="min-h-32"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="action_taken_details"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Action Taken</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe actions taken to address faults..."
                                                    className="min-h-32"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Additional Information Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="management_book_initials"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Management Book Initials</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter initials" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="comments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Comments</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Any additional comments..."
                                                    className="min-h-20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end gap-4 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/inspections/fire-alarm")}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Create Inspection
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}