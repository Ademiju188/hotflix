<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\CategoryRepository;

class CategoryService
{
    protected static ?CategoryRepository $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        self::$categoryRepository = $categoryRepository;
    }

    public static function storeCategory(array $data): Category
    {
        $category = self::$categoryRepository->create($data);

        return $category;
    }

    public static function updateCategory(Category $category, array $data): Category
    {
        $category = self::$categoryRepository->update($category->id, $data);

        return $category;
    }

    public static function deleteCategory(Category $category): bool
    {
        if ( ! $category->movies()->count() ) {
            return self::$categoryRepository->delete($category->id);
        }
        return false;
    }
}
