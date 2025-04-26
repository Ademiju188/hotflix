import React, { useEffect, useRef, FormEventHandler, useState } from 'react';
import InputError from "@/components/input-error";
import InputField from "@/components/input-field";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm, router } from "@inertiajs/react";
import { LoaderCircle } from 'lucide-react';
import Pagination from '@/components/pagination';
import { debounce } from 'lodash';

type CategoryForm = {
    name: string;
    description: string;
    active: boolean;
};

interface CategoryFormProps {
    id?: number;
    name: string;
    description: string;
    active: boolean;
}

const CategoryIndex: React.FC<CategoryIndexProps> = ({ categories }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState<CategoryFormProps>({
        name: '',
        description: '',
        active: true
    });

    const { data, setData, post, processing, errors, reset } = useForm<Required<CategoryForm>>({
        name: '',
        description: '',
        active: true
    });

    const searchCategories = debounce((query: string) => {
        router.get(route('system.category.index'),
            { search: query },
            {
                preserveState: true,
                replace: true,
                only: ['categories']
            }
        );
    }, 300);

    useEffect(() => {
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery) {
            searchCategories(trimmedQuery);
        } else if (categories.data.length === 0) {
            router.get(route('system.category.index'), {}, {
                preserveState: true,
                replace: true,
                only: ['categories'],
            });
        }

        return () => {
            if (searchCategories.cancel) {
                searchCategories.cancel();
            }
        };
    }, [searchQuery]);


    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (category.id !== undefined) {
            post(route('system.category.update', category.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('system.category.store'), {
                onSuccess: () => closeModal()
            });
        }

    };

    const handleModel = () => {
        setCategory({
            name: '',
            description: '',
            active: true
        });
        setData({
            name: '',
            description: '',
            active: true
        });
    }

    const handleCategory = (category: any) => {
        setCategory(category);
        setData({
            name: category.name,
            description: category.description,
            active: category.active
        });
    };

    const closeModal = () => {
        const modal = document.getElementById('model-category');
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            bsModal.hide();
        }
        setCategory({
            name: '',
            description: '',
            active: true
        });
        reset();
    };

    const handleDelete = (category: any) => {
        if (!confirm(`Are you sure you want to delete: ${category.name}?`)) return;
        post(route('system.category.destroy', category.id));
    }

    return (
        <>
            <Head title="Manage Category" />
            <AppLayout title="Manage Category" mainTitle={false}>
                <div className="row">
                    <div className="col-12">
                        <div className="main__title">
                            <h2>Manage Categories</h2>

                            <span className="main__title-stat">{categories.data.length} Total</span>

                            <div className="main__title-wrap">
                                <button type="button" data-bs-toggle="modal" className="main__title-link main__title-link--wrap" data-bs-target="#model-category" onClick={e => handleModel()}>Add Category</button>
                                <form onSubmit={e => searchCategories} className="main__title-form">
                                    <input
                                        type="text"
                                        placeholder="Find Category.."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="submit"  disabled={!searchQuery.trim()}>
                                        <i className="ti ti-search"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="catalog catalog--1">
                            <table className="catalog__table">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>TITLE</th>
                                        <th>DESCRIPTION</th>
                                        <th>STATUS</th>
                                        <th>CRAETED DATE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {categories.data.length > 0 ? categories.data.map((category, index) => (
                                        <tr key={category.id.toString()}>
                                            <td><div className="catalog__text">{++index}</div></td>
                                            <td><div className="catalog__text">{category.name}</div></td>
                                            <td><div className="catalog__text">{category.description ?? 'N/A'}</div></td>
                                            <td><div className={`catalog__text catalog__text--${category.active ? 'green' : 'red'}`}>{category.active ? 'Active' : 'In-Active'}</div></td>
                                            <td><div className="catalog__text">{category.created_at}</div></td>
                                            <td>
                                                <div className="catalog__btns">
                                                    <button className="catalog__btn catalog__btn--edit" data-bs-toggle="modal" data-bs-target="#model-category" onClick={e => handleCategory(category)}>
                                                        <i className="ti ti-edit"></i>
                                                    </button>
                                                    <button type="button" className="catalog__btn catalog__btn--delete" onClick={e => handleDelete(category)}>
                                                        <i className="ti ti-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className='text-center'><div className="catalog__text text-center">No Records Found!</div></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination
                        links={categories.meta.links}
                        meta={categories.meta}
                    />
                </div>

                <div className="modal fade" id="model-category" tabIndex="-1" aria-labelledby="model-category" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal__content">
                                <form onSubmit={submit} className="modal__form">
                                    <h4 className="modal__title">{category?.id ? 'Update Category' : 'Add Category'}</h4>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="sign__group">
                                                <InputField
                                                    name="name"
                                                    value={data.name}
                                                    onChange={(field, value) => setData({ ...data, [field]: value })}
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

                                        <div className="sign__group sign__group--checkbox">
                                            <input id="active" name="active" type="checkbox" checked={data.active} onClick={() => setData('active', !data.active)} />
                                            <label htmlFor="active">Status</label>
                                        </div>

                                        <div className="col-12 col-lg-6 offset-lg-3">
                                            <button type="submit" className="sign__btn sign__btn--modal" disabled={processing}>
                                                {processing && <LoaderCircle className="h-6 w-4 mr-2 animate-spin" />} {processing ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    )
};

export default CategoryIndex;
