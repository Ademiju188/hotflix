<?php

namespace App\Repositories;

use App\Models\PlanType;
use App\Traits\HandleRepositoryMethods;

class PlanTypeRepository
{
    use HandleRepositoryMethods;

    public function __construct()
    {
        $this->model = PlanType::class;
    }

    // public function all()
    // {
    //     return User::isTeam()->latest()->get();
    // }
}
