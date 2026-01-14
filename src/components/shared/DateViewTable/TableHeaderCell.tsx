'use client';

import React from 'react';
import { IoMdArrowUp } from 'react-icons/io';
import { TableColumnType } from '@/types/table';

interface TableHeaderCellProps<T> {
    col: TableColumnType<T>;
    isSorted: boolean;
    isAsc: boolean;
    onSort?: (key: string) => void;
}
export default function TableHeaderCell<T>({
    col,
    isSorted,
    isAsc,
    onSort,
}: TableHeaderCellProps<T>) {
    const sortKey = col.sortKey || col.key;

    return (
        <th
            key={String(col.key)}
            className={`group text-start py-4 px-4 font-semibold text-sm uppercase tracking-wide border-b border-gray-500 transition duration-200
        ${col.className || ''}
        ${col.sortable ? 'cursor-pointer select-none' : ''}
        ${isSorted ? 'text-secondary' : 'text-dark hover:opacity-70'}
      `}
            onClick={() => col.sortable && onSort?.(String(sortKey))}
        >
            <div className="flex items-center gap-1">
                <span className={`${isSorted ? 'font-bold' : ''}`}>{col.label}</span>
                {col.sortable && (
                    <IoMdArrowUp
                        className={`transition duration-200
              ${!isAsc ? 'rotate-180' : ''}
              ${isSorted ? 'opacity-100 text-secondary' : 'opacity-0 group-hover:opacity-100 text-gray-400'}
            `}
                    />
                )}
            </div>
        </th>
    );
}
