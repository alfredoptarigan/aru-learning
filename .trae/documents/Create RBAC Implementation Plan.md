I will create a comprehensive documentation file `RBAC_IMPLEMENTATION_PLAN.md` detailing the steps to refactor the current Role system into a robust RBAC system.

### Plan Overview

1.  **Database Architecture**:
    -   New tables: `roles`, `permissions`, `role_has_permissions`, `model_has_roles` (supporting UUIDs).
    -   Migration strategy: Safely migrate existing `users.role` string data to the new `roles` table.

2.  **Backend Architecture (Repo-Service Pattern)**:
    -   **Models**: `Role`, `Permission` (using `HasUuid`).
    -   **Repositories**: `RoleRepository`, `PermissionRepository`.
    -   **Services**: `RoleService` (handling logic, transactions, validation).
    -   **Middleware**: `CheckPermission` and `CheckRole` middleware.

3.  **Frontend Integration (Inertia/React)**:
    -   **Context/Hooks**: `usePermission` hook to easily check access in components (e.g., `<button disabled={!can('edit_course')} />`).
    -   **Sidebar**: New "Access Control" menu group.
    -   **Pages**: Management interfaces for Roles and Permissions using the "Pixel Art" design system.

4.  **Migration Steps**:
    -   Step-by-step guide to running migrations and seeding initial data (Admin, Mentor, User).

### File Structure to Create
- `RBAC_IMPLEMENTATION_PLAN.md`: The master plan document.

I will write this document now to guide the implementation.