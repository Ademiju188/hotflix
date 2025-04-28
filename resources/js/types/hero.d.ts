
interface Movie {
    id: number;
    title: string;
    banner_path: string;
}

interface HeroSlider {
    id: number;
    movie_id: number;
    hierarchy: number;
    movie: Movie;
    created_at: string
}

interface HeroSliderProps extends PageProps {
    heroSliders: {
        data: HeroSlider[];
    };
    movies: {
        data: Movie[];
    };
}
