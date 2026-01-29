Saya akan mengintegrasikan data course dari database ke halaman Landing Page dan Detail Course, serta menambahkan logika "Lock" untuk konten premium.

**Rencana Implementasi:**

1.  **Landing Page (`Welcome.tsx`)**:
    *   Memastikan data course dari database (`$courses` dari `web.php`) ditampilkan dengan benar menggunakan komponen `CourseCard`.
    *   Sudah terimplementasi di langkah sebelumnya, saya akan melakukan verifikasi akhir.

2.  **Detail Course (`Detail.tsx`)**:
    *   **Integrasi Data**: Menampilkan Judul, Deskripsi, Mentor, dan Kurikulum asli dari database.
    *   **Logika Premium (Lock Content)**:
        *   Jika `course.is_premium` = **TRUE**:
            *   Menampilkan ikon **Gembok (Lock)** pada setiap video lesson.
            *   Video lesson tidak bisa diklik (disabled/grayed out).
            *   Menampilkan tombol "Buy This Course" yang mencolok.
        *   Jika `course.is_premium` = **FALSE**:
            *   Menampilkan ikon **Play** atau **Unlock**.
            *   Video lesson bisa diklik (interactive).
            *   Tombol berubah menjadi "Start Learning".
    *   **Fitur Preview (Opsional)**: Saya akan membuat video pertama di modul pertama tetap "Unlocked" sebagai *Free Preview* agar user bisa mencoba sebelum membeli (UX pattern umum).

Saya akan mulai dengan mengupdate `Detail.tsx` untuk menerapkan logika gembok tersebut.