<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Country::truncate();

        $countriesJson = file_get_contents(__DIR__ . '/countries.json');
        $countries = json_decode($countriesJson, true);

        // Process in chunks of 100 records
        collect($countries)->chunk(100)->each(function ($countryChunk) {
            $countryData = $countryChunk->map(function ($country) {
                return [
                    'name' => $country['name'],
                    'code' => $country['iso2'],
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            })->toArray();

            Country::insert($countryData);
        });
    }
}
