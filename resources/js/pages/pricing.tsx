import GuestHeaderLayout from '@/layouts/guest/guest-header-layout';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Pricing({ pricingPlans }: PricingPlanPros) {
    const { auth } = usePage<SharedData>().props;

    const [processing, setProcessing] = useState(false);
    const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);

    const classes = [
        'plan',
        'plan plan--orange',
        'plan plan--red'
    ];

    const handlePlan = async  (plan: PricingPlans) => {
        setProcessing(true);
        setProcessingPlanId(plan.id);
        await router.post(route('process-subscription', plan.uuid), {}, {
            preserveScroll: true,
            onError: (err) => {
                setProcessing(false);
                setProcessingPlanId(null);
            }
        });
    }

    return (
        <>
            <Head title="Pricing" />
            <GuestHeaderLayout>
                <div style={{ minHeight: '90vh' }}>
                    <section className="section section--first">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="section__wrap">
                                        <h1 className="section__title section__title--head">Pricing plan</h1>

                                        <ul className="breadcrumbs">
                                            <li className="breadcrumbs__item"><Link href={route('home')}>Home</Link></li>
                                            <li className="breadcrumbs__item breadcrumbs__item--active">Pricing plan</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="section section--notitle">
                        <div className="container">
                            <div className="row">
                                {pricingPlans.data.map((plan, index) => {
                                    const className = classes[index % classes.length];
                                    return (
                                        <div key={plan.id} className="col-12 col-md-6 col-lg-4 order-md-2 order-lg-1">
                                            <div className={className}>
                                                <h3 className="plan__title">{plan.plan_type.name}</h3>
                                                <span className="plan__price">${plan.price}</span>
                                                <ul className="plan__list">
                                                    <li className="plan__item">{plan.description}</li>
                                                </ul>
                                                <button
                                                    onClick={e => handlePlan(plan)}
                                                    disabled={processingPlanId === plan.id || processingPlanId !== null}
                                                    className="plan__btn"
                                                >
                                                    {processingPlanId === plan.id ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        'Choose Plan'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </GuestHeaderLayout>
        </>
    );
}
