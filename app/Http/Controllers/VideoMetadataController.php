<?php

namespace App\Http\Controllers;

use App\Services\YouTubeService;
use Illuminate\Http\Request;

class VideoMetadataController extends Controller
{
    protected $youTubeService;

    public function __construct(YouTubeService $youTubeService)
    {
        $this->youTubeService = $youTubeService;
    }

    public function fetch(Request $request)
    {
        $request->validate([
            'url' => 'required|url'
        ]);

        $details = $this->youTubeService->getVideoDetails($request->url);

        if (!$details) {
            return response()->json([
                'error' => 'Could not fetch video details. Please check the URL or try manually.'
            ], 422);
        }

        return response()->json($details);
    }
}
