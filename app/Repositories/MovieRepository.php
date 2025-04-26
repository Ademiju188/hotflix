<?php

namespace App\Repositories;

use App\Models\Movie;
use Illuminate\Http\Request;
use App\Traits\HandleRepositoryMethods;

class MovieRepository
{
    use HandleRepositoryMethods;

    public function __construct()
    {
        $this->model = Movie::class;
    }

    public function all(Request $request)
    {
        $movies = Movie::query()
        ->with(['categories', 'episodes'])
        ->when($request->search, function($query) use ($request) {
            return $query->where('title', 'like', '%'.$request->search.'%')
                       ->orWhere('slug', 'like', '%'.$request->search.'%');
        })
        ->latest()
        ->paginate(50);

        return $movies;
    }
}
