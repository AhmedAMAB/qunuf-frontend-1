'use client'

import DataView from "@/components/shared/DateViewTable/DataView";
import { MenuActionItem } from "@/components/shared/DateViewTable/MenuActionList";
import { useContracts } from "@/hooks/dashboard/contracts/useContracts";
import { Contract, ContractStatus } from "@/types/dashboard/contract";
import { ContractColumns } from '@/constants/dashboard/contracts/contractColumns';
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { FaEye } from "react-icons/fa";
import { MdEdit, MdCheck, MdClose, MdUpload } from "react-icons/md";
import { RiIndeterminateCircleLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Popup from "@/components/shared/Popup";
import ContractDetailsPopup from "./Contracts/ContractDetailsPopup";
import {
    ReviseContractPopup,
    AcceptContractPopup,
    CancelContractPopup,
    ActivateContractPopup,
    TerminateContractPopup,
} from "./Contracts/ContractActionPopups";
import MaxPriceFilter from "./Contracts/MaxPriceFilter";
import { FilterConfig } from "@/types/table";

export default function ContractDataView() {
    const t = useTranslations('dashboard.contracts.table');
    const { getRows, exportRows } = useContracts();
    const { role } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [actionContract, setActionContract] = useState<Contract | null>(null);
    const [actionType, setActionType] = useState<'revise' | 'accept' | 'cancel' | 'activate' | 'terminate' | null>(null);

    useEffect(() => {
        const viewId = searchParams.get('view');
        if (viewId && (!selectedContract || selectedContract.id !== viewId)) {
            setSelectedContract({ id: viewId } as Contract);
        } else if (!viewId && selectedContract) {
            setSelectedContract(null);
        }
    }, [searchParams]);

    const handleSetSelected = (contract: Contract | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (contract) {
            params.set('view', contract.id);
            setSelectedContract(contract);
        } else {
            params.delete('view');
            setSelectedContract(null);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleAction = (contract: Contract, type: 'revise' | 'accept' | 'cancel' | 'activate' | 'terminate') => {
        setActionContract(contract);
        setActionType(type);
    };

    const handleActionClose = () => {
        setActionContract(null);
        setActionType(null);
    };

    const handleActionSuccess = () => {
        // Refresh the table by triggering a re-render
        window.location.reload();
    };

    const statusOptions = [
        { label: t('statusOptions.all'), value: 'all' },
        // { label: t('statusOptions.draft'), value: ContractStatus.DRAFT },
        { label: t('statusOptions.pending_tenant_acceptance'), value: ContractStatus.PENDING_TENANT_ACCEPTANCE },
        { label: t('statusOptions.pending_landlord_acceptance'), value: ContractStatus.PENDING_LANDLORD_ACCEPTANCE },
        { label: t('statusOptions.pending_signature'), value: ContractStatus.PENDING_SIGNATURE },
        { label: t('statusOptions.active'), value: ContractStatus.ACTIVE },
        { label: t('statusOptions.expired'), value: ContractStatus.EXPIRED },
        { label: t('statusOptions.cancelled'), value: ContractStatus.CANCELLED },
        { label: t('statusOptions.terminated'), value: ContractStatus.TERMINATED },
        { label: t('statusOptions.pending_termination'), value: ContractStatus.PENDING_TERMINATION },
    ];

    const contractFilters: FilterConfig[] = [
        {
            key: 'status',
            label: t('filters.status'),
            type: 'select',
            options: statusOptions,
            default: 'all',
        }
    ];

    const getActions = (contract: Contract): MenuActionItem[] => {
        const actions: MenuActionItem[] = [];

        // View Details - Always available
        actions.push({
            label: t('viewDetails'),
            Icon: FaEye,
            onClick: () => handleSetSelected(contract),
        });

        // Landlord actions for PENDING_LANDLORD_ACCEPTANCE
        if (role === 'landlord' && contract.status === ContractStatus.PENDING_LANDLORD_ACCEPTANCE) {
            actions.push({
                label: t('reviseContract'),
                Icon: MdEdit,
                onClick: () => handleAction(contract, 'revise'),
            });
            actions.push({
                label: t('acceptContract'),
                Icon: MdCheck,
                onClick: () => handleAction(contract, 'accept'),
            });
            actions.push({
                label: t('cancelContract'),
                Icon: MdClose,
                onClick: () => handleAction(contract, 'cancel'),
            });
        }

        // Tenant actions for PENDING_TENANT_ACCEPTANCE
        if (role === 'tenant' && contract.status === ContractStatus.PENDING_TENANT_ACCEPTANCE) {
            actions.push({
                label: t('acceptContract'),
                Icon: MdCheck,
                onClick: () => handleAction(contract, 'accept'),
            });
            actions.push({
                label: t('cancelContract'),
                Icon: MdClose,
                onClick: () => handleAction(contract, 'cancel'),
            });
        }

        // Admin actions for PENDING_SIGNATURE
        if (role === 'admin' && contract.status === ContractStatus.PENDING_SIGNATURE) {
            actions.push({
                label: t('activateContract'),
                Icon: MdUpload,
                onClick: () => handleAction(contract, 'activate'),
            });
        }

        // Terminate action for ACTIVE contracts
        if ((contract.status === ContractStatus.ACTIVE && (role === 'tenant' || role === 'landlord')) || (contract.status === ContractStatus.PENDING_TERMINATION && role === 'tenant')) {
            actions.push({
                label: t('terminateContract'),
                Icon: RiIndeterminateCircleLine,
                onClick: () => handleAction(contract, 'terminate'),
            });
        }

        return actions;
    };

    return (
        <>
            <DataView<Contract>
                columns={ContractColumns(t, role)}
                getRows={getRows}
                onExport={exportRows}
                showActions={true}
                showSearch={true}
                searchPlaceholder={t('searchPlaceholder')}
                actionsMenuItems={getActions}
                pageSize={10}
                filters={contractFilters}
            />

            {/* Contract Details Popup */}
            {selectedContract && (
                <Popup show={true} onClose={() => handleSetSelected(null)}>
                    <ContractDetailsPopup
                        row={selectedContract}
                        onClose={() => handleSetSelected(null)}
                    />
                </Popup>
            )}

            {/* Action Popups */}
            {actionContract && actionType === 'revise' && (
                <Popup show={true} onClose={handleActionClose}>
                    <ReviseContractPopup
                        contract={actionContract}
                        onClose={handleActionClose}
                        onSuccess={handleActionSuccess}
                    />
                </Popup>
            )}

            {actionContract && actionType === 'accept' && (
                <Popup show={true} onClose={handleActionClose}>
                    <AcceptContractPopup
                        contract={actionContract}
                        onClose={handleActionClose}
                        onSuccess={handleActionSuccess}
                    />
                </Popup>
            )}

            {actionContract && actionType === 'cancel' && (
                <Popup show={true} onClose={handleActionClose}>
                    <CancelContractPopup
                        contract={actionContract}
                        onClose={handleActionClose}
                        onSuccess={handleActionSuccess}
                    />
                </Popup>
            )}

            {actionContract && actionType === 'activate' && (
                <Popup show={true} onClose={handleActionClose}>
                    <ActivateContractPopup
                        contract={actionContract}
                        onClose={handleActionClose}
                        onSuccess={handleActionSuccess}
                    />
                </Popup>
            )}

            {actionContract && actionType === 'terminate' && (
                <Popup show={true} onClose={handleActionClose}>
                    <TerminateContractPopup
                        contract={actionContract}
                        onClose={handleActionClose}
                        onSuccess={handleActionSuccess}
                    />
                </Popup>
            )}
        </>
    );
}
