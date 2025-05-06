import { Link } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

export default function Header() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [sidebarActive, setSidebarActive] = useState(false);
    const [headerBtnActive, setHeaderBtnActive] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
        setHeaderBtnActive(!headerBtnActive);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setSidebarActive(false);
            setHeaderBtnActive(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <header className="py-3" ref={dropdownRef}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    {/* <a href="/" className="d-flex align-items-center text-decoration-none"> */}
                    <Link href="/" className="header__logo">
                        <img src="/assets/backend/img/logo.png" alt="Admin Logo" />
                    </Link>
                    {/* </a> */}
                    <div className="d-flex align-items-center">
                        <div className="ms-4 profile-dropdown">
                            <button
                                className="btn bg-transparent border-0 d-flex align-items-center text-white"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="profile-circle">
                                    <span>P</span>
                                </div>
                                <span className="d-none d-md-block me-2">Profile</span>
                                <i className={`ti ${showDropdown ? 'ti-chevron-up' : 'ti-chevron-down'} me-2`}></i>
                            </button>

                            {showDropdown && (
                                <div className="profile-dropdown-menu">
                                    <Link href={route('logout')}  method="post"  className="profile-dropdown-item d-flex align-items-center">
                                        <i className="ti ti-logout me-2"></i>
                                        Log out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
