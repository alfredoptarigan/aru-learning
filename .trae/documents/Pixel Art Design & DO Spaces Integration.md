# Pixel Art Design System & DigitalOcean Integration

## 1. DigitalOcean Spaces Integration
1.  **Install S3 Driver**: Run `composer require league/flysystem-aws-s3-v3`.
2.  **Configure Filesystem**:
    -   Update `config/filesystems.php` to add a `do` (DigitalOcean) disk configuration.
    -   Update `.env` with the provided credentials.
3.  **Update Registration Logic**:
    -   Modify `RegisteredUserController.php` to store uploaded profile pictures to the `do` disk.
    -   Ensure the stored URL is accessible (public).

## 2. Pixel Art Design System (Detailed)
1.  **Create Design Documentation (`DESIGN_SYSTEM.md`)**:
    -   **Typography**: "VT323" (Google Fonts) for a readable yet retro terminal look.
    -   **Color Palette**:
        -   `Primary`: **#C25E28** (Rust Orange) - Main actions.
        -   `Secondary`: **#4A90E2** (Retro Blue) - Secondary actions.
        -   `Accent`: **#F1C40F** (Retro Yellow) - Highlights.
        -   `Destructive`: **#E74C3C** (Pixel Red) - Errors/Delete.
        -   `Background`: **#FDFBF7** (Off-white/Paper).
        -   `Border`: **#000000** (Solid Black).
    -   **UI Rules**:
        -   **Corner Radius**: `0px` (Always sharp).
        -   **Borders**: `2px` solid black.
        -   **Shadows**: `4px 4px 0px 0px #000` (Hard offset).

2.  **Frontend Implementation**:
    -   **Tailwind Config**:
        -   Extend `colors` with the new palette.
        -   Add `fontFamily` "pixel" mapped to 'VT323'.
        -   Add custom `boxShadow` utilities.
    -   **Global CSS**: Import "VT323" from Google Fonts in `app.css`.
    -   **Component Refactor (Shadcn/UI)**:
        -   **Button**: Update variants (`default` -> Primary, `secondary` -> Secondary, `destructive`, `outline`, `ghost`). All will have hard borders and pixel shadows.
        -   **Input**: Hard borders, retro focus ring (thick outline), monospaced pixel font.
        -   **Card**: Update styling to match the pixel aesthetic.
    -   **Page Updates**: Refine `Login.tsx` and `Register.tsx` to use the new button variants and typography.

## 3. Verification
1.  Verify file upload to DigitalOcean Spaces.
2.  Visually verify the pixel art style and color system on auth pages.
