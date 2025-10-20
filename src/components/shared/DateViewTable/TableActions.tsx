import { actionButton } from "./FilterContainer";
import ExportExel from '../ExportExel';
import SecondaryButton from '../buttons/SecondaryButton';
import Tooltip from '../Tooltip';
import { Link } from "@/i18n/navigation";

export default function TableActions({ actionButton }: { actionButton: actionButton }) {
    const MobileIcon = actionButton.MobileIcon;

    return (
        <div className='flex gap-3 flex-row items-start'>
            <ExportExel />
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