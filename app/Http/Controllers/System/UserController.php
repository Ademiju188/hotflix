<?php

namespace App\Http\Controllers\System;

use App\Enums\RolesEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $userQuery = User::query()
            ->when($request->search, function ($query) use ($request) {
                return $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('username', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            })
            ->whereHas('role', function ($query) {
                $query->where('name', RolesEnum::Viewer->value);
            })->latest()->paginate(50);

        return Inertia::render('admin/user/user-index', [
            'users' => UserResource::collection($userQuery)
        ]);
    }

    public function show(User $user)
    {
        return Inertia::render('admin/user/user-show', [
            'user'  =>  User::with(['payments', 'payments.plan', 'subscriptions', 'subscriptions.payment', 'subscriptions.plan'])->find($user->id)
        ]);
    }
}
