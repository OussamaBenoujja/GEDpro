'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function CandidateDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [candidate, setCandidate] = useState<any>(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) loadCandidate();
    }, [id]);

    const loadCandidate = async () => {
        try {
            const res = await api.get(`/candidates/${id}`);
            setCandidate(res.data);
            setStatus(res.data.status);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusUpdate = async () => {
        setLoading(true);
        try {
            await api.patch(`/candidates/${id}/status`, { status });
            // Refresh
            loadCandidate();
            alert('Status updated');
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    if (!candidate) return <div>Loading...</div>;

    const statuses = ['NEW', 'PRE_SELECTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWING', 'ACCEPTED', 'REFUSED'];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">{candidate.firstName} {candidate.lastName}</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <p>{candidate.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Applied Date</label>
                            <p>{new Date(candidate.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Separator />
                        <div className="flex items-end gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <select
                                    className="w-full border rounded-md p-2"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <Button onClick={handleStatusUpdate} disabled={loading}>
                                <Save className="mr-2 h-4 w-4" /> Save
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">
                            (Documents should be fetched here based on candidateId.
                            Need to implement findAll with candidateId filter in DocumentsController or handle in frontend)
                        </p>
                        {/* 
                            For now, documents might not link properly unless I filter all documents by candidateId.
                            The backend document findAll only filters by Organization.
                            I can fetch all and filter client side for MVP or add query param.
                        */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
