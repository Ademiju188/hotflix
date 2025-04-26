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
        Schema::create('episodes', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('movie_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->integer('episode_number');
            $table->text('description')->nullable();
            $table->string('video_path');
            $table->string('thumbnail_path')->nullable();
            $table->integer('duration')->nullable(); // in seconds
            $table->boolean('is_premium')->default(false); // Whether this episode requires payment
            $table->boolean('active')->default(true);
            $table->string('encryption_key')->nullable(); // For end-to-end encryption
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('episodes');
    }
};
