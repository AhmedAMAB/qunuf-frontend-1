import PageHeroSection from '@/components/atoms/PageHeroSection';
import { getLocale, getTranslations } from 'next-intl/server';
import api from '@/libs/axios';
import { Property, PropertyType, RentType } from '@/types/dashboard/properties';
import { resolveUrl } from '@/utils/upload';
import { notFound } from 'next/navigation';
import PropertyDetails from '@/components/pages/PropertyDetails/PropertyDetails';

export async function generateMetadata({ params }: { params: { propertyId: string } }) {
    try {
        const res = await api.get<Property>(`/properties/${params.propertyId}/details`);
        const property = res.data;
        const title = property.name;
        return { title };
    } catch {
        return { title: 'Property Details' };
    }
}

export default async function PropertyPage({ params }: { params: { propertyId: string } }) {
    const { propertyId } = await params;
    const t = await getTranslations('property.details');

    let propertyData: Property;
    try {
        const res = await api.get<Property>(`/properties/${propertyId}/details`);
        propertyData = res.data;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            notFound();
        }
        throw error;
    }


    return (
        <div>
            <PageHeroSection
                title={propertyData.name}
                // description={property.}
                buttonText={t('seeMore')}
            />
            <PropertyDetails property={propertyData} />
        </div>
    );
}
