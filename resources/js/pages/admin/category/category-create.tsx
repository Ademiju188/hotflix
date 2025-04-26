import React, { useEffect, useRef, FormEventHandler } from 'react';
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import InputError from '@/components/input-error';
import InputField from '@/components/input-field';
import { LoaderCircle } from 'lucide-react';

type CategoryForm = {
    name: string;
    description: string;
};

const CategoryCreate = () => {
    const { data, setData, post, processing, errors, reset } = useForm<Required<CategoryForm>>({
        name: '',
        description: '',
    });

     const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('system.category.store'));
    };

    return (
        <>
            <Head title="New Category" />
            <AppLayout title="New Category" mainTitle={true}>
                <div className="col-12">
                    <form onSubmit={submit} className="sign__form sign__form--add">
                        <div className="row">
                            <div className="col-12 col-xl-7">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="sign__group">
                                            <InputField
                                                name="name"
                                                value={data.name}
                                                onChange={(field, value) => setData({...data, [field]: value})}
                                                placeholder="Title"
                                                error={errors.name}
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="sign__group">
                                            <textarea id="text" name="text" className={`sign__textarea ${errors.description ? 'is-invalid' : ''}`} placeholder="Description" onChange={(e) => setData('description', e.target.value)} defaultValue={data.description}></textarea>
                                            <InputError message={errors.description} />
                                        </div>
                                    </div>

                                    {/* <div className="col-12 col-md-6">
                                        <div className="sign__group">
                                            <div className="sign__gallery">
                                                <label id="gallery1" htmlFor="sign__gallery-upload">Upload cover (240x340)</label>
                                                <input data-name="#gallery1" id="sign__gallery-upload" name="gallery" className="sign__gallery-upload" type="file" accept=".png, .jpg, .jpeg" />
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                            <div className="col-12">
                                <button type="submit" className="sign__btn sign__btn--small" disabled={processing}>
                                    {processing && <LoaderCircle className="h-6 w-4 mr-2 animate-spin" />} {processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </AppLayout>
        </>
    )
};

export default CategoryCreate;
