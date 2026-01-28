# RBAC Implementation Plan (Pixel Art Design System)

This document outlines the architectural plan for implementing a robust Role-Based Access Control (RBAC) system, transitioning from a simple string-based role system to a dynamic, database-driven one.

## 1. Database Schema Design

We will introduce 3 new tables and 1 pivot table to handle the Many-to-Many relationship between Users and Roles, and Roles and Permissions.

### 1.1 Tables

#### `roles`
- `id` (uuid, primary)
- `name` (string, unique) - e.g., 'admin', 'mentor', 'user'
- `guard_name` (string, default: 'web')
- `created_at`, `updated_at`

#### `permissions`
- `id` (uuid, primary)
- `name` (string, unique) - e.g., 'course.create', 'user.delete'
- `guard_name` (string, default: 'web')
- `created_at`, `updated_at`

#### `model_has_roles` (Pivot)
- `role_id` (uuid, foreign key to roles.id)
- `model_type` (string) - e.g., 'App\Models\User'
- `model_id` (uuid)
- *Primary Key*: (role_id, model_id, model_type)

#### `role_has_permissions` (Pivot)
- `permission_id` (uuid, foreign key to permissions.id)
- `role_id` (uuid, foreign key to roles.id)
- *Primary Key*: (permission_id, role_id)

### 1.2 ERD Visualization
User (1) <-> (N) model_has_roles (N) <-> (1) Role (1) <-> (N) role_has_permissions (N) <-> (1) Permission

---

## 2. Migration Strategy (Data Integrity)

Since we are moving from a `users.role` string column to a relationship, we must ensure existing users retain their access levels.

### Migration Steps:
1.  **Create Tables**: Run migration to create `roles`, `permissions`, `model_has_roles`, `role_has_permissions`.
2.  **Seed Initial Roles**: Insert 'admin', 'mentor', 'user' into the `roles` table.
3.  **Migrate Data**:
    -   Iterate through all `users`.
    -   Read the current `role` column (e.g., "admin").
    -   Find the corresponding `Role` ID.
    -   Insert into `model_has_roles` linked to the user.
4.  **Cleanup**: Drop the `role` column from the `users` table.

---

## 3. Backend Architecture (Repo-Service Pattern)

We will adhere to the existing Repository-Service pattern.

### 3.1 Models
-   `App\Models\Role` (HasUuid)
-   `App\Models\Permission` (HasUuid)
-   `App\Models\User` (Update: Remove `role` attribute, add `roles()` relationship).

### 3.2 Repositories
-   **`RoleRepository`**:
    -   `getAll()`
    -   `findByName($name)`
    -   `create($data)`
    -   `syncPermissions($role, $permissions)`
-   **`PermissionRepository`**:
    -   `getAll()`

### 3.3 Services
-   **`RoleService`**:
    -   `createRole(CreateRoleDTO $data)`
    -   `assignRoleToUser(User $user, string $roleName)`
    -   `updateRolePermissions(Role $role, array $permissionIds)`
    -   *Logic*: Wrap database operations in Transactions.

### 3.4 Middleware
-   **`HandleInertiaRequests`**: Share user permissions to the frontend globally.
-   **`CheckPermission`**: Middleware to protect routes (e.g., `Route::middleware('permission:course.create')`).

---

## 4. Frontend Integration (React + Inertia)

### 4.1 Shared Props (Inertia)
We will share the authenticated user's permissions via `HandleInertiaRequests.php`:

```php
'auth' => [
    'user' => $request->user(),
    'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name') : [],
    'roles' => $request->user() ? $request->user()->getRoleNames() : [],
],
```

### 4.2 React Helper / Hook
Create a custom hook `usePermission` in `resources/js/Hooks/usePermission.ts`:

```typescript
export const usePermission = () => {
    const { auth } = usePage().props;
    
    const can = (permission: string) => auth.permissions.includes(permission);
    const hasRole = (role: string) => auth.roles.includes(role);
    
    return { can, hasRole };
};
```

### 4.3 UI Implementation
-   **Sidebar**: Add "Access Control" group visible only if `can('view.access_control')`.
    -   Roles
    -   Permissions
-   **Pages**:
    -   **Role Management**: Table listing roles.
    -   **Role Create/Edit**: Form with Name input and a Checklist of available Permissions.

---

## 5. Implementation Steps (Execution Order)

1.  **Backend Core**:
    -   Create Migrations (Tables + Data Migration Script).
    -   Create Models (`Role`, `Permission`).
    -   Create Repositories & Services.
2.  **Middleware & Helpers**:
    -   Implement `User` model relationships (`roles()`, `permissions()`).
    -   Update `HandleInertiaRequests` to share data.
3.  **Frontend**:
    -   Create `usePermission` hook.
    -   Update Sidebar.
    -   Create `RoleController` (CRUD).
    -   Create `Role/Index.tsx`, `Role/Create.tsx` (Pixel Art Style).

---

## 6. Pixel Art Design Requirements
-   **Tables**: Use `TanStack Table` with thick borders and hard shadows.
-   **Modals**: Use existing `Dialog` component for "Add Role".
-   **Alerts**: Use `Sonner` with pixel styling for success/error messages.
