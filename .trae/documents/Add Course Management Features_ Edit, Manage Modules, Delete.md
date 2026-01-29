# Implement Edit Details, Manage Modules, and Delete Course

I will implement the requested features by extending the existing Course management system.

## 1. Backend Implementation (Laravel)

### Repository (`CourseRepository.php` & Interface)
- Implement `findById($id)`: Retrieve a course with all necessary relationships (`courseImages`, `subCourses`, `courseMentors`, `courseTools`).
- Implement `update($id, $data)`: Update basic course information.
- Implement `delete($id)`: Delete a course.
- Implement `deleteCourseImage($id)`: Remove a specific course image.

### Service (`CourseService.php`)
- **`updateCourse($id, $data, $images, $mentors, $codingTools, $deletedImages)`**:
  - Update course details.
  - Handle new image uploads.
  - Delete removed images (from storage and DB).
  - Sync mentors and coding tools.
- **`updateCourseModules($id, $subcourses)`**:
  - Sync subcourses and videos.
  - Create new modules/videos if they don't exist.
  - Update existing ones.
  - Delete modules that are removed from the list.
- **`deleteCourse($id)`**:
  - Check if the course has subcourses.
  - If yes, prevent deletion (as per requirement).
  - If no, proceed with deletion.

### Controller (`CourseController.php`)
- **`edit($id)`**: Render the `Course/Edit` page with course data.
- **`update($id, Request $request)`**: Handle the "Edit Details" form submission.
- **`editModules($id)`**: Render the `Course/ManageModules` page.
- **`updateModules($id, Request $request)`**: Handle the "Manage Modules" form submission.
- **`destroy($id)`**: Handle course deletion with the validation rule (must have no modules).

### Routes (`web.php`)
- Add routes for `edit`, `update`, `editModules`, `updateModules`, and `destroy`.

## 2. Frontend Implementation (React/Inertia)

### `Course.tsx` (Course Listing)
- Add an **Actions** column to the table.
- Implement a Dropdown Menu with:
  - **Edit Details**: Links to the Edit page.
  - **Manage Modules**: Links to the Modules page.
  - **Delete Course**: Shows a confirmation. Disables or alerts if the course has modules.

### `Step1CourseDetails.tsx` (Partial)
- Update to accept `existingImages` prop.
- Add UI to display existing images and allow deleting them (tracking IDs in `deleted_images` state).

### `Edit.tsx` (New Page)
- A dedicated page for "Edit Details".
- Reuses `Step1CourseDetails` populated with existing course data.
- Submits to the `update` route.

### `ManageModules.tsx` (New Page)
- A dedicated page for "Manage Modules".
- Reuses `Step2SubCourses` populated with existing modules.
- Submits to the `updateModules` route.

## 3. Verification
- Verify "Edit Details" updates all fields correctly, including images (add/remove).
- Verify "Manage Modules" correctly adds, updates, and removes modules/videos.
- Verify "Delete Course" works only when no modules exist, and fails gracefully otherwise.
