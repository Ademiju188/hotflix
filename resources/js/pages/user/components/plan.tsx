import { User } from "@/types";
import { usePage } from "@inertiajs/react";

export default function Plan() {

    const { props } = usePage<{ auth: { user: User } }>();
    const user = props?.auth?.user;

    return (
        <div className="bg-dark rounded p-4 mb-4">
            <div className="small text-secondary mb-1">Your plan</div>
            <div className="mb-2">
                {user.subscription.has_subscription ? (<h2 className="mb-0">{user.subscription.plan_name}</h2>) :
                    <>
                        <h4 className="mb-0">{user.subscription.message}</h4>
                        <a href={route('pricing')} className="btn btn-success btn-sm mt-2">
                            Upgrade Now
                        </a>
                    </>
                }

            </div>

            {user.subscription.has_subscription &&
                <>
                    <div className="text-secondary mb-1">Your next bill is for {user.subscription.currency}{user.subscription.amount} on {user.subscription.next_bill_date}.</div>
                </>
            }
        </div>
    );
}
