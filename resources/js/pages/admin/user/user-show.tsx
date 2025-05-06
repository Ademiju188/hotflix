import Pagination from "@/components/pagination";
import AppLayout from "@/layouts/app-layout";
import { User } from "@/types"
import { Head } from "@inertiajs/react";
import { Link } from "lucide-react";

type UserProps = {
    user: User
};

export default function UserShow({ user }: UserProps) {

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) { // .toLowerCase() for case-insensitive matching
            case 'completed':
                return 'green'; // Success color
            case 'failed':
                return 'red'; // Error color
            case 'pending':
                return 'red'; // Warning color
            default:
                return 'red'; // Default color
        }
    };

    const formattedDate = (date: any) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <>
            <Head title="Manage User" />
            <AppLayout title="" mainTitle={true}>
                <div className="row">
                    <div className="col-12">
                        <div className="main__title">
                            <Link href={route('system.user.index')} className="me-3 bg-dark p-2 rounded-circle text-white">
                                <i className="ti ti-arrow-back fw-bolder" style={{ fontSize: '30px' }}></i>
                            </Link>
                            <h2>Manage User</h2>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="profile__content">
                            <div className="profile__user">
                                <div className="profile__avatar">
                                    <img src="/assets/backend/img/user.svg" alt="" />
                                </div>
                                <div className="profile__meta profile__meta--green">
                                    <h3>{user.name} <span className={`text-${user.email_verified_at ? 'green' : 'red'}`}>{user.email_verified_at ? '(Approved)' : '(Pending)'}</span></h3>
                                    <span>{import.meta.env.VITE_APP_NAME} ID: {user.uuid}</span>
                                </div>
                            </div>

                            <ul className="nav nav-tabs profile__tabs" id="profile__tabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button id="1-tab" className="active" data-bs-toggle="tab" data-bs-target="#tab-1" type="button" role="tab" aria-controls="tab-1" aria-selected="true">Subscriptions</button>
                                </li>

                                <li className="nav-item" role="presentation">
                                    <button id="2-tab" data-bs-toggle="tab" data-bs-target="#tab-2" type="button" role="tab" aria-controls="tab-2" aria-selected="false">Payments</button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="tab-1" role="tabpanel" aria-labelledby="1-tab" tabIndex="0">
                            <div className="col-12">
                                <div className="catalog catalog--1">
                                    <table className="catalog__table">
                                        <thead>
                                            <tr>
                                                <th width="3%">SN</th>
                                                <th>PLAN</th>
                                                <th>AMOUNT</th>
                                                <th>STATUS</th>
                                                <th>CREATED DATE</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {user?.subscriptions.length > 0 ? user?.subscriptions.map((subscription, index) => (
                                                <tr key={subscription.id.toString()}>
                                                    <td><div className="catalog__text">{++index}</div></td>
                                                    <td><div className="catalog__text">{subscription.plan?.name}</div></td>
                                                    <td><div className="catalog__text">${subscription.payment?.amount}</div></td>
                                                    <td>
                                                        <div className={`catalog__text catalog__text--${getStatusColor(subscription.status)}`}>
                                                            {subscription.status.toUpperCase()}
                                                        </div>
                                                    </td>
                                                    <td><div className="catalog__text">{formattedDate(subscription.created_at)}</div></td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={6} className='text-center'><div className="catalog__text text-center">No Records Found!</div></td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="tab-pane fade" id="tab-2" role="tabpanel" aria-labelledby="2-tab" tabindex="0">
                            <div className="col-12">
                                <div className="catalog catalog--1">
                                <table className="catalog__table">
                                    <thead>
                                        <tr>
                                            <th width="3%">SN</th>
                                            <th>PLAN</th>
                                            <th>AMOUNT</th>
                                            <th>STATUS</th>
                                            <th>CREATED DATE</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {user.payments.length > 0 ? user.payments.map((payment, index) => (
                                            <tr key={payment.id.toString()}>
                                                <td><div className="catalog__text">{++index}</div></td>
                                                <td><div className="catalog__text">{payment.plan.name}</div></td>
                                                <td><div className="catalog__text">${payment.amount}</div></td>
                                                <td>
                                                <div className={`catalog__text catalog__text--${getStatusColor(payment.status)}`}>
                                                    {payment.status.toUpperCase()}
                                                </div>
                                                </td>
                                                <td><div className="catalog__text">{formattedDate(payment.created_at)}</div></td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className='text-center'><div className="catalog__text text-center">No Records Found!</div></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    )
}
