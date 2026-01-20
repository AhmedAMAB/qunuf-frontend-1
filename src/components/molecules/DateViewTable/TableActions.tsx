import ExportExel from "@/components/atoms/ExportExel";
import { actionButton } from "./FilterContainer";

import { Link } from "@/i18n/navigation";
import SecondaryButton from "@/components/atoms/buttons/SecondaryButton";
import Tooltip from "@/components/atoms/Tooltip";

export default function TableActions({ hasRows, actionButton, onExport }: { hasRows?: boolean, actionButton: actionButton, onExport?: (limit: number) => Promise<void>; }) {
    const MobileIcon = actionButton.MobileIcon;

    return (
        <div className='flex gap-3 flex-row items-start'>
            <ExportExel hasRows={hasRows} onExport={onExport} />
            {actionButton.show && actionButton.href && actionButton.label && MobileIcon && (
                <div>
                    <SecondaryButton href={actionButton.href} className='max-md:hidden bg-primary hover:bg-primary-hover text-white max-lg:w-full'>
                        {actionButton.label}
                    </SecondaryButton>
                    <div className="block md:hidden">
                        <Tooltip content={actionButton.label}   >
                            <Link href={actionButton.href} className="block px-4 p-2 bg-primary hover:bg-primary-hover rounded-[8px]  border border-gray">
                                <MobileIcon size={24} className='shrink-0 text-white' />
                            </Link>
                        </Tooltip>
                    </div>
                </div>
            )}
        </div>
    );
}