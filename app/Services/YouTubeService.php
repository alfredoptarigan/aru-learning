<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use DateInterval;

class YouTubeService
{
    protected $apiKey;
    protected $baseUrl = 'https://www.googleapis.com/youtube/v3';

    public function __construct()
    {
        $this->apiKey = config('services.youtube.api_key');
    }

    /**
     * Extract video ID from YouTube URL
     */
    public function extractVideoId(string $url): ?string
    {
        $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i';
        if (preg_match($pattern, $url, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * Get video details (title, duration) from YouTube API
     */
    public function getVideoDetails(string $url)
    {
        $videoId = $this->extractVideoId($url);
        
        if (!$videoId) {
            return null;
        }

        // If no API key is configured, return mock data or basic info
        if (empty($this->apiKey)) {
            return [
                'title' => 'YouTube Video (API Key Missing)',
                'duration' => 0,
                'duration_formatted' => '00:00'
            ];
        }

        try {
            $response = Http::get("{$this->baseUrl}/videos", [
                'part' => 'snippet,contentDetails',
                'id' => $videoId,
                'key' => $this->apiKey
            ]);

            if ($response->successful()) {
                $items = $response->json()['items'];
                if (!empty($items)) {
                    $item = $items[0];
                    $durationIso = $item['contentDetails']['duration'];
                    $durationSeconds = $this->convertIsoDurationToSeconds($durationIso);

                    return [
                        'title' => $item['snippet']['title'],
                        'duration' => $durationSeconds,
                        'duration_formatted' => gmdate("H:i:s", $durationSeconds)
                    ];
                }
            }
        } catch (\Exception $e) {
            // Fallback or log error
            \Log::error('YouTube API Error: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Convert ISO 8601 duration to seconds
     */
    public function convertIsoDurationToSeconds(string $isoDuration): int
    {
        try {
            $interval = new DateInterval($isoDuration);
            return ($interval->d * 24 * 60 * 60) +
                   ($interval->h * 60 * 60) +
                   ($interval->i * 60) +
                   $interval->s;
        } catch (\Exception $e) {
            return 0;
        }
    }
}
