Benar, komponen `Select` bawaan Shadcn UI (yang berbasis Radix UI Select) **tidak memiliki fitur pencarian**.

Untuk fitur pencarian (Searchable Dropdown), pola yang digunakan di Shadcn UI adalah **Combobox**, yang dibangun menggunakan kombinasi komponen `Popover` dan `Command` (`cmdk`).

Saya akan mengimplementasikan `Combobox` dengan gaya Pixel Art agar Anda bisa mencari Group Permission.

### Rencana Implementasi
1.  **Install Dependencies**:
    -   `cmdk`: Library command palette untuk fitur search.
    -   `@radix-ui/react-popover`: Untuk menampilkan dropdown overlay.
2.  **Buat Komponen UI Dasar (Pixel Art Style)**:
    -   `resources/js/Components/ui/command.tsx`: Komponen search list.
    -   `resources/js/Components/ui/popover.tsx`: Komponen overlay.
3.  **Update `CreatePermission.tsx`**:
    -   Ganti `Select` dengan implementasi `Combobox` (Popover + Command).
    -   Pastikan styling konsisten (border tebal, font pixel).

Saya akan mulai dengan menginstall dependensi yang dibutuhkan.