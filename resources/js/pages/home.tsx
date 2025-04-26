import HeroSlider from '@/components/hero-slider';
import FilerWrapper from '@/components/filter-wrapper';
import GuestHeaderLayout from '@/layouts/guest/guest-header-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import MovieContents from '@/components/movie-contents';
import ExclusiveOriginal from '@/components/exclusive-original';

export default function Home() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Home" />
            <GuestHeaderLayout>
                <HeroSlider />
                <FilerWrapper />
                <MovieContents />
                <ExclusiveOriginal />
            </GuestHeaderLayout>
        </>
    );
}
