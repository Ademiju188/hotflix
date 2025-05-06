import React, { forwardRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';

interface SidebarLink {
    title: string;
    route: string;
    icon: string;
    activeRoutes?: string[];
    subLinks?: SidebarLink[];
}

interface AdminSidebarProps {
    sidebarActive: boolean;
    user: User;
    currentRoute: string;
}

const AdminSidebarLayout = forwardRef<HTMLDivElement, AdminSidebarProps>(({ sidebarActive, user }, ref) => {

    const currentRoute = usePage().props.ziggy?.currentRoute;

    // Main navigation links
    const mainLinks: SidebarLink[] = [
        {
            title: 'Dashboard',
            route: 'system.dashboard',
            icon: 'ti ti-layout-grid',
            activeRoutes: ['system.dashboard']
        },
        {
            title: 'Categories',
            route: 'system.category.index',
            icon: 'ti ti-category',
            activeRoutes: ['system.category.index']
        },
        {
            title: 'Pricing',
            route: 'system.pricing.index',
            icon: 'ti ti-cash',
            activeRoutes: ['system.pricing.index']
        },
        {
            title: 'Movies',
            route: 'system.categories.index',
            icon: 'ti ti-movie',
            activeRoutes: ['system.movie.*'],
            subLinks: [
                {
                    title: 'Add Movie',
                    route: 'system.movie.create',
                    icon: 'ti ti-plus'
                },
                {
                    title: 'Manage Movies',
                    route: 'system.movie.index',
                    icon: 'ti ti-list'
                }
            ]
        },
        {
            title: 'Users',
            route: 'system.user.index',
            icon: 'ti ti-users',
            activeRoutes: ['system.user.index']
        },
        {
            title: 'Settings',
            route: 'system.settings.hero-slider.index',
            icon: 'ti ti-settings',
            activeRoutes: ['system.settings.hero-slider.index'],
            subLinks: [
                {
                    title: 'Hero Slider',
                    route: 'system.settings.hero-slider.index',
                    icon: 'ti ti-movie'
                },
            ]
        }
    ];

    const isActive = (activeRoutes: string[] = []) => {
        if (!currentRoute || !activeRoutes?.length) return false;
        // console.log([activeRoutes, currentRoute])
        return activeRoutes.some(pattern => {
            if (pattern.endsWith('.*')) {
                const baseRoute = pattern.replace('.*', '');
                return currentRoute.startsWith(baseRoute);
            }
            return currentRoute === pattern;
        });
    };

    // Render navigation links recursively
    const renderLinks = (links: SidebarLink[]) => {
        return links.map((link, index) => (
            <li key={index} className="sidebar__nav-item">

                {link.subLinks ? (
                    <>
                        <a
                            className={`sidebar__nav-link ${isActive(link.activeRoutes) ? 'sidebar__nav-link--active' : ''}`}
                            href="#" role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className={link.icon}></i>
                            <span>{link.title}</span>
                            <i className="ti ti-chevron-down"></i>
                        </a>
                        <ul className="dropdown-menu sidebar__dropdown-menu">
                            {link.subLinks.map((subLink, index) => (
                                <li key={index} className={`${isActive(link.activeRoutes) ? 'sidebar__nav-link--active' : ''}`}><Link href={route(subLink.route)}>{subLink.title}</Link></li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <Link
                        href={route(link.route)}
                        className={`sidebar__nav-link ${isActive(link.activeRoutes) ? 'sidebar__nav-link--active' : ''}`}
                    >
                        <i className={link.icon}></i>
                        <span>{link.title}</span>
                    </Link>
                )}
            </li>
        ));
    };

    return (
        <div ref={ref} className={`sidebar ${sidebarActive ? 'sidebar--active' : ''}`}>
            {/* Logo */}
            <Link href="/" className="sidebar__logo">
                <img
                    src="/assets/backend/img/logo.png"
                    alt="Admin Logo"
                    width="120"
                    height="40"
                    loading="lazy"
                />
            </Link>

            {/* User Profile */}
            <div className="sidebar__user">
                <div className="sidebar__user-img">
                    <img
                        src={user.avatar || '/assets/backend/img/user.svg'}
                        alt={`${user.name}'s profile`}
                        width="40"
                        height="40"
                        loading="lazy"
                    />
                </div>
                <div className="sidebar__user-title">
                    <span className="sidebar__user-role">{user.role.name}</span>
                    <p className="sidebar__user-name">{user.name}</p>
                </div>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="sidebar__user-btn"
                    aria-label="Logout"
                >
                    <i className="ti ti-logout"></i>
                </Link>
            </div>

            {/* Navigation */}
            <div className="sidebar__nav-wrap">
                <ul className="sidebar__nav">
                    {renderLinks(mainLinks)}
                </ul>
            </div>

            {/* Footer */}
            <div className="sidebar__copyright">
                © {import.meta.env.VITE_APP_NAME}, 2025—{new Date().getFullYear()}.
            </div>
        </div>
    );
}
);

AdminSidebarLayout.displayName = 'AdminSidebarLayout';

export default AdminSidebarLayout;
