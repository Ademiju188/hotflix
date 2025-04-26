import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Link } from '@inertiajs/react';

interface Movie {
    id: number;
    title: string;
    rating: number;
    description: string;
    genres: string[];
    image: string;
}

interface HeroProps {
    movies: Movie[];
}
const HeroSlider: React.FC<HeroProps> = ({ movies }) => {
    return (
        <section className="home home--hero">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <Splide
                            options={{
                                type: 'loop',
                                perPage: 1,
                                arrows: true,
                                pagination: false,
                                // autoplay: true
                                rewind: true,
                            }}
                            className="hero splide splide--hero"
                        >
                            <SplideSlide key={1}>
                                <div
                                    className="hero__slide"
                                    style={{
                                        backgroundImage: `url(/assets/frontend/img/bg/home__bg.jpg)`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <div className="hero__content">
                                        <h2 className="hero__title">Demo One <sub className="green">9.8</sub></h2>
                                        <p className="hero__text">A brilliant scientist discovers a way to harness the power of the ocean's currents to create a new, renewable energy source. But when her groundbreaking technology falls into the wrong hands, she must race against time to stop it from being used for evil.</p>
                                        <p className="hero__category">
                                            <a href="#">Action</a>
                                            <a href="#">Drama</a>
                                            <a href="#">Comedy</a>
                                        </p>
                                        <div className="hero__actions">
                                            <a href="details.html" className="hero__btn">
                                                <span>Watch now</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </SplideSlide>
                        </Splide>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default HeroSlider;
