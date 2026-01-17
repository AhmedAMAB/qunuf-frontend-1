'use client';

import { Link } from "@/i18n/navigation";
import React, { ComponentType, ReactElement, useState } from 'react';
import Popup from '../Popup';
import { IconType } from 'react-icons';
import Tooltip from '../Tooltip';
import { TableRowType } from "@/types/table";

export type ActionType =
    | 'primary'
    | 'secondary'
    | 'edit'
    | 'delete'
    | 'normal';

const getColorClass = (type?: ActionType) => {
    switch (type) {
        case 'primary':
            return 'text-[var(--primary)] hover:text-[var(--primary-hover)]';
        case 'secondary':
            return 'text-[var(--secondary)] hover:text-[var(--secondary-hover)]';
        case 'edit':
            return 'text-[var(--light)] hover:text-[var(--primary)]';
        case 'delete':
            return 'text-red-600 hover:text-red-800';
        case 'normal':
        default:
            return 'text-[var(--dark)] hover:text-[var(--primary)]';
    }
};

export type MenuActionItem = {
    label: string;
    Icon?: IconType;
    type?: ActionType;
    link?: string;
    Child?: ComponentType<{ row, onClose: () => void }>;
    onClick?: () => void;
    show?: boolean
};

type Props = {
    items?: MenuActionItem[];
    onClose?: () => void;
    row?: any
    setRows?: React.Dispatch<React.SetStateAction<TableRowType<any>[] | null>>,
    fetchRows?: (signal?: AbortSignal) => Promise<void>;
    onOpenPopup?: (Child: ComponentType<ChildTypeProps>, row: any) => void
};

//for drop dwon action version 
export default function MenuActionList({ items, onClose }: Props) {
    const [activeChild, setActiveChild] = useState<{ Child: ComponentType<{ onClose: () => void }> | undefined }>({ Child: undefined });
    const [menuOpen, setMenuOpen] = useState(false);


    function handleOnClose() {
        setMenuOpen(false);
    }

    if (items?.length == 0) return null;

    return (
        <div className="flex flex-col gap-2 bg-white p-2">
            {items?.map((item, index) => {
                const Icon = item.Icon;
                const content = (
                    <>
                        {Icon && <Icon size={16} />}

                        <span>{item.label}</span>
                    </>
                );

                if (item.link) {
                    return (
                        <Link
                            key={index}
                            href={item.link}
                            onClick={onClose}
                            className={`flex items-center gap-2 text-sm ${getColorClass(item.type)} disabled:opacity-50`}
                        >
                            {content}
                        </Link>
                    );
                }

                return (
                    <button
                        key={index}
                        onClick={() => {
                            setActiveChild({ Child: item.Child });
                            setMenuOpen(true);
                        }}
                        className={`flex items-center gap-2 text-sm ${getColorClass(item.type)}`}
                    >
                        {content}
                    </button>
                );
            })}

            {/* Render child if active */}
            {activeChild?.Child && (
                <Popup onClose={handleOnClose} show={menuOpen}>
                    <activeChild.Child onClose={handleOnClose} />
                </Popup>
            )}

        </div>
    );
}

export type ChildTypeProps = { row, onClose: () => void, setRows?: React.Dispatch<React.SetStateAction<TableRowType<any>[] | null>>, fetchRows?: (signal?: AbortSignal) => Promise<void>; }
// for icon version
export function ActionList({ items, row, setRows, fetchRows, onOpenPopup }: Props) {
    // const [activeChild, setActiveChild] = useState<{ Child: ComponentType<ChildTypeProps> | undefined }>({ Child: undefined });
    // const [menuOpen, setMenuOpen] = useState(false);


    // function handleOnClose() {
    //     setMenuOpen(false);
    // }

    if (items?.length == 0) return null;

    return (
        <div className="flex flex-row justify-end gap-4 p-2">
            {items?.map((item, index) => {
                if (item.show != undefined && !item.show) return;
                const Icon = item.Icon;
                const content = (
                    <>
                        <Tooltip content={item.label}>
                            {Icon && <Icon size={20} className={`${getColorClass(item.type)}`} />}
                        </Tooltip>
                    </>
                );

                if (item.link) {
                    return (
                        <Link
                            key={index}
                            href={item.link}
                            className={`flex items-center gap-2 text-sm  disabled:opacity-50`}
                        >
                            {content}
                        </Link>
                    );
                }

                return (
                    <button
                        key={index}
                        // onClick={() => {
                        //     setActiveChild({ Child: item.Child });
                        //     setMenuOpen(true);
                        // }}
                        onClick={() => {
                            if (item?.onClick)
                                item?.onClick?.()
                            else if (item.Child && onOpenPopup) {
                                // Store fetchRows in a closure for the Child component
                                const ChildWithFetchRows = (props: any) => {
                                    return <item.Child {...props} fetchRows={fetchRows} />;
                                };
                                onOpenPopup(ChildWithFetchRows as ComponentType<ChildTypeProps>, row);
                            }
                        }}
                        className={`flex items-center gap-2 text-sm `}
                    >
                        {content}
                    </button>
                );
            })}

            {/* Render child if active */}
            {/* {activeChild?.Child && (
                <Popup onClose={handleOnClose} show={menuOpen}>
                    <activeChild.Child row={row} setRows={setRows} onClose={handleOnClose} />
                </Popup>
            )} */}

        </div>
    );
}