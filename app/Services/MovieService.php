<?php

namespace App\Services;

use App\Repositories\MovieRepository;

class MovieService
{
    protected static ?MovieRepository $movieRepository;

    public function __construct(MovieRepository $movieRepository)
    {
        self::$movieRepository = $movieRepository;
    }
}
