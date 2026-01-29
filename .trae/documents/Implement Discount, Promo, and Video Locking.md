# Implement Discount, Promo Code, and Video Locking Features

I will implement the requested changes to support course discounts, promo codes, and video locking.

## 1. Database Schema Changes (Migrations)

*   **Create `promos` table:**
    *   `id` (uuid)
    *   `code` (string, unique)
    *   `type` (enum: 'fixed', 'percentage')
    *   `value` (decimal/float)
    *   `max_uses` (integer, nullable)
    *   `used_count` (integer, default 0)
    *   `start_date` (timestamp, nullable)
    *   `end_date` (timestamp, nullable)
    *   `is_active` (boolean, default true)
    *   `course_id` (uuid, nullable) - If null, applies globally (optional feature), if set, applies to specific course. For now, we'll assume it can be linked to a course.
*   **Update `courses` table:**
    *   Add `discount_price` (float, nullable) - The discounted price.
*   **Update `subcourse_videos` table:**
    *   Add `is_locked` (boolean, default true).

## 2. Backend Implementation (Laravel)

### Models
*   **`Course`**: Add `discount_price` to fillable. Define relationship `promos()` (hasMany).
*   **`SubCourseVideo`**: Add `is_locked` to fillable.
*   **`Promo`**: Create new model with fillable fields and `course()` relationship.

### Services & Repositories
*   **`CourseService` / `CourseRepository`**:
    *   Update `create` and `update` methods to handle `discount_price`.
    *   Update `createSubCourses` and `updateCourseModules` to handle `is_locked`.
    *   Add methods to manage Promos (create, update, delete).

### Controllers
*   **`CourseController`**:
    *   Update `store` and `update` validation rules for `discount_price`.
    *   Update `storeSubCourses` and `updateModules` to accept `is_locked`.
    *   Add methods for Promo management (`storePromo`, `destroyPromo`).

### Routes
*   Add routes for Promo management (likely nested under courses or standalone).

## 3. Frontend Implementation (React/Inertia)

### `Step1CourseDetails.tsx` & `Edit.tsx`
*   Add **Discount Price** input field below the Price field.
*   Add a **Promos** section (or a new tab/modal) to manage promo codes for the course.
    *   List existing promos.
    *   Form to add a new promo (Code, Type, Value, etc.).

### `Step2SubCourses.tsx` & `ManageModules.tsx`
*   In the Video list/add section, add a **"Locked" switch/toggle** (default true).
    *   If toggled off (False), it means "Free Preview".

## 4. Execution Steps
1.  Create migrations.
2.  Update Models.
3.  Update Repository and Service logic.
4.  Update Controller and Routes.
5.  Update Frontend components (`Step1`, `Step2`).
6.  Verify implementation.
