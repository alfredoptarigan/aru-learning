Saya akan merombak halaman depan (Landing Page) dan membuat halaman detail course dengan gaya **Pixel Art Modern** yang terinspirasi dari BuildWithAngga.

Berikut adalah rencana implementasinya:

### 1. Komponen Baru (Pixel UI Theme)
*   **`Navbar.tsx`**:
    *   Sticky/Fixed positioning.
    *   Efek *Hide on Scroll Down* (menggunakan `framer-motion` atau logic scroll sederhana).
    *   Menu: List Kelas, Flash Sale, Alur Belajar, dll.
    *   Auth Buttons: Login & Register (jika belum login) atau Avatar User (jika sudah login).
    *   Style: Font `vt323`, border tebal, shadow pixel.
*   **`Footer.tsx`**:
    *   Link navigasi, sosial media, copyright.
    *   Style: Retro grid background, font pixel.
*   **`CourseCard.tsx`**:
    *   Card untuk menampilkan list kelas di halaman depan.
    *   Menampilkan: Thumbnail, Judul, Harga, Rating (bintang), Level.
    *   Hover effect: Scale up + shadow pixel lebih tebal.

### 2. Halaman Depan (`Welcome.tsx`)
Saya akan mengubah total file ini menjadi Landing Page utama.
*   **Hero Section**:
    *   Headline: "Upgrade Skills with Pixel Art Style".
    *   Subheadline: "Belajar coding & design dengan pengalaman retro yang seru".
    *   CTA Button: "Explore Courses" (Pixel button).
    *   Visual: Ilustrasi/Icon pixel art.
*   **Features Section**:
    *   Benefit belajar di platform ini (e.g., Lifetime Access, Portfolio, Community).
*   **Course List Section**:
    *   Grid yang menampilkan kursus-kursus unggulan (menggunakan Mock Data dulu untuk kecepatan, atau data dari database jika mudah).
*   **Testimonials / Stats**:
    *   "Trusted by 900K+ Students" (Pixel style).

### 3. Halaman Detail Course (`Course/Detail.tsx`)
*   **Routing**: Menambahkan route baru `/course/{id}` atau `/course/{slug}` di `web.php`.
*   **Layout**:
    *   **Header/Hero**: Judul Course, Deskripsi Singkat, Rating, Mentor, Last Updated.
    *   **Main Content (Kiri)**:
        *   **Video Preview**: Player video (placeholder).
        *   **About Course**: Penjelasan detail.
        *   **Key Takeaways**: Apa yang dipelajari.
        *   **Tools**: Software yang digunakan.
        *   **Curriculum**: List materi/video (Accordion style).
    *   **Sidebar (Kanan/Sticky)**:
        *   Harga (Coret jika diskon).
        *   Tombol "Buy Now" / "Join Class".
        *   Benefit list (Sertifikat, Konsultasi, dll).

### 4. Setup Route
*   Update `routes/web.php` untuk mengarahkan `/` ke `Welcome` (dengan data courses) dan `/course/{id}` ke `CourseController@show`.

Saya akan mulai dengan membuat komponen UI dasar (`Navbar`, `Footer`) lalu merakit halaman `Welcome`. Apakah Anda setuju?