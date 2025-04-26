import React, { forwardRef } from 'react';
import { Link } from '@inertiajs/react';
import { User } from '@/types';

interface AppSidebarProps {
    sidebarActive: boolean;
    user: User;
}

const AppSidebarLayout = forwardRef<HTMLDivElement, AppSidebarProps>(({ sidebarActive, user }, ref) => {
    return (
        <div ref={ref} className={`sidebar ${sidebarActive ? 'sidebar--active' : ''}`}>
            <Link href="#" className="sidebar__logo">
                <img src="/assets/backend/img/logo.svg" alt="Admin Logo" />
            </Link>

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

            <div className="sidebar__nav-wrap">
                <ul className="sidebar__nav">
                    <li className="sidebar__nav-item">
                        <Link href="/dashboard" className="sidebar__nav-link">
                            <i className="ti ti-layout-grid"></i> <span>Dashboard</span>
                        </Link>
                    </li>
                    {/* Other nav items... */}
                </ul>
            </div>

            <div className="sidebar__copyright">
                © HOTFLIX, 2019—2024. <br />
                Create by <a href="https://themeforest.net/user/dmitryvolkov/portfolio" target="_blank" rel="noopener noreferrer">Dmitry Volkov</a>
            </div>
        </div>
    );
});

export default AppSidebarLayout;
