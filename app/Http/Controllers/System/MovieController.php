<?php

namespace App\Http\Controllers\System;

use Inertia\Inertia;
use App\Models\Movie;
use App\Models\Series;
use App\Models\Episode;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Services\MovieService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\MovieResource;
use App\Repositories\MovieRepository;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\CategoryResource;
use App\Repositories\CategoryRepository;
use App\Http\Requests\Movie\StoreMovieRequest;
use App\Http\Requests\Movie\UpdateMovieRequest;

class MovieController extends Controller
{
    protected ?CategoryRepository $categoryRepository;
    protected ?MovieService $movieService;
    protected ?MovieRepository $movieRepository;

    public function __construct(CategoryRepository $categoryRepository, MovieRepository $movieRepository, MovieService $movieService)
    {
        $this->categoryRepository = $categoryRepository;
        $this->movieRepository = $movieRepository;
        $this->movieService = $movieService;
    }

    public function index(Request $request)
    {
        return Inertia::render('admin/movie/movie-index', [
            'categories'  => CategoryResource::collection($this->categoryRepository->activeCategories()),
            'movies'  => MovieResource::collection($this->movieRepository->all($request))
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('admin/movie/movie-create', [
            'categories'  => CategoryResource::collection($this->categoryRepository->activeCategories()),
        ]);
    }

    public function store(StoreMovieRequest $request)
    {
        return DB::transaction(function () use ($request) {
            try {
                // Create slug-friendly movie directory name
                $movieDir = generateUniqueSlug(Movie::class, $request->title);

                // Store main movie data
                $movieData = [
                    'title' => $request->title,
                    'description' => $request->description,
                    'content_type' => 'series', // Force to series for mini-series
                    'featured' => $request->featured ?? false,
                    'premium' => $request->premium ?? false,
                    'episode_count' => $request->episode_number,
                ];

                // Store banner in movie directory
                if ($request->hasFile('banner')) {
                    $bannerFile = $request->file('banner');
                    $customName = Str::slug($request->input('title', 'movie')) . '-' . Str::random(8);
                    $extension = $bannerFile->getClientOriginalExtension();
                    $fileName = "{$customName}.{$extension}";
                    $movieData['banner_path'] = $request->file('banner')->storeAs(
                        "movies/{$movieDir}/banners",
                        $fileName,
                        'public'
                    );
                }

                $movie = Movie::create($movieData);

                // Attach categories
                if ($request->has('categories')) {
                    $movie->categories()->attach($request->categories);
                }

                // Handle episodes (for mini-series format)
                if ($request->has('episodes')) {
                    foreach ($request->episodes as $index => $episodeData) {
                        $order = $index + 1;
                        $episode = new Episode([
                            'title' => "EP{$order}",
                            'movie_id' => $movie->id,
                            'episode_number' => $order,
                            'is_premium' => $episodeData['is_premium'] ?? false,
                        ]);

                        $customName = 'episode-' . $order . '-' . Str::random(8);
                        $extension = $episodeData['video']->getClientOriginalExtension();
                        $fileName = "{$customName}.{$extension}";

                        // Store episode video
                        if (isset($episodeData['video'])) {
                            $episode->video_path = $episodeData['video']->storeAs(
                                "movies/{$movieDir}/episodes",
                                $fileName,
                                'public'
                            );
                        }

                        $episode->save();
                    }
                }

                session()->flash('success', 'Mini series created successfully');
                return redirect()->route('system.movie.index');

            } catch (\Exception $e) {
                // Clean up any uploaded files if an error occurs
                if (isset($movieData['banner_path'])) {
                    Storage::disk('public')->delete($movieData['banner_path']);
                }

                if (isset($episode) && isset($episode->video_path)) {
                    Storage::disk('public')->delete($episode->video_path);
                }
                Log::error(''. $e->getMessage());
                return back()->withInput()->with('error', 'Failed to create mini series: ' . $e->getMessage());
            }
        });
    }

    public function edit(Movie $movie)
    {
        return Inertia::render('admin/movie/movie-edit', [
            'movie'       => (new MovieResource($movie)),
            'allCategories'  => CategoryResource::collection($this->categoryRepository->activeCategories()),
            'categories'  => CategoryResource::collection($this->categoryRepository->activeCategories()),
        ]);
    }

    public function update(UpdateMovieRequest $request, Movie $movie)
    {
        // Track newly uploaded files for cleanup if needed
        $newFiles = [
            'banner' => null,
            'episodes' => []
        ];

        return DB::transaction(function () use ($request, $movie, &$newFiles) {
            try {
                // Update basic movie data
                $movieData = $request->only([
                    'title', 'description', 'episode_number'
                ]);
                // dd($request->hasFile('banner'));
                // Handle banner update
                if ($request->hasFile('banner') ) {
                    // Store new banner first
                    $movieDir = Str::slug($movie->title);
                    $customName = Str::slug($request->input('title', 'movie')) . '-' . Str::random(8);
                    $extension = $request->file('banner')->getClientOriginalExtension();
                    $fileName = "{$customName}.{$extension}";

                    $newBannerPath = $request->file('banner')->storeAs(
                        "movies/{$movieDir}/banners",
                        $fileName,
                        'public'
                    );

                    $newFiles['banner'] = $newBannerPath;
                    $movieData['banner_path'] = $newBannerPath;
                }
                // elseif ($request->has('existing_banner')) {
                //     $movieData['banner_path'] = $request->existing_banner;
                // }

                $movie->update($movieData);

                // Sync categories
                $movie->categories()->sync($request->categories);

                // Process episodes
                $existingEpisodeIds = [];

                foreach ($request->episodes as $index => $episodeData) {
                    $order = $index+1;
                    $episodeData['episode_number'] = $order;

                    // Update or create episode
                    $episode = $movie->episodes()->updateOrCreate(
                        ['id' => $episodeData['id'] ?? null],
                        [
                            'episode_number' => $episodeData['episode_number'],
                            'is_premium' => $episodeData['is_premium'] ?? false,
                        ]
                    );

                    // Track existing episode IDs
                    $existingEpisodeIds[] = $episode->id;

                    // Handle video update if new file was uploaded
                    if (isset($episodeData['video'])) {
                        $movieDir = Str::slug($movie->title);
                        $customName = 'episode-' . $episodeData['episode_number'] . '-' . Str::random(8);
                        $extension = $episodeData['video']->getClientOriginalExtension();
                        $fileName = "{$customName}.{$extension}";

                        $newVideoPath = $episodeData['video']->storeAs(
                            "movies/{$movieDir}/episodes",
                            $fileName,
                            'public'
                        );

                        // Track new video file
                        $newFiles['episodes'][$episode->id] = $newVideoPath;

                        // Delete old video if exists (only after new one is successfully stored)
                        if ($episode->video_path) {
                            Storage::disk('public')->delete($episode->video_path);
                        }

                        $episode->video_path = $newVideoPath;
                        $episode->save();
                    }
                }

                // Delete episodes that were removed
                $movie->episodes()
                    ->whereNotIn('id', $existingEpisodeIds)
                    ->each(function ($episode) {
                        if ($episode->video_path) {
                            Storage::disk('public')->delete($episode->video_path);
                        }
                        $episode->delete();
                    });

                return redirect()
                    ->route('system.movie.index')
                    ->with('success', 'Movie updated successfully');

            } catch (\Exception $e) {
                // Clean up any newly uploaded files in case of error
                $this->cleanupUploadedFiles($newFiles);

                return back()
                    ->withInput()
                    ->with('error', 'Failed to update movie: ' . $e->getMessage());
            }
        });
    }

    /**
     * Clean up uploaded files when an error occurs
     */
    protected function cleanupUploadedFiles(array $newFiles)
    {
        try {
            // Delete newly uploaded banner if exists
            if ($newFiles['banner']) {
                Storage::disk('public')->delete($newFiles['banner']);
            }

            // Delete any newly uploaded episode videos
            foreach ($newFiles['episodes'] as $videoPath) {
                if ($videoPath) {
                    Storage::disk('public')->delete($videoPath);
                }
            }
        } catch (\Exception $cleanupError) {
            // Log cleanup errors but don't prevent the original error from being reported
            \Log::error('File cleanup failed: ' . $cleanupError->getMessage());
        }
    }

    public function deleteEpisode(Episode $episode)
    {
        DB::transaction(function () use ($episode) {
            try {
                // Delete the video file if exists
                if ($episode->video_path) {
                    Storage::disk('public')->delete($episode->video_path);
                }

                $episode->delete();

                session()->flash('success', 'Episode deleted successfully');
                return redirect()->back();

            } catch (\Exception $e) {
                session()->flash('error', 'Failed to delete episode');
                return redirect()->back();
            }
        });
    }

    public function updateStatus(Episode $episode)
    {
        DB::transaction(function () use ($episode) {
            $episode->update(['active' => !$episode->active]);
            session()->flash('success', "Episode status updated successfully");
            return redirect()->route('system.movie.edit', $episode->movie->uuid);
        });
    }

    public function updateMovieStatus(Movie $movie)
    {
        DB::transaction(function () use ($movie) {
            $movie->update(['active' => !$movie->active]);
            session()->flash('success', "Series status updated successfully");
            return redirect()->route('system.movie.index');
        });
    }

    public function deleteBanner(Movie $movie)
    {
        try {
            DB::transaction(function () use ($movie) {

                if ($movie->banner_path) {
                    Storage::disk('public')->delete($movie->banner_path);
                }

                $movie->update(['banner_path' => null]);
            });

            session()->flash('success', "Banner deleted successfully");
            return redirect()->route('system.movie.edit', $movie->uuid);

        } catch (\Exception $e) {
            session()->flash('error', "Failed to delete banner");
            return redirect()->route('system.movie.edit', $movie->uuid);
        }
    }

    public function destroy(Movie $movie)
    {
        DB::transaction(function () use ($movie) {
            try {
                // Get the movie directory path before deletion
                $movieDir = Str::slug($movie->title);
                $folderPath = "movies/{$movieDir}";

                // Delete banner if exists
                if ($movie->banner_path) {
                    Storage::disk('public')->delete($movie->banner_path);
                }

                // Delete all episode videos and their records
                $movie->episodes->each(function ($episode) {
                    if ($episode->video_path) {
                        Storage::disk('public')->delete($episode->video_path);
                    }
                    $episode->delete();
                });

                // Delete the movie record
                $movie->delete();

                // Delete the entire movie folder and all its contents
                if (Storage::disk('public')->exists($folderPath)) {
                    Storage::disk('public')->deleteDirectory($folderPath);
                }

                session()->flash('success', 'Movie, all episodes, and associated files deleted successfully');

            } catch (\Exception $e) {
                \Log::error('Failed to delete movie: ' . $e->getMessage(), [
                    'movie_id' => $movie->id,
                    'error' => $e
                ]);

                session()->flash('error', 'Failed to delete movie. Please try again.');
                throw $e;
            }
        });

        return redirect()->route('system.movie.index');
    }
}
