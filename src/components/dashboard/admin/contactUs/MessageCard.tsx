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

            <div className="w-full space-y-3">
                {/* Clickable Phone */}
                <a
                    href={`tel:${phone}`}
                    className="group/contact flex items-center gap-3 w-full cursor-pointer transition-all duration-200 hover:translate-x-1"
                >
                    <div className="relative shrink-0">
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-secondary/40 rounded-[12px] blur-md opacity-0 group-hover/contact:opacity-100 transition-opacity duration-300" />
                        <div className="relative bg-secondary rounded-[12px] w-9 h-9 flex items-center justify-center text-white shadow-sm group-hover/contact:shadow-secondary/20 transition-all duration-300">
                            <FaPhone size={14} className="group-hover/contact:scale-110 transition-transform" />
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-dark font-medium group-hover/contact:text-secondary transition-colors duration-200 truncate" dir="ltr">
                            {phone}
                        </span>
                        <span className="text-[10px] text-dark/40 opacity-0 group-hover/contact:opacity-100 transition-opacity duration-200">
                            Click to call
                        </span>
                    </div>
                </a>

                {/* Clickable Email */}
                <a
                    href={`mailto:${email}`}
                    className="group/contact flex items-center gap-3 w-full cursor-pointer transition-all duration-200 hover:translate-x-1"
                >
                    <div className="relative shrink-0">
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-secondary/40 rounded-[12px] blur-md opacity-0 group-hover/contact:opacity-100 transition-opacity duration-300" />
                        <div className="relative bg-secondary rounded-[12px] w-9 h-9 flex items-center justify-center text-white shadow-sm group-hover/contact:shadow-secondary/20 transition-all duration-300">
                            <FaEnvelope size={14} className="group-hover/contact:scale-110 transition-transform" />
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-dark font-medium group-hover/contact:text-secondary transition-colors duration-200 truncate">
                            {email}
                        </span>
                        <span className="text-[10px] text-dark/40 opacity-0 group-hover/contact:opacity-100 transition-opacity duration-200">
                            Click to send email
                        </span>
                    </div>
                </a>
            </div>

            <p className="text-gray-400 text-center text-[14px] leading-[20px] px-2">
                {message}
            </p>
        </div>
    );
}
