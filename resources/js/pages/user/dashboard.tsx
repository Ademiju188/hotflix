import Plan from './components/plan';
import Account from './components/account';
import Subscription from './components/subscription';
import Payment from './components/payment';
import Security from './components/security';
import UserLayout from '@/layouts/user-layout';

export default function Dashboard() {
    return (
        <UserLayout title="Account Overview">
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-2 col-lg-2"></div>
                    <div className="col-md-8">

                        <Plan />

                        <Account />

                        <Subscription />

                        <Payment />

                        <Security />

                    </div>
                    <div className="col-md-2 col-lg-2"></div>
                </div>
            </div>
        </UserLayout>
    );
}
