# Backend Integration & Refactoring Plan: Tier Management

We will refactor the current Tier implementation to follow a robust **Repository-Service Pattern** with strict validation, transaction management, and enhanced error handling (Pixel Art Sonner).

## 1. Documentation
- **Action:** Create `BACKEND_INTEGRATION_GUIDE.md` to document the architectural pattern (Controller -> Service -> Repository) and error handling standards.

## 2. Backend Architecture Implementation

### A. Repository Layer
- **Interface:** Create `app/Interfaces/Tier/TierRepositoryInterface.php`.
- **Implementation:** Create `app/Repositories/Tier/TierRepository.php`.
- **Responsibility:** Handle raw database operations (create, findByName, etc.).

### B. Service Layer
- **Class:** Create `app/Services/Tier/TierService.php`.
- **Responsibility:** 
  - Business logic validation (e.g., check if tier exists).
  - Database Transactions (`DB::beginTransaction`, `commit`, `rollBack`).
  - Calls Repository methods.

### C. Service Provider Registration
- **File:** `app/Providers/RepositoryServiceProvider.php`.
- **Action:** Bind `TierRepositoryInterface` to `TierRepository`.

### D. Controller Refactoring
- **File:** `app/Http/Controllers/TierController.php`.
- **Action:** 
  - Inject `TierService`.
  - Replace direct Model usage with Service calls.
  - Handle exceptions and return appropriate Inertia responses with flash messages (success/error).

## 3. Frontend Enhancements (Pixel Art Sonner)

### A. Custom Sonner Component
- **Action:** Create/Configure a custom Toaster component that overrides the default Shadcn/Sonner styles to match `DESIGN_SYSTEM.md`.
- **Style:**
  - **Success:** Green/White with thick borders, hard shadows.
  - **Error:** Red/White with thick borders, hard shadows.
  - **Warning:** Yellow/Black with thick borders, hard shadows.
  - **Font:** `VT323`.

### B. Inertia Flash Handling
- **Action:** Update the main Layout or a global listener to watch for Inertia flash messages (`page.props.flash`) and trigger the Pixel Art Sonner toasts automatically.

## 4. Execution Steps
1.  Create the `BACKEND_INTEGRATION_GUIDE.md`.
2.  Implement Repository & Interface.
3.  Implement Service with Transaction logic.
4.  Register Repository in Provider.
5.  Refactor Controller.
6.  Implement Custom Pixel Art Sonner.
7.  Integrate Sonner with Inertia Flash messages.
