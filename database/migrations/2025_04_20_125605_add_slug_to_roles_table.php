<?php

use Database\Seeders\RoleSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->string('slug')->after('name')->unique();
        });

        (new RoleSeeder)->run();
        // (new UserSeeder)->run();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
