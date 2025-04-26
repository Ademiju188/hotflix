<?php

namespace Database\Seeders;

use App\Repositories\PlanTypeRepository;
use Carbon\Carbon;
use App\Models\PlanType;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PlanTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $planTypeRepository = new PlanTypeRepository();

        $planTypes = [
            [
                'name' => 'Weekly',
                'duration_days' => 7,
                'description' => 'Access all premium content for one week',
                'active' => true,
            ],
            [
                'name' => 'Monthly',
                'duration_days' => 30,
                'description' => 'Access all premium content for one month',
                'active' => true,
            ],
            [
                'name' => 'Quarterly',
                'duration_days' => 90,
                'description' => 'Access all premium content for three months',
                'active' => true,
            ],
            [
                'name' => 'Yearly',
                'duration_days' => 365,
                'description' => 'Access all premium content for one year',
                'active' => true,
            ],
            [
                'name' => 'Life Time',
                'duration_days' => null,
                'description' => 'Access all premium content for one year',
                'active' => true,
            ],
        ];

        foreach ($planTypes as $planType) {
            $planTypeRepository->create([
                'name'          => $planType['name'],
                'slug'          => Str::slug($planType['name']),
                'duration_days' => $planType['duration_days'],
                'description'   => $planType['description'],
                'active'        => $planType['active']
            ]);
        }

        // $this->command->info('Plan types have been seeded!');
    }
}
