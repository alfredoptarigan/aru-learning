<?php

namespace App\Http\Controllers;

use App\Services\Course\CourseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    protected $courseService;
    protected $courseRepository;

    public function __construct(CourseService $courseService, \App\Interfaces\Course\CourseRepositoryInterface $courseRepository)
    {
        $this->courseService = $courseService;
        $this->courseRepository = $courseRepository;
    }

    public function index(Request $request) {
        $courses = $this->courseService->getPaginatedCourses($request->query('perPage', 10));
        return Inertia::render('Course/Course', compact('courses'));
    }

    public function create(Request $request) {
        $mentors = $this->courseRepository->getMentors();
        return Inertia::render('Course/Partials/CreateCourse', [
            'availableMentors' => $mentors
        ]);
    }

    public function validateStep1(Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:draft,published',
            // 'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048', 
            // We skip image validation here as files are not sent in JSON validation check easily
            // or we can validate them if sent as FormData
        ]);

        return response()->json(['message' => 'Valid']);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:draft,published',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            
            // Subcourses validation
            'subcourses' => [
                'nullable',
                'array',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->status === 'published' && empty($value)) {
                        $fail('Cannot publish a course without modules. Please switch to Draft status or add at least one module.');
                    }
                },
            ],
            'subcourses.*.title' => 'required_with:subcourses|string|max:255',
            'subcourses.*.description' => 'required_with:subcourses|string',
            'subcourses.*.videos' => 'array',
            'subcourses.*.videos.*.title' => 'required_with:subcourses.*.videos.*.video_url|string|nullable',
            'subcourses.*.videos.*.video_url' => 'required_with:subcourses.*.videos.*.title|url|nullable',
            
            // Mentors
            'mentors' => 'nullable|array',
            'mentors.*' => 'exists:users,id'
        ]);

        try {
            $images = $request->file('images') ?? [];
            $subcourses = $request->input('subcourses') ?? [];
            $mentors = $request->input('mentors') ?? [];
            
            // Re-structure subcourses to include video files if any (future proofing)
            // For now videos are just URLs in the JSON structure
            
            $courseData = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'is_published' => $validated['status'] === 'published',
                'is_premium' => $validated['price'] > 0,
            ];

            $course = $this->courseService->createCourseWithModules($courseData, $images, $subcourses, $mentors);
            
            return redirect()->route('course.index')->with('success', 'Course created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create course: ' . $e->getMessage()]);
        }
    }

    public function storeSubCourses(Request $request) {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'subcourses' => 'required|array|min:1',
            'subcourses.*.title' => 'required|string|max:255',
            'subcourses.*.description' => 'required|string',
            'subcourses.*.videos' => 'array',
            'subcourses.*.videos.*.title' => 'required_with:subcourses.*.videos.*.video_url|string|nullable',
            'subcourses.*.videos.*.video_url' => 'required_with:subcourses.*.videos.*.title|url|nullable',
        ]);

        try {
            $this->courseService->createSubCourses($request->course_id, $request->subcourses);

            return back()->with('success', 'Subcourses added successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to add subcourses: ' . $e->getMessage()]);
        }
    }

    public function updateStatus(Request $request, $id) {
        $request->validate([
            'is_published' => 'required|boolean'
        ]);

        try {
            // Check if course has modules before publishing
            if ($request->is_published) {
                $course = \App\Models\Course::withCount('subCourses')->findOrFail($id);
                if ($course->sub_courses_count === 0) {
                    return back()->withErrors(['error' => 'Cannot publish a course without modules.']);
                }
            }

            $this->courseService->updateCourseStatus($id, $request->is_published);
            return back()->with('success', 'Course status updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update status: ' . $e->getMessage()]);
        }
    }

    public function show($id) {
        $course = \App\Models\Course::with([
            'courseImages',
            'courseMentors.user',
            'subCourses.subCourseVideos'
        ])->findOrFail($id);

        return Inertia::render('Course/Detail', [
            'course' => $course
        ]);
    }
}
