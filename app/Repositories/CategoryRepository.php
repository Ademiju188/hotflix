<?php

namespace App\Repositories;

use App\Models\Category;
use App\Traits\HandleRepositoryMethods;
use Illuminate\Http\Request;

class CategoryRepository
{
    use HandleRepositoryMethods;

    public function __construct()
    {
        $this->model = Category::class;
    }

    public function all(Request $request)
    {
        $categories = Category::query()
        ->when($request->search, function($query) use ($request) {
            return $query->where('name', 'like', '%'.$request->search.'%')
                       ->orWhere('description', 'like', '%'.$request->search.'%');
        })
        ->latest()
        ->paginate(50);

        return $categories;
    }

    public function activeCategories()
    {
        return Category::isActive()->orderBy('name')->get();
    }
}
