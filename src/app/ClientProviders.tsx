"use client";
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import AOSInitializer from "@/config/AOSInitializer";
import { ProgressProvider } from "@bprogress/next/app";
import { useEffect } from 'react';
import { useAuthInterceptor } from "@/hooks/useAuthInterceptor"
import { AuthProvider } from '@/contexts/AuthContext';
export default function ClientProviders({ children }: { children: React.ReactNode }) {
    // Enforce toast limit
    const { toasts } = useToasterStore()
    const TOAST_LIMIT = 5

    useEffect(() => {
        toasts
            .filter(t => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
            .forEach(t => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) removal without animation
    }, [toasts])

    return (
        <AuthProvider>
            <AuthInterceptorWrapper>
                <ProgressProvider
                    height="2px"
                    color="#0070f3"
                    options={{ showSpinner: false }}
                    shallowRouting
                >
                    <AOSInitializer />
                    <Toaster position='top-center' />
                    {children}
                </ProgressProvider>
            </AuthInterceptorWrapper>
        </AuthProvider>
    );
}


function AuthInterceptorWrapper({ children }: { children: React.ReactNode }) {
    useAuthInterceptor(); // ✅ now inside AuthProvider
    return children;
}