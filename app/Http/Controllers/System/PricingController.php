<?php

namespace App\Http\Controllers\System;

use App\Models\Plan;
use Inertia\Inertia;
use App\Models\PlanType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\PlanResource;
use App\Http\Resources\PlanTypeResource;

class PricingController extends Controller
{
    public function index()
    {
        $pricingPlans = Plan::with(['planType'])->orderBy('hierarchy')->get();
        $usedPlanTypeIds = $pricingPlans->pluck('plan_type_id')->unique()->filter();

        $planTypes = $usedPlanTypeIds->isNotEmpty()
            ? PlanType::whereNotIn('id', $usedPlanTypeIds)->get()
            : PlanType::all();

        return Inertia::render('admin/pricing/pricing-index', [
            'pricingPlans' => PlanResource::collection($pricingPlans),
            'planTypes'    => PlanTypeResource::collection($planTypes),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'plan'    => ['required', 'integer', 'exists:plan_types,id'],
            'price'       => ['required', 'numeric'],
            'description' => ['nullable', 'string'],
            'active' => ['boolean'],
        ]);

        $planType = PlanType::find($validatedData['plan']);

        $lastHierarchy = Plan::max('hierarchy') ?? 0;

        Plan::create([
            'plan_type_id' => $planType->id,
            'price' => $validatedData['price'],
            'name'         => $planType->name,
            'description'  => $validatedData['description'] ?? null,
            'hierarchy'    => $lastHierarchy + 1,
        ]);

        session()->flash('success', 'Pricing Plan Added Successfully');
        return redirect()->route('system.pricing.index');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'plans' => 'required|array',
            'plans.*.id' => 'required|exists:plans,id',
            'plans.*.hierarchy' => 'required|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($request) {
                foreach ($request->plans as $plan) {
                    Plan::where('id', $plan['id'])
                        ->update(['hierarchy' => $plan['hierarchy']]);
                }
            });

            return redirect()->back()->with('success', 'Pricing Plan updated successfully');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Failed to update Pricing Plan');
        }
    }

    public function update(Plan $plan, Request $request)
    {
        $validatedData = $request->validate([
            'price'       => ['required', 'numeric'],
            'description' => ['nullable', 'string'],
            'active' => ['boolean'],
        ]);

        $plan->update($validatedData);

        return redirect()->back()->with('success', 'Pricing Plan deleted successfully');
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();
        return redirect()->back()->with('success', 'Pricing Plan deleted successfully');
    }
}
