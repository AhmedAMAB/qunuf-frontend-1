import { LuLayoutDashboard } from 'react-icons/lu';
import { FaHeadset, FaRegNewspaper } from 'react-icons/fa';
import { MdOutlineFactCheck, MdOutlinePayments } from 'react-icons/md';
import { Role } from '@/types/global';
import { ComponentType, SVGProps } from 'react';
import { TbContract } from 'react-icons/tb';
import { PiBuildingApartment } from 'react-icons/pi';
import { IoAnalytics } from 'react-icons/io5';
import { getDashboardHref } from '@/utils/dashboardPaths';
import { GrContact } from 'react-icons/gr';
import { HiOutlineUserGroup, HiOutlineUsers } from 'react-icons/hi2';


export type SidebarLink = {
    href: string;
    // key used to get translations
    key: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const tenantLinks: SidebarLink[] = [
    { href: getDashboardHref('tenant', 'root'), key: 'dashboard', Icon: LuLayoutDashboard },
    { href: getDashboardHref('tenant', 'contracts'), key: 'contracts', Icon: TbContract },
    { href: getDashboardHref('tenant', 'renewRequests'), key: 'renewRequests', Icon: MdOutlineFactCheck },
    { href: getDashboardHref('tenant', 'paymentHistory'), key: 'paymentHistory', Icon: MdOutlinePayments },
];


const landlordLinks: SidebarLink[] = [
    { href: getDashboardHref('landlord', 'root'), key: 'dashboard', Icon: LuLayoutDashboard },
    { href: getDashboardHref('landlord', 'contracts'), key: 'contracts', Icon: TbContract },
    { href: getDashboardHref('landlord', 'properties'), key: 'properties', Icon: PiBuildingApartment },
    { href: getDashboardHref('landlord', 'renewRequests'), key: 'renewRequests', Icon: MdOutlineFactCheck },
    { href: getDashboardHref('landlord', 'revenueSummary'), key: 'revenueSummary', Icon: IoAnalytics },
];

const adminLinks: SidebarLink[] = [
    { href: getDashboardHref('admin', 'root'), key: 'dashboard', Icon: LuLayoutDashboard },
    { href: getDashboardHref('admin', 'contactUs'), key: 'contactUs', Icon: GrContact },
    { href: getDashboardHref('admin', 'teamMembers'), key: 'teamMembers', Icon: HiOutlineUsers },
    { href: getDashboardHref('admin', 'blogs'), key: 'blogs', Icon: FaRegNewspaper },
    { href: getDashboardHref('admin', 'aboutUs'), key: 'aboutUs', Icon: HiOutlineUserGroup },
];

// sidebar links per role
export const dashboardItems: Record<Role, SidebarLink[]> = {
    tenant: tenantLinks,
    landlord: landlordLinks,
    admin: adminLinks,
};