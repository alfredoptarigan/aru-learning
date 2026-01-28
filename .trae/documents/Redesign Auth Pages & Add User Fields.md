# Redesign Auth Pages & Add User Fields

## 1. Database & Backend Updates

1. **Create Migration**: Add `role`, `profile_url`, and `phone_number` columns to `users` table.
2. **Update User Model**: Add new fields to `$fillable`.
3. **Update Controller**: Modify `RegisteredUserController` to handle validation and file upload for the profile picture.

## 2. Frontend Component Setup (Shadcn UI)

1. **Install Components**: Add the following Shadcn components to `resources/js/Components/ui`:

   * `Card` (for the container)

   * `Input` (for form fields)

   * `Label` (for form labels)

   * `Button` (ensure it's available)

## 3. Redesign Auth Pages

1. **Guest Layout**: Update or replace `GuestLayout` to support the new centered card design with a clean background.
2. **Login Page (`Login.tsx`)**:

   * Implement the "Masuk ke Dashboard" design.

   * Use `Card`, `CardHeader`, `CardContent`, `CardFooter`.

   * Style with Tailwind to match the reference (clean, minimal, centered).
3. **Register Page (`Register.tsx`)**:

   * Apply the same design consistency as Login.

   * Add new form fields: `Phone Number` and `Profile Picture` (File Upload).

   * Use `useForm` from Inertia to handle file uploads correctly.

## 4. Verification

1. Run migrations.
2. Test registration with all fields including file upload.
3. Test login with the new design.

