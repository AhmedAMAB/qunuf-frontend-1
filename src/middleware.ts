import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { getJwtPayload } from './utils/auth';
import { Role } from './types/global';

// -----------------------------
// 1) Initialize next-intl middleware
// -----------------------------
const intlMiddleware = createMiddleware({
    locales: routing.locales,
    localeCookie: {
        name: 'USER_LOCALE',
        maxAge: Number(process.env.LOCALE_COOKIE_MAX_AGE) || 60 * 60 * 24 * 365,
    },
    defaultLocale: routing.defaultLocale,
    localePrefix: 'always',
});

// -----------------------------
// 2) Route definitions
// -----------------------------
interface Route {
    path: string;
    strict?: boolean;
    regex?: RegExp;
}

const PUBLIC_ROUTES: Route[] = [
    { path: '/auth' },
    { path: '/about', strict: true },
    { path: '/blog', strict: true },
    { path: '/contact', strict: true },
    { path: '/properties', strict: true },
    { path: '/', strict: true },
];

// Role-specific routes
const TENANT_ROUTES: string[] = [];
const LANDLORD_ROUTES: string[] = [];
const ADMIN_ROUTES: string[] = [];

// -----------------------------
// 3) Middleware function
// -----------------------------
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    // Detect locale from URL
    const locale =
        routing.locales.find((l) => pathname.startsWith(`/${l}`)) ??
        routing.defaultLocale;

    // Remove locale prefix to compare route
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    // -----------------------------
    // 1) PUBLIC ROUTES → always allowed
    // -----------------------------
    if (isPublicRoute(pathWithoutLocale)) {
        return intlMiddleware(request);
    }

    // -----------------------------
    // 2) Must be authenticated
    // -----------------------------
    if (!token) {
        return NextResponse.redirect(new URL(`/${locale}/auth/sign-in`, request.url));
    }

    // -----------------------------
    // 3) Decode JWT and extract role
    // -----------------------------
    const payload = await getJwtPayload(token);
    if (!payload) {
        return NextResponse.redirect(new URL(`/${locale}/auth/sign-in`, request.url));
    }

    const role: Role = payload.role as Role;

    // -----------------------------
    // 4) Role-specific protection
    // -----------------------------
    if (TENANT_ROUTES.some((r) => pathWithoutLocale.startsWith(r))) {
        if (role !== 'tenant') {
            return NextResponse.redirect(new URL(`/${locale}/auth/sign-in`, request.url));
        }
    }

    if (LANDLORD_ROUTES.some((r) => pathWithoutLocale.startsWith(r))) {
        if (role !== 'tenant') {
            return NextResponse.redirect(new URL(`/${locale}/auth/sign-in`, request.url));
        }
    }

    if (ADMIN_ROUTES.some((r) => pathWithoutLocale.startsWith(r))) {
        if (role !== 'admin') {
            return NextResponse.redirect(new URL(`/${locale}/auth/sign-in`, request.url));
        }
    }

    // -----------------------------
    // Everything OK → run next-intl
    // -----------------------------
    return intlMiddleware(request);
}

// -----------------------------
// 5) Required matcher for intl + auth
// -----------------------------
export const config = {
    matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};

// -----------------------------
// Helper functions
// -----------------------------
function createPathRegex(pattern: string, exact = true): RegExp {
    // Escape regex special chars except ":" and "/"
    let regexStr = pattern.replace(/([.+*?=^!${}()[\]|\\])/g, "\\$1");

    // Replace :param with a capturing group for non-slash segments
    regexStr = regexStr.replace(/:([A-Za-z0-9_]+)/g, '([^/]+)');

    if (exact) {
        regexStr = `^${regexStr}$`;
    } else {
        regexStr = `^${regexStr}(?:/.*)?$`;
    }

    return new RegExp(regexStr);
}

function isPublicRoute(path: string): boolean {
    return PUBLIC_ROUTES.some((route) => {
        if (route.regex) {
            return createPathRegex(route.path, route?.strict).test(path);
        }
        if (route.strict) {
            return path === route.path;
        }
        // default: startsWith
        return path.startsWith(route.path);
    });
}
