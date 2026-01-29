Terima kasih atas koreksinya. Anda benar sekali. Saya telah keliru menyamakan **SubCourse** dengan satu video, padahal seharusnya **SubCourse** adalah sebuah **Module/Chapter** yang bisa berisi **banyak Video**.

Berikut adalah rencana perbaikan logika (Core Logic Fix) yang akan saya lakukan:

### 1. Refactor Struktur Data di Frontend (`Step2SubCourses.tsx`)
Struktur data saat ini `subcourses: [{ title, description, video_url }]` salah karena hanya mendukung 1 video per subcourse.

Akan saya ubah menjadi hierarki nested:
```typescript
interface Video {
    title: string;
    video_url: string;
}

interface SubCourse { // Ini adalah Module/Chapter
    title: string;
    description: string;
    videos: Video[]; // Array of videos
}
```

**Perubahan UI yang diperlukan:**
*   Setiap kartu **SubCourse** (Module) akan memiliki tombol tambah video ("Add Video").
*   Di dalam kartu SubCourse, akan ada list input untuk video (Title & URL).
*   Fitur "Generate 5" akan disesuaikan (misal: generate 5 modul kosong atau 1 modul dengan 5 video placeholder, nanti bisa kita atur).

### 2. Refactor Backend Logic
Logic penyimpanan di backend juga perlu disesuaikan untuk menangani array of videos.

*   **`CourseController.php`**: Validasi harus diupdate untuk menerima array `videos` di dalam `subcourses`.
    ```php
    'subcourses.*.videos' => 'array',
    'subcourses.*.videos.*.title' => 'required',
    'subcourses.*.videos.*.video_url' => 'required|url',
    ```
*   **`CourseService.php` & `CourseRepository.php`**:
    *   Method `createSubCourses` akan diubah logic loop-nya.
    *   Pertama create `SubCourse` (Module).
    *   Lalu loop `videos` di dalamnya untuk create `SubCourseVideo`.

### 3. Langkah Implementasi
1.  **Update `Step2SubCourses.tsx`**: Ubah state management dan UI untuk mendukung *nested videos*.
2.  **Update `CourseController.php`**: Perbaiki validasi request.
3.  **Update `CourseRepository.php`**: Perbaiki logic penyimpanan ke database agar menyimpan video ke tabel `subcourse_videos` dengan benar.

Apakah Anda setuju dengan rencana perbaikan struktur relasi `1 SubCourse -> Many Videos` ini? Jika ya, saya akan segera mengeksekusinya.