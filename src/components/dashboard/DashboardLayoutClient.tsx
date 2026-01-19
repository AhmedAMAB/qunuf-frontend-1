'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import Sidebar from '@/components/shared/Sidebar';
import Logo from '../shared/Logo';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className='flex h-screen overflow-hidden bg-dashboard-bg relative'>

            {/* Sidebar: Fixed position in the flex row */}
            <aside className="hidden lg:block w-[140px] h-full shrink-0 border-e border-gray/10 bg-white z-30 relative">
                <DashboardSidebar />
            </aside>
            {/* Mobile Sidebar (Kept as is for overlay logic) */}
            <div className="lg:hidden">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} title={<Logo small />}>
                    <DashboardSidebar />
                </Sidebar>
            </div>

            {/* Main Area: flex-1 takes remaining width, overflow-y-auto handles its own scroll */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto thin-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
