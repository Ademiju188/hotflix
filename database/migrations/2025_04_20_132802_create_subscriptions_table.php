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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('trx_ref', 510);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('payment_id')->constrained();
            $table->foreignId('plan_id')->constrained();
            $table->string('stripe_subscription_id')->nullable();
            $table->string('payment_method')->default('stripe');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_lifetime')->default(false);
            $table->enum('status', ['active', 'cancelled', 'expired']);
            $table->boolean('auto_renew')->default(false);
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
