import { useEffect, useState } from "react";
import PropertyFilterInputWrapper from "./PropertyFilterInputWrapper";
import PriceRangeSlider from "@/components/shared/forms/PriceRangeSlider";

type NumberRangeInputProps = {
    min: number;
    max: number;
    range?: { min: number, max: number }
    showProgress?: boolean
    label: string

    onChange: (range: { min: number; max: number }) => void;
};

export default function NumberRangeInput({ min, max, range, onChange, showProgress = true, label }: NumberRangeInputProps) {
    const [localMin, setLocalMin] = useState<number>(min);
    const [localMax, setLocalMax] = useState<number>(max);

    useEffect(() => {
        setLocalMin(min);
        setLocalMax(max);
    }, [min, max]);

    const rangeMin = range?.min ?? Number.MIN_SAFE_INTEGER;
    const rangeMax = range?.max ?? Number.MAX_SAFE_INTEGER;

    const handleBlur = () => {
        const validMin = Math.max(rangeMin, Math.min(localMin, localMax ?? rangeMax));
        const validMax = Math.min(rangeMax, Math.max(localMax, localMin ?? rangeMin));

        setLocalMin(validMin)
        setLocalMax(validMax)

        onChange({ min: validMin, max: validMax });
    };

    const handleSliderChange = (val: { min: number; max: number }) => {
        console.log(val)
        setLocalMin(val.min);
        setLocalMax(val.max);
        onChange({ min: val.min, max: val.max });
    };

    return (
        <PropertyFilterInputWrapper label={label}>
            <div className="flex gap-5 w-full">
                <input
                    type="number"
                    placeholder="Min"
                    value={localMin}
                    min={range?.min}
                    max={max ?? range?.max}
                    onChange={(e) => setLocalMin(Number(e.target.value))}
                    onBlur={handleBlur}
                    className="flex-1 rounded-md p-[10px] bg-white border border-lightGold text-[16px] text-placeholder"
                />
                <input
                    type="number"
                    placeholder="Max"
                    value={localMax}
                    min={min ?? range?.min}
                    max={range?.max}
                    onChange={(e) => setLocalMax(Number(e.target.value))}
                    onBlur={handleBlur}
                    className="flex-1 rounded-md p-[10px] bg-white border border-lightGold text-[16px] text-placeholder"
                />
            </div>
            {showProgress && <PriceRangeSlider onChange={handleSliderChange} range={range} value={{ min, max }} />}
        </PropertyFilterInputWrapper>
    );
}
