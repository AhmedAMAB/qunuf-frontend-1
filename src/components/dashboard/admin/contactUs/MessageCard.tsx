'use client';

import { getInitials } from '@/utils/helpers';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { MdAttachEmail } from 'react-icons/md';

interface MessageCardProps {
    name: string;
    phone: string;
    email: string;
    message: string;
}

export function MessageCard({ name, phone, email, message }: MessageCardProps) {


    return (
        <div className="relative bg-card-bg rounded-[14px] p-4 w-full max-w-sm mx-auto flex flex-col items-center gap-4">
            <div className="flex-center absolute top-2 end-2 bg-light w-[44px] h-[44px] rounded-[12px]">
                <MdAttachEmail size={24} className="text-dark" />
            </div>

            {/* Initials */}
            <div className="bg-secondary rounded-[12px] w-[111px] h-[105px] flex items-center justify-center text-lighter text-4xl font-bold">
                {getInitials(name)}
            </div>
            <h3 className="text-dark font-semibold text-base text-center">{name}</h3>

            <div className="flex items-center gap-3 w-full">
                <div className="bg-secondary rounded-[12px] w-9 h-9 flex items-center justify-center text-white">
                    <FaPhone size={16} />
                </div>
                <span className="text-dark" dir="ltr">
                    {phone}
                </span>
            </div>

            <div className="flex items-center gap-3 w-full">
                <div className="bg-secondary rounded-[12px] w-9 h-9 flex items-center justify-center text-white">
                    <FaEnvelope size={16} />
                </div>
                <span className="text-dark">{email}</span>
            </div>

            <p className="text-gray-400 text-center text-[14px] leading-[20px] px-2">
                {message}
            </p>
        </div>
    );
}
