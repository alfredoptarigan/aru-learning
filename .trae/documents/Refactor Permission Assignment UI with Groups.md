I will redesign the Role Create/Edit permission assignment UI to group permissions by their "Group" (e.g., "Course", "User", "Role") in collapsible cards (Accordion style) or a clean Grid layout, improving UX and organization.

### Plan Overview
1.  **Database Update (Optional but Recommended)**:
    -   To robustly support "Groups", it's best to add a `group` column to the `permissions` table. This is cleaner than parsing strings like `course.create`.
    -   *Action*: Create a migration to add `group` string column to `permissions`.
    -   *Action*: Update `Permission` model and `PermissionService` to handle the new field.

2.  **Frontend Redesign (Pixel Art Style)**:
    -   **Grouped UI**: Instead of a flat list, I will create a `PermissionGroup` component.
    -   **Layout**:
        -   Display a Grid of "Cards" (Pixel Art style: thick borders, shadows).
        -   Each Card represents a Group (e.g., "Course Management").
        -   Inside the Card: A "Select All" checkbox for the group, followed by individual checkboxes for permissions.
    -   **Files to Update**:
        -   `CreateRole.tsx` & `EditRole.tsx`: Refactor to process permissions into groups and render the new UI.
        -   `CreatePermission.tsx`: Add a "Group" input field (e.g., select or text) so new permissions are properly categorized.

### Execution Steps
1.  **Backend**:
    -   Create migration: `add_group_to_permissions_table`.
    -   Update `Permission` model (`fillable`).
    -   Update `PermissionService` (create logic).
    -   Update `PermissionController` (validation).
2.  **Frontend**:
    -   Update `CreatePermission.tsx` form to include "Group Name".
    -   Refactor `CreateRole.tsx` and `EditRole.tsx`:
        -   Helper function to group permissions: `groupPermissions(permissions)`.
        -   Render groups in Pixel Art Cards.
        -   Implement "Select All in Group" logic.

This approach ensures scalability (easy to add new groups) and a much better UX than a massive list of checkboxes.