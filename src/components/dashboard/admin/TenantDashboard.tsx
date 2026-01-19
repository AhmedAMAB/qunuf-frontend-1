'use client';
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatCard from "@/components/dashboard/StatCard";
import { BiBuildings } from "react-icons/bi";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { IoCardOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { useDashboardStats } from "@/hooks/dashboard/useDashboardStats";
import EmptyState from "@/components/shared/EmptyState";
import { ErrorCard } from "@/components/shared/ErrorCard";
import RentedPropertyCard from "@/components/dashboard/landlord/RentedPropertyCard";
import { resolveUrl } from "@/utils/upload";
import { getTrend } from "@/utils/helpers";

export default function TenantDashboard() {
    const tStat = useTranslations('dashboard.statistics');
    const tTenant = useTranslations('dashboard.tenant.root');
    const { stats, recentContracts, loading, error, refetch } = useDashboardStats();

    if (error && !loading) {
        return <ErrorCard message={error} onAction={refetch} />;
    }

    const statsValue = stats || {};

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Active Contracts */}
                {(() => {
                    const stat = statsValue.activeContracts;
                    const trend = getTrend(stat?.changePercent);

                    return (
                        <StatCard
                            icon={<BiBuildings size={26} className="text-secondary w-[22px] h-[22px] md:w-[26px] md:h-[26px]" />}
                            label={tTenant('reservedProperty')}
                            value={loading ? '...' : stat?.value ?? 0}
                            trend={
                                trend
                                    ? trend.isUp
                                        ? tStat('increase', { value: trend.value })
                                        : tStat('decrease', { value: trend.value })
                                    : undefined
                            }
                            trendIcon={
                                trend
                                    ? trend.isUp
                                        ? <IoIosTrendingUp size={14} />
                                        : <IoIosTrendingDown size={14} />
                                    : undefined
                            }
                            trendColor={trend?.isUp ? 'rgba(76,108,90,0.1)' : 'rgba(220,38,38,0.1)'}
                            subtext={tStat('fromLastWeek')}
                        />
                    );
                })()}

                {/* Pending Renew Requests */}
                {(() => {
                    const stat = statsValue.totalPendingRenewRequests;
                    const trend = getTrend(stat?.changePercent);

                    return (
                        <StatCard
                            icon={<BiBuildings size={26} className="text-secondary" />}
                            label={tTenant('pendingRenewRequests')}
                            value={loading ? '...' : stat?.value ?? 0}
                            trend={
                                trend
                                    ? trend.isUp
                                        ? tStat('increase', { value: trend.value })
                                        : tStat('decrease', { value: trend.value })
                                    : undefined
                            }
                            trendIcon={
                                trend
                                    ? trend.isUp
                                        ? <IoIosTrendingUp size={14} />
                                        : <IoIosTrendingDown size={14} />
                                    : undefined
                            }
                            trendColor={trend?.isUp ? 'rgba(76,108,90,0.1)' : 'rgba(220,38,38,0.1)'}
                            subtext={tStat('fromLastWeek')}
                        />
                    );
                })()}

                {/* Total Ejar Amount */}
                {(() => {
                    const stat = statsValue.totalAmountWithEjar;
                    const trend = getTrend(stat?.changePercent);

                    return (
                        <StatCard
                            icon={<IoCardOutline size={26} className="text-secondary" />}
                            label={tTenant('totalEjarAmount')}
                            value={
                                loading
                                    ? '...'
                                    : new Intl.NumberFormat(undefined, {
                                        style: 'currency',
                                        currency: 'SAR',
                                    }).format(stat?.value ?? 0)
                            }
                            trend={
                                trend
                                    ? trend.isUp
                                        ? tStat('increase', { value: trend.value })
                                        : tStat('decrease', { value: trend.value })
                                    : undefined
                            }
                            trendIcon={
                                trend
                                    ? trend.isUp
                                        ? <IoIosTrendingUp size={14} />
                                        : <IoIosTrendingDown size={14} />
                                    : undefined
                            }
                            trendColor={trend?.isUp ? 'rgba(76,108,90,0.1)' : 'rgba(220,38,38,0.1)'}
                            subtext={tStat('fromLastWeek')}
                        />
                    );
                })()}

            </div>

            <DashboardCard
                title={tTenant('lastRentedProperties')}
                className="max-h-[620px] overflow-y-auto thin-scrollbar"
            >
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                    </div>
                ) : recentContracts.length === 0 ? (
                    <EmptyState
                        title={tTenant('noContracts')}
                        message={tTenant('noContractsMessage')}
                    />
                ) : (
                    <div className="divide-y divide-gray-300">
                        {recentContracts.map((contract) => {
                            const imageSrc = contract.property?.images?.find(img => img.is_primary)?.url
                                || contract.property?.images?.[0]?.url
                                || "/images/property-placeholder.png";
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
        </div>
    );
}