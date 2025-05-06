import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    uuid: string;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    dashboard: string;
    created_at: string;
    verified: boolean;
    [key: string]: unknown;
    subscription: {
        has_subscription: boolean;
        message?: string;
        cta?: {
            text: string;
            route: string;
        };
        plan_name?: string;
        next_bill_date?: string;
        amount?: number;
        currency?: string;
        payment_method?: string;
        card_last_four?: string;
        auto_renew?: boolean;
        status?: string;
    };
}
