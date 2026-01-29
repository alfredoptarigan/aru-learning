Baik, saya akan membuat halaman **Course Management** yang lengkap dan informatif sesuai permintaan Anda.

Berikut adalah rencana implementasinya:

### 1. Backend: Persiapan Data (Pagination & Relasi)
Saat ini `CourseController@index` masih kosong. Saya akan mengupdate alur pengambilan datanya:
*   **Repository**: Tambahkan method `getPaginatedCourses($perPage)` di `CourseRepository`.
    *   Query akan memuat relasi: `courseImages` (untuk gambar), `courseMentors.user` (untuk list mentor), `subCourses.subCourseVideos` (untuk menghitung jumlah modul & video).
*   **Service & Controller**: Hubungkan data dari repository ke controller, lalu pass ke Inertia View.

### 2. Frontend: Tampilan Table (React + Shadcn)
Saya akan mengadaptasi layout dari `Tier.tsx` dan memperkayanya:

*   **Kolom Tabel**:
    1.  **Course Info**: Nama Course (Bold).
    2.  **Cover**: Thumbnail gambar pertama. *Fitur: Klik thumbnail -> Buka Modal Preview Gambar (sama seperti di Review Page).*
    3.  **Instructors**: Menampilkan avatar mentor-mentor yang terlibat (stack avatar).
    4.  **Content Stats**: Menampilkan Badge info: "X Modules | Y Videos".
    5.  **Status & Price**:
        *   Badge Status: `Draft` (Kuning) / `Published` (Hijau).
        *   Badge Tipe: `Free` (Biru) / `Premium` (Emas) + Harga.
    6.  **Actions**:
        *   Button **Edit** (Icon Pencil).
        *   Button **Delete** (Icon Trash).
        *   Button **Manage Modules** (Icon Layers - pintasan cepat ke edit subcourse).

*   **Komponen Baru**:
    *   `CourseTableAction.tsx`: Untuk merapikan tombol-tombol aksi.
    *   `CourseImageModal.tsx`: Reusable component untuk preview gambar (bisa pakai ulang logika dari Step 3).

### 3. UX Improvement
*   **Empty State**: Tampilan menarik jika belum ada course.
*   **Loading State**: Skeleton loading saat pindah halaman.
*   **Format Rupiah**: Helper function untuk menampilkan harga dengan rapi.

Apakah Anda setuju dengan rencana ini? Saya akan mulai dari Backend terlebih dahulu.