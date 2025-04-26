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
};

type Episode = {
    id: string;
    video: File | null;
    // videoPreview: string | null;
    is_premium: boolean;
};

type MovieForm = {
    title: string;
    description: string;
    featured: boolean;
    premium: boolean;
    episode_no: number;
    banner: File | null;
    categories: number[];
    // category: number | string;
    episodes: Episode[];
};

const MovieCreate = ({ categories }: CategoryProps) => {
    const categorySelectRef = useRef<HTMLSelectElement>(null);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [bannerThumbnail, setBannerThumbnail] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    // const [progress, setProgress] = useState<number>(0);

    const [videoPreviews, setVideoPreviews] = useState<{ [key: string]: string }>({});

    const { data, setData, post, errors, reset, progress } = useForm<MovieForm>({
        title: '',
        description: '',
        featured: true,
        premium: false,
        episode_no: 1,
        banner: null,
        categories: [],
        // category: '',
        episodes: Array(1).fill(null).map(() => ({
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
                // videoPreview: null,
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
    const handleEpisodeVideoChange = (episodeId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file
            // if (file.size > 100 * 1024 * 1024) {
            //     alert('Video file must be less than 100MB');
            //     e.target.value = '';
            //     return;
            // }

            if (!['video/mp4', 'video/x-m4v', 'video/quicktime'].includes(file.type)) {
                alert('Only MP4, M4V, and QuickTime videos are allowed');
                e.target.value = '';
                return;
            }

            setData('episodes', data.episodes.map(episode =>
                episode.id === episodeId
                    ? { ...episode, video: file }
                    : episode
            ));

            // Create and store preview URL separately
            const previewUrl = URL.createObjectURL(file);
            setVideoPreviews(prev => ({ ...prev, [episodeId]: previewUrl }));
        }
    };

    const handleEpisodePremiumChange = (episodeId: string, isPremium: boolean) => {
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

        try {

            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('featured', data.featured ? '1' : '0');
            formData.append('premium', data.premium ? '1' : '0');
            formData.append('episode_no', data.episode_no.toString());

            if (data.banner) formData.append('banner', data.banner);

            data.categories.forEach(cat => formData.append('categories[]', cat.toString()));

            data.episodes.forEach((episode, index) => {
                if (episode.video) {
                    formData.append(`episodes[${index}][video]`, episode.video);
                    formData.append(`episodes[${index}][is_premium]`, episode.is_premium ? '1' : '0');
                }
            });

            // await router.post(route('system.movie.store'), formData);


            // const response = await axios.post(route('system.movie.store'), formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            //     onUploadProgress: (progressEvent: ProgressEvent) => {
            //         const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            //         setProgress(percent);
            //     },
            // });

            //   console.log('Upload success:', response.data);

            await post(route('system.movie.store'), { formData,
                onSuccess: () => {
                    setProcessing(false);
                    reset();
                },
                // onUploadProgress: () => {

                // },
                onError: (errors) => {
                    setProcessing(false);
                    console.error('Submission errors:', errors);
                }
            });

        } catch (error) {
            setProcessing(false);
            console.error('Submission error:', error);
        }
    };

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

            return () => {
                select.destroy();
            };
        }
    }, []);

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
                                        <div className="col-12">
                                            <div className="mt-2 mb-3">
                                                <img
                                                    src={bannerThumbnail}
                                                    alt="Banner preview"
                                                    className="img-thumbnail"
                                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                                />
                                            </div>
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
                                                    required
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
                                                //  value={data.episode_no}
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
                                                // onChange={(e) => setData('category', e.target.value)}
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
                                                <div className="col-12">
                                                    <span className="sign__episode-title">Episode #{index + 1}</span>
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
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-4">
                                                    <div className="sign__group">
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

                                                {videoPreviews[episode.id] && (
                                                    <video
                                                        src={videoPreviews[episode.id]}
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

export default MovieCreate;
