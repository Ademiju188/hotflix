<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::where('name', RolesEnum::SuperAdmin->value)->first();

        User::create([
            'name'      => 'CEO',
            'username'  =>  'gm',
            'email'     =>  'gm@gmail.com',
            'role_id'   =>  $role->id,
            'password'  =>  bcrypt('password')
        ])->assignRole($role);
    }
}
