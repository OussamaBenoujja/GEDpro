'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            // Expecting { access_token, user } from backend based on likely NestJS passport practice
            // But checking auth controller earlier:
            // return this.authService.login(user);
            // Usually NestJS JWT login returns { access_token: ... }
            // The user data might need to be decoded or fetched separately if not returned.
            // Let's assume for now it returns standard JWT object.
            // I'll need to fetch user profile if it's not in the response.

            const { access_token } = response.data;

            // If user info is not in login response, we might need another call.
            // But typically we can decode it or get it. 
            // Let's try to fetch user profile immediately or use a mock user if backend doesn't return it.
            // However, given the project context, I'll try to fetch profile or decode.
            // For now, let's just use the token and basic info if available.

            // If the backend returns user object:
            const userData = response.data.user || { email, userId: 'unknown', role: 'unknown' };

            login(access_token, userData);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Login to HR DMS</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Password</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                        <div className="text-center text-sm">
                            Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
