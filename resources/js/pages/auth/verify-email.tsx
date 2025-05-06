// Components
import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email verification" />
            <div
                className="sign section--bg"
                style={{
                    backgroundImage: `url('/assets/frontend/img/bg/section__bg.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="sign__content">
                                <form onSubmit={submit} className="text-center sign__form text-white">
                                    <h6 className='mb-4'>Please verify your email address by clicking on the link we just emailed to you.</h6>
                                    <button disabled={processing} className="btn btn-warning text-black">
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Resend verification email
                                    </button>
                                    {status === 'verification-link-sent' && (
                                        <div className="mt-4 text-center text-sm font-medium text-danger">
                                            A new verification link has been sent to the email address you provided during registration.
                                        </div>
                                    )}
                                    <Link href={route('logout')} method="post" className="mx-auto block text-sm text-white mt-4">
                                        Log out
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
