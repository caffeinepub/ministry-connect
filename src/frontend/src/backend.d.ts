import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PrayerResponse {
    text: string;
    timestamp: bigint;
}
export interface PrayerRequest {
    text: string;
    timestamp: bigint;
}
export interface PrayerEntry {
    prayerId: PrayerId;
    request: PrayerRequest;
    user: Principal;
    response: PrayerResponse;
}
export type PrayerId = bigint;
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPrayer(prayerId: PrayerId): Promise<PrayerEntry>;
    getPrayerHistory(): Promise<Array<PrayerEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitPrayer(requestText: string): Promise<PrayerId>;
}
