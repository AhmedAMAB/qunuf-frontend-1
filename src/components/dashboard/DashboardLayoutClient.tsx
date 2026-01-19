'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar, { MobileSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-dashboard-bg">
            {/* Desktop Sidebar - Compact 80px */}
            <aside className="hidden lg:block w-[90px] h-full shrink-0 bg-sidebar z-30 relative border-r border-gray/10 shadow-sm">
                <DashboardSidebar />
            </aside>

            {/* Mobile Sidebar */}
            <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto thin-scrollbar">
                    <div className=" p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}