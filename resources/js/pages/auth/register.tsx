import InputError from '@/components/input-error';
import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import '../../../css/main.css';

type RegisterForm = {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title='Register' />
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
                                        <input type="text" className="sign__input" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Full Name" />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="sign__group">
                                        <input type="text" className="sign__input" value={data.username} onChange={(e) => setData('username', e.target.value)} placeholder="Username" />
                                        <InputError message={errors.username} />
                                    </div>

                                    <div className="sign__group">
                                        <input type="email" className="sign__input" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Email" />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="sign__group">
                                        <input type="password" className="sign__input" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Password" />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="sign__group">
                                        <input type="password" className="sign__input" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} placeholder="Password Confirmation" />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    <div className="sign__group sign__group--checkbox">
                                        <input id="remember" name="remember" type="checkbox" required />
                                        <label htmlFor="remember">I agree to the <Link href="#">Privacy Policy</Link></label>
                                    </div>

                                    <button className="sign__btn" type="submit" disabled={processing}>
                                        {processing && <LoaderCircle className="h-5 w-4 mr-2 animate-spin" />} {processing ? 'Please Wait...' : 'Sign up'}
                                    </button>

                                    <span className="sign__text">Already have an account? <Link href={route('login')}>Sign in!</Link></span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
