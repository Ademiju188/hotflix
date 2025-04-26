import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Link } from '@inertiajs/react';
import '@splidejs/splide/dist/css/splide.min.css';

interface MovieItem {
    id: number;
    title: string;
    image: string;
    rating: number;
    genres: string[];
}

const ExclusiveOriginal = () => {
    // Sample data - replace with your actual data source
    const movies: MovieItem[] = [
        {
            id: 1,
            title: 'I Dream in Another Language',
            image: '/assets/frontend/img/covers/cover.jpg',
            rating: 8.4,
            genres: ['Action', 'Triler']
        },
        // {
        //     id: 2,
        //     title: 'I Dream in Another Language',
        //     image: '/assets/frontend/img/covers/cover.jpg',
        //     rating: 8.4,
        //     genres: ['Action', 'Triler']
        // },
        // {
        //     id: 3,
        //     title: 'I Dream in Another Language',
        //     image: '/assets/frontend/img/covers/cover.jpg',
        //     rating: 8.4,
        //     genres: ['Action', 'Triler']
        // },
        // {
        //     id: 4,
        //     title: 'I Dream in Another Language',
        //     image: '/assets/frontend/img/covers/cover.jpg',
        //     rating: 8.4,
        //     genres: ['Action', 'Triler']
        // },
        // {
        //     id: 5,
        //     title: 'I Dream in Another Language',
        //     image: '/assets/frontend/img/covers/cover.jpg',
        //     rating: 8.4,
        //     genres: ['Action', 'Triler']
        // },
        // {
        //     id: 6,
        //     title: 'I Dream in Another Language',
        //     image: '/assets/frontend/img/covers/cover.jpg',
        //     rating: 8.4,
        //     genres: ['Action', 'Triler']
        // },
        // {
        //     id: 7,
        //     title: 'I Dream in Another Language',
        //     image: '/assets/frontend/img/covers/cover.jpg',
        //     rating: 8.4,
        //     genres: ['Action', 'Triler']
        // },
        // {
        //     id: 8,
        //     title: 'I Dream in Another Language',
        //     image: '/assets/frontend/img/covers/cover.jpg',
        //     rating: 8.4,
        //     genres: ['Action', 'Triler']
        // },
        // Add more movies as needed
    ];

    return (
        <section className="section section--border">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section__title-wrap">
                            <h2 className="section__title">Expected premiere</h2>
                            <Link href="/catalog" className="section__view section__view--carousel">
                                View All
                            </Link>
                        </div>
                    </div>

                    <div className="col-12">
                        <Splide
                            options={{
                                type: 'slide',
                                perPage: 4,
                                gap: '1rem',
                                pagination: false,
                                breakpoints: {
                                    1200: { perPage: 3 },
                                    992: { perPage: 2 },
                                    576: { perPage: 1 }
                                }
                            }}
                            className="section__carousel splide--content"
                        >
                            {movies.map((movie) => (
                                <SplideSlide key={movie.id}>
                                    <div className="item item--carousel">
                                        <div className="item__cover">
                                            <img src={movie.image} alt={movie.title} />
                                            <Link href={`/details/${movie.id}`} className="item__play">
                                                <i className="ti ti-player-play-filled"></i>
                                            </Link>
                                            <span className={`item__rate ${movie.rating >= 8 ? 'item__rate--green' :
                                                    movie.rating >= 6 ? 'item__rate--yellow' :
                                                        'item__rate--red'
                                                }`}>
                                                {movie.rating}
                                            </span>
                                            <button className="item__favorite" type="button">
                                                <i className="ti ti-bookmark"></i>
                                            </button>
                                        </div>
                                        <div className="item__content">
                                            <h3 className="item__title">
                                                <Link href={`/details/${movie.id}`}>{movie.title}</Link>
                                            </h3>
                                            <span className="item__category">
                                                {movie.genres.map((genre, index) => (
                                                    <React.Fragment key={genre}>
                                                        <Link href={`/genre/${genre.toLowerCase()}`}>{genre}</Link>
                                                        {index < movie.genres.length - 1 && ' '}
                                                    </React.Fragment>
                                                ))}
                                            </span>
                                        </div>
                                    </div>
                                </SplideSlide>
                            ))}
                        </Splide>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExclusiveOriginal;
