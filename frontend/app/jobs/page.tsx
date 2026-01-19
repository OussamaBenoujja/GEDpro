import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from 'lucide-react'; // Wait, Badge is typically a component, not lucide icon. I'll make a Badge component or just use span.

// Simple Badge component
function JobBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
            {children}
        </span>
    );
}

interface Form {
    _id: string;
    title: string;
    description: string;
    type: string;
    createdAt: string;
}

async function getJobs() {
    // Ensure we handle the fetch failure gracefully
    try {
        const res = await fetch('http://localhost:3000/forms/public', {
            cache: 'no-store', // Dynamic data
            next: { revalidate: 0 }
        });
        if (!res.ok) {
            throw new Error('Failed to fetch jobs');
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }
}

export default async function JobsPage() {
    const jobs: Form[] = await getJobs();

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
                {/* Decorative background effects */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&blend-mode=multiply')] bg-cover bg-center opacity-20" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Join Our Team
                    </h1>
                    <p className="text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                        We are looking for talented individuals to help us build the future.
                        Browse our open positions and apply today.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
                {jobs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No open positions at the moment. Please check back later.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <Card key={job._id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-blue-500">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <JobBadge>{job.type}</JobBadge>
                                        <span className="text-xs text-muted-foreground">{new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <CardTitle className="text-xl">{job.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-muted-foreground line-clamp-3 text-sm">
                                        {job.description || "No description available."}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full bg-slate-900 hover:bg-slate-800">
                                        <Link href={`/jobs/${job._id}`}>
                                            View Details & Apply
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
