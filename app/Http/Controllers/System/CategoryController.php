<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Repositories\CategoryRepository;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    protected ?CategoryService $categoryService;
    protected ?CategoryRepository $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository, CategoryService $categoryService)
    {
        $this->categoryRepository = $categoryRepository;
        $this->categoryService = $categoryService;
    }

    public function index(Request $request)
    {
        return Inertia::render('admin/category/category-index', [
            'categories'  => CategoryResource::collection($this->categoryRepository->all($request)),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/category/category-create');
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();

        $category = $this->categoryService->storeCategory($data);

        session()->flash('success', 'Category Added Successfully');

        return redirect()->route('system.category.index');
    }

    public function update(Category $category, UpdateCategoryRequest $request)
    {
        $data = $request->validated();

        $category = $this->categoryService->updateCategory($category, $data);

        session()->flash('success', 'Category Updated Successfully');

        return redirect()->route('system.category.index');
    }

    public function destroy(Category $category)
    {
        $service = $this->categoryService->deleteCategory($category);

        if ($service) {
            session()->flash('success', 'Category Deleted Successfully');
            return redirect()->back();
        }

        session()->flash('error', "Unable to delete Category! {$category->movies()->count()} has been assigned to the category");
        return redirect()->back();
    }
}
