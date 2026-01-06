

export type Locale = "en" | "ar";

export type Role = 'admin' | 'tenant' | 'landlord';

export type ContractStatus = 'free' | 'reserved';

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',  // voluntary / time-based inactivity
    PENDING_VERIFICATION = 'pending_verification',
    SUSPENDED = 'suspended',  // admin or violation
    DELETED = 'deleted',
}