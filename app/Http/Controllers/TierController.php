<?php

namespace App\Http\Controllers;

use App\Services\Tier\TierService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;

class TierController extends Controller
{
    protected $tierService;

    public function __construct(TierService $tierService)
    {
        $this->tierService = $tierService;
    }

    public function index()
    {
        $tiers = $this->tierService->getPaginatedTiers(10);
        return Inertia::render('Tier/Tier', [
            'tiers' => $tiers
        ]);
    }

    public function create() {
        return Inertia::render('Tier/Partials/CreateTier');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        try {
            $this->tierService->createTier($request->only('name'));

            return redirect()->route('tier.index')->with('success', 'Tier created successfully!');
        } catch (Exception $e) {
            return back()->withErrors(['name' => $e->getMessage()])->with('error', $e->getMessage());
        }
    }
}
