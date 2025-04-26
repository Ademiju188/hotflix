<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Role::create([
            'name' => RolesEnum::SuperAdmin->value,
            'slug' => Str::slug(RolesEnum::SuperAdmin->value)
        ]);

        Role::create([
            'name' => RolesEnum::Admin->value,
            'slug' => Str::slug(RolesEnum::Admin->value)
        ]);

        Role::create([
            'name' => RolesEnum::Viewer->value,
            'slug' => Str::slug(RolesEnum::Viewer->value)
        ]);
    }
}
