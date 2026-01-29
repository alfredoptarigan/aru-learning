Saya akan melakukan perombakan UI secara menyeluruh untuk mendukung Dark Mode di area Dashboard (Management Course) dan Landing Page (Detail Course), dengan tetap mempertahankan gaya *Pixel Art*.

**Rencana Implementasi:**

1.  **Course Management (`Course/Index.tsx`)**:
    *   **Tabel**: Mengubah warna header, body, dan border tabel agar kontras di latar gelap. Teks akan menjadi putih/abu-abu terang.
    *   **Pagination**: Menyesuaikan tombol pagination agar terlihat jelas di dark mode.
    *   **Filter/Search**: Memastikan input field memiliki background gelap dan teks terang.

2.  **Course Create/Edit Form**:
    *   **Input Fields**: Mengubah background input menjadi gelap, border putih, dan teks putih.
    *   **Label**: Mengubah warna label menjadi putih/terang.
    *   **Card Container**: Menyesuaikan background container form.

3.  **Detail Course Page (`Detail.tsx`)**:
    *   **Hero Section**: Sudah memiliki dasar dark mode, akan diperhalus (text contrast).
    *   **About Section**: Mengubah background card putih menjadi gelap (`bg-gray-800`) dengan teks terang.
    *   **Curriculum (Accordion)**:
        *   Mengubah background item accordion menjadi gelap.
        *   Menyesuaikan warna teks judul modul dan lesson.
        *   Memastikan ikon gembok/play terlihat jelas.
    *   **Modal (Dialog)**: Memastikan modal image slider dan video player memiliki backdrop dan border yang sesuai tema gelap.

Saya akan memulai dengan memperbaiki halaman **Course Management** terlebih dahulu, kemudian lanjut ke **Detail Course**.