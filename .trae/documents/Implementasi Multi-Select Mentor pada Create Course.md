Baik, saya akan menambahkan fitur **Multi-Select Mentor** (Collaboration) pada pembuatan course.

Berikut adalah rencana implementasinya:

### 1. Backend: Mencari User dengan Role Mentor
Kita perlu query user yang memiliki role 'mentor'. Karena sistem role Anda menggunakan tabel pivot `model_has_roles`, kita akan menggunakan relasi `whereHas`.

*   **`CourseRepository.php`**: Tambahkan method `getMentors()` yang mengembalikan list user dengan role 'mentor'.
*   **`CourseController.php`**: Di method `create`, panggil repository untuk mendapatkan list mentor dan kirim ke Inertia view.
*   **`CourseController.php` (Method `store`)**: Update validasi dan logic penyimpanan untuk menangani array `mentors` (list ID user).
*   **`CourseService.php`**: Update method `createCourseWithModules` untuk menyimpan relasi mentor ke tabel `course_mentors`.
    *   Otomatis tambahkan `auth()->id()` sebagai mentor utama jika belum ada di list.
    *   Simpan mentor tambahan yang dipilih dari dropdown.

### 2. Frontend: Multi-Select Component
Kita akan menggunakan komponen `Command` atau `MultiSelect` dari shadcn/ui (jika belum ada, kita buat manual menggunakan Combobox + Badge).

*   **`CreateCourse.tsx`**: Terima props `mentors` (list mentor yang tersedia). Tambahkan field `mentors` (array of IDs) ke dalam `useForm`.
*   **`Step1CourseDetails.tsx`**:
    *   Tambahkan komponen Multi-Select untuk memilih mentor.
    *   Secara default, tampilkan nama user yang sedang login (terkunci/disabled atau pre-selected) sebagai "Main Mentor".
    *   User bisa mencari dan memilih mentor lain dari list.

### 3. Skema Data (Model)
*   **`CourseMentor.php`**: Sudah ada, siap digunakan.
*   **`User.php`**: Relasi `roles()` sudah ada, kita bisa pakai `User::whereHas('roles', fn($q) => $q->where('name', 'mentor'))->get()`.

Apakah Anda setuju dengan rencana ini? Saya akan mulai dengan menyiapkan data mentor dari backend terlebih dahulu.