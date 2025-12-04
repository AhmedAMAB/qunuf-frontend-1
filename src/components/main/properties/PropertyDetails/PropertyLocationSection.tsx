'use client';

import dynamic from 'next/dynamic';
import PropertySectionHeader from './PropertySectionHeader';

const LocationMap = dynamic(() => import('../../../shared/LocationMap'), {
    ssr: false,
});


export default function PropertyLocationSection({ lat, lng, title = "Location" }: {
    lat: number;
    lng: number;
    title?: string
}) {
    return (
        <div className='px-4'>
            <PropertySectionHeader title={title} align="end" />
            <LocationMap lat={lat} lng={lng} />
        </div>
    )
}