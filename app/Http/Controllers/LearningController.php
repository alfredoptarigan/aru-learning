<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\SubCourseVideo;
use App\Models\UserVideoProgress;
use App\Models\UserStat;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class LearningController extends Controller
{
    public function show($courseId, $videoId = null)
    {
        $user = Auth::user();

        // Check if user has access (purchased)
        $hasAccess = \App\Models\UserCourse::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->exists();

        if (!$hasAccess) {
            return redirect()->route('course.show', $courseId)->with('error', 'You must purchase this course first.');
        }

        $course = Course::with(['subCourses.subCourseVideos' => function($query) {
            $query->orderBy('created_at', 'asc'); // Ensure consistent order
        }])->findOrFail($courseId);

        // Flatten all videos to find current and next/prev
        $allVideos = $course->subCourses->flatMap(function ($sub) {
            return $sub->subCourseVideos;
        });

        // If no video ID provided, start with the first one or last watched
        if (!$videoId) {
            // TODO: Implement "Resume" logic later
            $currentVideo = $allVideos->first();
        } else {
            $currentVideo = $allVideos->firstWhere('id', $videoId);
        }

        if (!$currentVideo) {
            return redirect()->route('course.show', $courseId); // Or error page
        }

        // Get user progress for this course
        $progress = UserVideoProgress::where('user_id', $user->id)
            ->whereIn('sub_course_video_id', $allVideos->pluck('id'))
            ->get()
            ->keyBy('sub_course_video_id');

        // Get User Stats (Gamification)
        $userStats = UserStat::firstOrCreate(
            ['user_id' => $user->id],
            ['total_exp' => 0, 'level' => 1]
        );

        // Find Next and Prev Videos
        $currentIndex = $allVideos->search(function ($item) use ($currentVideo) {
            return $item->id === $currentVideo->id;
        });

        $nextVideo = $currentIndex !== false && $currentIndex < $allVideos->count() - 1 
            ? $allVideos[$currentIndex + 1] 
            : null;

        $prevVideo = $currentIndex !== false && $currentIndex > 0 
            ? $allVideos[$currentIndex - 1] 
            : null;

        return Inertia::render('Learning/Player', [
            'course' => $course,
            'currentVideo' => $currentVideo,
            'nextVideo' => $nextVideo,
            'prevVideo' => $prevVideo,
            'progress' => $progress,
            'userStats' => $userStats
        ]);
    }

    public function markComplete(Request $request)
    {
        $request->validate([
            'video_id' => 'required|exists:subcourse_videos,id'
        ]);

        $user = Auth::user();
        $videoId = $request->video_id;

        // Check if already completed
        $existing = UserVideoProgress::where('user_id', $user->id)
            ->where('sub_course_video_id', $videoId)
            ->first();

        $expGained = 0;
        $leveledUp = false;

        if (!$existing || !$existing->is_completed) {
            // Mark as complete
            UserVideoProgress::updateOrCreate(
                ['user_id' => $user->id, 'sub_course_video_id' => $videoId],
                ['is_completed' => true, 'completed_at' => now()]
            );

            // Add EXP Logic
            $expGained = 100; // Base EXP per video
            $stats = UserStat::firstOrCreate(['user_id' => $user->id]);
            
            $stats->total_exp += $expGained;
            
            // Simple Level Up Logic (Every 1000 EXP = 1 Level)
            $newLevel = floor($stats->total_exp / 1000) + 1;
            if ($newLevel > $stats->level) {
                $stats->level = $newLevel;
                $leveledUp = true;
            }
            
            $stats->save();
        }

        return response()->json([
            'success' => true,
            'exp_gained' => $expGained,
            'leveled_up' => $leveledUp,
            'current_level' => $user->stats->level ?? 1,
            'total_exp' => $user->stats->total_exp ?? 0
        ]);
    }
}
