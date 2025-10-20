import { Role } from '@/types/global';
import { usePathname } from 'next/navigation';

export function useRoleFromPath(): Role {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean); // removes empty strings

    const dashboardIndex = segments.indexOf('dashboard');
    const role = segments[dashboardIndex + 1];

    if (role === 'tenant' || role === 'landlord' || role === 'admin') {
        return role;
    }


    return 'tenant';
}
