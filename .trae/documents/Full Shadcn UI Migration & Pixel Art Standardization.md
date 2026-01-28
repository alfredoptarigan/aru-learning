I will finalize the migration to a fully standardized **Shadcn UI** system while baking in your **Pixel Art** design directly into the components. This means you won't have to manually add `border-2 border-black shadow-[...]` every time you use a button or input.

### 1. Standardize UI Components (The "Shadcn Way")
I will refactor the components in `resources/js/Components/ui` to include the Pixel Art styles as their **default variants**.
-   **`button.tsx`**: Update `cva` config so `<Button>` automatically has the thick border, pixel font, and hard shadow.
-   **`input.tsx`**: Update default styles to match the design (box shape, border).
-   **`card.tsx`**: Ensure `<Card>` has the signature shadow and border by default.
-   **`dialog.tsx`**, **`popover.tsx`**, **`select.tsx`**: baking the styles in.

### 2. Install Missing Components
To replace the legacy `Dropdown.tsx` (Breeze) and other elements, I need to add:
-   **`dropdown-menu.tsx`**: For standard dropdown actions.
-   **`table.tsx`**: (Optional) For consistent table styling if we want to replace the manual `DataTable` styling later.

### 3. Migration & Cleanup
I will scan the codebase (starting with the Role & Permission pages we just worked on) and:
-   Replace manual class strings (`className="border-2 border-black..."`) with the standardized components.
-   Replace legacy `PrimaryButton` / `SecondaryButton` imports with the new `<Button>`.
-   Replace `TextInput` with `<Input>`.

**Goal**: Your code will become cleaner (e.g., just `<Button>Save</Button>` instead of `<Button className="...">Save</Button>`) while maintaining the exact same Pixel Art look.