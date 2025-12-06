'use client';
/**
 * 📊 DataView Component
 *
 * A generic table wrapper that handles:
 * - Fetching paginated data using the `getRows` function
 * - Displaying filters, search, and sort controls via `FilterContainer`
 * - Rendering loading skeletons, error states, and the final table
 * - Managing pagination and showing entry count summary
 *

 * This component is designed to be reusable across different data types by leveraging generics (`<T>`).
 */


import { useSearchParams } from 'next/navigation';
import { FilterConfig, TableColumnType, TableRowType } from '@/types/table';
import TableSkeleton from './TableSkeleton';
import FilterContainer, { actionButton } from './FilterContainer';
import { useEffect, useState } from 'react';
import Table from './Table';
import TableError from './TableError';
import { MenuActionItem } from './MenuActionList';
import TablePagination from './TablePagination';
import DashboardCard from '@/components/dashboard/DashboardCard';

type DataViewProps<T = Record<string, any>> = {
    columns: TableColumnType<T>[];
    filters?: FilterConfig[];
    showSearch?: boolean;
    searchPlaceholder?: string;
    actionsMenuItems?: (row: T, onClose?: () => void) => MenuActionItem[];
    showActions?: boolean;
    pageSize?: number;
    actionButton?: actionButton
    getRows: (signal?: AbortSignal) => Promise<{
        rows: TableRowType<T>[];
        error?: Error | null;
        totalCount?: number;
    }>;
};



export default function DataView<T = Record<string, any>>({
    columns,
    filters = [],
    showSearch = true,
    searchPlaceholder,
    actionsMenuItems,
    showActions = false,
    pageSize = 10,
    actionButton,
    getRows,
}: DataViewProps<T>) {
    const searchParams = useSearchParams();
    const [rows, setRows] = useState<TableRowType<T>[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalRowsCount, setTotalRowsCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        fetchRows(controller.signal);
        return () => controller.abort();
    }, [getRows]);

    const fetchRows = async (signal?: AbortSignal) => {
        setIsLoading(true);
        try {
            const { rows, error, totalCount } = await getRows(signal);
            setTotalRowsCount(totalCount ?? 0);
            setError(error ? error.message : null);
            setRows(rows);
        } finally {
            setIsLoading(false);
        }
    };

    const pageParam = searchParams.get('page');
    const currentPage = pageParam ? parseInt(pageParam) : 1;

    const startEntry = (currentPage - 1) * pageSize + 1;
    const endEntry = Math.min(currentPage * pageSize, totalRowsCount);
    // const pageCount = Math.ceil(totalRowsCount / pageSize);
    const pageCount = 70;

    return (

        <DashboardCard>
            <FilterContainer
                filters={filters}
                showSearch={showSearch}
                searchPlaceholder={searchPlaceholder}
                actionButton={actionButton}

            />

            <div className='overflow-x-auto thin-scrollbar '>
                {isLoading ? (
                    <TableSkeleton columns={columns} rowCount={pageSize} />
                ) : error ? (
                    <TableError message={error} onRetry={fetchRows} />
                ) : (
                    <Table<T>
                        columns={columns}
                        rows={rows ?? []}
                        showActions={showActions}
                        actionsMenuItems={actionsMenuItems}
                    />
                )}

                <TablePagination pageCount={pageCount} pageSize={pageSize} total={totalRowsCount} />
            </div>
        </DashboardCard>
    );
}
