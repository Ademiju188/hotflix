import React, { useState, useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { router } from '@inertiajs/react';

interface Episode {
    id: number;
    uuid: string;
    title: string;
    episode_number: number;
    video_path: string;
    is_premium: number;
    active: number;
    movie_banner: string;
}

interface EpisodePlayerProps {
    episodes: Episode[];
    userHasAccess?: boolean;
}

const EpisodePlayer: React.FC<EpisodePlayerProps> = ({ episodes, userHasAccess = false }) => {
    const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const playerRef = useRef<Plyr | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [playerInitialized, setPlayerInitialized] = useState(false);

    const EPISODES_PER_PAGE = 50;
    const totalPages = Math.ceil(episodes.length / EPISODES_PER_PAGE);
    const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
    const endIndex = startIndex + EPISODES_PER_PAGE;
    const currentEpisodes = episodes.slice(startIndex, endIndex);

    // Initialize with first episode
    useEffect(() => {
        if (episodes.length > 0 && !currentEpisode) {
            setCurrentEpisode(episodes[0]);
        }
    }, [episodes]);

    // Initialize Plyr player
    useEffect(() => {
        if (!videoRef.current || playerInitialized) return;

        const player = new Plyr(videoRef.current, {
            controls: [
                'play-large',
                'play',
                'progress',
                'current-time',
                'mute',
                'volume',
                'settings',
                'fullscreen'
            ],
            settings: ['quality', 'speed'],
            keyboard: { focused: true, global: true },
            disableContextMenu: true
        });

        playerRef.current = player;
        // setPlayerInitialized(true);

        // Prevent right-click context menu
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        if (containerRef.current) {
            containerRef.current.addEventListener('contextmenu', handleContextMenu);
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('contextmenu', handleContextMenu);
            }
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
                setPlayerInitialized(false);
            }
        };
    }, [playerInitialized]);

    // Handle episode changes
    useEffect(() => {
        // console.log(videoRef.current)
        if (!currentEpisode || !playerRef.current || !videoRef.current) return;

        const player = playerRef.current;

        // Change source and play
        player.source = {
            type: 'video',
            title: currentEpisode.title,
            sources: [{
                src: getSecureVideoUrl(currentEpisode.video_path),
                type: 'video/mp4',
            }],
            poster: currentEpisode.movie_banner
        };

        // Auto-play when source is loaded
        player.once('loadeddata', () => {
            player.play().catch(e => console.log('Auto-play prevented:', e));
        });

        // Handle when playback ends - auto-play next episode
        const handleVideoEnded = () => {
            const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
            if (currentIndex < episodes.length - 1) {
                const nextEpisode = episodes[currentIndex + 1];
                const nextEpisodePage = Math.ceil((currentIndex + 2) / EPISODES_PER_PAGE);

                if (nextEpisodePage !== currentPage) {
                    setCurrentPage(nextEpisodePage);
                }

                setCurrentEpisode(nextEpisode);
            }
        };

        videoRef.current.addEventListener('ended', handleVideoEnded);

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('ended', handleVideoEnded);
            }
        };
    }, [currentEpisode, currentPage, episodes]);

    const handleEpisodeClick = (episode: Episode) => {

        if (episode.is_premium && !userHasAccess) {
            // router.push(route('pricing'))
            router.visit(route('pricing'));
            return;
        }

        setCurrentEpisode(episode);
    };

    const changePage = (page: number) => {
        setCurrentPage(page);
    };

    const getSecureVideoUrl = (url: string) => {
        if (url.includes('?')) {
            return `${url}&token=YOUR_AUTH_TOKEN&encrypted=true`;
        }
        return `${url}?token=YOUR_AUTH_TOKEN&encrypted=true`;
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <div
                    key={i}
                    className={`text-${currentPage === i ? 'primary' : 'white'}`}
                    onClick={() => changePage(i)}
                    style={{ cursor: 'pointer', margin: '0 5px' }}
                >
                    {i === 1 ? '1-50' :
                     i === 2 ? '51-100' :
                     `${(i-1)*50 + 1}-${i*50}`}
                </div>
            );
        }

        return (
            <div className="pt-2">
                <div className="d-flex justify-content-start align-items-center gap-3 mb-2">
                    {pages}
                </div>
            </div>
        );
    };

    return (
        <div className="row">
            <div className="col-12 pb-4 mb-4">
                <div className="section__player" ref={containerRef}>
                    {currentEpisode ? (
                        <div className="plyr plyr--full-ui plyr--video plyr--html5 plyr--paused plyr--stopped plyr--pip-supported plyr--fullscreen-enabled plyr--captions-enabled plyr__poster-enabled">
                            <video
                                ref={videoRef}
                                controls
                                crossOrigin="anonymous"
                                playsInline
                                width={`100%`}
                                height={`400px`}
                                // poster={currentEpisode.movie_banner}
                                controlsList="nodownload"
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                <source
                                    src={getSecureVideoUrl(currentEpisode.video_path)}
                                    type="video/mp4"
                                />
                            </video>
                        </div>
                    ) : (
                        <div className="video-placeholder bg-dark text-white d-flex align-items-center justify-content-center">
                            <p>Select an episode to play</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="col-12">
                <section style={{ willChange: 'opacity', opacity: 1, height: 'auto', overflowY: 'unset' }}>
                    <div className="py-2" role="region" aria-labelledby="section-title">
                        {/* <h2>
                            <button
                                className="d-flex py-3 w-100 h-100 gap-2 align-items-center btn btn-link text-start"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#episodeList"
                                aria-expanded="true"
                                aria-controls="episodeList"
                                style={{ userSelect: 'none' }}
                            >
                                <div className="flex-grow-1 d-flex flex-column text-start">
                                    <span className="text-body">Episode List ({episodes.findIndex(ep => ep.id === currentEpisode?.id) + 1 || 1}/{episodes.length})</span>
                                </div>
                                <span className="text-secondary">
                                    <svg
                                        aria-hidden="true"
                                        fill="none"
                                        focusable="false"
                                        height="1em"
                                        role="presentation"
                                        viewBox="0 0 24 24"
                                        width="1em"
                                    >
                                        <path
                                            d="M15.5 19l-7-7 7-7"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                        ></path>
                                    </svg>
                                </span>
                            </button>
                        </h2> */}

                        {renderPagination()}

                        <div className="row g-2 text-black">
                            {currentEpisodes.map((episode, index) => {
                                const globalIndex = startIndex + index;
                                const isCurrent = currentEpisode?.id === episode.id;

                                return (
                                    <div key={episode.id} className="col-1">
                                        <div
                                            className={`bg-dark text-white rounded text-center py-2 ${episode.is_premium ? 'lock' : ''}`}
                                            onClick={(e) => handleEpisodeClick(episode)}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: isCurrent ? '#007bff' : '',
                                                color: isCurrent ? 'white' : ''
                                            }}
                                        >
                                            {isCurrent ? (
                                                <img
                                                    alt=""
                                                    loading="lazy"
                                                    width="20"
                                                    height="20"
                                                    src="/assets/frontend/img/player.gif"
                                                    style={{ verticalAlign: 'middle' }}
                                                />
                                            ) : (
                                                globalIndex + 1
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EpisodePlayer;
