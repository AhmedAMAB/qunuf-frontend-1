'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TeamMemberCard } from './TeamMemberCard';
import Popup from '@/components/shared/Popup';
import SecondaryButton from '@/components/shared/buttons/SecondaryButton';
import TeamMemberForm from './TeamMemberForm';
import SectionHeading from '../../SectionHeading';

const mockedTeam = [
    {
        name: 'Layla Hassan',
        phone: '+44 7700 900123',
        email: 'layla.hassan@mail.com',
        imageUrl: '/users/user-1.jpg',
    },
    {
        name: 'Omar El-Sharif',
        phone: '+33 612 345 678',
        email: 'omar.elsharif@mail.com',
        imageUrl: '/users/user-2.jpg',
    },
    {
        name: 'Layla Hassan',
        phone: '+44 7700 900123',
        email: 'layla.hassan@mail.com',
        imageUrl: '/users/user-3.jpg',
    },
    {
        name: 'Omar El-Sharif',
        phone: '+33 612 345 678',
        email: 'omar.elsharif@mail.com',
        imageUrl: '/users/user-4.jpg',
    },
    {
        name: 'Layla Hassan',
        phone: '+44 7700 900123',
        email: 'layla.hassan@mail.com',
        imageUrl: '/users/user-5.jpg',
    },
    {
        name: 'Omar El-Sharif',
        phone: '+33 612 345 678',
        email: 'omar.elsharif@mail.com',
        imageUrl: '/users/user-2.jpg',
    },
];

export default function TeamGrid() {
    const t = useTranslations('dashboard.admin.team');
    const [showAdd, setShowAdd] = useState(false);


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <SectionHeading title={t('title')} />
                <SecondaryButton
                    onClick={() => setShowAdd(true)}
                    className="bg-secondary hover:bg-secondary-hover font-semibold text-lighter sm:!py-2"
                >
                    {t('add')}
                </SecondaryButton>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {mockedTeam.map((member, index) => (
                    <TeamMemberCard key={index} {...member} />
                ))}
            </div>


            {/* Add Member Popup */}
            <Popup show={showAdd} onClose={() => setShowAdd(false)} className='max-sm:!w-full' headerContent={<p className="text-[24px] font-bold text-dark">{t('add')}</p>}>
                <TeamMemberForm
                    onCancel={() => setShowAdd(false)}
                    onAction={(data) => {
                        console.log('Add:', data);
                        setShowAdd(false);
                    }}
                    cancelText={t('cancel')}
                    actionText={t('addAction')}
                />
            </Popup>

        </div>
    );
}
