I will implement the Role and Permission management interfaces, including the ability to create roles, assign permissions to them, and manage the list of available permissions.

### Backend Implementation
1.  **Permission Service & Controller**:
    -   Create `PermissionService` to handle business logic (create, delete).
    -   Create `PermissionController` with `index`, `store`, and `destroy` methods.
2.  **Role Controller Updates**:
    -   Update `RoleController` to implement `create` (fetch all permissions for selection), `store`, `edit` (fetch role + its permissions), `update`, and `destroy`.
3.  **Routes**:
    -   Register `PermissionController` resources in `routes/web.php`.

### Frontend Implementation (Pixel Art Design)
1.  **Permission Management Page** (`Pages/Permission/Index.tsx`):
    -   A `DataTable` listing all permissions.
    -   A "Create Permission" button opening a Pixel Art styled `Dialog` with a form to add a new permission (e.g., `course.view`).
2.  **Role Management Page** (`Pages/Role/Index.tsx`):
    -   A `DataTable` listing roles and their associated permissions (truncated if too many).
    -   "Edit" and "Delete" buttons.
3.  **Create/Edit Role Forms** (`Pages/Role/Partials/CreateRole.tsx`, `EditRole.tsx`):
    -   A form with a **Role Name** input.
    -   A **Permissions Section**: A grid of checkboxes listing all available permissions, allowing the user to toggle which permissions this role has.
4.  **Sidebar Update**:
    -   Add an "Access Control" section in `Sidebar.tsx` with links to "Roles" and "Permissions", visible to authorized users.

### Execution Order
1.  Backend: Services & Controllers.
2.  Routes.
3.  Frontend: Permission Page.
4.  Frontend: Role Pages (Create/Edit with Permission assignment).
5.  Sidebar Integration.