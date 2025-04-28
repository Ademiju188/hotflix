import React, { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import AppHeaderLayout from './app/app-header-layout';
import AppSidebarLayout from './app/app-sidebar-layout';
import AdminSidebarLayout from './app/admin-sidebar-layout';
import Notification from '@/components/notification';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/admin.css';
// import '../../css/admin.custom.css';

// Define proper TypeScript interfaces
interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    // Add other user properties as needed
}

interface FlashMessage {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    message?: FlashMessage;
}

interface AppLayoutProps {
    children: React.ReactNode;
    title: string,
    mainTitle: boolean
}


const AppLayout: React.FC<AppLayoutProps> = ({ children, title, mainTitle = true }) => {
    const { props } = usePage<PageProps>();
    const { auth, message } = props;

    const [sidebarActive, setSidebarActive] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const headerBtnRef = useRef<HTMLButtonElement>(null);
    const [main, setMain] = useState(mainTitle);

    const toggleSidebar = () => setSidebarActive(prev => !prev);
    const closeSidebar = () => setSidebarActive(false);

    const { flash, errors }:any = usePage().props;

    useEffect(() => {
        // Display success flash messages
        if (flash?.message?.success) {
            toast.success(flash.message.success);
        }

        // Display error flash messages
        if (flash?.message?.error) {
            toast.error(flash.message.error);
        }

        // Display validation errors
        if (errors && Object.keys(errors).length > 0) {
            // Display general form error if exists
            if (errors.message) {
                toast.error(errors.message);
            }

            // Display individual field errors
            Object.entries(errors).forEach(([field, message]) => {
                // Skip the general message since we already displayed it
                if (field !== 'message') {
                    toast.error(`${field}: ${message}`, {
                        toastId: `validation-error-${field}` // Prevent duplicates
                    });
                }
            });
        }
    }, [flash, errors]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarActive &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node) &&
                headerBtnRef.current &&
                !headerBtnRef.current.contains(event.target as Node)) {
                closeSidebar();
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeSidebar();
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [sidebarActive]);

    // Render the appropriate sidebar based on user role
    const renderSidebar = () => {
        if (!auth?.user) return null;
        switch (auth.user.role.id) {
            case 1: // Admin
                return (
                    <AdminSidebarLayout
                        sidebarActive={sidebarActive}
                        ref={sidebarRef}
                        user={auth.user}
                    />
                );
            case 3: // Regular user
                return (
                    <AppSidebarLayout
                        sidebarActive={sidebarActive}
                        ref={sidebarRef}
                        user={auth.user}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={9000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <AppHeaderLayout
                sidebarActive={sidebarActive}
                toggleSidebar={toggleSidebar}
                ref={headerBtnRef}
                user={auth?.user}
            />

            {renderSidebar()}

            <div className={`main-content ${sidebarActive ? 'main-content--shifted' : ''}`}>
                {main ?
                    (<main className="main">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="main__title">
                                        <h2>{title}</h2>
                                    </div>
                                </div>
                                {children}
                            </div>
                        </div>
                    </main>) :
                    (<main className="main">
                        <div className="container-fluid">
                            {children}
                        </div>
                    </main>
                    )}
            </div>

            {/* {message && <Notification flash={message} />} */}
        </>
    );
};

export default AppLayout;
