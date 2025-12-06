import PropertiesForm, { PropertiesFormType } from "@/components/dashboard/Properties/PropertiesForm";

const mockedProperty: PropertiesFormType = {
    title: "Luxury Family Home",
    size: 250,
    propertyType: "commercial",
    rentType: "monthly",
    price: 12000,
    description: "Spacious villa with a private garden and swimming pool.",
    bathrooms: 3,
    bedrooms: 4,
    garage: 2,
    additionalDetails: "Recently renovated, close to international schools.",
    features: [
        "airConditioning",
        "assistedLiving",
        "controlledAccess",
        "extraStorage",
    ],
    position: { lat: 30.0444, lng: 31.2357 }, // Cairo coords
    nearby: [
        { category: "Education", name: "Eladia's Kids", distance: 2.5 },
        { category: "Shopping", name: "City Stars Mall", distance: 5 },
    ],
    images: [{ url: '/properties/property-2.jpg', isPrimary: true },
    { url: '/properties/property-3.jpg' }
    ], // could be File[] if you’re handling uploads
};


export default function EditPropertyPage() {
    return <PropertiesForm initialData={mockedProperty} />;
}
