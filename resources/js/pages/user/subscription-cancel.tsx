import UserLayout from "@/layouts/user-layout";
import { Link, router } from "@inertiajs/react";
import { useRef, useState } from "react";

export default function SubscriptionCancel({ cancellationDate }: any) {
    const [processing, setProcessing] = useState(false);
    const isProcessing = useRef(false);

    const handleCancel = async (e) => {
        e.preventDefault();

        // Prevent multiple clicks
        if (isProcessing.current) return;

        if (!confirm('Are you sure you want to proceed to unsubscribe?')) return;

        isProcessing.current = true;
        setProcessing(true);

        try {
            await router.post(route('user.subscription.update'), {}, {
                preserveScroll: true,
                onError: (err) => {
                    isProcessing.current = false;
                    setProcessing(false);
                },
                onFinish: () => {
                    isProcessing.current = false;
                    setProcessing(false);
                }
            });
        } catch (error) {
            isProcessing.current = false;
            setProcessing(false);
        }
    };


    return (
        <UserLayout title="Cancel Subscription">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-8 col-lg-6 mx-auto">
                        <div className="card shadow-sm bg-dark text-white p-4">
                            <h2 className="mb-4 text-center">How your access will change</h2>

                            <p className="text-center mb-4">
                                If you cancel, you'll change to our free plan on {cancellationDate}.
                                Here's how your access will change:
                            </p>

                            <div className="d-flex justify-content-around text-center mb-4">
                                <div className="feature-change">
                                    <div className="display-4">SD</div>
                                    <p className="small">Video quality limited to Standard Definition</p>
                                </div>
                                <div className="feature-change">
                                    <div className="display-4">0</div>
                                    <p className="small">Premium features will be disabled</p>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <Link
                                    href={route('user.dashboard')}
                                    className="btn btn-outline-light"
                                >
                                    Back to Account
                                </Link>
                                <button
                                    disabled={processing}
                                    className="btn btn-danger"
                                    onClick={handleCancel}
                                >
                                    {processing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        'Continue to Cancel'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}
