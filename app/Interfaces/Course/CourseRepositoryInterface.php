<?php

namespace App\Interfaces\Course;

interface CourseRepositoryInterface
{
    public function create(array $data);
    public function storeCourseImage(string $courseId, array $data);
    public function createSubCourse(string $courseId, array $data);
    public function getMentors();
    public function assignMentor(string $courseId, string $userId);
    public function getPaginatedCourses(int $perPage = 10);
    public function updateStatus(string $courseId, bool $isPublished);
    public function update(string $id, array $data);
    public function delete(string $id);
    public function findById(string $id);
    public function deleteCourseImage(string $imageId);
}
