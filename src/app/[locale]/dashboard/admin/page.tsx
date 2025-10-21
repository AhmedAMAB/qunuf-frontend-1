import DashboardCard from "@/components/dashboard/DashboardCard";
import StatCard from "@/components/dashboard/StatCard";
import { BiBuildings } from "react-icons/bi";
import { IoCardOutline } from "react-icons/io5";
import { IoIosTrendingUp } from "react-icons/io";
import { getTranslations } from "next-intl/server";
import RentedPropertyCard from "@/components/dashboard/landlord/RentedPropertyCard";
import MaintenanceRequestCard from "@/components/dashboard/admin/MaintenanceRequestCard";
import { MaintenanceRequestCardType } from "@/types/dashboard/maintenance";
import { ReportSalesChart } from "@/components/dashboard/admin/ReportSalesChart";
import { CostBreakdownChart } from "@/components/dashboard/admin/CostBreakdownChart";

const transactions = [
    {
        id: "property-6",
        imageSrc: "/properties/property-6.jpg",
        address: "456 Oak Street, Cairo",
        date: new Date("2025-10-10T14:30"),
        price: 20,
    },
    {
        id: "property-2",
        imageSrc: "/properties/property-2.jpg",
        address: "789 Palm Road, Giza",
        date: new Date("2025-10-11T09:15"),
        price: 20,
    },
    {
        id: "property-3",
        imageSrc: "/properties/property-3.jpg",
        address: "321 Cedar Lane, Alexandria",
        date: new Date("2025-10-12T17:45"),
        price: 20,
    },
    {
        id: "property-4",
        imageSrc: "/properties/property-4.jpg",
        address: "654 Elm Street, Mansoura",
        date: new Date("2025-10-13T11:00"),
        price: 20,
    },
    {
        id: "property-5",
        imageSrc: "/properties/property-5.jpg",
        address: "987 Pine Avenue, Tanta",
        date: new Date("2025-10-14T08:20"),
        price: 20,
    },
    {
        id: "property-6",
        imageSrc: "/properties/property-6.jpg",
        address: "159 Birch Blvd, Aswan",
        date: new Date("2025-10-15T19:00"),
        price: 20,
    },
    {
        id: "property-7",
        imageSrc: "/properties/property-7.jpg",
        address: "753 Willow Way, Ismailia",
        date: new Date("2025-10-16T13:10"),
        price: 20,
    },
];

const requests: MaintenanceRequestCardType[] = [
    {
        type: "Plumbing",
        location: "721 Meadowview",
        requestId: "MR-001",
        issue: "Broken garbage disposal",
        user: {
            name: "Layla Hassan",
            imageSrc: "/users/user-1.jpg",
        },
    },
    {
        type: "Electrical",
        location: "159 Birch Blvd",
        requestId: "MR-002",
        issue: "Non-functional ceiling fan",
        user: {
            name: "Omar El-Masry",
            imageSrc: "/users/user-2.jpg",
        },
    },
    {
        type: "HVAC",
        location: "456 Oak Street",
        requestId: "MR-003",
        issue: "No heat in bathroom",
        user: {
            name: "Sara Nabil",
            imageSrc: "/users/user-3.jpg",
        },
    },
    {
        type: "Plumbing",
        location: "987 Pine Avenue",
        requestId: "MR-004",
        issue: "Leaking shower head",
        user: {
            name: "Youssef Kamal",
            imageSrc: "/users/user-4.jpg",
        },
    },
    {
        type: "Electrical",
        location: "753 Willow Way",
        requestId: "MR-005",
        issue: "Power outage in kitchen",
        user: {
            name: "Nour Adel",
            imageSrc: "/users/user-5.jpg",
        },
    },
];

export default async function AdminPage() {
    const [tAdmin, tStat] = await Promise.all([
        getTranslations("dashboard.admin.root"),
        getTranslations("dashboard.statistics"),
    ]);

    return (
        <div className="space-y-4 h-full overflow-hidden">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    icon={<BiBuildings size={26} className="text-secondary" />}
                    label={tAdmin("totalProperties")}
                    value={111}
                    trend={tStat("increase", { value: 10 })}
                    trendColor="rgba(76,108,90,0.1)"
                    trendIcon={<IoIosTrendingUp size={14} />}
                    subtext={tStat("fromLastWeek")}
                />

                <StatCard
                    icon={<IoCardOutline size={26} className="text-secondary" />}
                    label={tAdmin("freeProperties")}
                    value={20}
                    trend={tStat("newListing", { value: 2 })}
                    trendColor="rgba(76,108,90,0.1)"
                    subtext={tStat("inThisWeek")}
                />

                <StatCard
                    icon={<IoCardOutline size={26} className="text-secondary" />}
                    label={tAdmin("rentedProperties")}
                    value={5}
                    trend={tStat("increase", { value: 10 })}
                    trendColor="rgba(76,108,90,0.1)"
                    trendIcon={<IoIosTrendingUp size={14} />}
                    subtext={tStat("fromLastWeek")}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <DashboardCard
                    title={tStat('reportSales')}
                    className="lg:col-span-2"
                >
                    <ReportSalesChart />
                </DashboardCard>
                <DashboardCard
                    title={tStat('costBreakdown')}
                    className="lg:col-span-1"
                >
                    <CostBreakdownChart />
                </DashboardCard>
            </div>
            {/* Last Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DashboardCard title={tAdmin("lastTransactions")}
                    className="max-h-[620px] overflow-y-auto thin-scrollbar">
                    <div className="divide-y divide-gray-300">

                        {transactions.map((tx, index) => (
                            <RentedPropertyCard key={index} {...tx} />
                        ))}
                    </div>
                </DashboardCard>

                <DashboardCard title={tAdmin("maintenanceRequests")}
                    className="max-h-[620px] overflow-y-auto thin-scrollbar">
                    <div className="divide-y divide-gray-300">

                        {requests.map((req, index) => (
                            <MaintenanceRequestCard key={index} {...req} />
                        ))}
                    </div>
                </DashboardCard>
            </div>

        </div>
    );
}
