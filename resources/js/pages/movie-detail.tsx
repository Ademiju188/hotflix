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
                <section className="section section--details">
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
                                                <img src={movie.banner_path} alt={movie.title} />
                                                {/* <span className="item__rate item__rate--green">8.4</span> */}
                                                <button className="item__favorite item__favorite--static" type="button"><i className="ti ti-bookmark"></i></button>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-7 col-lg-8 col-xl-6 col-xxl-7">
                                            <div className="item__content">
                                                <ul className="item__meta">
                                                    <li>
                                                        {movie.categories.map(category => (
                                                            <a href="#" key={category.id}>{category.name}</a>
                                                        ))}
                                                    </li>
                                                </ul>

                                                <div className="item__description">
                                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique, maiores? Accusamus harum quas quaerat, voluptatibus architecto, eos odio labore quibusdam ducimus recusandae dolore cupiditate assumenda aperiam adipisci molestiae. Laudantium culpa minus enim quis unde at corporis suscipit sit, voluptates officia. Sit impedit similique laboriosam quaerat neque nisi consequuntur, atque repellat aliquam nam temporibus. Ut sequi qui dolor dolorem nam unde tempora modi minima harum perferendis obcaecati iure, id quia eius vitae atque rerum sunt nulla, nisi facere? Accusantium praesentium laborum consequuntur laudantium! Molestias, omnis soluta blanditiis deserunt dolorem, ex expedita nam corrupti voluptas amet dicta doloribus atque cumque accusantium tenetur quibusdam quaerat magni nobis eum excepturi laboriosam neque quidem eaque assumenda. Voluptas quae itaque quis, aliquid ad iste dolorem nam adipisci tempora? Explicabo atque deserunt aliquam, ducimus, tempora necessitatibus culpa quisquam eius debitis hic voluptatibus inventore ex architecto aut ut! Vel non reprehenderit nemo unde dicta tempora quasi debitis impedit totam corrupti, eum voluptates, officiis iure repudiandae facilis quam nulla. Cum, at sequi, culpa debitis voluptates accusantium nesciunt enim odit neque rem eius rerum qui eos! Minus et ullam ea quae non iusto quos, est id perspiciatis maiores similique molestias atque quaerat numquam. Dolores molestiae nisi vel quas blanditiis totam!</p>
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
