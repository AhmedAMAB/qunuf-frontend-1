'use client';

import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useDebounce } from "@/hooks/useDebounce"
import { formatLargeNumber } from '@/utils/helpers';


interface PriceRangeSliderProps {
    value: { min: number, max: number }
    range?: { min: number, max: number }
    onChange: (range: { min: number; max: number }) => void;
    showCurrencySymbol?: boolean;
}

export default function PriceRangeSlider({ range, value, onChange, showCurrencySymbol = true }: PriceRangeSliderProps) {
    const [internalValue, setInternalValue] = useState<[number, number]>(() => {
        return value?.min !== undefined && value?.max !== undefined
            ? [value.min, value.max]
            : [range?.min ?? 0, range?.max ?? 10000];
    });

    const { debouncedValue } = useDebounce({ value: internalValue });

    useEffect(() => {
        if (value.min != debouncedValue[0] || value.max != debouncedValue[1])
            onChange({ min: debouncedValue[0], max: debouncedValue[1] });
    }, [debouncedValue]);

    useEffect(() => {
        if (
            value?.min !== undefined &&
            value?.max !== undefined &&
            (value.min !== internalValue[0] || value.max !== internalValue[1])
        ) {
            setInternalValue([value.min, value.max]);
        }
    }, [value]);
    return (
        <div className="pb-2 ">
            <div className="range-slider relative px-2">
                {/* Value labels above handles */}
                <div className="flex justify-between">
                    <div className="text-sm text-[var(--neutral-700)] font-medium">
                        {showCurrencySymbol ? "$" : ""}
                        {formatLargeNumber(internalValue[0])}
                    </div>
                    <div className="text-sm text-[var(--neutral-700)] font-medium">
                        {showCurrencySymbol ? "$" : ""}
                        {formatLargeNumber(internalValue[1])}
                    </div>
                </div>


                <Slider
                    range
                    min={range?.min}
                    max={range?.max}
                    value={internalValue}
                    onChange={(val: number | number[]) => {
                        if (Array.isArray(val)) {
                            setInternalValue(val as [number, number]);
                        }
                    }}
                    styles={{
                        track: { backgroundColor: 'var(--primary)', height: 6 },
                        rail: { height: 6 },
                        handle: {
                            borderColor: '#E9EFFE',
                            backgroundColor: 'var(--primary)',
                            width: 18,
                            height: 18,
                        },
                    }}
                    ariaLabelForHandle={['السعر الأدنى', 'السعر الأقصى']}
                />
            </div>
        </div>
    );
}