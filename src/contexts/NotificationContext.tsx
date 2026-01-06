'use client';

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '@/libs/axios';

// --- Types ---

export interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    relatedEntityType: string | null;
    relatedEntityId: string | null;
    created_at: string;
}
export type NotificationAction =
    | { type: "NEW_NOTIFICATION"; payload: Notification }
    | { type: "MARK_ONE_AS_READ"; payload: { id: string } }
    | { type: "REVERT_MARK_ONE"; payload: { id: string } }
    | { type: "MARK_ALL_AS_READ" }
    | { type: "REVERT_MARK_ALL" };

export type SubscriberCallback = (action: NotificationAction) => void;

interface NotificationContextType {
    unreadNotificationCount: number;
    addIncoming: (notification: Notification) => void;
    markOneAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    subscribe: (callback: SubscriberCallback) => () => void;
}

// --- Context ---

// We initialize with undefined to enforce the use of the Provider
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);

    // Using a Set of callbacks for the Pub/Sub system
    const subscribers = useRef<Set<SubscriberCallback>>(new Set());

    // Assuming useAuth returns an object with a user
    const { user } = useAuth() as { user: { id: string } | null };

    // ------------------------------
    // Pub/Sub System
    // ------------------------------
    const publish = (action: NotificationAction) => {
        subscribers.current.forEach(cb => cb(action));
    };

    const subscribe = (callback: SubscriberCallback) => {
        subscribers.current.add(callback);
        return () => {
            subscribers.current.delete(callback);
        };
    };

    // ------------------------------
    // Notification Actions
    // ------------------------------
    const addIncoming = (notification: Notification) => {
        if (!notification.isRead) {
            setUnreadNotificationCount(prev => prev + 1);
        }

        publish({ type: "NEW_NOTIFICATION", payload: notification });

        setTimeout(() => {
            const els = document.querySelectorAll(
                `[data-notification-id="${notification.id}"]`
            );
            els.forEach(el => el.classList.add("highlight"));
        }, 50);
    };

    const markOneAsRead = async (id: string) => {
        // Optimistic update
        publish({ type: "MARK_ONE_AS_READ", payload: { id } });
        setUnreadNotificationCount(prev => Math.max(prev - 1, 0));

        try {
            await api.put(`/notifications/read/${id}`);
        } catch {
            // Revert on error
            setUnreadNotificationCount(prev => prev + 1);
            publish({ type: "REVERT_MARK_ONE", payload: { id } });
        }
    };

    const markAllAsRead = async () => {
        // Optimistic update
        const prevUnreadCount = unreadNotificationCount;
        setUnreadNotificationCount(0);
        publish({ type: "MARK_ALL_AS_READ" });

        try {
            await api.put('/notifications/read-all');
        } catch {
            // Revert on error
            setUnreadNotificationCount(prevUnreadCount);
            publish({ type: "REVERT_MARK_ALL" });
        }
    };

    // ------------------------------
    // Fetch initial counts
    // ------------------------------
    const fetchUnreadNotificationCount = async () => {
        try {
            const res = await api.get('/notifications/unread-count');
            const count = Number(res?.data?.total_records ?? 0);
            setUnreadNotificationCount(count);
        } catch {
            setUnreadNotificationCount(0);
        }
    };

    // Initial data fetch
    useEffect(() => {
        if (user?.id) {
            fetchUnreadNotificationCount();
        } else {
            setUnreadNotificationCount(0);
        }
    }, [user?.id]);

    return (
        <NotificationContext.Provider
            value={{
                unreadNotificationCount,
                addIncoming,
                markOneAsRead,
                markAllAsRead,
                subscribe,
            }
            }
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};