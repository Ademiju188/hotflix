import React, { forwardRef, useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

interface AppHeaderProps {
    sidebarActive: boolean;
    toggleSidebar: () => void;
}

const AppHeaderLayout = forwardRef<HTMLButtonElement, AppHeaderProps>(({ sidebarActive, toggleSidebar }, ref) => {

    const [hideHeader, setHideHeader] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1200px)');

        const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setHideHeader(e.matches);
        };

        // Initial check
        handleMediaChange(mediaQuery);

        // Listen to changes
        mediaQuery.addEventListener('change', handleMediaChange);

        // Cleanup
        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, []);

    return (
        <header  className="header" style={{ display: hideHeader ? 'none' : 'block' }}>
            <div className="header__content">
                <Link href="/" className="header__logo">
                    <img src="/assets/backend/img/logo.png" alt="Admin Logo" />
                </Link>

                <button
                    ref={ref}
                    className={`header__btn ${sidebarActive ? 'header__btn--active' : ''}`}
                    type="button"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                    aria-expanded={sidebarActive}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    );
});

export default AppHeaderLayout;
