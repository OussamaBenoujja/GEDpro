'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

export function DocumentUpload({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [candidateId, setCandidateId] = useState('');
    const [candidates, setCandidates] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadCandidates();
        }
    }, [isOpen]);

    const loadCandidates = async () => {
        try {
            const response = await api.get('/candidates');
            setCandidates(response.data);
        } catch (error) {
            console.error('Failed to load candidates', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !candidateId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('candidateId', candidateId);

        try {
            await api.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsOpen(false);
            setFile(null);
            setCandidateId('');
            onUploadSuccess();
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
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
                <h2 className="text-xl font-bold mb-4">Upload Document</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Select Candidate</label>
                        <select
                            className="w-full border rounded-md p-2 text-sm"
                            value={candidateId}
                            onChange={(e) => setCandidateId(e.target.value)}
                        >
                            <option value="">-- Select Candidate --</option>
                            {candidates.map(c => (
                                <option key={c._id} value={c._id}>
                                    {c.firstName} {c.lastName} ({c.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">File</label>
                        <Input type="file" onChange={handleFileChange} />
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={!file || !candidateId || uploading}
                        className="w-full"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
