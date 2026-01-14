
import { TableColumnType, TableRowType } from "@/types/table";
// import Dropdown from "../Dropdown";
import /*MenuActionList,*/ { ActionList, ChildTypeProps, MenuActionItem } from "./MenuActionList";
import { ComponentType } from "react";
// import TableTrigger from "./TableTrigger";

interface TableRowProps<T> {
    row: T;
    idx: number;
    allColumns: TableColumnType<T>[];
    showActions?: boolean;
    setRows?: React.Dispatch<React.SetStateAction<TableRowType<T>[] | null>>,
    actionsMenuItems?: (row: T, onClose: () => void) => MenuActionItem[];
    onOpenPopup?: (Child: ComponentType<ChildTypeProps>, row: T) => void
}

export default function TableRow<T>({
    row,
    idx,
    allColumns,
    showActions,
    setRows,
    actionsMenuItems,
    onOpenPopup
}: TableRowProps<T>) {
    return (
        <tr
            key={idx}
            className="hover:bg-lighter border-b border-gray-500 group/row transition-colors duration-200"
        >
            {allColumns.map((col, index) => {

                const value = col.key ? row[col.key] : '';

                return (
                    <td
                        key={index}
                        className={`align-middle group-hover/row:bg-lighter py-4 px-4 text-dark ${col.className || ''}`}
                    >


                        {col.key === 'actions' && showActions ? (
                            // for dropdown version of actions
                            // <Dropdown
                            //     Trigger={TableTrigger}
                            //     position="bottom-right"
                            //     Menu={({ onClose }) => (
                            //         <MenuActionList
                            //             items={actionsMenuItems?.(row, onClose)}
                            //             onClose={onClose}
                            //         />
                            //     )}
                            // />
                            // for action list version
                            <div>
                                <ActionList onOpenPopup={onOpenPopup} setRows={setRows} row={row} items={actionsMenuItems?.(row, () => { })} />
                            </div>

                        ) : col.cell ? (
                            col.cell?.(value, row, setRows)
                        ) : value !== undefined ? (
                            value as React.ReactNode
                        ) : (
                            <span className="text-gray-400">—</span>
                        )}
                    </td>
                );
            })}
        </tr>
    );
}
