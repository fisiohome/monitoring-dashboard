import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="rounded-3xl border-none shadow-sm h-[160px] bg-white">
                        <CardContent className="p-6 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                            <div className="mt-auto space-y-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column (Charts) */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Funnel Chart Skeleton */}
                    <Card className="rounded-3xl border-none shadow-sm bg-white h-[400px]">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-5 w-32 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between h-[300px] gap-4 px-4">
                                <Skeleton className="h-[60%] w-full rounded-t-xl" />
                                <Skeleton className="h-[80%] w-full rounded-t-xl" />
                                <Skeleton className="h-[50%] w-full rounded-t-xl" />
                                <Skeleton className="h-[70%] w-full rounded-t-xl" />
                                <Skeleton className="h-[40%] w-full rounded-t-xl" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actionable Orders Skeleton */}
                    <Card className="rounded-3xl border-none shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-6">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-16" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <Skeleton className="h-8 w-24 rounded-lg" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Widgets) */}
                <div className="space-y-8 h-full">
                    {/* Auto Assign Widget Skeleton */}
                    <Card className="rounded-3xl border-none shadow-sm bg-white h-[350px]">
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="flex items-center justify-center h-full pb-12">
                            <Skeleton className="h-48 w-48 rounded-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
