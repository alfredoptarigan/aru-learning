Untuk kasus **Aru Learning** yang memiliki tema unik **Pixel Art**, saya sangat menyarankan menggunakan **Tiptap**.

### Mengapa Tiptap?
1.  **Headless (Tanpa UI Bawaan)**: Berbeda dengan editor lain yang punya tampilan toolbar kaku (gaya klasik Word), Tiptap tidak punya UI sama sekali. Ini artinya kita bisa membuat tombol toolbar (Bold, Italic, H1, dll) menggunakan **Pixel Art Button** kita sendiri.
2.  **Fleksibel**: Sangat mudah diintegrasikan dengan React dan form library.
3.  **Ringan & Modern**: Output-nya bersih (HTML atau JSON).

Jika menggunakan Markdown editor biasa, tampilannya akan terlihat terlalu "teknis" dan sulit disesuaikan dengan estetika border tebal & font VT323 kita.

---

### Rencana Implementasi
Saya akan membangun form `CreateCourse` lengkap dengan **Pixel Art Rich Text Editor** menggunakan Tiptap.

#### 1. Setup Tiptap Editor
-   Install dependencies: `@tiptap/react`, `@tiptap/starter-kit`.
-   Buat komponen reusable: `resources/js/Components/PixelEditor.tsx`.
    -   Toolbar dengan tombol Pixel Art (Bold, Italic, List).
    -   Area ketik dengan border tebal dan font VT323.

#### 2. Implementasi Form Create Course
Saya akan menggunakan komponen Shadcn yang baru saja kita standarisasi:
-   **Card**: Sebagai container form.
-   **Input**: Untuk Title & Price (dengan styling pixel).
-   **Select (Shadcn)**: Untuk status Published/Draft.
-   **PixelEditor**: Untuk Description.

#### 3. Backend (Persiapan)
-   Membuat method `store` di `CourseController` untuk menangani penyimpanan data ini (validasi & save ke DB).

Apakah Anda setuju dengan pilihan **Tiptap** dan rencana ini?