import { MdSearchOff, MdLockOutline, MdErrorOutline, MdCloudOff } from 'react-icons/md';
import React, { JSX } from 'react';
import { useTranslations } from 'next-intl';

type ErrorType = 'not-found' | 'unauthorized' | 'bad-request' | 'service-error';

interface ErrorCardProps {
    type?: ErrorType;
    title?: string;
    buttonText?: string;
    message: string;
    onAction: () => void;
}

const iconMap: Record<ErrorType, JSX.Element> = {
    'not-found': <MdSearchOff className="text-5xl text-red-600" />,
    'unauthorized': <MdLockOutline className="text-5xl text-red-600" />,
    'bad-request': <MdErrorOutline className="text-5xl text-red-600" />,
    'service-error': <MdCloudOff className="text-5xl text-red-600" />,
};
export const ErrorCard: React.FC<ErrorCardProps> = ({
    type = 'bad-request',
    title,
    message,
    buttonText,
    onAction,
}) => {
    const tComman = useTranslations('comman');

    return (
        <div className="w-full bg-[#FFD8DE] h-[calc(100vh-114px)] sm:h-[calc(100vh-122px)] md:h-[calc(100vh-128px)] flex items-center justify-center rounded-xl">
            <div className="w-full max-w-md flex flex-col items-center gap-4 shadow-lg bg-white rounded-2xl p-8">
                <div className=" text-red-600">{iconMap[type]}</div>
                <h2 className="text-2xl font-bold text-[#B8323C]">
                    {title || tComman('errorTitle')}
                </h2>
                <p className="text-base text-red-800 text-center">{message}</p>
                <button
                    onClick={onAction}
                    className="mt-2 px-6 py-2 bg-[#B8323C] text-white rounded hover:bg-red-700 transition"
                >
                    {buttonText || tComman('retry')}
                </button>
            </div>
        </div>
    );
};
