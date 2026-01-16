import { PropertyCell } from "@/components/shared/properties/PropertyCell";
import { UserCell } from "@/components/shared/properties/UserCell";
import { UserRole } from "@/constants/user";
import { Contract, ContractStatus } from "@/types/dashboard/contract";
import { TableColumnType } from "@/types/table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ContractPdfViewer from "@/components/dashboard/Contracts/ContractPdfViewer";

export const ContractColumns = (t: ReturnType<typeof useTranslations>, role: UserRole): TableColumnType<Contract>[] => [
    {
        key: 'propertySnapshot',
        label: t('columns.property'),
        cell(value, row) {
            return <PropertyCell property={{ ...row.property, name: value.name }} />;
        },
        sortKey: 'propertyName'
    },
    {
        key: 'status',
        label: t('columns.status'),
        cell(value) {
            const status = value as ContractStatus;
            const statusMap: Record<ContractStatus, { bg: string; text: string; dot: string }> = {
                draft: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-600' },
                pending_tenant_acceptance: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-600' },
                pending_landlord_acceptance: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-600' },
                pending_signature: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-600' },
                active: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-600' },
                expired: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-600' },
                cancelled: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-600' },
                terminated: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-600' },
                pending_termination: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-600' },
            };

            const s = statusMap[status] ?? statusMap.draft;

            return (
                <div className={`${s.bg} ${s.text} flex items-center gap-1.5 rounded-full w-fit px-3 py-0.5 text-xs font-medium border-[1px] border-current/10`}>
                    <div className={`w-1.5 h-1.5 ${s.dot} rounded-full`} />
                    <span>{t(`statusOptions.${status}`)}</span>
                </div>
            );
        },
    },
    {
        key: 'contractNumber',
        label: t('columns.contractNumber'),
        cell: (value) => value ? <span className="text-gray-700 font-mono">{value as string}</span> : <span className="text-gray-400">—</span>,
    },
    {
        key: 'tenantSnapshot',
        label: t('columns.tenant'),
        cell(value, row: Contract) {
            return (
                <UserCell
                    user={{ ...row.tenant, name: value.name }}
                    role={role as UserRole}
                />
            );
        },
        sortKey: 'tenantName'
    },
    {
        key: 'landlordSnapshot',
        label: t('columns.landlord'),
        cell(value, row: Contract) {
            return (
                <UserCell
                    user={{ ...row.landlord, name: value.name }}
                    role={role as UserRole}
                />
            );
        },
        sortKey: 'landlordName'
    },
    {
        key: 'startDate',
        label: t('columns.startDate'),
        cell: (value) => value ? format(new Date(value), 'dd/MM/yyyy') : "—",
    },
    {
        key: 'endDate',
        label: t('columns.endDate'),
        cell: (value) => value ? format(new Date(value), 'dd/MM/yyyy') : "—",
    },
    {
        key: 'totalAmount',
        label: t('columns.totalAmount'),
        cell: (value) => {
            const amount = value as number;
            return <span className="font-medium text-dark">{amount.toLocaleString()} SAR</span>;
        },
    },
    {
        key: 'created_at',
        label: t('columns.createdAt'),
        cell: (value) => value ? format(new Date(value), 'dd/MM/yyyy') : "—",
    },
    {
        key: 'ejarPdfPath',
        label: t('columns.contract'),
        cell(value, row: Contract) {
            return <ContractViewButton contract={row} />;
        },
    },
];

function ContractViewButton({ contract }: { contract: Contract }) {
    const t = useTranslations('dashboard.contracts.table');
    const [showViewer, setShowViewer] = useState(false);
    const hasPdf = !!contract.ejarPdfPath;

    if (!hasPdf) {
        return (
            <button
                disabled
                className="text-gray-400 py-1 px-2 border border-gray-300 rounded-full text-sm cursor-not-allowed"
            >
                {t('viewContract')}
            </button>
        );
    }

    return (
        <>
            <button
                className="text-primary py-1 px-2 border border-dark rounded-full text-sm hover:bg-primary/10 transition-colors"
                onClick={() => setShowViewer(true)}
            >
                {t('viewContract')}
            </button>
            {showViewer && contract.ejarPdfPath && (
                <ContractPdfViewer
                    pdfPath={contract.ejarPdfPath}
                    contractNumber={contract.contractNumber}
                    onClose={() => setShowViewer(false)}
                />
            )}
        </>
    );
}

