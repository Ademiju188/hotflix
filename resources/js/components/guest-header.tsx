import { Link, usePage } from "@inertiajs/react";
import { type User } from '@/types';
import { useState } from "react";
interface GuestHeaderProps {
    onSearchSubmit: (e: React.FormEvent) => void;
    searchValue: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function GuestHeader({ onSearchSubmit, searchValue, onSearchChange }: GuestHeaderProps) {
    const { props } = usePage<{ auth: { user: User } }>();
    const user = props?.auth?.user;
    const [searchField, setSearchField] = useState(false);
    const [headerNav, setHeaderNav] = useState(false);


    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="header__content">
                                <a href="/" className="header__logo">
                                    <img src="/assets/frontend/img/logo.png" alt="" />
                                </a>

                                <ul className={`header__nav ${headerNav ? 'header__nav--active' : ''}`}>
                                    <li className="header__nav-item">
                                        <Link className="header__nav-link" href="/">Home</Link>
                                    </li>
                                    <li className="header__nav-item">
                                        <Link className="header__nav-link" href={route('pricing')}>Pricing Plan</Link>
                                    </li>
                                </ul>

                                <div className="header__auth">
                                    <form onSubmit={onSearchSubmit} className={`header__search ${searchField ? 'header__search--active' : ''}`}>
                                        <input
                                            className="header__search-input"
                                            type="text"
                                            placeholder="Search..."
                                            value={searchValue}
                                            onChange={onSearchChange}
                                        />
                                        <button className="header__search-button" type="button">
                                            <i className="ti ti-search"></i>
                                        </button>
                                        <button className="header__search-close" type="button" onClick={e => setSearchField(false)}>
                                            <i className="ti ti-x"></i>
                                        </button>
                                    </form>

                                    <button className="header__search-btn" type="button" onClick={e => setSearchField(true)}>
                                        <i className="ti ti-search"></i>
                                    </button>

                                    <div className="header__profile">
                                        {user ?
                                            (<a href="#" className="header__sign-in header__sign-in--user" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="ti ti-user"></i><span> Dashboard</span></a>)
                                            :
                                            (<Link href={route('login')} className="header__sign-in header__sign-in--user"><i className="ti ti-user"></i><span>Sign In</span></Link>)
                                        }
                                        {user &&
                                            <ul className="dropdown-menu dropdown-menu-end header__dropdown-menu header__dropdown-menu--user">
                                                <li><Link href={user.dashboard}><i className="ti ti-ghost"></i>Profile</Link></li>
                                                <li><Link method="post" className="text-white" href={route('logout')}><i className="ti ti-logout me-2"></i> Logout</Link></li>
                                            </ul>
                                        }
                                    </div>
                                </div>

                                <button className={`header__btn ${headerNav ? 'header__btn--active' : ''}`} type="button" onClick={e => setHeaderNav(!headerNav)}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
