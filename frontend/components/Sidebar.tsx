'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    FileText,
    Calendar,
    Settings,
    LogOut,
    Briefcase
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export function Sidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Candidates', href: '/dashboard/candidates', icon: Users },
        { name: 'Documents', href: '/dashboard/documents', icon: FileText },
        { name: 'Interviews', href: '/dashboard/interviews', icon: Calendar },
        { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
        // { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-gray-900 text-white">
            <div className="flex h-16 items-center px-6 font-bold text-xl border-b border-gray-800">
                HR DMS
            </div>
            <div className="flex-1 py-4 flex flex-col gap-2 px-3">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </div>
            <div className="border-t border-gray-800 p-4">
                <div className="mb-4 flex items-center gap-3 px-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                        {user?.email?.[0].toUpperCase() || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="truncate text-sm font-medium">{user?.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                    </div>
                </div>
                <Button
                    variant="destructive"
                    className="w-full justify-start gap-2"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
