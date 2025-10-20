

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


export type CategoryType = 'education' | 'hospital' | 'shopping';
export type PropertyType = 'residential' | 'commercial';
export type RentType = 'monthly' | 'yearly';
export type FurnishedType = 'furnished' | 'unfurnished';
export type FeatureType =
    | 'airConditioning'
    | 'assistedLiving'
    | 'disabilityAccess'
    | 'controlledAccess'
    | 'cableReady'
    | 'availableNow'
    | 'college'
    | 'corporate'
    | 'elevator'
    | 'extraStorage'
    | 'highSpeedInternet'
    | 'garage'
    | 'petAllowed'
    ;
