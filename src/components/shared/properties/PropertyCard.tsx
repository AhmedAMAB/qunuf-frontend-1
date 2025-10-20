import Image from "next/image";
import { Link } from "@/i18n/navigation";
import FloatingActionButton from "../buttons/FloatingActionButton";

type Property = {
    id: string;
    title: string;
    address: string;
    price: number;
    imageUrl: string;
};
export default function PropertyCard({
    property,
    locale,
}: {
    property: Property;
    locale: 'ar' | 'en';
}) {
    const period = locale === 'ar' ? '/ شهرى' : '/ Monthly';

    return (
        <div className="relative w-full max-w-[384px] h-[484px] rounded-[24px] flex items-end bg-light overflow-hidden">
            {/* light corner blocks */}
            <div className="z-[1] absolute top-0 rtl:start-0 ltr:end-0 bg-light rounded-tr-[24px] w-[94px] h-[47px]" />
            <div className="z-[1] absolute top-0 rtl:start-0 ltr:end-0 bg-light rounded-tr-[24px] w-[47px] h-[94px]" />
            {/* Concave SVG decorations */}
            <div className="absolute top-[74px] rtl:-start-[20px] ltr:-end-[20px] z-10">
                <svg width="40" height="40" viewBox="0 0 40 40" className="block">
                    <defs>
                        <mask id="notch-bl">
                            <rect x="0" y="0" width="40" height="40" fill="white" />
                            <circle cx="0" cy="40" r="20" fill="black" />
                        </mask>
                    </defs>
                    <rect x="0" y="0" width="40" height="40" fill="var(--light)" mask="url(#notch-bl)" />
                </svg>
            </div>

            <div className="absolute rtl:start-[74px] ltr:end-[74px] -top-[20px] z-10">
                <svg width="40" height="40" viewBox="0 0 40 40" className="block">
                    <defs>
                        <mask id="notch-bl">
                            <rect x="0" y="0" width="40" height="40" fill="white" />
                            <circle cx="0" cy="40" r="20" fill="black" />
                        </mask>
                    </defs>
                    <rect x="0" y="0" width="40" height="40" fill="var(--light)" mask="url(#notch-bl)" />
                </svg>
            </div>
            <FloatingActionButton
                href={`/properties/${property.id}`}
                size={60}
            />


            {/* Property details */}
            <div className="max-w-[384px] h-[484px] overflow-hidden">
                <Image
                    src={property.imageUrl}
                    fill
                    alt={property.title}
                    className="w-[384px] h-[484px] rounded-[24px] object-cover filter brightness-[0.9] image-scale"
                />
            </div>

            <div className="space-y-4 z-[1] ms-2 me-6 mb-4">
                <Link href={`/properties/${property.id}`} className="block font-bold text-lg text-white ">{property.title}</Link>
                <p className="text-[#D4E1FF] text-xs">{property.address}</p>
                <div className="text-white ms-10">
                    <span className="font-bold text-2xl">${property.price}</span> <span>{period}</span>
                </div>
            </div>
        </div>
    );
}