import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Link } from '@inertiajs/react';

const HeroSlider = ({ sliders }) => {
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
                            {sliders.data.map((slider, index) => (
                            <SplideSlide key={index}>
                                <div
                                    className="hero__slide"
                                    style={{
                                        backgroundImage: `url(${slider.movie.banner})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <div className="hero__content">
                                        <h2 className="hero__title">{slider.movie.title}
                                            {/* <sub className="green">9.8</sub> */}
                                        </h2>
                                        <p className="hero__text">{slider.movie.description}</p>
                                        <p className="hero__category">
                                            {slider.movie.categories.map(category => (
                                                <a href="#" key={category.id}>{category.name}</a>
                                            ))}
                                        </p>
                                        <div className="hero__actions">
                                            <Link href={route('movie-details', slider.movie.uuid)} className="hero__btn">
                                                <span>Watch now</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SplideSlide>
                            ))}
                        </Splide>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default HeroSlider;
