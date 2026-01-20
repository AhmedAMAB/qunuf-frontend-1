'use client'
import PrimaryButton from "@/components/atoms/buttons/PrimaryButton";
import ImageGallery from "@/components/atoms/ImageGallery";
import { LiaBuilding } from "react-icons/lia";
import { GiMilitaryAmbulance } from "react-icons/gi";
import { Property, RentType } from "@/types/dashboard/properties";
import { BiArea, BiGroup, BiCheckCircle, BiXCircle } from "react-icons/bi";
import { resolveUrl } from "@/utils/upload";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";

import dynamic from 'next/dynamic';
import { ReactNode } from "react";
import { IoIosPin } from "react-icons/io";

const LocationMap = dynamic(() => import('../../../components/atoms/LocationMap'), {
    ssr: false,
});



export default function PropertyDetails({ property }: { property: Property }) {
    const tEnums = useTranslations('property.enums');
    const t = useTranslations('property.details');
    const locale = useLocale();

    const periodLabel = property.rentType === RentType.MONTHLY
        ? locale === 'ar' ? 'شهرياً' : 'mo'
        : locale === 'ar' ? 'سنويًا' : 'yr';

    // Build address string
    const address = property.state
        ? (locale === 'ar' ? property.state.name_ar : property.state.name)
        : property.nationalAddressCode || '';

    // Transform images
    const images = property.images?.map((img) => ({
        imagePath: resolveUrl(img.url),
        isPrimary: img.is_primary,
    })) || [];

    // Transform description and additionalDetails
    const description = property.description
        ? property.description.split('\n').filter((p) => p.trim())
        : [];
    const additionalDetails = property.additionalDetails
        ? property.additionalDetails.split('\n').filter((p) => p.trim())
        : [];

    // Build details array with all facilities
    const details = buildDetailsArray(property, locale, tEnums);

    // Transform nearby facilities
    const nearby = {
        education: property.educationInstitutions?.map((inst) => ({
            name: inst.name,
            distance: `${inst.distance_km} km`,
        })) || [],
        health: property.healthMedicalFacilities?.map((facility) => ({
            name: facility.name,
            distance: `${facility.distance_km} km`,
        })) || [],
    };

    return (
        <div className="my-20 px-2">
            <div className="container">
                {/* Improved Header */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 lg:p-10 mb-8 shadow-xs border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[55px] font-bold text-dark leading-tight mb-4">
                                {property.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-lg sm:text-xl text-gray-600">
                                {address && (
                                    <span className="flex items-center gap-2">
                                        <span>{address}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                                <p className="text-secondary text-2xl sm:text-3xl md:text-4xl lg:text-[55px] font-bold">
                                    <span>SAR {property.rentPrice.toLocaleString()}</span>
                                    <span className="mx-1 text-lg sm:text-xl md:text-2xl lg:text-3xl">/</span>
                                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl">{periodLabel}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Info + Booking */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4 p-4 bg-white rounded-xl shadow-xs border border-gray-100">
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                        {property.area && (
                            <QuickInfoBadge
                                icon={<BiArea className="text-xl" />}
                                label={locale === 'ar' ? 'المساحة' : 'Area'}
                                value={`${property.area} m²`}
                            />
                        )}
                        {property.capacity && (
                            <QuickInfoBadge
                                icon={<BiGroup className="text-xl" />}
                                label={locale === 'ar' ? 'السعة' : 'Capacity'}
                                value={property.capacity.toString()}
                            />
                        )}
                        <QuickInfoBadge
                            icon={property.isFurnished ? <BiCheckCircle className="text-xl" /> : <BiXCircle className="text-xl" />}
                            label={locale === 'ar' ? 'مفروش' : 'Furnished'}
                            value={property.isFurnished ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No')}
                            variant={property.isFurnished ? 'success' : 'default'}
                        />
                    </div>
                    <BookButton id={property.id} />
                </div>

                {/* Gallery */}
                <ImageGallery
                    images={images}
                    userImage={property?.user.imagePath ? resolveUrl(property?.user.imagePath) : "/users/default-user.png"}
                    price={{ amount: property.rentPrice, isMonthly: property.rentType === RentType.MONTHLY }}
                    title={property?.user.name || "Landlord"}
                />

                {/* Sections */}
                <div className="space-y-6 mt-8">
                    {description.length > 0 && (
                        <PropertyDescription title={t('description')}>
                            {description.map((para, idx) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </PropertyDescription>
                    )}

                    {details.length > 0 && (
                        <PropertyDetailsSection details={details} title={t('propertyDetails')} />
                    )}

                    {property.features && property.features.length > 0 && (
                        <PropertyFeaturesSection features={property.features} title={t('propertyFeatures')} />
                    )}

                    {additionalDetails.length > 0 && (
                        <PropertyDescription title={t('additionalDetails')}>
                            {additionalDetails.map((para, idx) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </PropertyDescription>
                    )}

                    {(property.latitude && property.longitude) && (
                        <PropertyLocationSection lat={property.latitude} lng={property.longitude} title={t('location')} />
                    )}

                    {nearby.education.length > 0 && (
                        <PropertyNearbySection
                            title={t('education')}
                            icon={<LiaBuilding />}
                            items={nearby.education}
                        />
                    )}

                    {nearby.health.length > 0 && (
                        <PropertyNearbySection
                            title={t('healthAndMedical')}
                            icon={<GiMilitaryAmbulance />}
                            items={nearby.health}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// Quick Info Badge Component
function QuickInfoBadge({
    icon,
    label,
    value,
    variant = 'default'
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    variant?: 'default' | 'success' | 'warning';
}) {
    const variantStyles = {
        default: 'text-gray-700 bg-gray-50',
        success: 'text-green-700 bg-green-50',
        warning: 'text-orange-700 bg-orange-50',
    };

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${variantStyles[variant]}`}>
            <span className="text-secondary">{icon}</span>
            <div className="flex flex-col">
                <span className="text-xs font-medium opacity-70">{label}</span>
                <span className="text-sm font-semibold">{value}</span>
            </div>
        </div>
    );
}

// Build details array with all facilities
function buildDetailsArray(
    property: Property,
    locale: string,
    tEnums: (key: string) => string
): { label: string; value: string }[] {
    const details: { label: string; value: string }[] = [];

    // Add all facilities from PropertyFacilities
    if (property.facilities) {
        const facilities = property.facilities;

        if (facilities.bedrooms) {
            details.push({
                label: locale === 'ar' ? 'غرف النوم' : 'Bedrooms',
                value: facilities.bedrooms.toString(),
            });
        }
        if (facilities.bathrooms) {
            details.push({
                label: locale === 'ar' ? 'الحمامات' : 'Bathrooms',
                value: facilities.bathrooms.toString(),
            });
        }
        if (facilities.livingRooms) {
            details.push({
                label: locale === 'ar' ? 'غرف المعيشة' : 'Living Rooms',
                value: facilities.livingRooms.toString(),
            });
        }
        if (facilities.kitchen) {
            details.push({
                label: locale === 'ar' ? 'المطبخ' : 'Kitchen',
                value: facilities.kitchen.toString(),
            });
        }
        if (facilities.parking) {
            details.push({
                label: locale === 'ar' ? 'موقف سيارات' : 'Parking',
                value: facilities.parking.toString(),
            });
        }
        if (facilities.elevators) {
            details.push({
                label: locale === 'ar' ? 'المصاعد' : 'Elevators',
                value: facilities.elevators.toString(),
            });
        }
        if (facilities.rooms) {
            details.push({
                label: locale === 'ar' ? 'الغرف' : 'Rooms',
                value: facilities.rooms.toString(),
            });
        }
        if (facilities.majlis) {
            details.push({
                label: locale === 'ar' ? 'المجلس' : 'Majlis',
                value: facilities.majlis.toString(),
            });
        }
        if (facilities.store) {
            details.push({
                label: locale === 'ar' ? 'المخزن' : 'Store',
                value: facilities.store.toString(),
            });
        }
        if (facilities.securityEntrances) {
            details.push({
                label: locale === 'ar' ? 'مداخل الأمان' : 'Security Entrances',
                value: facilities.securityEntrances.toString(),
            });
        }
        if (facilities.maidRoom !== undefined) {
            details.push({
                label: locale === 'ar' ? 'غرفة الخادمة' : 'Maid Room',
                value: facilities.maidRoom ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No'),
            });
        }
        if (facilities.backyard !== undefined) {
            details.push({
                label: locale === 'ar' ? 'الفناء الخلفي' : 'Backyard',
                value: facilities.backyard ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No'),
            });
        }
        if (facilities.centralAC !== undefined) {
            details.push({
                label: locale === 'ar' ? 'تكييف مركزي' : 'Central AC',
                value: facilities.centralAC ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No'),
            });
        }
        if (facilities.desertAC !== undefined) {
            details.push({
                label: locale === 'ar' ? 'تكييف صحراوي' : 'Desert AC',
                value: facilities.desertAC ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No'),
            });
        }
    }

    return details;
}


function BookButton({ id }: { id: string }) {
    const t = useTranslations('property.details');
    const { role } = useAuth()
    return (
        <PrimaryButton
            className="bg-secondary hover:bg-secondary-hover text-white !rounded-[12px] shadow-[0px_4px_12px_0px_#0000001F] lg:!py-3 w-full sm:w-auto shrink-0"
            href={role != 'tenant' ? '/auth/sign-up?type=tenant' : `/booking?property=${id}`}
        >
            {t('bookingNow')}
        </PrimaryButton>
    );
}


type PropertyDescriptionProps = {
    title: string;
    children: React.ReactNode;
};

const PropertyDescription: React.FC<PropertyDescriptionProps> = ({ title, children }) => {
    return (
        <div className="px-4">
            <PropertySectionHeader title={title} />
            <div className="text-[18px] sm:text-[20px] md:text-[20px] leading-[28px] sm:leading-[30px] md:leading-[32px] space-y-4">
                {children}
            </div>
        </div>
    );
};

const PropertyDetailsSection: React.FC<{ details: { label: string; value: string }[], title: string }> = ({ details, title }) => (
    <div className="px-4">
        <PropertySectionHeader title={title} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {details.map(({ label, value }, idx) => (
                <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                    <span className="text-sm md:text-base font-semibold text-gray-600">{label}:</span>
                    <span className="text-base md:text-lg font-semibold text-secondary">{value}</span>
                </div>
            ))}
        </div>
    </div>
);

const PropertyFeaturesSection: React.FC<{ features: string[], title: string }> = ({ features, title }) => (
    <div className="px-4">
        <PropertySectionHeader title={title} />
        <div className="flex flex-wrap gap-3 mt-4">
            {features.map((feature, idx) => (
                <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full border border-secondary/20 hover:bg-secondary/20 transition-colors"
                >
                    <BiCheckCircle className="text-lg shrink-0" />
                    <span className="text-sm md:text-base font-medium">{feature}</span>
                </div>
            ))}
        </div>
    </div>
);

function PropertyLocationSection({ lat, lng, title = "Location" }: {
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

type NearbyItem = {
    name: string;
    distance?: string;
};

type Props = {
    title: string;
    icon?: ReactNode;
    items: NearbyItem[];
    align?: 'start' | 'center' | 'end';
};

function PropertyNearbySection({ title, icon, items, align = 'end' }: Props) {
    return (
        <div className="px-4">
            <PropertySectionHeader title={title} align={align} icon={icon} />
            <div className="space-y-3">
                {items.map(({ name, distance }, idx) => (
                    <div key={idx} className="flex justify-between items-center text-end gap-2">
                        <span className="text-[18px] md:text-[20px] font-medium text-dark text-start">{name}</span>
                        {distance ? (
                            <span className="flex items-center gap-1 text-[18px] md:text-[20px] ">
                                <IoIosPin className="text-[28px] sm:text-[32px] text-secondary shrink-0" />
                                <span>{distance}</span>
                            </span>
                        ) : (
                            <div />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

type PropertySectionHeaderProps = {
    title: string;
    align?: 'start' | 'center' | 'end';
    icon?: ReactNode;
};

const PropertySectionHeader: React.FC<PropertySectionHeaderProps> = ({ title, icon }) => {

    return (
        <div className={`flex items-center gap-2  py-1 border-b border-dark mb-4`}>
            {icon && <span className="text-[42px] text-secondary">{icon}</span>}
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[34px] font-bold">
                {title}
            </h2>
        </div>
    );
};

