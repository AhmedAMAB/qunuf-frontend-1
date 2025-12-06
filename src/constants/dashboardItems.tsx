import { LuLayoutDashboard } from 'react-icons/lu';
import { FaHeadset, FaRegNewspaper } from 'react-icons/fa';
import { MdOutlineFactCheck, MdOutlinePayments } from 'react-icons/md';
import { Role } from '@/types/global';
import { ComponentType, SVGProps } from 'react';
import { TbBuildingCommunity, TbContract } from 'react-icons/tb';
import { PiBuildingApartment } from 'react-icons/pi';
import { IoAnalytics, IoSettingsOutline } from 'react-icons/io5';
import { getDashboardHref } from '@/utils/dashboardPaths';
import { GrContact } from 'react-icons/gr';
import { HiOutlineUserGroup, HiOutlineUsers } from 'react-icons/hi2';

export type SidebarLink = {
    href: string;
    // key used to get translations
    key: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    className?: string
};

const common: SidebarLink[] = [
    { href: getDashboardHref('settings'), key: 'settings', Icon: IoSettingsOutline, className: 'lg:mt-12' },
    { href: getDashboardHref('support'), key: 'support', Icon: FaHeadset },
]
const tenantLinks: SidebarLink[] = [
    { href: getDashboardHref('root'), key: 'dashboard', Icon: LuLayoutDashboard },
    { href: getDashboardHref('contracts'), key: 'contracts', Icon: TbContract },
    { href: getDashboardHref('renewRequests'), key: 'renewRequests', Icon: MdOutlineFactCheck },
    { href: getDashboardHref('paymentHistory'), key: 'paymentHistory', Icon: MdOutlinePayments },
    ...common,
];


const landlordLinks: SidebarLink[] = [
    { href: getDashboardHref('root'), key: 'dashboard', Icon: LuLayoutDashboard },
    { href: getDashboardHref('contracts'), key: 'contracts', Icon: TbContract },
    { href: getDashboardHref('properties'), key: 'properties', Icon: PiBuildingApartment },
    { href: getDashboardHref('renewRequests'), key: 'renewRequests', Icon: MdOutlineFactCheck },
    { href: getDashboardHref('revenueSummary'), key: 'revenueSummary', Icon: IoAnalytics },
    ...common,
];

const adminLinks: SidebarLink[] = [
    { href: getDashboardHref('root'), key: 'dashboard', Icon: LuLayoutDashboard },
    { href: getDashboardHref('contactUs'), key: 'contactUs', Icon: GrContact },
    { href: getDashboardHref('blogs'), key: 'blogs', Icon: FaRegNewspaper },
    { href: getDashboardHref('teamMembers'), key: 'teamMembers', Icon: HiOutlineUsers },
    { href: getDashboardHref('aboutUs'), key: 'aboutUs', Icon: HiOutlineUserGroup },
    { href: getDashboardHref('departments'), key: 'departments', Icon: TbBuildingCommunity },
    ...common,
];

// sidebar links per role
export const dashboardItems: Record<Role, SidebarLink[]> = {
    tenant: tenantLinks,
    landlord: landlordLinks,
    admin: adminLinks,
};