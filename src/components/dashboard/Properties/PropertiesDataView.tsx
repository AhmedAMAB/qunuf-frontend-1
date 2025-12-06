'use client';

import { PropertyRow } from "@/types/dashboard/properties";
import { useTranslations } from 'next-intl';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { BiBuilding } from 'react-icons/bi';
import { getDashboardHref } from '@/utils/dashboardPaths';
import { PropertyColumns } from '@/constants/properties/constant';
import DataView from "@/components/shared/DateViewTable/DataView";
import { MenuActionItem } from "@/components/shared/DateViewTable/MenuActionList";
import ActionPopup from "@/components/shared/ActionPopup";
import { FaHome } from "react-icons/fa";
import { useProperties } from "@/hooks/properties/useProperties";
import { useAuth } from "@/contexts/AuthContext";

export default function PropertiesDataView() {
    const t = useTranslations('dashboard.properties.table');
    const { getRows } = useProperties();
    const { role } = useAuth();
    return (
        <DataView<PropertyRow>
            columns={PropertyColumns(t)}
            getRows={getRows}
            showActions={true}
            actionsMenuItems={(row: PropertyRow): MenuActionItem[] => [
                {
                    label: t('deleteProperty'),
                    Icon: MdDelete,
                    Child: DeletePropertyPopup,
                },
                {
                    label: t('editProperty'),
                    Icon: MdModeEdit,
                    link: `/dashboard/${role}/properties/${row.id}/edit`,
                },
            ]}
            actionButton={{
                show: true,
                label: t('addProperty'),
                MobileIcon: BiBuilding,
                href: getDashboardHref('addProperty'),
            }}
            pageSize={10}
        />
    );
}



function DeletePropertyPopup({ onClose }: { onClose: () => void }) {
    const t = useTranslations('dashboard.properties');

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