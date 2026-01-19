'use client';

import DashboardCard from "@/components/dashboard/DashboardCard";
import StatCard from "@/components/dashboard/StatCard";
import { BiBuildings } from "react-icons/bi";
import { IoCardOutline } from "react-icons/io5";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import RentedPropertyCard from "@/components/dashboard/landlord/RentedPropertyCard";
import { ReportSalesChart } from "@/components/dashboard/admin/ReportSalesChart";
import { CostBreakdownChart } from "@/components/dashboard/admin/CostBreakdownChart";
import { useTranslations } from "next-intl";
import { useDashboardStats } from "@/hooks/dashboard/useDashboardStats";
import { ErrorCard } from "@/components/shared/ErrorCard";
import EmptyState from "@/components/shared/EmptyState";
import { resolveUrl } from "@/utils/upload";
import Link from "next/link";
import { getTrend } from "@/utils/helpers";

export default function AdminDashboard() {
    const tStat = useTranslations('dashboard.statistics');
    const tAdmin = useTranslations('dashboard.admin.root');
    const { stats, chartData, recentContracts, recentProperties, loading, error, refetch } = useDashboardStats();

    if (error && !loading) {
        return (
            <ErrorCard
                message={error}
                onAction={refetch}
            />
        );
    }

    const statsValue = stats || {};
    const contractsPerDay = chartData?.contractsPerDay || [];
    const statusBreakdown = chartData?.statusBreakdown || {};
    const totalContracts = chartData?.totalContracts || 0;

    return (
        <div className="space-y-4 h-full overflow-hidden">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(() => {
                    const stat = statsValue.totalProperties;
                    const trend = getTrend(stat?.changePercent);

                    return (
                        <StatCard
                            icon={<BiBuildings size={26} className="text-secondary" />}
                            label={tAdmin("totalProperties")}
                            value={loading ? "..." : stat?.value ?? 0}
                            trend={
                                trend
                                    ? trend.isUp
                                        ? tStat("increase", { value: trend.value })
                                        : tStat("decrease", { value: trend.value })
                                    : undefined
                            }
                            trendColor={trend?.isUp ? "rgba(76,108,90,0.1)" : "rgba(220,38,38,0.1)"}
                            trendIcon={
                                trend ? (
                                    trend.isUp ? <IoIosTrendingUp size={14} /> : <IoIosTrendingDown size={14} />
                                ) : undefined
                            }
                            subtext={tStat("fromLastWeek")}
                        />
                    );
                })()}

                {/* Free Properties */}
                {(() => {
                    const stat = statsValue.freeProperties;
                    const trend = getTrend(stat?.changePercent);

                    return (
                        <StatCard
                            icon={<IoCardOutline size={26} className="text-secondary" />}
                            label={tAdmin("freeProperties")}
                            value={loading ? "..." : stat?.value ?? 0}
                            trend={
                                trend
                                    ? trend.isUp
                                        ? tStat("increase", { value: trend.value })
                                        : tStat("decrease", { value: trend.value })
                                    : undefined
                            }
                            trendColor={trend?.isUp ? "rgba(76,108,90,0.1)" : "rgba(220,38,38,0.1)"}
                            trendIcon={
                                trend ? (
                                    trend.isUp ? <IoIosTrendingUp size={14} /> : <IoIosTrendingDown size={14} />
                                ) : undefined
                            }
                            subtext={tStat("fromLastWeek")}
                        />
                    );
                })()}

                {/* Rented Properties */}
                {(() => {
                    const stat = statsValue.rentedProperties;
                    const trend = getTrend(stat?.changePercent);

                    return (
                        <StatCard
                            icon={<IoCardOutline size={26} className="text-secondary" />}
                            label={tAdmin("rentedProperties")}
                            value={loading ? "..." : stat?.value ?? 0}
                            trend={
                                trend
                                    ? trend.isUp
                                        ? tStat("increase", { value: trend.value })
                                        : tStat("decrease", { value: trend.value })
                                    : undefined
                            }
                            trendColor={trend?.isUp ? "rgba(76,108,90,0.1)" : "rgba(220,38,38,0.1)"}
                            trendIcon={
                                trend ? (
                                    trend.isUp ? <IoIosTrendingUp size={14} /> : <IoIosTrendingDown size={14} />
                                ) : undefined
                            }
                            subtext={tStat("fromLastWeek")}
                        />
                    );
                })()}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <DashboardCard
                    title={tStat('contractsCreated')}
                    className="lg:col-span-2"
                >
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                        </div>
                    ) : (
                        <ReportSalesChart data={contractsPerDay} />
                    )}
                </DashboardCard>
                <DashboardCard
                    title={tStat('costBreakdown')}
                    className="lg:col-span-1"
                >
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                        </div>
                    ) : (
                        <CostBreakdownChart statusBreakdown={statusBreakdown} totalContracts={totalContracts} />
                    )}
                </DashboardCard>
            </div>

            {/* Last Transactions (Contracts) & Recent Properties */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DashboardCard title={tAdmin("lastTransactions")}
                    className="max-h-[620px] overflow-y-auto thin-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                        </div>
                    ) : recentContracts.length === 0 ? (
                        <EmptyState
                            title={tAdmin("noContracts")}
                            message={tAdmin("noContractsMessage")}
                        />
                    ) : (
                        <div className="divide-y divide-gray-300">
                            {recentContracts.map((contract) => {
                                const imageSrc = contract.property?.images?.find(img => img.is_primary)?.url ||
                                    contract.property?.images?.[0]?.url ||
                                    "/images/property-placeholder.png";

                                return (
                                    <RentedPropertyCard
                                        key={contract.id}
                                        imageSrc={resolveUrl(imageSrc)}
                                        address={contract.propertyName}
                                        date={new Date(contract.date)}
                                        price={contract.price}
                                        id={contract.property?.slug}
                                    />
                                );
                            })}
                        </div>
                    )}
                </DashboardCard>

                <DashboardCard title={tAdmin("recentProperties")}
                    className="max-h-[620px] overflow-y-auto thin-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                        </div>
                    ) : recentProperties.length === 0 ? (
                        <EmptyState
                            title={tAdmin("noProperties")}
                            message={tAdmin("noPropertiesMessage")}
                        />
                    ) : (
                        <div className="divide-y divide-gray-300">
                            {recentProperties.map((property) => (
                                <div key={property.id} className="flex justify-between items-center gap-4 py-2">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-[58px] h-[58px]">
                                            <img
                                                src={resolveUrl(property.imageSrc)}
                                                alt={property.name}
                                                className="rounded-full object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Link
                                                href={`/properties/${property.slug}`}
                                                className="font-medium text-sm sm:text-base hover:underline decoration-secondary"
                                            >
                                                {property.name}
                                            </Link>
                                            <p className="text-gray-500 text-sm sm:text-base">
                                                {new Date(property.date).toLocaleString("en-US", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DashboardCard>
            </div>
        </div>
    );
}
