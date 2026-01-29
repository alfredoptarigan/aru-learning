<?php

namespace App\Repositories\Course;

use App\Models\Course;
use App\Models\User;

class CourseRepository implements \App\Interfaces\Course\CourseRepositoryInterface
{
    public function getMentors()
    {
        return User::whereHas('roles', function ($query) {
            $query->where('name', 'mentor');
        })->get(['id', 'name', 'email', 'profile_url']);
    }

    public function assignMentor(string $courseId, string $userId)
    {
        $course = Course::findOrFail($courseId);
        // Prevent duplicate assignment
        if (!$course->courseMentors()->where('mentor_id', $userId)->exists()) {
            $course->courseMentors()->create([
                'mentor_id' => $userId
            ]);
        }
    }

    public function getPaginatedCourses(int $perPage = 10)
    {
        return Course::with([
            'courseImages', 
            'courseMentors.user', 
            'subCourses.subCourseVideos'
        ])
        ->latest()
        ->paginate($perPage);
    }

    public function updateStatus(string $courseId, bool $isPublished)
    {
        $course = Course::findOrFail($courseId);
        $course->update(['is_published' => $isPublished]);
        return $course;
    }

    public function create(array $data)
    {
        return Course::create($data);
    }

    public function storeCourseImage(string $courseId, array $data)
    {
        $course = Course::findOrFail($courseId);
        $course->courseImages()->create($data);
    }

    public function createSubCourse(string $courseId, array $data)
    {
        $course = Course::findOrFail($courseId);
        $subCourse = $course->subCourses()->create([
            'title' => $data['title'],
            'description' => $data['description']
        ]);

        if (!empty($data['videos']) && is_array($data['videos'])) {
            foreach ($data['videos'] as $video) {
                if (!empty($video['title']) && !empty($video['video_url'])) {
                    $subCourse->subCourseVideos()->create([
                        'title' => $video['title'],
                        'video_url' => $video['video_url']
                    ]);
                }
            }
        }

        return $subCourse;
    }
}
