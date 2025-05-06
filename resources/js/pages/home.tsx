import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import GuestHeaderLayout from '@/layouts/guest/guest-header-layout';
import HeroSlider from '@/components/hero-slider';
import FilterWrapper from '@/components/filter-wrapper';
import MovieContents from '@/components/movie-contents';
import { type SharedData } from '@/types';

interface HomeProps {
    heroSliders: any[];
    movies: {
        data: any[];
        links: any;
        meta: any;
    };
    categories: {
        data: any[];
    };
    filters?: {
        category?: string;
        sort?: string;
        search?: string;
        page?: string;
    };
}

export default function Home({ heroSliders, movies: initialMovies, categories, filters = {} }: HomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [movies, setMovies] = useState(initialMovies);

    const handleFilterChange = (newFilters: { category?: string; sort?: string; search?: string }) => {
        const mergedFilters = {
            ...filters,
            ...newFilters,
            page: undefined // Reset pagination when filters change
        };

        const cleanFilters = Object.fromEntries(
            Object.entries(mergedFilters).filter(([_, v]) => v !== undefined && v !== '')
        );

        router.get(route('home'), cleanFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['movies', 'filters'],
            onSuccess: (page) => {
                setMovies(page.props.movies);
            }
        });
    };

    const handleSearch = (searchTerm: string) => {
        handleFilterChange({ search: searchTerm });
    };

    const handleLoadMore = (url: string) => {
        if (!url) return;

        const urlObj = new URL(url);
        const page = urlObj.searchParams.get('page');

        if (!page) return;

        router.get(route('home'), {
            ...filters,
            page
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['movies'],
            onSuccess: (page) => {
                setMovies(prev => ({
                    ...page.props.movies,
                    data: [...prev.data, ...page.props.movies.data]
                }));
            }
        });
    };

    return (
        <>
            <Head title="Home" />
            <GuestHeaderLayout onSearch={handleSearch}>
                <HeroSlider sliders={heroSliders} />
                <FilterWrapper
                    categories={categories}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                <MovieContents
                    movies={movies}
                    onLoadMore={handleLoadMore}
                />
            </GuestHeaderLayout>
        </>
    );
}
