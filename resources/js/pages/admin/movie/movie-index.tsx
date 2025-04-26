
import React, { useEffect, useRef, FormEventHandler, useState } from 'react';
import InputError from "@/components/input-error";
import InputField from "@/components/input-field";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { LoaderCircle } from 'lucide-react';
import Pagination from '@/components/pagination';
import { debounce } from 'lodash';

interface Movies {
    id: number,
    uuid: string,
    title: string
    description: string;
    content_type: string;
    featured: boolean;
    premium: boolean;
    duration: number | string;
    banner_path: string;
    active: boolean | string,
    created_at: string,
    meta: {
        links: object
    },
    episodes: [],
    episodes_count: number
    // video: File | null;
    // categories: number[];
};

type MovieProps = {
    movies: {
        data: Movies[],
        meta: Object
    }
}

const MovieIndex: React.FC<MovieProps>=({ movies }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [movie, setMovie] = useState<Object>();
    const searchMovies = debounce((query: string) => {
        router.get(route('system.movie.index'),
            { search: query },
            {
                preserveState: true,
                replace: true,
                only: ['movies']
            }
        );
    }, 300);

    useEffect(() => {
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery) {
            searchMovies(trimmedQuery);
        } else if (movies.data.length === 0) {
            router.get(route('system.movie.index'), {}, {
                preserveState: true,
                replace: true,
                only: ['movies'],
            });
        }

        return () => {
            if (searchMovies.cancel) {
                searchMovies.cancel();
            }
        };
    }, [searchQuery]);

    const handleDelete = (movie:Object) => {

    }

    const handleModal = (movie:Movies) => {
        setMovie(movie);
    }

    const handelSeriesStatus = async (movie:Movies) => {
        if (!confirm(`Are you sure you want to ${movie.active ? 'disable' : 'enable'} this series?`)) return;

        try {

            await router.put(route('system.movie.status', movie.id), );

            movies.data.map(mv =>
                mv.id === movie.id ? { ...mv, active: !mv.active } : mv
            );

        } catch (error) {
            console.error(`Failed to ${movie.active ? 'disable' : 'enable'} series:`, error);
            // Optionally show an error notification here
        }
    }

    return (
        <>
        <Head title="Manage Category" />
            <AppLayout title="Manage Category" mainTitle={false}>
                <div className="row">
                    <div className="col-12">
                        <div className="main__title">
                            <h2>Manage Movies</h2>

                            <span className="main__title-stat">{movies.data.length} Total</span>

                            <div className="main__title-wrap">
                                <Link href={route('system.movie.create')} type="button" className="main__title-link main__title-link--wrap" >Add Movie</Link>
                                <form onSubmit={e => searchMovies} className="main__title-form">
                                    <input
                                        type="text"
                                        placeholder="Find Movie.."
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
                                        <th>EPISODES</th>
                                        <th>STATUS</th>
                                        <th>CREATED DATE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {movies.data.length > 0 ? movies.data.map((movie, index) => (
                                        <tr key={movie.id.toString()}>
                                            <td><div className="catalog__text">{++index}</div></td>
                                            <td>
                                                <div className="d-flex align-item-center">
                                                    <div>
                                                        <img src={`/storage/${movie.banner_path}`} width={50} className='me-2' alt="" />
                                                    </div>
                                                    <div className="catalog__text">{movie.title}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="catalog__text">
                                                    <span style={{ cursor: 'pointer' }} data-bs-target={`#model-description`}  onClick={e => handleModal(movie)} data-bs-toggle="modal">Preview Description</span>
                                                </div>
                                            </td>
                                            <td><div className="catalog__text">{movie.episodes_count}</div></td>
                                            <td><div className={`catalog__text catalog__text--${movie.active ? 'green' : 'red'}`} style={{ cursor: 'pointer' }} onClick={e => handelSeriesStatus(movie)}>{movie.active ? 'Active' : 'In-Active'}</div></td>
                                            <td><div className="catalog__text">{movie.created_at}</div></td>
                                            <td>
                                                <div className="catalog__btns">
                                                    <Link className="catalog__btn catalog__btn--edit" href={route('system.movie.edit', movie.uuid)} >
                                                        <i className="ti ti-edit"></i>
                                                    </Link>
                                                    <button type="button" className="catalog__btn catalog__btn--delete" onClick={e => handleDelete(movie)}>
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

                    <div className="modal fade" id={`model-description`} tabIndex="-1" aria-labelledby={`#model-description`} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal__content catalog__text">
                                    <h6>{movie?.description}</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Pagination
                        links={movies.meta.links}
                        meta={movies.meta}
                    />
                </div>

            </AppLayout>
        </>
    )
};

export default MovieIndex;
