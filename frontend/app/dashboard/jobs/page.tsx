'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Plus, Briefcase, Calendar, MoreVertical, Trash, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Job {
    _id: string;
    title: string;
    description: string;
    type: string;
    isPublished: boolean;
    createdAt: string;
}

export default function JobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newJobTitle, setNewJobTitle] = useState('');
    const [newJobDescription, setNewJobDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch all forms, backend filters by orgId usually. 
                // We will client-side filter for 'RECRUITMENT' type if needed, 
                // or just show all for now as the backend controller is generic 'Forms'.
                const res = await api.get('/forms');
                // Optional: Filter for recruitment type if specific
                const recruitmentForms = res.data.filter((f: any) => f.type === 'RECRUITMENT' || f.type === 'OTHER' || !f.type);
                setJobs(recruitmentForms);
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchJobs();
        }
    }, [user]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post('/forms', {
                title: newJobTitle,
                description: newJobDescription,
                type: 'RECRUITMENT',
                // Add default fields for a job application
                fields: [
                    { label: 'Full Name', type: 'TEXT', required: true },
                    { label: 'Email Address', type: 'EMAIL', required: true },
                    { label: 'Phone Number', type: 'TEXT', required: false },
                    { label: 'Resume/CV', type: 'FILE', required: true },
                    { label: 'Cover Letter', type: 'TEXT', required: false }
                ]
            });
            setJobs([res.data, ...jobs]);
            setIsCreateOpen(false);
            setNewJobTitle('');
            setNewJobDescription('');
        } catch (error) {
            console.error('Failed to create job', error);
            alert('Failed to create job. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job posting?')) return;
        try {
            await api.delete(`/forms/${id}`);
            setJobs(jobs.filter(job => job._id !== id));
        } catch (error) {
            console.error('Failed to delete job', error);
        }
    };

    if (isLoading) {
        return <div>Loading jobs...</div>;
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Jobs & Vacancies</h1>
                    <p className="text-gray-500">Manage your open positions and recruitment forms.</p>
                </div>
                {/* Future: Link to Create Job page */}
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Job
                </Button>
            </div>

            {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="rounded-full bg-blue-50 p-4 mb-4">
                        <Briefcase className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold">No jobs posted yet</h3>
                    <p className="text-gray-500 max-w-sm mt-2 mb-6">
                        Create your first job vacancy to start accepting applications.
                    </p>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Job
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div key={job._id} className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => handleDelete(job._id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{job.description || 'No description provided.'}</p>

                            <div className="flex items-center text-xs text-gray-400 mb-4 gap-4">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                                <div className={`px-2 py-0.5 rounded-full ${job.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {job.isPublished ? 'Published' : 'Draft'}
                                </div>
                            </div>

                            <Link href={`/dashboard/candidates?jobId=${job._id}`} className="w-full">
                                <Button variant="outline" className="w-full text-sm">
                                    View Applications
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            {/* Simple Modal Overlay */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold mb-4">Create New Job Vacancy</h2>
                        <form onSubmit={handleCreate}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="e.g. Senior Frontend Developer"
                                        value={newJobTitle}
                                        onChange={(e) => setNewJobTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        required
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                                        placeholder="Brief description of the role..."
                                        value={newJobDescription}
                                        onChange={(e) => setNewJobDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Job'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
