'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { InterviewScheduler } from '@/components/InterviewScheduler';
import { Calendar as CalendarIcon, Clock, User, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Interview {
    _id: string;
    title: string;
    candidateId: string;
    startTime: string;
    endTime: string;
    status: string;
}

export default function InterviewsPage() {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [candidates, setCandidates] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [intRes, candRes] = await Promise.all([
                api.get('/interviews'),
                api.get('/candidates')
            ]);
            setInterviews(intRes.data);

            const candMap: Record<string, any> = {};
            candRes.data.forEach((c: any) => {
                candMap[c._id] = c;
            });
            setCandidates(candMap);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Cancel this interview?')) return;
        try {
            await api.delete(`/interviews/${id}`);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    // Group by date logic could be added here
    // For now simple list sorted by date
    const sortedInterviews = [...interviews].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
                <InterviewScheduler onSuccess={loadData} />
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div>Loading...</div>
                ) : sortedInterviews.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8">No interviews scheduled.</div>
                ) : (
                    sortedInterviews.map(interview => {
                        const candidate = candidates[interview.candidateId] || { firstName: 'Unknown', lastName: 'Candidate' };
                        const date = new Date(interview.startTime);
                        const endDate = new Date(interview.endTime);

                        return (
                            <Card key={interview._id}>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex gap-6 items-center">
                                        <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 w-16 h-16 rounded-lg font-bold">
                                            <span className="text-xl">{date.getDate()}</span>
                                            <span className="text-xs uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-lg">{interview.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User className="h-4 w-4" />
                                                    {candidate.firstName} {candidate.lastName}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(interview._id)}>
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
