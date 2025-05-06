import { Link, useForm, usePage } from "@inertiajs/react";
import { User } from "@/types";
import UserLayout from "@/layouts/user-layout";
import InputError from "@/components/input-error";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";

export default function EditCredentials() {

    const { props } = usePage<{ auth: { user: User } }>();
    const user = props?.auth?.user;

    const { data, setData, post, errors, processing, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        post(route('user.profile.updateCredentials'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <UserLayout title="Edit Credentials">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="main__title">
                            <Link href={route('user.dashboard')} className="me-3 bg-dark p-2 rounded-circle text-white">
                                <i className="ti ti-arrow-back fw-bolder" style={{ fontSize: '30px' }}></i>
                            </Link>
                            <h2>Edit Password</h2>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="profile__content">
                            <div className="profile__user">
                                <div className="profile__avatar">
                                    <img src="/assets/backend/img/user.svg" alt="" />
                                </div>
                                <div className="profile__meta profile__meta--green">
                                    <h3>{user.name} <span>(Approved)</span></h3>
                                    <span>{import.meta.env.VITE_APP_NAME} ID: {user.uuid}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-lg-8">
                            <form onSubmit={handleSubmit} className="sign__form sign__form--profile">
                                <div className="row">
                                    <div className="col-12">
                                        <h4 className="sign__title">Change password</h4>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-12 col-xxl-6">
                                        <div className="sign__group">
                                            <label className="sign__label" htmlFor="oldpass">Old Password</label>
                                            <input id="oldpass" type="password" name="oldpass" onChange={(e) => setData('current_password', e.target.value)} className="sign__input" />
                                            <InputError message={errors.current_password} />
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-12 col-xxl-6">
                                        <div className="sign__group">
                                            <label className="sign__label" htmlFor="newpass">New Password</label>
                                            <input id="newpass" type="password" name="newpass" onChange={(e) => setData('password', e.target.value)} className="sign__input" />
                                            <InputError message={errors.password} />
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-12 col-xxl-6">
                                        <div className="sign__group">
                                            <label className="sign__label" htmlFor="confirmpass">Confirm New Password</label>
                                            <input id="confirmpass" type="password" name="confirmpass" onChange={(e) => setData('password_confirmation', e.target.value)} className="sign__input" />
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <button className="sign__btn sign__btn--small" type="submit">
                                            <span>{processing && <LoaderCircle className="animate-spin mr-2 fs-1" />} {processing ? 'Updating...' : 'Change'}</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}
