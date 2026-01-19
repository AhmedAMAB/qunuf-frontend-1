'use client';

import { useState } from 'react';
import PropertiesForm from "@/components/dashboard/Properties/PropertiesForm";
import { useAuth } from '@/contexts/AuthContext';
import Step1 from '@/components/pages/booking/Step1';

export default function AddPage() {
    const { user } = useAuth();

    // Check if all required fields exist
    const isProfileComplete = !!(
        user?.phoneNumber &&
        user?.nationalityId &&
        user?.identityNumber &&
        user?.birthDate &&
        user?.shortAddress
    );

    const [profileCompleted, setProfileCompleted] = useState(isProfileComplete);

    if (!profileCompleted) {
        return (
            <Step1 nextStep={() => setProfileCompleted(true)} />
        );
    }

    return (
        <div>
            <PropertiesForm />
        </div>
    );
}