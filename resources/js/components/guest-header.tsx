import { Link } from "@inertiajs/react";

export default function GuestHeader() {
    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="header__content">
                                <a href="#" className="header__logo">
                                    <img src="/assets/frontend/img/logo.svg" alt="" />
                                </a>

                                <ul className="header__nav">
                                    <li className="header__nav-item">
                                        <Link className="header__nav-link" href="/">Home</Link>
                                    </li>
                                    {/* <li className="header__nav-item">
                                        <a className="header__nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Catalog <i className="ti ti-chevron-down"></i></a>
                                        <ul className="dropdown-menu header__dropdown-menu">
                                            <li><a href="catalog.html">Catalog style 1</a></li>
                                            <li><a href="catalog2.html">Catalog style 2</a></li>
                                            <li><a href="details.html">Details Movie</a></li>
                                            <li><a href="details2.html">Details TV Series</a></li>
                                        </ul>
                                    </li> */}

                                </ul>

                                <div className="header__auth">
                                    <form action="#" className="header__search">
                                        <input className="header__search-input" type="text" placeholder="Search..." />
                                        <button className="header__search-button" type="button">
                                            <i className="ti ti-search"></i>
                                        </button>
                                        <button className="header__search-close" type="button">
                                            <i className="ti ti-x"></i>
                                        </button>
                                    </form>

                                    <button className="header__search-btn" type="button">
                                        <i className="ti ti-search"></i>
                                    </button>

                                    <div className="header__profile">
                                        <Link href={route('login')} className="header__sign-in header__sign-in--user"><span>Sign In</span></Link>
                                        {/* <a className="header__sign-in header__sign-in--user" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="ti ti-user"></i>
                                            <span>Nickname</span>
                                        </a>

                                        <ul className="dropdown-menu dropdown-menu-end header__dropdown-menu header__dropdown-menu--user">
                                            <li><a href="profile.html"><i className="ti ti-ghost"></i>Profile</a></li>
                                            <li><a href="profile.html"><i className="ti ti-stereo-glasses"></i>Subscription</a></li>
                                            <li><a href="profile.html"><i className="ti ti-bookmark"></i>Favorites</a></li>
                                            <li><a href="profile.html"><i className="ti ti-settings"></i>Settings</a></li>
                                            <li><a href="#"><i className="ti ti-logout"></i>Logout</a></li>
                                        </ul> */}
                                    </div>
                                </div>

                                <button className="header__btn" type="button">
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
