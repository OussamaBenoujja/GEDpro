'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Calendar } from 'lucide-react';

export function InterviewScheduler({ onSuccess }: { onSuccess: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: 'Technical Interview',
        candidateId: '',
        date: '',
        startTime: '10:00',
        duration: '60' // minutes
    });

    useEffect(() => {
        if (isOpen) {
            loadCandidates();
        }
    }, [isOpen]);

    const loadCandidates = async () => {
        try {
            const res = await api.get('/candidates');
            setCandidates(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Construct start and end time
            const start = new Date(`${formData.date}T${formData.startTime}`);
            const end = new Date(start.getTime() + parseInt(formData.duration) * 60000);

            await api.post('/interviews', {
                title: formData.title,
                candidateId: formData.candidateId,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                participants: [] // Optional
            });

            setIsOpen(false);
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to schedule interview');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Interview
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg relative">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-4 w-4" />
                </button>
                <h2 className="text-xl font-bold mb-4">Schedule Interview</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Candidate</label>
                        <select
                            className="w-full border rounded-md p-2 text-sm"
                            value={formData.candidateId}
                            onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                        >
                            <option value="">-- Select Candidate --</option>
                            {candidates.map(c => (
                                <option key={c._id} value={c._id}>
                                    {c.firstName} {c.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Time</label>
                            <Input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                        <select
                            className="w-full border rounded-md p-2"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        >
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                        </select>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!formData.candidateId || !formData.date || loading}
                        className="w-full"
                    >
                        {loading ? 'Scheduling...' : 'Schedule'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
