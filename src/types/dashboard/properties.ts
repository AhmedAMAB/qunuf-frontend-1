

export type PropertyStatus = 'free' | 'online' | 'offline' | 'booked'
export type PropertyRow = {
    id: string;
    property: {
        id: string;
        imagePath: string;
        name: string;
    }
    status: PropertyStatus;
    startDate: Date;
    endDate: Date;
    publishedAt: Date;
    price: number;
    contract: {
        src: string;
        alt?: string;
    }[];
    location: string;
};