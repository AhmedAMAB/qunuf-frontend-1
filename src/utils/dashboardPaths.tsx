import { Role } from "@/types/global";

export type DashboardPathKey =
    | 'root'
    | 'contracts'
    | 'renewRequests'
    | 'paymentHistory'
    | 'properties'
    | 'revenue'
    | 'settings'
    | 'account'
    | 'notifications'
    | 'payments'
    | 'support'
    | 'chats'
    | 'revenueSummary'
    | 'addProperty';

export const dashboardPaths: Record<DashboardPathKey, string> = {
    root: '',
    contracts: '/contracts',
    renewRequests: '/renew-requests',
    paymentHistory: '/payments-history',
    properties: '/properties',
    revenue: '/revenue',
    settings: '/settings',
    account: '/settings/account',
    notifications: '/settings/notifications',
    payments: '/settings/payments',
    support: '/support',
    chats: '/chats',
    revenueSummary: '/revenue-summary',
    addProperty: '/properties/add',
};


export function getDashboardHref(
    role: Role,
    key: DashboardPathKey,
    query?: Record<string, string | number | boolean>
): string {
    const basePath = `/dashboard/${role}${dashboardPaths[key]}`;

    if (!query) return basePath;

    const searchParams = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
        searchParams.append(k, String(v));
    }

    return `${basePath}?${searchParams.toString()}`;
}


export function isPathActive(normalizedPath: string, role: Role, key: DashboardPathKey): boolean {
    const basePath = getDashboardHref(role, key);
    return normalizedPath.startsWith(basePath);
}
