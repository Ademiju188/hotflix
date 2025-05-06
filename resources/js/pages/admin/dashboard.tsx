import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ users_count, subscriptions_count, payments_count, series_count }) {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [headerBtnActive, setHeaderBtnActive] = useState(false);

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
        setHeaderBtnActive(!headerBtnActive);
    };

    return (
        <>
            <Head title='Dashboard' />
            <AppLayout title='Dashboard' mainTitle={true}>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stats">
                        <span>Total Users</span>
                        <p>{users_count}</p>
                        <i className="ti ti-users"></i>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stats">
                        <span>Total Series</span>
                        <p>{series_count}</p>
                        <i className="ti ti-movie"></i>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stats">
                        <span>Total Payments</span>
                        <p>{payments_count}</p>
                        <i className="ti ti-cash"></i>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stats">
                        <span>Total Subscriptions</span>
                        <p>{subscriptions_count}</p>
                        <i className="ti ti-star-half-filled"></i>
                    </div>
                </div>

                {/* <div className="row">
                    <div className="col-12 col-xl-6">
                        <div className="dashbox">
                            <div className="dashbox__title">
                                <h3><i className="ti ti-trophy"></i> Top items</h3>

                                <div className="dashbox__wrap">
                                    <a className="dashbox__refresh" href="#"><i className="ti ti-refresh"></i></a>
                                    <a className="dashbox__more" href="catalog.html">View All</a>
                                </div>
                            </div>

                            <div className="dashbox__table-wrap dashbox__table-wrap--1">
                                <table className="dashbox__table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>TITLE</th>
                                            <th>CATEGORY</th>
                                            <th>RATING</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">241</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">The Lost City</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Movie</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 9.2</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">825</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Undercurrents</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Movie</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 9.1</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">9271</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Tales from the Underworld</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">TV Series</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 9.0</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">635</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">The Unseen World</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">TV Series</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 8.9</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">825</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Redemption Road</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">TV Series</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 8.9</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-6">
                        <div className="dashbox">
                            <div className="dashbox__title">
                                <h3><i className="ti ti-movie"></i> Latest items</h3>

                                <div className="dashbox__wrap">
                                    <a className="dashbox__refresh" href="#"><i className="ti ti-refresh"></i></a>
                                    <a className="dashbox__more" href="catalog.html">View All</a>
                                </div>
                            </div>

                            <div className="dashbox__table-wrap dashbox__table-wrap--2">
                                <table className="dashbox__table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>ITEM</th>
                                            <th>CATEGORY</th>
                                            <th>RATING</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">824</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">I Dream in Another Language</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">TV Series</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 7.2</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">602</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Benched</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Movie</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 6.3</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">538</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Whitney</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">TV Show</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 8.4</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">129</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Blindspotting</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Anime</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 9.0</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">360</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Another</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Movie</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 7.7</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-6">
                        <div className="dashbox">
                            <div className="dashbox__title">
                                <h3><i className="ti ti-users"></i> Latest users</h3>

                                <div className="dashbox__wrap">
                                    <a className="dashbox__refresh" href="#"><i className="ti ti-refresh"></i></a>
                                    <a className="dashbox__more" href="users.html">View All</a>
                                </div>
                            </div>

                            <div className="dashbox__table-wrap dashbox__table-wrap--3">
                                <table className="dashbox__table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>FULL NAME</th>
                                            <th>EMAIL</th>
                                            <th>USERNAME</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text">23</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Brian Cranston</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">bcxwz@email.com</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">BrianXWZ</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text">22</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Jesse Plemons</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">jess@email.com</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Jesse.P</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text">21</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Matt Jones</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">matt@email.com</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Matty</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text">20</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Tess Harper</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">harper@email.com</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Harper123</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text">19</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Jonathan Banks</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">bank@email.com</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Jonathan</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-6">
                        <div className="dashbox">
                            <div className="dashbox__title">
                                <h3><i className="ti ti-star-half-filled"></i> Latest reviews</h3>

                                <div className="dashbox__wrap">
                                    <a className="dashbox__refresh" href="#"><i className="ti ti-refresh"></i></a>
                                    <a className="dashbox__more" href="reviews.html">View All</a>
                                </div>
                            </div>

                            <div className="dashbox__table-wrap dashbox__table-wrap--4">
                                <table className="dashbox__table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>ITEM</th>
                                            <th>AUTHOR</th>
                                            <th>RATING</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">824</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">I Dream in Another Language</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Eliza Josceline</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 7.2</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">602</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Benched</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Ketut</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 6.3</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">538</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Whitney</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Brian Cranston</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 8.4</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">129</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Blindspotting</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Quang</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 9.0</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--grey">360</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text"><a href="#">Another</a></div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text">Jackson Brown</div>
                                            </td>
                                            <td>
                                                <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 7.7</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div> */}
            </AppLayout>
        </>
    );
}
