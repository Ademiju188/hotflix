import EpisodePlayer from "@/components/EpisodePlayer";
import GuestHeaderLayout from "@/layouts/guest/guest-header-layout";
import { Head } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { Scrollbars } from 'react-custom-scrollbars-2';


interface MovieProps {
    movie: Movies
}

const MovieDetail = ({ movie }: MovieProps) => {

    const scrollContainerRef = useRef(null);
    // console.log(movie);
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Scrollbar && scrollContainerRef.current) {
            const scrollbar = window.Scrollbar.init(scrollContainerRef.current, {
                damping: 0.1,
                renderByPixels: true,
                alwaysShowTracks: true,
                continuousScrolling: true
            });

            // Cleanup on component unmount
            return () => {
                if (scrollbar) {
                    scrollbar.destroy();
                }
            };
        }
    }, []);

    return (
        <>
            <Head title="Home" />
            <GuestHeaderLayout>
                <section className="section section--details" style={{ minHeight: '90vh' }}>
                    <div className="section__details-bg" data-bg="img/bg/details__bg.jpg"></div>

                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h1 className="section__title section__title--head">{movie.title}</h1>
                            </div>

                            <div className="col-12 col-xl-6">
                                <div className="item item--details">
                                    <div className="row">
                                        <div className="col-12 col-sm-5 col-md-5 col-lg-4 col-xl-6 col-xxl-5">
                                            <div className="item__cover">
                                                <img src={movie.banner_path} alt={movie.title} style={{ width: '270px', height: '400px', objectFit: 'cover' }} />
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-7 col-lg-8 col-xl-6 col-xxl-7">
                                            <div className="item__content">
                                                <ul className="item__meta mb-0 pb-0">
                                                    <li>
                                                        {movie.categories.map(category => (
                                                            <a href="#" key={category.id}>{category.name}</a>
                                                        ))}
                                                    </li>
                                                </ul>
                                                <div className="item__description pt-0 mt-0">
                                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime harum dolor iste saepe deserunt! Aperiam, voluptatibus impedit! Veniam, iste quidem. Nisi vel repellat quidem iusto illo aperiam accusantium, obcaecati quasi.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-xl-6">
                                <EpisodePlayer episodes={movie.episodes} />
                            </div>
                        </div>
                    </div>
                </section>
            </GuestHeaderLayout>
        </>
    );
};

export default MovieDetail;
