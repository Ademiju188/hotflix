import Pagination from "@/components/pagination";
import UserLayout from "@/layouts/user-layout"
import { Link } from "@inertiajs/react";

interface Payment {
    id: number;
    uui: string;
    trx_ref: string;
    plan: {
        name: string
    };
    amount: number;
    currency: string;
    status: string;
    subscription?: Subscription,
    created_at: string
}

interface Subscription {
    has_subscription: boolean;
    plan_name: string;
    start_data: string;
    end_date: string;
    next_bill_date: string;
    amount: string;
    currency: string;
    payment_method: string;
    auto_renew: string;
    status: string;
}

type PaymentProps = {
    payments: {
        data: Payment[],
        meta: {
            links: object
        },
    }
}

export default function Payments({ payments }: PaymentProps) {
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


    return (
        <UserLayout title="Payments">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="main__title">
                             <Link href={route('user.dashboard')} className="me-3 bg-dark p-2 rounded-circle text-white">
                                <i className="ti ti-arrow-back fw-bolder" style={{ fontSize: '30px' }}></i>
                            </Link>
                            <h2>Manage Payments</h2>
                            <span className="main__title-stat">{payments.data.length} Total</span>
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
                                    {payments.data.length > 0 ? payments.data.map((payment, index) => (
                                        <tr key={payment.id.toString()}>
                                            <td><div className="catalog__text">{++index}</div></td>
                                            <td><div className="catalog__text">{payment.plan.name}</div></td>
                                            <td><div className="catalog__text">${payment.amount}</div></td>
                                            <td>
                                            <div className={`catalog__text catalog__text--${getStatusColor(payment.status)}`}>
                                                {payment.status.toUpperCase()}
                                            </div>
                                            </td>
                                            <td><div className="catalog__text">{payment.created_at}</div></td>
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
                        links={payments.meta.links}
                        meta={payments.meta}
                    />
                </div>
            </div>
        </UserLayout>
    )
}
