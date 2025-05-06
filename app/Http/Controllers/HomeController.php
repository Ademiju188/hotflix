<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\MovieResource;
use App\Http\Resources\PlanResource;
use App\Models\Category;
use App\Models\Plan;
use Inertia\Inertia;
use App\Models\Movie;
use App\Models\HeroSlider;
use Illuminate\Http\Request;
use App\Http\Resources\HeroSliderResource;

class HomeController extends Controller
{

    public function index()
    {
        return Inertia::render('welcome', [
            'pricingPlans' => PlanResource::collection(Plan::with('planType')->orderBy('hierarchy')->get())
        ]);
    }

    public function index2(Request $request)
    {
        $query = Movie::with(['categories', 'episodes' => fn($query) => $query->where('active', true)])
            ->isActive();

        // Apply category filter
        if ($request->has('category') && $request->category !== '') {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Apply search filter
        if ($request->has('search') && $request->search !== '') {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Apply sorting
        if ($request->has('sort') && $request->sort !== '') {
            switch ($request->sort) {
                case 'newest':
                    $query->latest();
                    break;
                case 'oldest':
                    $query->oldest();
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $movies = $query->paginate(2)->appends($request->except('page'));

        return Inertia::render('home', [
            'heroSliders' => HeroSliderResource::collection(HeroSlider::with('movie')->orderBy('hierarchy')->get()),
            'movies' => MovieResource::collection($movies),
            'categories' => CategoryResource::collection(Category::isActive()->get()),
            'filters' => $request->all() // Include all query parameters
        ]);
    }

    public function movieDetails(Movie $movie)
    {
        if (!$movie->isActive()) {
            return redirect()->route('home');
        }

        return Inertia::render('movie-detail', [
            'movie' => new MovieResource(Movie::with([
                'categories',
                'episodes' => function ($query) {
                    $query->where('active', true);
                }
            ])->find($movie->id)),
        ]);
    }

    public function pricing()
    {
        return Inertia::render('pricing', [
            'pricingPlans' => PlanResource::collection(Plan::with('planType')->orderBy('hierarchy')->get())
        ]);
    }
}
