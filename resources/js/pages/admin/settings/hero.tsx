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

type HeroForm = {
    series: number[];
};

const Hero: React.FC<HeroSliderProps> = ({ heroSliders, movies }) => {
    const seriesSelectRef = useRef<HTMLSelectElement>(null);
    const [reorder, setReorder] = useState(false);
    const [items, setItems] = useState<HeroSlider[]>(heroSliders.data);
    const [selectedSeries, setSelectedSeries] = useState<number[]>(
        heroSliders.data.map(slider => slider.movie_id).filter((id): id is number => id !== undefined)
    );

    const { data, setData, processing, post, errors, reset } = useForm<HeroForm>({
        series: selectedSeries,
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        post(route('system.settings.hero-slider.store'), {
            onSuccess: () => closeModal()
        });
    };

    // Initialize SlimSelect
    useEffect(() => {
        if (seriesSelectRef.current) {
            const select = new SlimSelect({
                select: seriesSelectRef.current,
                settings: {
                    showSearch: true,
                    placeholderText: 'Select Series',
                    closeOnSelect: false
                },
                events: {
                    afterChange: (newVal) => {
                        const selectedIds = newVal.map((item: { value: string }) => parseInt(item.value));
                        setSelectedSeries(selectedIds);
                        setData('series', selectedIds);
                    }
                }
            });

            // Set initial selected values
            // if (selectedSeries.length > 0) {
            //     select.set(selectedSeries.map(id => id.toString()));
            // }

            return () => {
                select.destroy();
            };
        }
    }, [seriesSelectRef.current]);

    // Initialize items with proper ordering
    useEffect(() => {
        setItems([...heroSliders.data].sort((a, b) => a.hierarchy - b.hierarchy));
    }, [heroSliders.data]);

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

                // Save order automatically
                saveOrder(newItems);

                return newItems;
            });
        }
    };


    const saveOrder = throttle((newOrder: HeroSlider[]) => {
        const orderData = newOrder.map((item, index) => ({
            id: item.id,
            hierarchy: index + 1
        }));

        router.post(route('system.settings.hero-slider.reorder'), { sliders: orderData }, {
            preserveScroll: true
        });
    }, 1000);

    const closeModal = () => {
        const modal = document.getElementById('model-hero-slider');
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            bsModal?.hide();
        }
        reset();
    };

    const handleDelete = (slider: HeroSlider) => {
        if (!confirm(`Are you sure you want to delete this slider?`)) return;
        post(route('system.settings.hero-slider.destroy', slider.id), {
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title="Settings :: Hero Sliders" />
            <AppLayout title="Hero Sliders" mainTitle={false}>
                <div className="row">
                    <div className="col-12">
                        <div className="main__title">
                            <h2>Hero Sliders</h2>
                            <span className="main__title-stat">Total {items.length}</span>
                            <div className="main__title-wrap">
                                <button
                                    type="button"
                                    data-bs-toggle="modal"
                                    className="main__title-link main__title-link--wrap"
                                    data-bs-target="#model-hero-slider"
                                >
                                    Add Slider
                                </button>
                                {items.length > 0 &&
                                <button
                                    type="button"
                                    className="main__title-link main__title-link--wrap"
                                    onClick={() => setReorder(!reorder)}
                                >
                                    Reorder Sliders
                                </button>}
                            </div>
                        </div>
                    </div>
                    {reorder ?
                    (<div className="col-12">
                        <div className="catalog catalog--1">
                            <div className={`relative ${processing ? 'opacity-75' : ''}`}>
                                {processing && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                )}

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
                                            {items.map((slider) => (
                                                <SortableItem key={slider.id} id={slider.id}>
                                                    <div className="col-12 mb-4">
                                                        <div className="card h-100 shadow-sm bg-dark text-white  hover-shadow">
                                                            <div className="card-body">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="d-flex align-items-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="me-2" fill="currentColor" viewBox="0 0 16 16">
                                                                            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                                        </svg>
                                                                        <h5 className="text-truncate mt-0 mb-0">
                                                                            {slider.movie?.title || 'Untitled Movie'}
                                                                        </h5>
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
                                        <th>SERIES</th>
                                        <th>CREATED DATE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.length > 0 ? items.map((slider, index) => (
                                        <tr key={slider.id.toString()}>
                                            <td><div className="catalog__text">{++index}</div></td>
                                            <td><div className="catalog__text">{slider.movie.title}</div></td>
                                            <td><div className="catalog__text">{slider.created_at}</div>    </td>
                                            <td>
                                                <div className="catalog__btns">
                                                    <button type="button" className="catalog__btn catalog__btn--delete" onClick={e => handleDelete(slider)}>
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
                    </div>)
                    }
                </div>
            </AppLayout>

            <div className="modal fade" id="model-hero-slider" aria-labelledby="model-hero-slider" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal__content">
                            <form onSubmit={submit} className="">
                                <p className="modal__title mb-4">Add Series to Hero Sliders</p>
                                <div className="row">
                                    <div className="col-12 w-100">
                                        <div className="sign__group">
                                            <select
                                                className="sign__selectjs"
                                                id="sign__genre"
                                                ref={seriesSelectRef}
                                                multiple
                                            >
                                                {movies.data.map(movie => (
                                                    <option
                                                        value={movie.id}
                                                        key={movie.id}
                                                        selected={selectedSeries.includes(movie.id)}
                                                    >
                                                        {movie.title}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.series} />
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6 offset-lg-3">
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;
