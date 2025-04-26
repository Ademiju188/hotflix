<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('content_type', ['single', 'series']); // Indicates if movie is standalone or has series
            $table->text('description')->nullable();
            $table->string('poster_path')->nullable();
            $table->string('banner_path')->nullable();
            $table->string('video_path')->nullable(); // Only used for single movies
            $table->integer('duration')->nullable(); // Only used for single movies
            $table->boolean('is_premium')->default(false); // Whether this movie requires payment
            $table->boolean('featured')->default(false);
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};
