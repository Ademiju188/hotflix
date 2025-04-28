<?php

namespace App\Http\Controllers;

use App\Http\Resources\MovieResource;
use Inertia\Inertia;
use App\Models\Movie;
use App\Models\HeroSlider;
use Illuminate\Http\Request;
use App\Http\Resources\HeroSliderResource;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('home', [
            'heroSliders'   =>  HeroSliderResource::collection(HeroSlider::with('movie')->orderBy('hierarchy')->get()),
        ]);
    }

    public function movieDetails(Movie $movie)
    {
        if (!$movie->isActive()) {
            return redirect()->route('home');
        }

        return Inertia::render('movie-detail', [
            'movie' =>  new MovieResource(Movie::with([
                'categories',
                'episodes' => function ($query) {
                    $query->where('active', true);
                }
            ])->find($movie->id)),
        ]);
    }
}
