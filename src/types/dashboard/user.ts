import { Role, UserStatus } from "../global";


// Frontend User Interface
export interface User {
    id: string; // from CoreEntity
    email: string;
    name: string;
    role: Role;
    status: UserStatus;

    // Profile Information
    imagePath: string | null;
    phoneNumber: string | null;
    birthDate: string | null; // Dates from Postgres 'date' type come as strings ISO

    // Identity and Country
    countryId: string | null;
    country?: { id: string; name: string; flag?: string }; // Minimal Country object
    identityType: string | null;
    identityNumber: string | null;
    identityOtherType: string | null;

    // Stats
    notificationUnreadCount: number;
    notificationsEnabled: boolean;
    lastLogin: string | null;

    // Metadata from CoreEntity
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}