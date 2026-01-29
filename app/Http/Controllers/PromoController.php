<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Promo;
use App\Services\Promo\PromoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromoController extends Controller
{
    protected $promoService;

    public function __construct(PromoService $promoService)
    {
        $this->promoService = $promoService;
    }

    public function index()
    {
        $promos = $this->promoService->getAllPromos();
        return Inertia::render('Promo/Index', [
            'promos' => $promos
        ]);
    }

    public function create()
    {
        $courses = Course::select('id', 'title')->get();
        return Inertia::render('Promo/Create', [
            'courses' => $courses
        ]);
    }

    public function store(Request $request)
    {
        // Handle "global" value from frontend
        if ($request->course_id === 'global') {
            $request->merge(['course_id' => null]);
        }

        $validated = $request->validate([
            'code' => 'required|string|unique:promos,code',
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric',
            'max_uses' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'course_id' => 'nullable|exists:courses,id'
        ]);

        $this->promoService->createPromo($validated);

        return redirect()->route('promo.index')->with('success', 'Promo created successfully');
    }

    public function edit(string $id)
    {
        $promo = Promo::findOrFail($id);
        $courses = Course::select('id', 'title')->get();
        return Inertia::render('Promo/Edit', [
            'promo' => $promo,
            'courses' => $courses
        ]);
    }

    public function update(Request $request, string $id)
    {
        // Handle "global" value from frontend
        if ($request->course_id === 'global') {
            $request->merge(['course_id' => null]);
        }

        $validated = $request->validate([
            'code' => 'required|string|unique:promos,code,' . $id,
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric',
            'max_uses' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'course_id' => 'nullable|exists:courses,id'
        ]);

        $this->promoService->updatePromo($id, $validated);

        return redirect()->route('promo.index')->with('success', 'Promo updated successfully');
    }

    public function destroy(string $id)
    {
        $this->promoService->deletePromo($id);
        return redirect()->route('promo.index')->with('success', 'Promo deleted successfully');
    }
}
