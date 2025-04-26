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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 20, 2);
            $table->string('currency')->default('USD');
            $table->string('payment_method');
            $table->string('transaction_id')->nullable();
            $table->enum('status', ['completed', 'failed', 'refunded']);
            $table->timestamp('payment_date');
            $table->text('notes')->nullable();
            $table->json('api_response')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
