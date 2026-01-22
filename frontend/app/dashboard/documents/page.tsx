'use client';

import { DocumentList } from '@/components/DocumentList';
import { DocumentUpload } from '@/components/DocumentUpload';
import { useState } from 'react';

export default function DocumentsPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
                <DocumentUpload onUploadSuccess={handleUploadSuccess} />
            </div>

            <DocumentList key={refreshKey} />
        </div>
    );
}
