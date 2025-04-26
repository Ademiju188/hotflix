import InputError from "@/components/input-error";
import InputField from "@/components/input-field";
import AppLayout from "@/layouts/app-layout";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { LoaderCircle } from 'lucide-react';
import SlimSelect from 'slim-select';
// import axios from 'axios';

type CategoryProps = {
    categories: {
        data: {
            id: number,
            name: string
        }[]
    };
    movie: {
        id: number;
        title: string;
        description: string;
        featured: boolean;
        premium: boolean;
        episodes_count: number;
        banner_path?: string;
        banner?:string;
        categories: { id: number }[];
        episodes?: {
            id: number;
            episode_number: number;
            is_premium: boolean;
            video_path?: string;
            active: boolean
        }[];
    };
};

type Episode = {
    id: string | number;
    video: File | null;
    is_premium: boolean;
    existing_video?: string;
    video_path?: string,
    active: boolean
};

type MovieForm = {
    title: string;
    description: string;
    featured: boolean;
    premium: boolean;
    episode_no: number;
    banner: File | null;
    existing_banner: string | null,
    categories: number[];
    episodes: Episode[];
};

const MovieEdit = ({ categories, movie }: CategoryProps) => {
    const categorySelectRef = useRef<HTMLSelectElement>(null);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [bannerThumbnail, setBannerThumbnail] = useState<string | null>(movie.banner);
    const [processing, setProcessing] = useState(false);
    // const [progress, setProgress] = useState<number>(0);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const [videoPreviews, setVideoPreviews] = useState<{ [key: string]: string }>(movie.episodes);

    const { data, setData, post, errors, reset, progress } = useForm<MovieForm>({
        title: movie.title,
        description: movie.description,
        featured: movie.featured,
        premium: movie.premium,
        episode_no: movie.episodes_count,
        existing_banner: movie.banner_path,
        banner: null,
        categories: movie.categories.map(c => c.id),
        episodes: movie.episodes?.map(episode => ({
            id: episode.id,
            video: null,
            is_premium: episode.is_premium,
            existing_video: episode.video_path,
            active: episode.active
        })) || Array(movie.episode_count).fill(null).map(() => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            video: null,
            is_premium: false
        })),

    });

    useEffect(() => {
        // Update episodes array when episode_no changes
        const newEpisodeCount = data.episode_no;
        const currentEpisodeCount = data.episodes.length;

        if (newEpisodeCount > currentEpisodeCount) {
            // Add new episodes
            const episodesToAdd = newEpisodeCount - currentEpisodeCount;
            const newEpisodes = Array(episodesToAdd).fill(null).map(() => ({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                video: null,
                is_premium: false
            }));
            setData('episodes', [...data.episodes, ...newEpisodes]);
        } else if (newEpisodeCount < currentEpisodeCount) {
            // Remove episodes (from the end)
            setData('episodes', data.episodes.slice(0, newEpisodeCount));
        }
    }, [data.episode_no]);

    const handleFileChange = (field: keyof MovieForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData(field, file);

            if (field === 'banner') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        setBannerThumbnail(e.target.result as string);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    // const handleEpisodeVideoChange = (episodeId: string | number, e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files[0]) {
    //         const file = e.target.files[0];

    //         if (!['video/mp4', 'video/x-m4v', 'video/quicktime'].includes(file.type)) {
    //             alert('Only MP4, M4V, and QuickTime videos are allowed');
    //             e.target.value = '';
    //             return;
    //         }

    //         setData('episodes', data.episodes.map(episode =>
    //             episode.id === episodeId
    //                 ? { ...episode, video: file }
    //                 : episode
    //         ));

    //         // Create and store preview URL separately
    //         const previewUrl = URL.createObjectURL(file);
    //         setVideoPreviews(prev => ({ ...prev, [episodeId.toString()]: previewUrl }));
    //     }
    // };


    const handleEpisodeVideoChange = (episodeId: string | number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file type
            if (!['video/mp4', 'video/x-m4v', 'video/quicktime'].includes(file.type)) {
                alert('Only MP4, M4V, and QuickTime videos are allowed');
                e.target.value = '';
                return;
            }

            // Update state with new file
            setData('episodes', data.episodes.map(episode =>
                episode.id === episodeId
                    ? { ...episode, video: file }
                    : episode
            ));

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setVideoPreviews(prev => ({ ...prev, [episodeId.toString()]: previewUrl }));
        }
    };

    const handleEpisodePremiumChange = (episodeId: string | number, isPremium: boolean) => {
        setData('episodes', data.episodes.map(episode => {
            if (episode.id === episodeId) {
                return {
                    ...episode,
                    is_premium: isPremium
                };
            }
            return episode;
        }));
    };

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        // formData.append('_method', 'PUT'); // Important for Laravel to treat as PUT request
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('featured', data.featured ? '1' : '0');
        formData.append('premium', data.premium ? '1' : '0');
        formData.append('episode_no', data.episode_no.toString());

        if (data.banner) formData.append('banner', data.banner);
        else if (movie.banner_path) formData.append('existing_banner', movie.banner_path);

        data.categories.forEach(cat => formData.append('categories[]', cat.toString()));

        data.episodes.forEach((episode, index) => {
            if (episode.video) {
                formData.append(`episodes[${index}][video]`, episode.video);
            } else if (episode.existing_video) {
                formData.append(`episodes[${index}][existing_video]`, episode.existing_video);
            }
            formData.append(`episodes[${index}][id]`, episode.id.toString());
            formData.append(`episodes[${index}][is_premium]`, episode.is_premium ? '1' : '0');
        });

        try {
            await post(route('system.movie.update', movie.id), {
                // onProgress: (progress) => {
                //     // Update progress state
                //     setUploadProgress(progress.percentage);
                //     console.log(`Upload progress: ${progress.percentage}%`);
                // },
                onSuccess: () => {
                    setProcessing(false);
                },
                onError: (errors) => {
                    setProcessing(false);
                    console.error('Update errors:', errors);
                }
            });
        } catch (error) {
            setProcessing(false);
            console.error('Update error:', error);
        }
    };

    const handleDeleteEpisode = async (episodeId: string | number, index: number) => {
        if (!confirm('Are you sure you want to delete this episode?')) return;

        setProcessing(true);

        try {
            // If episode exists in backend (has numeric ID)
            if (typeof episodeId === 'number') {
                await router.delete(route('system.movie.episode.destroy', episodeId));
            }

            // Remove from local state
            setData('episodes', data.episodes.filter((_, i) => i !== index));

            // Update episode numbers
            setData('episode_no', data.episode_no - 1);

        } catch (error) {
            console.error('Failed to delete episode:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleEpisodeStatus = async (episode: Episode) => {
        setProcessing(true);

        try {
            await router.put(route('system.movie.episode.status', episode.id));

            // Update local state to reflect the new status
            setData('episodes', data.episodes.map(ep =>
                ep.id === episode.id ? { ...ep, active: !ep.active } : ep
            ));

        } catch (error) {
            console.error(`Failed to ${episode.active ? 'disable' : 'enable'} episode:`, error);
            // Optionally show an error notification here
        } finally {
            setProcessing(false);
        }
    }

    const handleDeleteBanner = async () => {
        if (!confirm('Are you sure you want to delete this poster?')) return;
        setProcessing(true);

        try {
            await router.put(route('system.movie.banner.delete', movie.id), {}, {
                onSuccess: () => {
                    setBannerThumbnail(null);
                    setData('banner', null);
                },
            });

        } catch (error) {
            console.error(`Failed to remove banner:`, error);
            // Optionally show an error notification here
        } finally {
            setProcessing(false);
        }
    }

    useEffect(() => {
        if (categorySelectRef.current) {
            const select = new SlimSelect({
                select: categorySelectRef.current,
                settings: {
                    showSearch: true,
                    placeholderText: 'Select Categories',
                    closeOnSelect: false
                },
                events: {
                    afterChange: (newVal) => {
                        const selectedIds = newVal.map((item: { value: string }) => parseInt(item.value));
                        setSelectedCategories(selectedIds);
                        setData('categories', selectedIds);
                    }
                }
            });

            // Set initially selected categories
            // select.set(selectedCategories.map(id => id.toString()));

            return () => {
                select.destroy();
            };
        }
    }, [selectedCategories]);

    return (
        <>
            <Head title="Mini Series" />
            <AppLayout title="Mini Series" mainTitle={true}>
                <div className="col-12">
                    <form onSubmit={handleSubmit} className="sign__form sign__form--add">
                        <div className="row">
                            <div className="col-12 col-xl-6">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="sign__group">
                                            <InputField
                                                name="title"
                                                value={data.title}
                                                onChange={(field, value) => setData(field, value)}
                                                placeholder="Title"
                                                error={errors.title}
                                                required
                                            />
                                            <InputError message={errors.title} />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="sign__group">
                                            <textarea
                                                className={`sign__textarea ${errors.description ? 'is-invalid' : ''}`}
                                                placeholder="Description"
                                                onChange={(e) => setData('description', e.target.value)}
                                                value={data.description}
                                            />
                                            <InputError message={errors.description} />
                                        </div>
                                    </div>
                                    {bannerThumbnail && (
                                        <div className="col-12 mb-3">
                                            <div className="mt-2 mb-3">
                                                <img
                                                    src={bannerThumbnail}
                                                    alt="Banner preview"
                                                    className="img-thumbnail"
                                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteBanner()}
                                                disabled={processing}
                                            >
                                                Remove Poster
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-12 col-xl-6">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="sign__group">
                                            <div className="sign__gallery">
                                                <label htmlFor="sign__gallery-upload">Upload Poster</label>
                                                <input
                                                    id="sign__gallery-upload"
                                                    name="banner"
                                                    className="sign__gallery-upload"
                                                    type="file"
                                                    accept=".png, .jpg, .jpeg"
                                                    onChange={handleFileChange('banner')}
                                                    // required
                                                />
                                            </div>
                                            <InputError message={errors.banner} />
                                        </div>
                                    </div>



                                    <div className="col-12">
                                        <div className="sign__group">
                                            <label className="sign__label">No. of Episode:</label>
                                            <InputField
                                                type='number'
                                                name="episode_no"
                                                value={data.episode_no}
                                                onChange={(field, value) => {
                                                    const numValue = parseInt(value);
                                                    if (!isNaN(numValue)) {
                                                        setData(field, Math.max(1, numValue)); // Ensure at least 1 episode
                                                    }
                                                }}
                                                placeholder="No. of Episode"
                                                error={errors.episode_no}
                                                //  min="1"
                                                // required
                                            />
                                            <InputError message={errors.episode_no} />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="sign__group">
                                            <select
                                                className="sign__selectjs"
                                                id="sign__genre"
                                                ref={categorySelectRef}
                                                onChange={(e) => setData('categories', e.target.value)}
                                                multiple
                                            >
                                                {/* <option value=""></option> */}
                                                {categories.data.map(category => (
                                                    <option value={category.id} key={category.id}>{category.name}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.categories} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="sign__episodes mt-4">
                                    <h4 className="sign__title">Episodes</h4>

                                    {data.episodes.map((episode, index) => (
                                        <div key={episode.id} className="sign__episode mt-3">
                                            <div className="row">
                                                <div className="col-12 mb-3">
                                                    <div className="d-flex justify-content-between">
                                                        <div className="sign__episode-title">Episode #{index + 1}</div>
                                                        <div>
                                                            <button
                                                                type="button"
                                                            className={`btn btn-${episode.active ? 'danger' : 'success'} btn-sm me-2`}
                                                                onClick={() => handleEpisodeStatus(episode)}
                                                                disabled={processing}
                                                            >
                                                                {episode.active ? 'Disable' : 'Enable'} Episode #{index + 1}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleDeleteEpisode(episode.id, index)}
                                                                disabled={processing}
                                                            >
                                                                Delete Episode #{index + 1}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-8">
                                                    <div className="sign__video">
                                                        <label htmlFor={`episode-video-${episode.id}`}>
                                                            Upload episode {index + 1}
                                                        </label>
                                                        <input
                                                            id={`episode-video-${episode.id}`}
                                                            type="file"
                                                            accept="video/mp4,video/x-m4v,video/*"
                                                            onChange={(e) => handleEpisodeVideoChange(episode.id, e)}
                                                            // required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="flex-grow-1">
                                                            <select
                                                                className="form-select"
                                                                value={episode.is_premium ? '1' : '0'}
                                                                onChange={(e) => handleEpisodePremiumChange(
                                                                    episode.id,
                                                                    e.target.value === '1'
                                                                )}
                                                            >
                                                                <option value="0">Free</option>
                                                                <option value="1">Premium</option>
                                                            </select>
                                                            <InputError message={errors[`episodes.${index}.is_premium`]} />
                                                        </div>
                                                    </div>
                                                </div>
                                            {videoPreviews[episode.id] && (
                                                    <video
                                                        src={videoPreviews[episode.id]}
                                                        controls
                                                        style={{ maxWidth: '300px' }}
                                                    />
                                                )}

                                                {/* Show existing video if no new upload */}
                                                {!videoPreviews[episode.id] && episode.existing_video && (
                                                    <video
                                                        src={episode.existing_video}
                                                        controls
                                                        style={{ maxWidth: '300px' }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-12 mt-4">
                                <button
                                    type="submit"
                                    className="sign__btn sign__btn--small"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <span>Publish</span>
                                    )}
                                </button>

                                {/* {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="mt-4 text-white">
                                        <p>Uploading: {uploadProgress}%</p>
                                        <div className="progress">
                                            <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${uploadProgress}%` }} aria-valuemin="0" aria-valuemax="100">{Math.round(uploadProgress)}%</div>
                                        </div>
                                    </div>
                                )} */}

                                {progress && (
                                    <div className="mt-4 text-white">
                                        <p>Uploading: {progress.percentage}%</p>
                                        <div className="progress">
                                            <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${progress.percentage}%` }} aria-valuemin="0" aria-valuemax="100">{progress.percentage}%</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </AppLayout>
        </>
    )
};

export default MovieEdit;
