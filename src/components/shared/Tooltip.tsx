import { DropMenuPosition, getDropMenuPosition } from '@/utils/helpers';
import React, { ReactNode } from 'react';


interface TooltipProps {
    children: ReactNode;
    content: string;
    position?: DropMenuPosition;
}

export default function Tooltip({
    children,
    content,
    position = 'top-right',
}: TooltipProps) {
    const className = getDropMenuPosition(position);

    return (
        <div className="relative group inline-block">
            {children}
            <div
                className={`absolute ${className} w-max max-w-xs px-2 py-1 rounded text-sm z-[40]
          bg-[var(--primary)] text-[var(--highlight)] shadow-lg opacity-0 group-hover:opacity-100
          transition-opacity duration-200 pointer-events-none`}
            >
                {content}
            </div>
        </div>
    );
}
