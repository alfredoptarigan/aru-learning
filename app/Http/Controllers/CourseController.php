<?php

namespace App\Http\Controllers;

use App\Services\Course\CourseService;
use App\Interfaces\CodingTool\CodingToolRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    protected $courseService;
    protected $courseRepository;
    protected $codingToolRepository;

    public function __construct(
        CourseService $courseService, 
        \App\Interfaces\Course\CourseRepositoryInterface $courseRepository,
        CodingToolRepositoryInterface $codingToolRepository
    )
    {
        $this->courseService = $courseService;
        $this->courseRepository = $courseRepository;
        $this->codingToolRepository = $codingToolRepository;
    }

    public function index(Request $request) {
        $courses = $this->courseService->getPaginatedCourses($request->query('perPage', 10));
        return Inertia::render('Course/Course', compact('courses'));
    }

    public function create(Request $request) {
        $mentors = $this->courseRepository->getMentors();
        $codingTools = $this->codingToolRepository->getAll(100); // Get enough tools
        
        return Inertia::render('Course/Partials/CreateCourse', [
            'availableMentors' => $mentors,
            'availableCodingTools' => $codingTools
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'status' => 'required|in:draft,published',
            'images.*' => 'nullable|image|max:2048', // Validate each image
            
            // Subcourses & Videos
            'subcourses' => 'nullable|array',
            
            // Mentors
            'mentors' => 'nullable|array',
            'mentors.*' => 'exists:users,id',
            
            // Coding Tools
            'coding_tools' => 'nullable|array',
            'coding_tools.*' => 'exists:coding_tools,id',
            
            // Promos
            'promos' => 'nullable|array',
            'promos.*.code' => 'required_with:promos|string',
            'promos.*.type' => 'required_with:promos|in:fixed,percentage',
            'promos.*.value' => 'required_with:promos|numeric',
        ]);

        try {
            $images = $request->file('images') ?? [];
            $subcourses = $request->input('subcourses') ?? [];
            $mentors = $request->input('mentors') ?? [];
            $codingTools = $request->input('coding_tools') ?? [];
            $promos = $request->input('promos') ?? [];
            
            // Re-structure subcourses to include video files if any (future proofing)
            // For now videos are just URLs in the JSON structure
            
            $courseData = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'discount_price' => $validated['discount_price'],
                'is_published' => $validated['status'] === 'published',
                'is_premium' => $validated['price'] > 0,
            ];

            $course = $this->courseService->createCourseWithModules($courseData, $images, $subcourses, $mentors, $codingTools, $promos);
            
            return redirect()->route('course.index')->with('success', 'Course created successfully!');
        } catch (\Exception $e) {
            // Log error
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
        $course = $this->courseRepository->findById($id);
        $user = auth()->user();
        $hasPurchased = false;

        if ($user) {
            $hasPurchased = \App\Models\UserCourse::where('user_id', $user->id)
                ->where('course_id', $id)
                ->exists();
        }

        return Inertia::render('Course/Detail', [
            'course' => $course,
            'hasPurchased' => $hasPurchased
        ]);
    }

    public function edit($id) {
        $course = $this->courseRepository->findById($id);
        $mentors = $this->courseRepository->getMentors();
        $codingTools = $this->codingToolRepository->getAll(100);
        
        return Inertia::render('Course/Edit', [
            'course' => $course,
            'availableMentors' => $mentors,
            'availableCodingTools' => $codingTools
        ]);
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
            'status' => 'required|in:draft,published',
            'images.*' => 'nullable|image|max:2048',
            'deleted_images' => 'nullable|array',
            'mentors' => 'nullable|array',
            'coding_tools' => 'nullable|array',
            'promos' => 'nullable|array',
            'promos.*.code' => 'required_with:promos|string',
            'promos.*.type' => 'required_with:promos|in:fixed,percentage',
            'promos.*.value' => 'required_with:promos|numeric',
        ]);

        try {
            $images = $request->file('images') ?? [];
            $mentors = $request->input('mentors') ?? [];
            $codingTools = $request->input('coding_tools') ?? [];
            $deletedImages = $request->input('deleted_images') ?? [];
            $promos = $request->input('promos') ?? [];

            $courseData = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'discount_price' => $validated['discount_price'],
                'is_published' => $validated['status'] === 'published',
                'is_premium' => $validated['price'] > 0,
            ];

            $this->courseService->updateCourse($id, $courseData, $images, $mentors, $codingTools, $deletedImages, $promos);
            
            return redirect()->route('course.index')->with('success', 'Course updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update course: ' . $e->getMessage()]);
        }
    }

    public function editModules($id) {
        $course = $this->courseRepository->findById($id);
        return Inertia::render('Course/ManageModules', [
            'course' => $course
        ]);
    }

    public function updateModules(Request $request, $id) {
        $request->validate([
            'subcourses' => 'required|array',
            'subcourses.*.title' => 'required|string|max:255',
            'subcourses.*.description' => 'required|string',
            'subcourses.*.videos' => 'array',
            'subcourses.*.videos.*.title' => 'required_with:subcourses.*.videos.*.video_url|string|nullable',
            'subcourses.*.videos.*.video_url' => 'required_with:subcourses.*.videos.*.title|url|nullable',
            'subcourses.*.videos.*.is_locked' => 'boolean',
            'subcourses.*.videos.*.duration' => 'nullable|integer',
        ]);

        try {
            $this->courseService->updateCourseModules($id, $request->input('subcourses'));
            return redirect()->route('course.index')->with('success', 'Modules updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update modules: ' . $e->getMessage()]);
        }
    }

    public function destroy($id) {
        try {
            $this->courseService->deleteCourse($id);
            return redirect()->route('course.index')->with('success', 'Course deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
