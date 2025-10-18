'use client';

/**
 * 📌 FilterContainer Component
 *
 * This component initializes filter and sort state from URL search parameters.
 * 
 * 🔍 For filters of type `'dateRange'`, the `key` is split into two query parameters:
 * - `${key}_from` → represents the start date
 * - `${key}_to` → represents the end date
 *
 * These are used to prefill the date range inputs and apply filtering logic accordingly.
 */


import { parse } from 'date-fns';
import { FilterConfig } from '@/types/table';
import DateRangePicker from '../forms/SelectDateRange';
import SearchField from '../forms/SearchField';
import useTableFilter from '@/hooks/dashboard/useTableFilter';

import Sidebar from '../Sidebar';
import { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { IconType } from 'react-icons';
import TableActions from './TableActions';
import { useTranslations } from 'next-intl';

export type actionButton = {
    show?: boolean;
    label?: string;
    href?: string;
    MobileIcon?: IconType;
}

type Props = {
    filters: FilterConfig[];
    showSearch?: boolean;
    searchPlaceholder?: string;
    actionButton?: actionButton
};
export default function FilterContainer({
    filters,
    searchPlaceholder,
    showSearch = true,
    actionButton = { show: false }
}: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const t = useTranslations('dashboard.filter.container');
    const {
        search,
        setSearch,
        allFilters,
        updateFilter,
        handleReset,
        handleDateChange
    } = useTableFilter({ filters })
    return (
        <div>
            <div className='flex max-md:flex-wrap items-start flex-row gap-3 mb-5 max-lg:p-2'>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="me-auto inline-flex  lg:hidden bg-primary hover:bg-primary-hover py-2 px-4 text-white gap-1 items-center justify-center rounded-[8px] transition-colors duration-200 "
                >
                    <CiFilter size={20} className='shrink-0' />
                    <span className="text-base">{t('filter')}</span>
                </button>

                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} className='flex-1'
                    title={
                        <div className='text-primary flex items-center gap-1'>
                            <CiFilter size={20} className='shrink-0' />
                            <span className="text-lg">{t('filter')}</span>
                        </div>
                    }>

                    <div className="flex-1 flex flex-col max-lg:m-4 max-lg:mt-6 lg:flex-row flex-wrap items-center justify-between gap-3 ">
                        <div className=" order-first w-full  flex items-center gap-3 " >
                            <div className="w-full md:flex-none">
                                {showSearch && <SearchField
                                    value={search}
                                    onChange={setSearch}
                                    searchPlaceholder={searchPlaceholder}
                                />}
                            </div>

                        </div>
                        {/* 3) Other filters, each direct child */}
                        {filters.map((filter) => {

                            const current = allFilters[filter.key];
                            const handleChange = (value: string | undefined) => {
                                updateFilter(filter.key, value);
                            };
                            if (filter.type === 'custom' && filter.Component) {
                                const CustomComponent = filter.Component;
                                return (
                                    <div key={filter.key} className="w-full md:w-fit">
                                        <CustomComponent value={current} onChange={handleChange} />
                                    </div>
                                );
                            }

                            // if (filter.type === "select" && filter.options) {
                            //     return (
                            //         <div key={filter.key} className="w-full md:w-fit">
                            //             <SelectDropdown
                            //                 label={filter.label}
                            //                 options={filter.options}
                            //                 value={current}
                            //                 onChange={handleChange}
                            //             />
                            //         </div>
                            //     )
                            // }

                            if (filter.type === "dateRange") {
                                const fromDate = allFilters[`${filter.key}_from`]
                                    ? parse(allFilters[`${filter.key}_from`], 'yyyy-MM-dd', new Date())
                                    : undefined;
                                const toDate = allFilters[`${filter.key}_to`]
                                    ? parse(allFilters[`${filter.key}_to`], 'yyyy-MM-dd', new Date())
                                    : undefined;

                                return (
                                    <div key={filter.key} className="w-full md:w-fit">
                                        <DateRangePicker
                                            // DateInputComponent={filter.label}
                                            value={{ startDate: fromDate, endDate: toDate }}
                                            onChange={(dates) => handleDateChange({ filter, dates })}
                                        />
                                    </div>
                                )
                            }

                            return null
                        })}
                    </div>
                </Sidebar >

                <TableActions actionButton={actionButton} />
            </div>
        </div>
    )
}
