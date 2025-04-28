<?php

namespace App\Http\Controllers\System;

use Inertia\Inertia;
use App\Models\Movie;
use App\Models\HeroSlider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\MovieResource;
use App\Http\Resources\HeroSliderResource;

class HeroSliderSettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/settings/hero', [
            'heroSliders'   =>  HeroSliderResource::collection(HeroSlider::with('movie')->orderBy('hierarchy')->get()),
            'movies'        =>  MovieResource::collection(Movie::isActive()->latest()->get()),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'series'        => 'required|array',
            'series.*'   => 'required|exists:movies,id',
            // 'hierarchy'     => 'required|integer|unique:hero_sliders,hierarchy',
        ]);

        $lastHierarchy = HeroSlider::max('hierarchy') ?? 0;

        foreach ($validatedData['series'] as $index => $movieId) {
            HeroSlider::firstOrCreate(
                ['movie_id' => $movieId],
                ['hierarchy' => $lastHierarchy + $index + 1]
            );
        }

        return back()->with('success','Series Added to Hero Sliders Successfully');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'sliders' => 'required|array',
            'sliders.*.id' => 'required|exists:hero_sliders,id',
            'sliders.*.hierarchy' => 'required|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($request) {
                foreach ($request->sliders as $slider) {
                    HeroSlider::where('id', $slider['id'])
                        ->update(['hierarchy' => $slider['hierarchy']]);
                }
            });

            return redirect()->back()->with('success', 'Slider order updated successfully');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Failed to update slider order');
        }
    }

    public function destroy(HeroSlider $slider)
    {
        $slider->delete();
        return redirect()->back()->with('success', 'Slider deleted successfully');
    }
}
