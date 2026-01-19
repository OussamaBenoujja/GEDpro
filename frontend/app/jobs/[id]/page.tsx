import { FormRenderer } from '@/components/FormRenderer';
import { notFound } from 'next/navigation';

async function getJob(id: string) {
    try {
        const res = await fetch(`http://localhost:3000/forms/public/${id}`, {
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export default async function JobPage({ params }: { params: { id: string } }) {
    const job = await getJob(params.id);

    if (!job) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{job.title}</h1>
                    <div className="mt-4 text-lg text-gray-500">
                        <p>{job.description}</p>
                    </div>
                </div>

                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6 border-b pb-2">Application Form</h3>
                        <FormRenderer fields={job.fields} formId={job._id} jobTitle={job.title} />
                    </div>
                </div>
            </div>
        </div>
    );
}
