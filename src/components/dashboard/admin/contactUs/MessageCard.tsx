'use client';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { MdAttachEmail } from 'react-icons/md';

interface MessageCardProps {
    userName: string;
    phone: string;
    email: string;
    description: string;
}

export function MessageCard({ userName, phone, email, description }: MessageCardProps) {
    const initials = userName
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="relative bg-lighter rounded-[14px] p-4 w-full max-w-sm mx-auto flex flex-col items-center gap-4">
            <div className='flex-center absolute top-2 end-2 bg-light w-[44px] h-[44px] rounded-[12px]' >
                <MdAttachEmail size={24} className='text-dark' />
            </div>
            {/* Initials Box */}
            <div className="bg-secondary rounded-[12px] w-[111px] h-[105px] flex items-center justify-center text-lighter text-4xl font-bold">
                {initials}
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 w-full">
                <div className="bg-secondary shrink-0 rounded-[12px] w-9 h-9 flex items-center justify-center text-white">
                    <FaPhone size={16} className='shrink-0' />
                </div>
                <span className="text-dark " dir='ltr'>{phone}</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 w-full">
                <div className="bg-secondary shrink-0 rounded-[12px] w-9 h-9 flex items-center justify-center text-white">
                    <FaEnvelope size={16} className='shrink-0' />
                </div>
                <span className="text-dark ">{email}</span>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-center text-[14px] leading-[20px] font-[Open_Sans] font-normal px-2">
                {description}
            </p>
        </div>
    );
}
