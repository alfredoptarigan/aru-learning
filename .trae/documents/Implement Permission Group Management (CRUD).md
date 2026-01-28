I will implement a fully normalized "Permission Group" management system to allow you to create, edit, and delete permission groups explicitly.

### 1. Database Refactoring (Normalization)
-   **Create Table**: `permission_groups` (`id`, `name`).
-   **Migrate**: Move existing `group_name` string data from `permissions` table to the new `permission_groups` table.
-   **Update**: Change `permissions` table to use `permission_group_id` foreign key instead of a raw string.

### 2. Backend Implementation
-   **Model**: Create `PermissionGroup` model.
-   **Architecture**: Add `PermissionGroupRepository`, `PermissionGroupService`, and `PermissionGroupController` (following the existing pattern).
-   **Updates**: Update `PermissionService` to handle the relation (e.g., eager loading the group name).

### 3. Frontend Implementation (Pixel Art)
-   **New Menu**: Add **"Groups"** to the Sidebar under "Access Control".
-   **Group Management Page**: A `DataTable` to list groups with "Create Group" and "Delete Group" actions.
-   **Permission Creation**: Update the "Create Permission" modal to use a **Dropdown/Select** for the Group instead of a text input.

This ensures data consistency (no typos in group names) and gives you the explicit control you requested.