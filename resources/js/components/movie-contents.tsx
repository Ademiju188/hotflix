import React from 'react';
import { Link } from '@inertiajs/react';

interface MovieContentsProps {
    movies: {
        data: any[];
        links: any;
        meta: any;
    };
    onLoadMore: (url: string) => void;
}

const MovieContents: React.FC<MovieContentsProps> = ({ movies, onLoadMore }) => {
    const [loading, setLoading] = React.useState(false);

    const handleLoadMore = () => {
        if (!movies.links.next || loading) return;
        setLoading(true);
        onLoadMore(movies.links.next);
        setLoading(false);
    };
// console.log(movies)
    return (
        <div className="section section--catalog" >
            <div className="container">
                <div className="row">
                    {movies.data.map((movie) => (
                        <div key={movie.id} className="col-6 col-sm-4 col-lg-3 col-xl-2">
                            <div className="item">
                                <div className="item__cover">
                                    <div className="movie-image-container">
                                        <img
                                            src={movie.banner_path}
                                            alt={movie.title}
                                            className="movie-image"
                                        />
                                    </div>
                                    <Link href={route('movie-details', movie.uuid)} className="item__play">
                                        <i className="ti ti-player-play-filled"></i>
                                    </Link>
                                    {/* <button className="item__favorite" type="button">
                                        <i className="ti ti-bookmark"></i>
                                    </button> */}
                                </div>
                                <div className="item__content">
                                    <h3 className="item__title">
                                        <Link href={route('movie-details', movie.uuid)}>{movie.title}</Link>
                                    </h3>
                                    <span className="item__category">
                                        {movie.categories.map(category => (
                                            <Link href="#" key={category.id}>{category.name}</Link>
                                        ))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {movies.links.next && (
                    <div className="row">
                        <div className="col-12">
                            <button
                                className="section__more"
                                type="button"
                                onClick={handleLoadMore}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieContents;
