import PrimaryButton from "@/components/shared/buttons/PrimaryButton";
import ImageGallery from "@/components/shared/ImageGallery";
import PropertyDescription from "./PropertyDescription";
import PropertyDetailsSection from "./PropertyDetailsSection";
import PropertyFeaturesSection from "./PropertyFeaturesSection";
import PropertyLocationSection from "./PropertyLocationSection";
import PropertyNearbySection from "./PropertyNearbySection";
import { LiaBuilding } from "react-icons/lia";
import { GiMilitaryAmbulance } from "react-icons/gi";
import { getLocale, getTranslations } from "next-intl/server";
import { Property, RentType } from "@/types/dashboard/properties";
import { BiArea, BiGroup, BiCheckCircle, BiXCircle } from "react-icons/bi";
import { resolveUrl } from "@/utils/upload";
import BookButton from "./BookButton";



export default async function PropertyDetails({ property }: { property: Property }) {
    const tEnums = await getTranslations('property.enums');
    const t = await getTranslations('property.details');
    const locale = await getLocale();

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
