'use client'

import ActionPopup from "@/components/shared/ActionPopup";
import DataView from "@/components/shared/DateViewTable/DataView";
import { MenuActionItem } from "@/components/shared/DateViewTable/MenuActionList";
import { useTenantContracts } from "@/hooks/dashboard/tenant/useTenantContracts";
import { TenantContractRow } from "@/types/dashboard/tenant";
import { FaFileExcel, FaHome, FaRegNewspaper } from "react-icons/fa";
import { RiIndeterminateCircleLine } from "react-icons/ri";
import { TbContract } from "react-icons/tb";
import { TenantContractColumns } from '@/constants/dashboard/tenant/tenantContracts'
import { useTranslations } from "next-intl";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { BiBuilding } from "react-icons/bi";
import { getDashboardHref } from "@/utils/dashboardPaths";
import { useAuth } from "@/contexts/AuthContext";

export default function ContractDataView() {
    const t = useTranslations('dashboard.contracts.table');
    const { getRows } = useTenantContracts();
    const { role } = useAuth();

    return (
        <DataView<TenantContractRow>
            columns={TenantContractColumns(t)}
            getRows={getRows}
            showActions={true}
            actionsMenuItems={(row: TenantContractRow): MenuActionItem[] =>
                [
                    role === 'tenant' && {
                        label: t('renewContract'),
                        Icon: TbContract,
                        Child: RenewContract,
                    },
                    role === 'landlord' && {
                        label: t('deleteContract'),
                        Icon: MdDelete,
                        Child: DeleteContractPopup,
                    },
                    role === 'landlord' && {
                        label: t('editContract'),
                        Icon: MdModeEdit,
                        link: '/'
                    },
                    {
                        label: t('terminateContract'),
                        Icon: RiIndeterminateCircleLine,
                        Child: TerminateContractPopup,
                    },
                ].filter(Boolean) as MenuActionItem[]
            }
            actionButton={
                {
                    show: role === 'landlord',
                    label: t('addProperty'),
                    MobileIcon: BiBuilding,
                    href: getDashboardHref('addProperty')
                }
            }
            pageSize={10}
        />
    );
}


function RenewContract({ onClose }: { onClose: () => void }) {
    const t = useTranslations('dashboard.contracts');

    return (
        <ActionPopup
            title={t('renew.title')}
            subtitle={t('renew.subtitle')}
            MainIcon={FaRegNewspaper}
            cancelText={t('cancel')}
            actionText={t('renew.actionText')}
            onCancel={onClose}
            onAction={() => onClose()}
        />
    );
}

function TerminateContractPopup({ onClose }: { onClose: () => void }) {
    const t = useTranslations('dashboard.contracts');

    return (
        <ActionPopup
            title={t('terminate.title')}
            subtitle={t('terminate.subtitle')}
            MainIcon={FaFileExcel}
            mainIconColor="#FD5257"
            note={t('terminate.note')}
            cancelText={t('cancel')}
            actionText={t('terminate.actionText')}
            onCancel={onClose}
            onAction={() => onClose()}
        />
    );
}


function DeleteContractPopup({ onClose }: { onClose: () => void }) {
    const t = useTranslations('dashboard.contracts');

    return (
        <ActionPopup
            title={t('delete.title')}
            subtitle={t('delete.subtitle')}
            MainIcon={FaHome}
            mainIconColor="#FD5257"
            cancelText={t('cancel')}
            actionText={t('delete.actionText')}
            onCancel={onClose}
            onAction={() => onClose()}
        />
    );
}
