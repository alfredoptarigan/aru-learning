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

    public function createCourseWithModules(array $courseData, array $images = [], array $subcourses = [], array $mentors = [], array $codingTools = [], array $promos = [])
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
            
            // Assign Coding Tools
            if (!empty($codingTools)) {
                $course->courseTools()->sync($codingTools);
            }

            // Create Promos
            if (!empty($promos)) {
                foreach ($promos as $promo) {
                    $this->courseRepository->createPromo($course->id, $promo);
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

    public function updateCourse(string $id, array $data, array $images = [], array $mentors = [], array $codingTools = [], array $deletedImages = [], array $promos = [])
    {
        DB::beginTransaction();
        try {
            $course = $this->courseRepository->update($id, $data);

            // Handle deleted images
            foreach ($deletedImages as $imageId) {
                 $this->courseRepository->deleteCourseImage($imageId);
            }

            // Handle new images
            foreach ($images as $image) {
                $disk = Storage::disk('do');
                $path = $disk->putFile('course-images', $image, 'public');
                $url = $disk->url($path);
                $this->courseRepository->storeCourseImage($course->id, [
                    'image_url' => $url
                ]);
            }

            // Sync Coding Tools
            if (!empty($codingTools)) {
                $course->courseTools()->sync($codingTools);
            } else {
                $course->courseTools()->detach();
            }
            
            // Sync Mentors
            $course->courseMentors()->delete();
             foreach ($mentors as $mentorId) {
                $this->courseRepository->assignMentor($course->id, $mentorId);
            }
            
            // Sync Promos (Delete all and re-create for simplicity in update logic, 
            // or we could check IDs. For now, simple replace)
            $course->promos()->delete();
            if (!empty($promos)) {
                foreach ($promos as $promo) {
                    $this->courseRepository->createPromo($course->id, $promo);
                }
            }
            
            DB::commit();
            return $course;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateCourseModules(string $id, array $subcourses)
    {
        DB::beginTransaction();
        try {
            $course = $this->courseRepository->findById($id);
            
            $existingIds = $course->subCourses->pluck('id')->toArray();
            $newIds = [];

            foreach ($subcourses as $subcourseData) {
                if (isset($subcourseData['id'])) {
                    $newIds[] = $subcourseData['id'];
                    // Update
                    $subCourse = $course->subCourses()->find($subcourseData['id']);
                    if ($subCourse) {
                         $subCourse->update([
                            'title' => $subcourseData['title'],
                            'description' => $subcourseData['description']
                         ]);
                         
                         // Handle videos - delete all and re-create
                         $subCourse->subCourseVideos()->delete();
                         if (!empty($subcourseData['videos'])) {
                             foreach ($subcourseData['videos'] as $video) {
                                if (!empty($video['title']) && !empty($video['video_url'])) {
                                    $subCourse->subCourseVideos()->create([
                                        'title' => $video['title'],
                                        'video_url' => $video['video_url'],
                                        'is_locked' => $video['is_locked'] ?? true,
                                        'duration' => $video['duration'] ?? null
                                    ]);
                                }
                             }
                         }
                    }
                } else {
                    // Create New
                     $subCourse = $course->subCourses()->create([
                        'title' => $subcourseData['title'],
                        'description' => $subcourseData['description']
                    ]);
                    // Create Videos
                    if (!empty($subcourseData['videos'])) {
                         foreach ($subcourseData['videos'] as $video) {
                            if (!empty($video['title']) && !empty($video['video_url'])) {
                                $subCourse->subCourseVideos()->create([
                                    'title' => $video['title'],
                                    'video_url' => $video['video_url'],
                                    'is_locked' => $video['is_locked'] ?? true,
                                    'duration' => $video['duration'] ?? null
                                ]);
                            }
                         }
                    }
                }
            }
            
            // Delete removed subcourses
            $toDelete = array_diff($existingIds, $newIds);
            if (!empty($toDelete)) {
                $course->subCourses()->whereIn('id', $toDelete)->delete();
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteCourse(string $id)
    {
         $course = $this->courseRepository->findById($id);
         if ($course->subCourses()->count() > 0) {
             throw new Exception("Cannot delete course with existing modules. Please remove all modules first.");
         }
         
         return $this->courseRepository->delete($id);
    }
}
