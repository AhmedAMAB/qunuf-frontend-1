'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FaUser } from 'react-icons/fa';
import { PiHouseLine } from 'react-icons/pi';
import RoleOption from './RoleOption';
import { UserRole } from '@/constants/user';
type RoleType = 'tenant' | 'landlord';

interface RoleSelectorProps {
    selectedRole: RoleType;
    setSelectedRole: (role: RoleType) => void;
}

export default function RoleSelector({ selectedRole, setSelectedRole }: RoleSelectorProps) {
    const t = useTranslations('auth.roleSelector');

    return (
        <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-center">
            <RoleOption
                title={t('tenant.title')}
                description={t('tenant.description')}
                selected={selectedRole === UserRole.TENANT}
                onClick={() => setSelectedRole(UserRole.TENANT)}
                icon={<FaUser size={24} />}
            />
            <RoleOption
                title={t('landlord.title')}
                description={t('landlord.description')}
                selected={selectedRole === UserRole.LANDLORD}
                onClick={() => setSelectedRole(UserRole.LANDLORD)}
                icon={<PiHouseLine size={26} />}
            />
        </div>
    );
}
