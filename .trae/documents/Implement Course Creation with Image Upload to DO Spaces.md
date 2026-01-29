Saya akan mengimplementasikan logika penyimpanan gambar ke DigitalOcean Spaces dan menghubungkannya dengan `CourseService`.

### Rencana Implementasi

1.  **Update `CourseRepositoryInterface` & `CourseRepository`**:
    -   Menambahkan method `create` untuk membuat Course baru.
    -   Method `storeCourseImage` sudah ada, tapi kita perlu memanggilnya setelah Course dibuat.

2.  **Update `CourseService`**:
    -   Menambahkan method `createCourse` yang akan:
        1.  Membuat Course baru via Repository.
        2.  Menyimpan gambar-gambar ke DO Spaces.
        3.  Menyimpan URL gambar ke database via `storeCourseImage`.

3.  **Update `CourseController`**:
    -   Menggunakan `CourseService` di method `store`.
    -   Mengirimkan data validasi dan file gambar ke Service.

### Detail Langkah Teknis

1.  **Repository**: Tambahkan `create(array $data)` ke Interface dan Implementasinya.
2.  **Service**: Buat method `createCourse(array $data, array $images = [])`.
    -   Gunakan `Storage::disk('do')->putFile(...)` untuk upload ke DO Spaces.
    -   Dapatkan URL publiknya.
    -   Panggil `storeCourseImage` untuk setiap gambar.
3.  **Controller**: Panggil `$this->courseService->createCourse(...)` dengan data dari request.

Apakah Anda setuju dengan alur ini?