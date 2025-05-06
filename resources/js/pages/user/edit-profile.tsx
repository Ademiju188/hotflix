import { Link, useForm, usePage } from "@inertiajs/react";
import { User } from "@/types";
import UserLayout from "@/layouts/user-layout";
import { FormEventHandler, useEffect, useRef } from "react";
import InputError from "@/components/input-error";
import SlimSelect from "slim-select";
import { LoaderCircle } from "lucide-react";

interface Country {
    id: number,
    name: string,
    code: string
}

type CountryProps = {
    countries: Country[]
}

export default function EditProfile({ countries }: CountryProps) {

    const { props } = usePage<{ auth: { user: User } }>();
    const user = props?.auth?.user;
    const countrySelectRef = useRef<HTMLSelectElement>(null);

    const  { data, setData, post, errors, processing } = useForm({
        name: user.name,
        country: user.country_id
    });

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        post(route('user.profile.update'));
    };

    useEffect(() => {
        if (!countrySelectRef.current) return;

        const slimSelectInstance = new SlimSelect({
            select: countrySelectRef.current,
            settings: {
                showSearch: true,
                placeholderText: 'Select Country',
                closeOnSelect: true,
                isMultiple: false,
            },
        });

        if (data?.country) {
            slimSelectInstance.setSelected(`${data.country}`);
        }

        return () => {
            slimSelectInstance.destroy();
        };
    }, []);



    return (
        <UserLayout title="Edit Profile">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="main__title">
                            <Link href={route('user.dashboard')} className="me-3 bg-dark p-2 rounded-circle text-white">
                                <i className="ti ti-arrow-back fw-bolder" style={{ fontSize: '30px' }}></i>
                            </Link>
                            <h2>Edit Profile</h2>
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

                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-lg-8">
                                <form onSubmit={handleSubmit} className="sign__form sign__form--profile">
                                    <div className="row">
                                        <div className="col-12">
                                            <h4 className="sign__title">Profile details</h4>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="sign__group">
                                                <label className="sign__label" htmlFor="fname">Full Name</label>
                                                <input id="fname" type="text" name="fname" className="sign__input" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                                <InputError message={errors.name} />
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                        <div className="sign__group">
                                            <label className="sign__label" htmlFor="fname">Select Country</label>
                                            <select
                                                className="sign__selectjs"
                                                id="sign__genre"
                                                ref={countrySelectRef}
                                                onChange={(e) => setData('country', e.target.value)}
                                            >
                                                <option value=""></option>
                                                {countries.map(country => (
                                                    <option value={country.id} key={country.id}>{country.name}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.country} />
                                        </div>
                                    </div>

                                        <div className="col-12 col-md-6">
                                            <div className="sign__group">
                                                <label className="sign__label" htmlFor="username">Username</label>
                                                <input id="username" type="text" name="username" value={user.username} className="sign__input" readOnly />
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="sign__group">
                                                <label className="sign__label" htmlFor="email2">Email</label>
                                                <input id="email2" type="text" name="email" className="sign__input" value={user.email} readOnly />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <button className="sign__btn sign__btn--small" type="submit" disabled={processing}>
                                                <span>{processing && <LoaderCircle className="animate-spin mr-2 fs-1" />} {processing ? 'Saving...' : 'Save'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}
