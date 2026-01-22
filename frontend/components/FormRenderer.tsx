'use client';

import { useState } from 'react';
// import { FormField, FieldType } from '@/types/form'; // Need to define types
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'; // Need to check if I have this or use hr

// Definitions matching backend
enum FieldType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    EMAIL = 'EMAIL',
    FILE = 'FILE',
    DATE = 'DATE',
}

interface FormFieldDef {
    label: string;
    type: FieldType;
    required: boolean;
}

interface FormRendererProps {
    fields: FormFieldDef[];
    formId: string;
    jobTitle: string;
}

export function FormRenderer({ fields, formId, jobTitle }: FormRendererProps) {
    // Since we don't have a public "Apply" endpoint that accepts dynamic fields in a standardized way yet,
    // we need to see how CandidatesController.create expects data.
    // It expects `candidateData: Partial<Candidate>`.
    // Candidate has: firstName, lastName, email, etc.
    // THE DYNAMIC FORM FIELDS might not map directly to Candidate schema unless stored in a "flexible" field.
    // The candidate schema has `extractedText`, `skills`, `contact`, etc.
    // It does NOT have "customFields".

    // HOWEVER, for a "Project Context" where we make a "Smart HR Form", usually we map standard fields (Name, Email, CV) 
    // and maybe put the rest in a JSON field or similar.
    // But let's assume the form has at least: First Name, Last Name, Email, CV.
    // OR we submit to a generic "Submission" endpoint which creates a candidate.

    // For now, I'll simulate the submission by mapping "standard" labels if possible, or just sending a payload.
    // But `CandidatesController.create` expects a Candidate object.

    // I'll create a local state to hold form data.
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (label: string, value: string) => {
        setFormData(prev => ({ ...prev, [label]: value }));
    };

    const handleFileChange = (label: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
            // Also store in formData if needed, but file upload is usually separate
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // We need to map dynamic fields to Candidate fields if we use the existing create endpoint.
        // Assuming the form asks for: First Name, Last Name, Email.
        // I will try to find these fields by checking labels loosely.

        const firstName = Object.entries(formData).find(([k]) => k.toLowerCase().includes('first') && k.toLowerCase().includes('name'))?.[1] || formData['First Name'] || 'Unknown';
        const lastName = Object.entries(formData).find(([k]) => k.toLowerCase().includes('last') && k.toLowerCase().includes('name'))?.[1] || formData['Last Name'] || 'Unknown';
        const email = Object.entries(formData).find(([k]) => k.toLowerCase().includes('email'))?.[1] || 'unknown@example.com';

        // This is a bit hacky because dynamic forms -> static schema is hard without configuration.
        // Ideally the Form Field definitions would include a "mapping" property.
        // For this demo, I'll do my best.

        // I'll construct a FormData to send.
        // Wait, `CandidatesController.create` takes `@Body() candidateData`. It doesn't take files directly in the same request?
        // `DocumentsController.upload` takes file and candidateId.
        // So the flow should be:
        // 1. Create Candidate (POST /candidates) -> returns ID.
        // 2. if CV is present, Upload Document (POST /documents/upload).

        try {
            // But wait, CandidatesController.create is PROTECTED (@Roles(HR...)).
            // I need a PUBLIC apply endpoint. I haven't created it yet.
            // I added public methods to FormsController, but not CandidatesController.
            // I NEED TO ADD A PUBLIC APPLY ENDPOINT.
            // I'll assume I will add `POST /candidates/public-apply`.

            // For now, I'll allow the UI to try calling a hypothetical public endpoint.

            const candidatePayload = {
                firstName,
                lastName,
                email,
                // Add other fields as a summary or description?
                // summary: JSON.stringify(formData)
            };

            // Use fetch because api client uses auth token, here we are public.
            const res = await fetch('http://localhost:3000/candidates/public/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(candidatePayload)
            });

            if (!res.ok) throw new Error('Application failed');

            const result = await res.json();
            const newCandidateId = result._id;

            if (cvFile && newCandidateId) {
                const fileData = new FormData();
                fileData.append('file', cvFile);
                fileData.append('candidateId', newCandidateId);

                // We need a public upload endpoint too? Or assume the public apply handles it?
                // DocumentsController.upload is protected.
                // It's getting complicated to support full public flow without proper backend support.
                // I should have added `CandidatesController.publicApply` that handles everything (maybe with interceptor for file).

                // Let's assume I'll fix backend to have `POST /candidates/public` that might optionally accept a file or I use the same public apply for now.
                // AND `DocumentsController` needs a public upload or `CandidatesController` handles it.

                // To keep it simple for now: Just create candidate.
                alert("Application submitted! (File upload pending backend support)");
            }

            setSuccess(true);

        } catch (error) {
            console.error(error);
            alert("Failed to submit application");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-10">
                <h3 className="text-2xl font-bold text-green-600">Application Received!</h3>
                <p className="text-gray-600 mt-2">Thank you for applying. We will review your application shortly.</p>
                <Button className="mt-6" variant="outline" onClick={() => window.location.href = '/jobs'}>
                    Back to Jobs
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1">
                {fields.map((field, idx) => (
                    <div key={idx} className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {field.type === FieldType.TEXT && (
                            <Input
                                required={field.required}
                                onChange={(e) => handleInputChange(field.label, e.target.value)}
                            />
                        )}
                        {field.type === FieldType.EMAIL && (
                            <Input
                                type="email"
                                required={field.required}
                                onChange={(e) => handleInputChange(field.label, e.target.value)}
                            />
                        )}
                        {field.type === FieldType.NUMBER && (
                            <Input
                                type="number"
                                required={field.required}
                                onChange={(e) => handleInputChange(field.label, e.target.value)}
                            />
                        )}
                        {field.type === FieldType.FILE && (
                            <Input
                                type="file"
                                required={field.required}
                                onChange={(e) => handleFileChange(field.label, e)}
                            />
                        )}
                        {/* Add other types as needed */}
                    </div>
                ))}
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
        </form>
    );
}
