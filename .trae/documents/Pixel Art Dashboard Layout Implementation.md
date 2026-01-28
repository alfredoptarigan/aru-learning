# Implementation Plan: Pixel Art Dashboard & TanStack Table Setup

We will proceed with building the Pixel Art Dashboard layout and setting up TanStack Table as requested.

## 1. Dependencies
- **Action:** Install `@tanstack/react-table` for future data grid implementations.
- **Command:** `npm install @tanstack/react-table`

## 2. Type Definitions Update
**File:** `resources/js/types/index.d.ts`
- Update `User` interface to include `profile_url`, `role`, and `phone_number` to match the database.

## 3. Component Creation

### Sidebar Component (`resources/js/Components/Sidebar.tsx`)
- **Layout:** Fixed width (`w-64`), full height.
- **Style:**
  - Background: `#FDFBF7` (Background color).
  - Border: Right border `2px solid black`.
  - Font: `VT323`.
- **Features:**
  - Branding/Logo area.
  - Navigation Links (Dashboard, etc.) with pixel-art hover effects (primary color background).
  - Responsive toggle logic.

### Navbar Component (`resources/js/Components/Navbar.tsx`)
- **Layout:** Top sticky bar.
- **Style:**
  - Background: `#FDFBF7`.
  - Border: Bottom border `2px solid black`.
- **Features:**
  - User Profile Display (Avatar + Name).
  - **Pixel Art Dropdown:**
    - Trigger: Avatar/Name click.
    - Style: White bg, `2px` black border, `4px` hard shadow.
    - Items: Profile, Log Out.

## 4. Layout Refactoring
**File:** `resources/js/Layouts/AuthenticatedLayout.tsx`
- Implement Flexbox layout:
  - **Sidebar:** Left side (hidden on mobile).
  - **Main:** Right side, containing Navbar and Page Content.
- Ensure the entire layout uses the `VT323` font family and pixel design variables.

## 5. Execution Steps
1.  Install TanStack Table.
2.  Update TypeScript definitions.
3.  Create `Sidebar` and `Navbar` components.
4.  Refactor `AuthenticatedLayout`.
5.  Verify the dashboard UI.
