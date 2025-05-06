import Pagination from "@/components/pagination";
import UserLayout from "@/layouts/user-layout"
import { Link } from "@inertiajs/react";

interface Subscription {
    id: number;
    has_subscription: boolean;
    plan_name: string;
    payment: Payment;
    start_data: string;
    end_date: string;
    next_bill_date: string;
    amount: string;
    currency: string;
    payment_method: string;
    auto_renew: string;
    status: string;
    created_at: string
};

interface Payment {
    id: number;
    uui: string;
    trx_ref: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string
}

type SubscriptionProps = {
    subscriptions: {
        data: Subscription[],
        meta: {
            links: object
        },
    }
}

export default function Subscriptions({ subscriptions }: SubscriptionProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'green'; // Success color
            case 'cancelled':
                return 'red'; // Error color
            case 'expired':
                return 'red'; // Warning color
            default:
                return 'red'; // Default color
        }
    };


    return (
        <UserLayout title="Subscriptions">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="main__title">
                            <Link href={route('user.dashboard')} className="me-3 bg-dark p-2 rounded-circle text-white">
                                <i className="ti ti-arrow-back fw-bolder" style={{ fontSize: '30px' }}></i>
                            </Link>
                            <h2>Manage Subscriptions</h2>
                            <span className="main__title-stat">{subscriptions.data.length} Total</span>
                        </div>
                    </div>
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
                                    {subscriptions.data.length > 0 ? subscriptions.data.map((subscription, index) => (
                                        <tr key={subscription.id.toString()}>
                                            <td><div className="catalog__text">{++index}</div></td>
                                            <td><div className="catalog__text">{subscription.plan_name}</div></td>
                                            <td><div className="catalog__text">${subscription.payment.amount}</div></td>
                                            <td>
                                            <div className={`catalog__text catalog__text--${getStatusColor(subscription.status)}`}>
                                                {subscription.status.toUpperCase()}
                                            </div>
                                            </td>
                                            <td><div className="catalog__text">{subscription.created_at}</div></td>
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
                    <Pagination
                        links={subscriptions.meta.links}
                        meta={subscriptions.meta}
                    />
                </div>
            </div>
        </UserLayout>
    )
}
