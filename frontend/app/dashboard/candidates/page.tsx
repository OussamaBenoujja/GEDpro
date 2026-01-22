'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

enum CandidateStatus {
    NEW = 'NEW',
    PRE_SELECTED = 'PRE_SELECTED',
    INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
    INTERVIEWING = 'INTERVIEWING',
    ACCEPTED = 'ACCEPTED',
    REFUSED = 'REFUSED',
}

interface Candidate {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: CandidateStatus;
}

const statusColumns = [
    { id: CandidateStatus.NEW, label: 'New', color: 'bg-blue-50 border-blue-200' },
    { id: CandidateStatus.PRE_SELECTED, label: 'Pre-Selected', color: 'bg-indigo-50 border-indigo-200' },
    { id: CandidateStatus.INTERVIEW_SCHEDULED, label: 'Scheduled', color: 'bg-purple-50 border-purple-200' },
    { id: CandidateStatus.INTERVIEWING, label: 'Interviewing', color: 'bg-pink-50 border-pink-200' },
    { id: CandidateStatus.ACCEPTED, label: 'Accepted', color: 'bg-green-50 border-green-200' },
    { id: CandidateStatus.REFUSED, label: 'Refused', color: 'bg-red-50 border-red-200' },
];

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);

    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
    const [filterJobId, setFilterJobId] = useState<string | null>(null);

    useEffect(() => {
        // Simple search params read
        const params = new URLSearchParams(window.location.search);
        const jobId = params.get('jobId');
        setFilterJobId(jobId);
        loadCandidates(jobId);
    }, []);

    const loadCandidates = async (jobId: string | null = null) => {
        try {
            // In a real app, query /candidates?jobId=${jobId}. 
            // Here, we fetch all and filter in memory if needed, or assume backend does it.
            const res = await api.get('/candidates');
            let data = res.data;
            if (jobId) {
                // Assuming candidate has a forms/jobs array or singular relation. 
                // Since this is a demo, let's just assume we show all for now or 
                // implementation of candidate-job relation is TBD. 
                // Ideally: data = data.filter(c => c.jobId === jobId);
                console.log('Filtering for job:', jobId);
            }
            setCandidates(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Candidates Board</h1>
            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-4 min-w-max h-full pb-4">
                    {statusColumns.map((col) => {
                        const colCandidates = candidates.filter(c => c.status === col.id);
                        return (
                            <div key={col.id} className={`w-72 flex-shrink-0 flex flex-col rounded-lg border ${col.color}`}>
                                <div className="p-3 border-b border-gray-200/50 font-semibold flex justify-between">
                                    {col.label}
                                    <span className="bg-white/50 px-2 rounded-full text-xs flex items-center">{colCandidates.length}</span>
                                </div>
                                <div className="p-2 flex-1 overflow-y-auto space-y-2">
                                    {colCandidates.map(c => (
                                        <Link key={c._id} href={`/dashboard/candidates/${c._id}`}>
                                            <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white">
                                                <CardContent className="p-3">
                                                    <div className="font-medium">{c.firstName} {c.lastName}</div>
                                                    <div className="text-xs text-muted-foreground truncate">{c.email}</div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
