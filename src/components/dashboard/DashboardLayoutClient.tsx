'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import Sidebar from '@/components/shared/Sidebar';
import Logo from '../shared/Logo';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className='relative bg-dashboard-bg  h-full'>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} title={<Logo small />} className='lg:w-[140px] absolute top-0 start-0 bottom-0'>
                <DashboardSidebar />
            </Sidebar>
            <div className="dashboard-layout h-full min-h-screen">
                <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />
                <main className="p-2 ">
                    {children}
                </main>
            </div>
        </div>
    );
}

//