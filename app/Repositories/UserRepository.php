<?php

namespace App\Repositories;

use App\Models\User;
use App\Traits\HandleRepositoryMethods;

class UserRepository
{
    use HandleRepositoryMethods;

    public function __construct()
    {
        $this->model = User::class;
    }
}