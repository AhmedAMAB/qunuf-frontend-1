import { PropertyRow } from "@/types/dashboard/properties";
import { TableRowType } from "@/types/table";
import { useCallback } from "react";


const rows: PropertyRow[] = [
    {
        id: "contract-1",
        property: {
            id: 'property-1',
            imagePath: '/properties/property-3.jpg',
            name: 'Luxury Family Home'
        },
        status: 'booked',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2026-10-01'),
        publishedAt: new Date('2025-09-15'),
        price: 12000,
        location: 'Nasr City, Cairo',
        contract: [
            { src: "/contract/contract-1.png" },
            { src: "/contract/contract-2.png" }
        ],
    },
    {
        id: "contract-2",
        property: {
            id: 'property-1',
            imagePath: '/properties/property-3.jpg',
            name: 'Luxury Family Home'
        },
        status: 'free',
        startDate: new Date('2025-11-01'),
        endDate: new Date('2026-11-01'),
        publishedAt: new Date('2025-10-10'),
        price: 9500,
        location: 'Zamalek, Cairo',
        contract: [
            { src: "/contract/contract-1.png" },
            { src: "/contract/contract-2.png" }
        ],
    },
    {
        id: "contract-3",
        property: {
            id: 'property-1',
            imagePath: '/properties/property-3.jpg',
            name: 'Luxury Family Home'
        },
        status: 'offline',
        startDate: new Date('2025-09-15'),
        endDate: new Date('2026-09-15'),
        publishedAt: new Date('2025-08-20'),
        price: 10500,
        location: 'Maadi, Cairo',
        contract: [
            { src: "/contract/contract-1.png" },
            { src: "/contract/contract-2.png" }
        ],
    },
    {
        id: "contract-4",
        property: {
            id: 'property-1',
            imagePath: '/properties/property-3.jpg',
            name: 'Luxury Family Home'
        },
        status: 'online',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2026-12-01'),
        publishedAt: new Date('2025-10-05'),
        price: 8800,
        location: 'Heliopolis, Cairo',
        contract: [],
    },
];

export function useProperties() {
    const getRows = useCallback(
        async (_signal?: AbortSignal): Promise<{
            rows: TableRowType<PropertyRow>[];
            error?: Error | null;
            totalCount?: number;
        }> => {
            return {
                rows,
                totalCount: rows.length,
                error: null,
            };
        },
        []
    );

    return { getRows };
}