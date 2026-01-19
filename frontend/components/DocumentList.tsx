'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, Search } from 'lucide-react';

interface DocMetadata {
    _id: string;
    filename: string;
    mimetype: string;
    size: number;
    extractedText?: string;
    skills?: string[];
    createdAt: string;
}

export function DocumentList() {
    const [documents, setDocuments] = useState<DocMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error('Failed to fetch documents', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.filename.toLowerCase().includes(search.toLowerCase()) ||
        doc.skills?.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
    );

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Documents</CardTitle>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Search documents..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button type="submit" size="icon" variant="ghost">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div>Loading documents...</div>
                ) : filteredDocs.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">No documents found.</div>
                ) : (
                    <div className="space-y-4">
                        {filteredDocs.map((doc) => (
                            <div key={doc._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{doc.filename}</p>
                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                            <span>{formatSize(doc.size)}</span>
                                            <span>•</span>
                                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                            {doc.skills && doc.skills.length > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-blue-600">{doc.skills.slice(0, 3).join(', ')}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" asChild>
                                    {/* Assuming backend serves files or has a download link. 
                        The controller has findOne returning metadata. 
                        We might need a download endpoint or use the path if public?
                        Usually findOne just returns info. 
                        Needs investigation on download. 
                        For now, just a button.
                    */}
                                    <a href={`http://localhost:3000/uploads/${doc.filename}`} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
