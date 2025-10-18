'use client'
import ActionPopup from "@/components/shared/ActionPopup";
import DataView from "@/components/shared/DateViewTable/DataView";
import { MenuActionItem } from "@/components/shared/DateViewTable/MenuActionList";
import { useTenantContracts } from "@/hooks/dashboard/tenant/useTenantContracts";
import { TenantContractRow } from "@/types/dashboard/tenant";
import { FaFileExcel, FaRegNewspaper } from "react-icons/fa";
import { RiIndeterminateCircleLine } from "react-icons/ri";
import { TbContract } from "react-icons/tb";
import { TenantContractColumns } from '@/constants/dashboard/tenant/tenantContracts'
import { useTranslations } from "next-intl";

export default function TenantContractDataView() {
    const t = useTranslations('dashboard.contracts.table');
    const { getRows } = useTenantContracts();

    return (
        <DataView<TenantContractRow>
            columns={TenantContractColumns(t)}
            getRows={getRows}
            showActions={true}
            actionsMenuItems={(row: TenantContractRow): MenuActionItem[] => [
                {
                    label: t('renewContract'),
                    Icon: TbContract,
                    Child: RenewContract
                },
                {
                    label: t('terminateContract'),
                    Icon: RiIndeterminateCircleLine,
                    Child: TerminateContractPopup
                }
            ]}
            pageSize={10}
        />
    );
}


function RenewContract({ onClose }: { onClose: () => void }) {
    const t = useTranslations('dashboard.contracts');

    return (
        <ActionPopup
            title={t('renewTitle')}
            subtitle={t('renewSubtitle')}
            MainIcon={FaRegNewspaper}
            cancelText={t('cancel')}
            actionText={t('renew')}
            onCancel={onClose}
            onAction={() => onClose()}
        />
    );
}

function TerminateContractPopup({ onClose }: { onClose: () => void }) {
    const t = useTranslations('dashboard.contracts');

    return (
        <ActionPopup
            title={t('terminateTitle')}
            subtitle={t('terminateSubtitle')}
            MainIcon={FaFileExcel}
            mainIconColor="#FD5257"
            note={t('terminateNote')}
            cancelText={t('cancel')}
            actionText={t('terminate')}
            onCancel={onClose}
            onAction={() => onClose()}
        />
    );
}
