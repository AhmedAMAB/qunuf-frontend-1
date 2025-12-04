'use client'

import dynamic from 'next/dynamic';

const LocationMap = dynamic(() => import('../../../components/shared/LocationMap'), {
    ssr: false,
});


export default function ContactMap() {
    return (
        <div className="col-span-6 relative h-full flex justify-center items-center ">
            <div className=" absolute top-0 bottom-0 right-0  h-full w-[300px] bg-secondary rounded-r-4xl"></div>
            <div className=" w-full max-w-[650px] my-12 md:my-16 lg:my-20 me-12 md:me-16 lg:me-20">
                <LocationMap lat={23.8859} lng={45.0792} zoom={6} />

            </div>
        </div>
    );
}