<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriptionResource;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        return Inertia::render('user/subscriptions', [
            'subscriptions'   =>    SubscriptionResource::collection(Subscription::with('payment')->where('user_id', auth()->id())->latest()->paginate(50))
        ]);
    }

    public function cancel()
    {
        if (!user()->hasActiveSubscription()) {
            session()->flash('error', 'You do not have an active subscription');
            return redirect()->route('user.dashboard');
        }

        return Inertia::render('user/subscription-cancel', [
            'cancellationDate' => user()->subscription()->end_date->format('m/d/Y'),
        ]);
    }

    public function update()
    {
        if (!user()->hasActiveSubscription()) {
            session()->flash('error', 'You do not have an active subscription');
            return redirect()->route('user.dashboard');
        }

        user()->subscription()->update(['status' => 'cancelled']);
        session()->flash('error', 'Your subscription has been cancelled successfully');
        return redirect()->route('user.dashboard');
    }
}
