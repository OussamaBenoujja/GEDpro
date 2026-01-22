'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash } from 'lucide-react';

interface Form {
    _id: string;
    title: string;
    isPublished: boolean;
    type: string;
    fields: any[];
}

export default function FormsManagementPage() {
    const [forms, setForms] = useState<Form[]>([]);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const res = await api.get('/forms');
            setForms(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/forms/${id}`);
            fetchForms();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Form Management</h1>
                <Button asChild>
                    <Link href="/dashboard/forms/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Form
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {forms.map(form => (
                    <Card key={form._id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-center">
                                <span className="truncate">{form.title}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${form.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {form.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-gray-500 mb-4">
                                Type: {form.type} • Fields: {form.fields.length}
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon" asChild>
                                    <Link href={`/jobs/${form._id}`} target="_blank">
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => handleDelete(form._id)}>
                                    <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
