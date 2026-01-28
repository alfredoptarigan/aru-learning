# Backend Integration & Refactoring Plan: Tier Management (Part 2: Read & Table)

We will implement the "Read" functionality for Tiers using TanStack Table with a custom Pixel Art design, integrated with backend pagination.

## 1. Documentation Update
- **Action:** Update `BACKEND_INTEGRATION_GUIDE.md` to include steps for:
  - Implementing Pagination in Repository.
  - Exposing Paginated Data via Service.
  - Handling Pagination in Frontend (TanStack Table).

## 2. Backend Implementation (Pagination)

### A. Repository Layer
- **File:** `app/Interfaces/Tier/TierRepositoryInterface.php`
- **Action:** Add `getPaginated(int $perPage = 10)` method.
- **File:** `app/Repositories/Tier/TierRepository.php`
- **Action:** Implement `getPaginated` using Eloquent's `paginate()`.

### B. Service Layer
- **File:** `app/Services/Tier/TierService.php`
- **Action:** Add `getPaginatedTiers(int $perPage = 10)` method calling the repository.

### C. Controller Layer
- **File:** `app/Http/Controllers/TierController.php`
- **Action:** Update `index` method to call `TierService::getPaginatedTiers()` and pass the data to the Inertia view.

## 3. Frontend Implementation (TanStack Table + Pixel Art)

### A. Install Dependencies
- **Action:** Ensure `@tanstack/react-table` is installed (it is).
- **Action:** Copy/Create Shadcn Table components if missing (will check/create `components/ui/table.tsx`).

### B. Pixel Art Table Component
- **File:** `resources/js/Components/ui/table.tsx`
- **Action:** Customize the Table styles to match `DESIGN_SYSTEM.md`:
  - **Header:** Thick border bottom, bold VT323 font.
  - **Rows:** Border bottom, hover effects (gray-50).
  - **Cells:** VT323 font, proper padding.

### C. DataTable Component
- **File:** `resources/js/Components/DataTable.tsx`
- **Action:** Create a reusable `DataTable` component that accepts `columns` and `data` (paginated).
- **Features:**
  - Rendering headers and rows.
  - Pagination controls (Previous/Next buttons with Pixel Art style).

### D. Tier Index Page
- **File:** `resources/js/Pages/Tier/Tier.tsx`
- **Action:**
  - Define columns (Name, Created At, Actions).
  - Use the `DataTable` component.
  - Pass the paginated data from props.

## 4. Execution Steps
1.  Update `BACKEND_INTEGRATION_GUIDE.md`.
2.  Implement `getPaginated` in Repository & Interface.
3.  Implement `getPaginatedTiers` in Service.
4.  Update `TierController` to return paginated data.
5.  Create/Customize `Table` UI components (Pixel Art style).
6.  Create `DataTable` component with Pagination logic.
7.  Update `Tier.tsx` to display the table.
