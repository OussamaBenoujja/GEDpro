'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, FileText, Calendar, Bell } from 'lucide-react';

export default function DashboardPage() {
    // In a real app, these would come from an API call
    const stats = [
        { title: 'Total Applications', value: '124', icon: Users, color: 'text-blue-500' },
        { title: 'Documents Processed', value: '45', icon: FileText, color: 'text-green-500' },
        { title: 'Upcoming Interviews', value: '8', icon: Calendar, color: 'text-purple-500' },
        { title: 'New Notifications', value: '3', icon: Bell, color: 'text-yellow-500' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Mock List */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                        CN
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Candidate Name {i}</p>
                                        <p className="text-sm text-muted-foreground">Applied for Software Engineer</p>
                                    </div>
                                    <div className="ml-auto font-medium">Just now</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Upcoming Interviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Technical Interview</p>
                                        <p className="text-sm text-muted-foreground">Tomorrow at 2:00 PM</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
