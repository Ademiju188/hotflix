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
        Schema::create('video_encryption_keys', function (Blueprint $table) {
            $table->id();
            $table->morphs('videoable');
            $table->string('key');
            $table->string('iv')->nullable();
            $table->string('algorithm')->default('AES-256-CBC');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_encryption_keys');
    }
};
