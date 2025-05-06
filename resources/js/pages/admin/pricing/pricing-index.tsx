import InputError from "@/components/input-error";
import InputField from "@/components/input-field";
import AppLayout from "@/layouts/app-layout"
import { Head, router, useForm } from "@inertiajs/react"
import { LoaderCircle } from "lucide-react";
import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import SlimSelect from "slim-select";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from "@/components/SortableItem";
import { throttle } from 'lodash';

const PricingIndex: React.FC<PricingPlanPros> = ({ pricingPlans, planTypes }) => {
    const plansSelectRef = useRef<HTMLSelectElement>(null);
    const [items, setItems] = useState<PricingPlans[]>(pricingPlans.data);
    const [showModal, setShowModal] = useState(false);
    const [reorder, setReorder] = useState(false);
    const [plan, setPlan] = useState({
        id: ''
    });

    const { data, setData, processing, post, errors, reset } = useForm({
        plan: '',
        description: '',
        price: '',
        active: true
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        if (plan.id) {
            post(route('system.pricing.update', plan.id), {
                onSuccess:  () => {
                    reset();
                    setShowModal(false);
                }
            });
        } else {
            post(route('system.pricing.store'), {
                onSuccess:  () => {
                    reset();
                    setShowModal(false);
                }
            });
        }
    };

    // Initialize SlimSelect
    useEffect(() => {
        if (plansSelectRef.current) {
            const select = new SlimSelect({
                select: plansSelectRef.current,
                settings: {
                    showSearch: false,
                    closeOnSelect: true
                },
                events: {
                    afterChange: (newVal) => {
                        const selectedId = newVal.length > 0 ? parseInt(newVal[0].value) : null;
                        setData('plan', selectedId);
                    },
                },
            });

            return () => {
                select.destroy();
            };
        }
    }, [plansSelectRef.current, showModal]);

    // Initialize items with proper ordering
    useEffect(() => {
        setItems([...pricingPlans.data].sort((a, b) => a.hierarchy - b.hierarchy));
    }, [pricingPlans.data]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over?.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                saveOrder(newItems);
                return newItems;
            });
        }
    };

    const saveOrder = throttle((newOrder: PricingPlans[]) => {
        const orderData = newOrder.map((item, index) => ({
            id: item.id,
            hierarchy: index + 1
        }));

        router.post(route('system.pricing.reorder'), { plans: orderData }, {
            preserveScroll: true
        });
    }, 1000);

    const handleDelete = (plan: PricingPlans) => {
        if (!confirm(`Are you sure you want to delete this plan?`)) return;
        router.delete(route('system.pricing.destroy', plan.id), {
            preserveScroll: true
        });
    };

    const handlePricingProps = (plan : PricingPlans) => {
        setData('plan', plan.plan_type.id);
        setData('price', plan.price);
        setData('description', plan.description);
        setData('active', plan.active);

        setPlan(plan);
    };


    return (
        <>
            <Head title="Settings :: Pricing Plans" />
            <AppLayout title="Pricing Plans" mainTitle={false}>
                <div className="row">
                    <div className="col-12">
                        <div className="main__title">
                            <h2>Pricing Plans</h2>
                            <span className="main__title-stat">Total {items.length}</span>
                            <div className="main__title-wrap">
                                <button
                                    type="button"
                                    className="main__title-link main__title-link--wrap"
                                    // onClick={() => setShowModal(true)}
                                    // data-bs-toggle="modal"
                                    // data-bs-target="#model-pricing-plan"
                                    onClick={(e) => {setPlan({}); setShowModal(true)}}
                                >
                                    Add Plan
                                </button>
                                {items.length > 0 &&
                                <button
                                    type="button"
                                    className="main__title-link main__title-link--wrap"
                                    onClick={() => setReorder(!reorder)}
                                >
                                    Reorder Plans
                                </button>}
                            </div>
                        </div>
                    </div>

                    {reorder ?
                    (<div className="col-12">
                        <div className="catalog catalog--1">
                            <div className={`relative ${processing ? 'opacity-75' : ''}`}>
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={items}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="row mt-4">
                                            {items.map((plan) => (
                                                <SortableItem key={plan.id} id={plan.id}>
                                                    <div className="col-12 mb-4">
                                                        <div className="card h-100 shadow-sm bg-dark text-white hover-shadow">
                                                            <div className="card-body">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="d-flex align-items-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="me-2" fill="currentColor" viewBox="0 0 16 16">
                                                                            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                                        </svg>
                                                                        <div>
                                                                            <h5 className="text-truncate mt-0 mb-0">
                                                                                {plan.plan_type.name || ''}
                                                                            </h5>
                                                                            <p className="p-0 m-0">${plan.price}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SortableItem>
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </div>
                        </div>
                    </div>)
                    :
                    (<div className="col-12">
                        <div className="catalog catalog--1">
                            <table className="catalog__table">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>PLAN</th>
                                        <th>DURATION</th>
                                        <th>PRICE</th>
                                        <th>DESCRIPTION</th>
                                        <th>STATUS</th>
                                        <th>CREATED DATE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pricingPlans.data.length > 0 ? pricingPlans.data.map((plan, index) => (
                                        <tr key={plan.id.toString()}>
                                            <td><div className="catalog__text">{++index}</div></td>
                                            <td><div className="catalog__text">{plan.plan_type.name}</div></td>
                                            <td><div className="catalog__text">{plan.plan_type.duration}</div></td>
                                            <td><div className="catalog__text">${plan.price}</div></td>
                                            <td><div className="catalog__text">{plan.description ?? 'N/A'}</div></td>
                                            <td><div className={`catalog__text catalog__text--${plan.active ? 'green' : 'red'}`}>{plan.active ? 'Active' : 'In-Active'}</div></td>
                                            <td><div className="catalog__text">{plan.created_at}</div></td>
                                            <td>
                                                <div className="catalog__btns">
                                                    <button className="catalog__btn catalog__btn--edit" data-bs-toggle="modal"
                                                    data-bs-target="#model-pricing-plan"  onClick={(e) => {
                                                        handlePricingProps(plan);
                                                        setShowModal(true);
                                                    }}>
                                                        <i className="ti ti-edit"></i>
                                                    </button>
                                                    <button type="button" className="catalog__btn catalog__btn--delete" onClick={e => handleDelete(plan)}>
                                                        <i className="ti ti-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className='text-center'><div className="catalog__text text-center">No Records Found!</div></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>)
                    }

                </div>
            {/* Modal using React state */}
            {showModal && (

                <div className="modal fade show" style={{ display: 'block' }} id="model-hero-slider" aria-labelledby="model-hero-slider" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal__content">
                                <form onSubmit={submit} className="">
                                    <p className="modal__title mb-4">{plan.id ? `Update ${plan.plan_type.name}` : 'New Plan'}</p>
                                    <div className="row">
                                        {!plan.id  &&
                                            (<div className="col-12 w-100">
                                            <div className="sign__group">
                                                <select
                                                    className="sign__selectjs"
                                                    id="sign__genre"
                                                    ref={plansSelectRef}
                                                >
                                                    <option>Select Plan</option>
                                                    {planTypes.data.map(p => (
                                                        <option value={p.id} key={p.id}>
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.plan} />
                                            </div>
                                        </div>)
                                        }

                                        <div className="col-12">
                                            <div className="sign__group">
                                                <InputField
                                                    name="price"
                                                    type="text"
                                                    value={data.price}
                                                    onChange={(field, value) => setData({ ...data, [field]: value })}
                                                    placeholder="Price"
                                                    error={errors.price}
                                                />
                                                <InputError message={errors.price} />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="sign__group">
                                                <textarea
                                                    id="text"
                                                    name="text"
                                                    className={`sign__textarea ${errors.description ? 'is-invalid' : ''}`}
                                                    placeholder="Description"
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    value={data.description}
                                                />
                                                <InputError message={errors.description} />
                                            </div>
                                        </div>

                                        <div className="sign__group sign__group--checkbox">
                                            <input id="active" name="active" type="checkbox" checked={data.active} onClick={() => setData('active', !data.active)} />
                                            <label htmlFor="active">Status</label>
                                        </div>

                                        <div className="col-12">
                                            <div className="d-flex justify-content-between">
                                                <button
                                                    type="button"
                                                    className="sign__btn sign__btn--modal me-5"
                                                    disabled={processing}
                                                    onClick={e => setShowModal(false)}
                                                >
                                                    Cancle
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="sign__btn sign__btn--modal"
                                                    disabled={processing}
                                                >
                                                    {processing && <LoaderCircle className="h-6 w-4 mr-2 animate-spin" />}
                                                    {processing ? 'Saving...' : 'Save'}
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </AppLayout>

        </>
    );
};

export default PricingIndex;
