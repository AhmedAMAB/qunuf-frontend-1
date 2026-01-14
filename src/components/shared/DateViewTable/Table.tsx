'use client';

import React, { ComponentType, useMemo, useState } from 'react';
import { TableColumnType, TableRowType } from '@/types/table';
import { ChildTypeProps, MenuActionItem } from './MenuActionList';
import NoRowsFound from './NoRowsFound';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import Popup from '../Popup';



interface TableProps<T = Record<string, any>> {
    columns: TableColumnType<T>[];
    rows: TableRowType<T>[];
    showActions?: boolean;
    setRows?: React.Dispatch<React.SetStateAction<TableRowType<T>[] | null>>,
    actionsMenuItems?: (row: T, onClose?: () => void) => MenuActionItem[];
}

export default function Table<T = Record<string, any>>({
    columns,
    rows,
    actionsMenuItems,
    showActions = false,
    setRows
}: TableProps<T>) {

    const allColumns = useMemo(() => {
        const normalized = columns.map((col) => ({
            ...col,
            sortable: col.sortable ?? true, // default to true if undefined
        }));

        return showActions
            ? [...normalized, { key: 'actions' as keyof T, label: '', className: 'w-12', sortable: false }]
            : normalized;
    }, [columns, showActions]);

    const [popupState, setPopupState] = useState<{
        Child?: ComponentType<ChildTypeProps>;
        row?: T;
    }>({});
    const [menuOpen, setMenuOpen] = useState(false);

    function handleOpenPopup(Child: ComponentType<ChildTypeProps>, row: T) {
        setPopupState({ Child, row });
        setMenuOpen(true);
    }

    function handleClosePopup() {
        setMenuOpen(false);
        setPopupState({});
    }

    return (
        <div className="">
            <table className="min-w-full bg-card-bg table-fixed whitespace-nowrap overflow-hidden">
                <TableHeader<T> columns={allColumns} />
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={allColumns.length}>
                                <NoRowsFound />
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, idx) => (
                            <TableRow<T>
                                key={idx}
                                row={row}
                                idx={idx}
                                allColumns={allColumns}
                                showActions={true}
                                actionsMenuItems={actionsMenuItems}
                                setRows={setRows}
                                onOpenPopup={handleOpenPopup}
                            />
                        ))
                    )}
                </tbody>
            </table>
            {popupState.Child && (
                <Popup onClose={handleClosePopup} show={menuOpen}>
                    <popupState.Child row={popupState.row!} setRows={setRows} onClose={handleClosePopup} />
                </Popup>
            )}
        </div>
    );
}



