import React from 'react';

interface PlanCardProps {
    title: string;
    price: string;
    description: string;
    buttonText: string;
    onClick?: () => void;
    isSelected?: boolean;
    aos?: string;
}

export default function PlanCard({
    title,
    price,
    description,
    buttonText,
    onClick,
    isSelected = false,
    aos = 'fade-up',
}: PlanCardProps) {
    return (
        <div
            className={`w-full max-w-[350px] h-[310px] bg-white shadow-md rounded-lg flex flex-col justify-between overflow-hidden border-2 transition-all ${
                isSelected ? 'border-secondary' : 'border-gray'
            }`}
            data-aos={aos}
        >
            <div className="px-6 pt-4">
                <h2 className="text-[30px] font-bold leading-none text-start">{title}</h2>
                <p className="text-primary text-center text-[50px] font-bold leading-none mt-2">
                    {price}
                </p>
                <p className="text-center text-[16px] font-normal leading-none mt-4">
                    {description}
                </p>
            </div>

            <button
                onClick={onClick}
                className={`
                    w-full h-[66px] mt-auto text-white text-lg font-semibold 
                    transition-colors
                    ${isSelected 
                        ? 'bg-secondary hover:bg-secondary-hover' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }
                `}
            >
                {buttonText}
            </button>
        </div>
    );
}
