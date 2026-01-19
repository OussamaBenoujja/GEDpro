'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

enum FieldType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    EMAIL = 'EMAIL',
    FILE = 'FILE',
    DATE = 'DATE',
}

interface FormField {
    label: string;
    type: FieldType;
    required: boolean;
}

export default function CreateFormPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('RECRUITMENT');
    const [fields, setFields] = useState<FormField[]>([
        { label: 'First Name', type: FieldType.TEXT, required: true },
        { label: 'Last Name', type: FieldType.TEXT, required: true },
        { label: 'Email', type: FieldType.EMAIL, required: true },
        { label: 'CV', type: FieldType.FILE, required: true },
    ]);
    const router = useRouter();

    const addField = () => {
        setFields([...fields, { label: 'New Field', type: FieldType.TEXT, required: false }]);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const updateField = (index: number, key: keyof FormField, value: any) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], [key]: value };
        setFields(newFields);
    };

    const handleSave = async (publish: boolean) => {
        try {
            await api.post('/forms', {
                title,
                description,
                type,
                fields,
                isPublished: publish
            });
            router.push('/dashboard/forms');
        } catch (error) {
            console.error('Failed to create form', error);
            alert('Failed to create form');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <h1 className="text-3xl font-bold">Create New Form</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Form Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Job description..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <select
                                className="w-full border rounded-md p-2"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="RECRUITMENT">Recruitment</option>
                                <option value="ONBOARDING">Onboarding</option>
                                <option value="EVALUATION">Evaluation</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Fields</CardTitle>
                            <Button onClick={addField} variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" /> Add Field
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, idx) => (
                            <div key={idx} className="flex gap-4 items-start p-4 border rounded-md bg-gray-50">
                                <div className="flex-1 space-y-2">
                                    <Input
                                        value={field.label}
                                        onChange={(e) => updateField(idx, 'label', e.target.value)}
                                        placeholder="Label"
                                    />
                                    <div className="flex gap-4">
                                        <select
                                            className="border rounded p-1 text-sm flex-1"
                                            value={field.type}
                                            onChange={(e) => updateField(idx, 'type', e.target.value)}
                                        >
                                            {Object.values(FieldType).map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={(e) => updateField(idx, 'required', e.target.checked)}
                                            />
                                            <span className="text-sm">Required</span>
                                        </div>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeField(idx)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => handleSave(false)}>Save Draft</Button>
                    <Button onClick={() => handleSave(true)}>Publish</Button>
                </div>
            </div>
        </div>
    );
}
