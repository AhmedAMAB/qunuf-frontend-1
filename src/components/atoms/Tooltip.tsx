import { DropMenuPosition, getDropMenuPosition } from '@/utils/helpers';
import { createPortal } from 'react-dom';
import { useRef, useState, useEffect, ReactNode } from 'react';

interface TooltipProps {
    children: ReactNode;
    content: string;
    position?: DropMenuPosition;
}
export default function Tooltip({ children, content }: TooltipProps) {
    const [show, setShow] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, isRtl: false });
    const triggerRef = useRef<HTMLDivElement>(null);

    const updatePosition = () => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        const isRtl = document.documentElement.dir === 'rtl';

        setCoords({
            top: rect.top + rect.height / 2,
            // If RTL, position to the left of the icon. If LTR, position to the right.
            left: isRtl ? rect.left - 10 : rect.right + 10,
            isRtl
        });
    };

    return (
        <div
            ref={triggerRef}
            className="relative inline-block"
            onMouseEnter={() => { updatePosition(); setShow(true); }}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && createPortal(
                <div
                    style={{
                        top: coords.top,
                        left: coords.left,
                        transform: `translate(${coords.isRtl ? '-100%' : '0'}, -50%)`
                    }}
                    className="fixed w-max px-3 py-1.5 rounded-lg text-xs font-bold z-[9999]
                               bg-primary text-white shadow-2xl pointer-events-none 
                               whitespace-nowrap animate-in fade-in zoom-in duration-150"
                >
                    {content}

                    {/* Dynamic Arrow: Flips side based on RTL */}
                    <div className={`absolute top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent ${coords.isRtl
                        ? "right-[-4px] border-l-[6px] border-l-primary"
                        : "left-[-4px] border-r-[6px] border-r-primary"
                        }`} />
                </div>,
                document.body
            )}
        </div>
    );
}