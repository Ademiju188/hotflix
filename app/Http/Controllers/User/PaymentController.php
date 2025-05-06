<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('user/payments', [
            'payments'  =>  PaymentResource::collection(Payment::with(['subscription', 'plan'])->where('user_id', auth()->id())->latest()->paginate(50))
        ]);
    }
}
