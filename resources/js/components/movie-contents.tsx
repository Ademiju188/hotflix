import React from 'react';

interface Movie {
    id: number;
    title: string;
    rating: number;
    description: string;
    genres: string[];
    image: string;
}

interface MovieContentProps {
    movies?: Movie[]; // Optional prop with default empty array
}

const MovieContents: React.FC<MovieContentProps> = ({ movies = [] }) => {
    return (
        <div className="section section--catalog">
			<div className="container">
				<div className="row">
					<div className="col-6 col-sm-4 col-lg-3 col-xl-2">
						<div className="item">
							<div className="item__cover">
								<img src="/assets/frontend/img/covers/cover.jpg" alt="" />
								<a href="details.html" className="item__play">
									<i className="ti ti-player-play-filled"></i>
								</a>
								<span className="item__rate item__rate--green">8.4</span>
								<button className="item__favorite" type="button"><i className="ti ti-bookmark"></i></button>
							</div>
							<div className="item__content">
								<h3 className="item__title"><a href="details.html">I Dream in Another Language</a></h3>
								<span className="item__category">
									<a href="#">Action</a>
									<a href="#">Triler</a>
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="col-12">
						<button className="section__more" type="button">Load more</button>
					</div>
				</div>
			</div>
		</div>
    );
};

export default MovieContents;
