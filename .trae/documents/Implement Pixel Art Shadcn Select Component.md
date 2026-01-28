I will replace the native HTML `<select>` with the Shadcn UI `Select` component, customizing it to match the "Pixel Art" design system (thick borders, hard shadows, VT323 font).

### Plan Overview
1.  **Create Custom Select Component**: I will create `resources/js/Components/ui/select.tsx` based on Radix UI (the foundation of Shadcn Select), but styled heavily with Tailwind for the Pixel Art look.
    -   **Trigger**: White background, 2px black border, hard shadow.
    -   **Content (Dropdown)**: White background, 2px black border, hard shadow, VT323 font.
    -   **Item**: Hover state with black border or background change.

2.  **Refactor `CreatePermission.tsx`**: Replace the native `<select>` with the new `<Select>` component.

3.  **Refactor `CreateRole.tsx` / `EditRole.tsx` (If applicable)**: Although they currently use checkboxes, if there are any selects, I will update them. For now, the primary target is the Permission Group selector.

### Execution Steps
1.  Create `resources/js/Components/ui/select.tsx`.
2.  Update `CreatePermission.tsx` to use the new component.
3.  Verify styles match the existing design system.

*Note: Since I don't have the `npx shadcn-ui@latest add select` command capability in this environment (or prefer to write the file directly to ensure custom styles), I will create the file manually using the Radix UI primitives if available, or write a custom accessible dropdown if Radix isn't installed. Assuming Radix might be present (Shadcn dependency), I'll check `package.json` first. If not, I'll build a custom one or check if I can install it.*

*Wait, I should check `package.json` to see if `@radix-ui/react-select` is available. If not, I will install it.*