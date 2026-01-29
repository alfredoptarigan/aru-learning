<?php

namespace App\Http\Controllers;

use App\Models\CodingTool;
use App\Services\CodingTool\CodingToolService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CodingToolController extends Controller
{
    protected $codingToolService;

    public function __construct(CodingToolService $codingToolService)
    {
        $this->codingToolService = $codingToolService;
    }

    public function index() {
        $codingTools = $this->codingToolService->getAll(10);
        return Inertia::render("CodingTool/CodingTool", [
            'codingTools' => $codingTools
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // Max 2MB
        ]);

        $data = $request->only(['name', 'description']);
        $image = $request->file('image');

        $this->codingToolService->create($data, $image);

        return redirect()->route('coding-tool.index')->with('success', 'Coding Tool created successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['name', 'description']);
        $image = $request->file('image');

        $this->codingToolService->update($id, $data, $image);

        return redirect()->back()->with('success', 'Coding Tool updated successfully.');
    }

    public function destroy($id)
    {
        $this->codingToolService->delete($id);
        return redirect()->back()->with('success', 'Coding Tool deleted successfully.');
    }
}
