<?php

namespace App\Services\Course;

use App\Interfaces\Course\CourseRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CourseService
{
    protected $courseRepository;
    /**
     * Create a new class instance.
     */
    public function __construct(CourseRepositoryInterface $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

    public function getPaginatedCourses(int $perPage = 10)
    {
        return $this->courseRepository->getPaginatedCourses($perPage);
    }

    public function updateCourseStatus(string $courseId, bool $isPublished)
    {
        DB::beginTransaction();

        try {
            $course = $this->courseRepository->updateStatus($courseId, $isPublished);
            DB::commit();
            return $course;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function createCourse(array $data, array $images = [])
    {
        DB::beginTransaction();

        try {
            // Create the course
            $course = $this->courseRepository->create($data);

            // Handle image uploads
            foreach ($images as $image) {
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('do');

                // Upload to DO Spaces
                $path = $disk->putFile('course-images', $image, 'public');
                
                // Get the full URL
                $url = $disk->url($path);

                // Store image record
                $this->courseRepository->storeCourseImage($course->id, [
                    'image_url' => $url
                ]);
            }

            DB::commit();
            return $course;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function storeCourseImage(string $courseId, array $data)
    {
        DB::beginTransaction();

        try {
            $this->courseRepository->storeCourseImage($courseId, $data);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function createSubCourses(string $courseId, array $subcourses)
    {
        DB::beginTransaction();

        try {
            foreach ($subcourses as $subcourseData) {
                $subCourse = $this->courseRepository->createSubCourse($courseId, [
                    'title' => $subcourseData['title'],
                    'description' => $subcourseData['description']
                ]);

                if (!empty($subcourseData['videos']) && is_array($subcourseData['videos'])) {
                    foreach ($subcourseData['videos'] as $video) {
                        if (!empty($video['title']) && !empty($video['video_url'])) {
                            $subCourse->subCourseVideos()->create([
                                'title' => $video['title'],
                                'video_url' => $video['video_url']
                            ]);
                        }
                    }
                }
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function createCourseWithModules(array $courseData, array $images = [], array $subcourses = [], array $mentors = [])
    {
        DB::beginTransaction();

        try {
            // 1. Create Course
            $course = $this->courseRepository->create($courseData);

            // 2. Assign Mentors
            // Always assign current user (creator) as mentor
            $this->courseRepository->assignMentor($course->id, auth()->id());
            
            // Assign selected additional mentors
            if (!empty($mentors)) {
                foreach ($mentors as $mentorId) {
                    $this->courseRepository->assignMentor($course->id, $mentorId);
                }
            }

            // 3. Upload Images
            foreach ($images as $image) {
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('do');

                $path = $disk->putFile('course-images', $image, 'public');
                $url = $disk->url($path);

                $this->courseRepository->storeCourseImage($course->id, [
                    'image_url' => $url
                ]);
            }

            // 3. Create Subcourses & Videos
            foreach ($subcourses as $subcourseData) {
                $subCourse = $this->courseRepository->createSubCourse($course->id, [
                    'title' => $subcourseData['title'],
                    'description' => $subcourseData['description']
                ]);

                if (!empty($subcourseData['videos']) && is_array($subcourseData['videos'])) {
                    foreach ($subcourseData['videos'] as $video) {
                        if (!empty($video['title']) && !empty($video['video_url'])) {
                            // Assuming we can use the repository to create video directly 
                            // or access the relationship via model.
                            // For simplicity, let's use the relation on the model instance returned
                            $subCourse->subCourseVideos()->create([
                                'title' => $video['title'],
                                'video_url' => $video['video_url']
                            ]);
                        }
                    }
                }
            }

            DB::commit();
            return $course;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
