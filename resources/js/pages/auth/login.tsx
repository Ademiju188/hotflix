import InputError from '@/components/input-error';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import '../../../css/main.css';

type LoginForm = {
    username: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        username: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title='Login' />
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
                                <form onSubmit={submit} className="sign__form">
                                    <Link href="/" className="sign__logo">
                                        <img src="/assets/frontend/img/logo.svg" alt="" />
                                    </Link>

                                    <div className="sign__group">
                                        <input type="text" className="sign__input" value={data.username} onChange={(e) => setData('username', e.target.value)} placeholder="Username | Email" />
                                        <InputError message={errors.username} />
                                    </div>

                                    <div className="sign__group">
                                        <input type="password" className="sign__input" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Password" />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="sign__group sign__group--checkbox">
                                        <input id="remember" name="remember" type="checkbox" checked={data.remember} onClick={() => setData('remember', !data.remember)} />
                                        <label htmlFor="remember">Remember Me</label>
                                    </div>

                                    <button className="sign__btn" type="submit" disabled={processing}>
                                        {processing && <LoaderCircle className="h-6 w-4 mr-2 animate-spin" />} {processing ? 'Authenticating...' : 'Sign in'}
                                    </button>

                                    <span className="sign__text">Don't have an account? <Link href={route('register')}>Sign up!</Link></span>
                                    <span className="sign__text"><a href="#">Forgot password?</a></span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
