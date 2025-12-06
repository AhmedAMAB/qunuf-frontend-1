import DashboardCard from "@/components/dashboard/DashboardCard";
import StatCard from "@/components/dashboard/StatCard";
import { BiBuildings } from "react-icons/bi";
import { IoIosTrendingUp } from "react-icons/io";
import { IoCardOutline } from "react-icons/io5";
import PropertyCard from "./PropertCard";
import { getDashboardHref } from "@/utils/dashboardPaths";
import RentedAnalyticsChart from "@/components/shared/charts/RentedAnalytics";
import { useTranslations } from "next-intl";

const properties = [
    {
        id: "property-6",
        imageSrc: "/properties/property-6.jpg",
        address: "456 Oak Street, Cairo",
        date: new Date("2025-10-10T14:30"),
        rating: 4.2,
    },
    {
        id: "property-2",
        imageSrc: "/properties/property-2.jpg",
        address: "789 Palm Road, Giza",
        date: new Date("2025-10-11T09:15"),
        rating: 3.8,
    },
    {
        id: "property-3",
        imageSrc: "/properties/property-3.jpg",
        address: "321 Cedar Lane, Alexandria",
        date: new Date("2025-10-12T17:45"),
        rating: 4.5,
    },
    {
        id: "property-4",
        imageSrc: "/properties/property-4.jpg",
        address: "654 Elm Street, Mansoura",
        date: new Date("2025-10-13T11:00"),
        rating: 3.9,
    },
    {
        id: "property-5",
        imageSrc: "/properties/property-5.jpg",
        address: "987 Pine Avenue, Tanta",
        date: new Date("2025-10-14T08:20"),
        rating: 4.0,
    },
    {
        id: "property-6",
        imageSrc: "/properties/property-6.jpg",
        address: "159 Birch Blvd, Aswan",
        date: new Date("2025-10-15T19:00"),
        rating: 4.3,
    },
    {
        id: "property-7",
        imageSrc: "/properties/property-7.jpg",
        address: "753 Willow Way, Ismailia",
        date: new Date("2025-10-16T13:10"),
        rating: 3.7,
    },
];


export default function LandlordDashboard() {
    const tStat = useTranslations('dashboard.statistics');
    const tLandlord = useTranslations('dashboard.landlord.root');


    return (
        <div className="space-y-4 h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <StatCard
                    icon={<BiBuildings size={26} className="text-secondary w-[22px] h-[22px] md:w-[26px] md:h-[26px]" />}
                    label={tLandlord('totalProperties')}
                    value={111}
                    trend={tStat('increase', {
                        value: 10
                    })}
                    trendColor="rgba(76,108,90,0.1)"
                    trendIcon={<IoIosTrendingUp size={14} />}
                    subtext={tStat('fromLastWeek')}
                />

                <StatCard
                    icon={<BiBuildings size={26} className="text-secondary w-[22px] h-[22px] md:w-[26px] md:h-[26px]" />}
                    label={tLandlord('totalReviews')}
                    value={110}
                    trend={tStat('increase', {
                        value: 10
                    })}
                    trendColor="rgba(76,108,90,0.1)"
                    trendIcon={<IoIosTrendingUp size={14} />}
                    subtext={tStat('fromLastWeek')}
                />

                <StatCard
                    icon={<IoCardOutline size={26} className="text-secondary w-[22px] h-[22px] md:w-[26px] md:h-[26px]" />}
                    label={tLandlord('freeProperties')}
                    value="20"
                    trend={tStat('newListing', {
                        value: 2
                    })}
                    trendColor="rgba(76,108,90,0.1)"
                    subtext={tStat('inThisWeek')}
                />
                <StatCard
                    icon={<IoCardOutline size={26} className="text-secondary w-[22px] h-[22px] md:w-[26px] md:h-[26px]" />}
                    label={tLandlord('RentedProperties')}
                    value="5"
                    trend={tStat('increase', {
                        value: 10
                    })}
                    trendColor="rgba(76,108,90,0.1)"
                    trendIcon={<IoIosTrendingUp size={14} />}
                    subtext={tStat('fromLastWeek')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DashboardCard
                    title={tStat('rentedAnalytics')}
                    linkLabel={tStat('seeAll')}
                    linkHref={getDashboardHref('contracts')}
                    className="flex flex-col justify-between"
                >
                    <RentedAnalyticsChart data={[102, 130, 120, 110, 150, 160, 120, 110, 70, 60, 60, 50]} />
                </DashboardCard>
                <DashboardCard
                    title={tLandlord('topRentedProperties')}
                    linkLabel={tStat('seeAll')}
                    linkHref={getDashboardHref('contracts')}
                    className="max-h-[620px] overflow-y-auto thin-scrollbar"
                >
                    <div className="divide-y divide-gray-300">
                        {properties.map((property, index) => (
                            <PropertyCard key={index} {...property} />
                        ))}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}