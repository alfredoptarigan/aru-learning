# Plan: Implement Zustand & Zod Strategy

Yes, adding **Zustand** and **Zod** is a **great idea** for a project of this scale, specifically for the reasons below.

## 1. Why Zustand? (State Management)
**Do you need it?** **Yes**, primarily for **Global UI State** and **Cross-Component Communication**.

### The Problem it Resolves:
Currently, your `isSidebarCollapsed` state lives in `AuthenticatedLayout.tsx`.
1.  **Persistence Issue:** If a user collapses the sidebar and refreshes the page (or navigates to a page that forces a full reload), the sidebar will "pop" back open. This is annoying UX.
2.  **Prop Drilling:** If you later want a button in the `Profile` page to open the sidebar, you'd have to pass functions all the way down.
3.  **Future Feature (Shopping Cart/Notifications):** If you add a "Course Cart" later, you need the Cart Counter in the Navbar to update immediately when a user clicks "Add to Cart" in a Course Card (which are in completely different parts of the React tree).

### The Solution:
We will use Zustand with its `persist` middleware. This automatically saves your state to `localStorage`.
- **Action:** Create `useSidebarStore` to manage the sidebar state globally and persist it across reloads.

## 2. Why Zod? (Schema Validation)
**Do you need it?** **Yes**, but primarily for **Type Safety** and **Client-Side Validation**.

### The Problem it Resolves:
1.  **Type Duplication:** You manually wrote the `User` interface in `types/index.d.ts`. If the DB changes, you have to remember to update that file.
2.  **Delayed Feedback:** Currently, validation happens on the server (Laravel). The user fills out a form, hits submit, waits, and *then* sees an error.
3.  **Complex Forms:** For complex features like "Create Course" (Title -> Modules -> Lessons), validating step-by-step on the client is much smoother than sending partial requests to the backend.

### The Solution:
We will use Zod to define our data "shapes".
- **Action:** Install Zod. We won't refactor *everything* to Zod yet (Inertia handles server errors well), but we will set it up for future complex forms.

---

## Implementation Steps

### Step 1: Install Dependencies
Install `zustand` and `zod`.

### Step 2: Implement Zustand for Sidebar
Refactor the current `Sidebar` and `AuthenticatedLayout` to use a global store.
- Create `resources/js/hooks/useSidebarStore.ts`.
- Use the `persist` middleware so the sidebar remembers its state.
- Remove the `useState` from `AuthenticatedLayout`.

### Step 3: Example Zod Implementation
Create a schema for the "Profile Update" logic we just built, to demonstrate how it guarantees Type Safety.
- Create `resources/js/types/schema.ts`.

### Step 4: Verification
Verify that the sidebar state persists after a page refresh.
