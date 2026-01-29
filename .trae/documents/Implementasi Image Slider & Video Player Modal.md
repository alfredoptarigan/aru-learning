Saya akan meningkatkan UI/UX halaman Detail Course dengan fitur interaktif untuk gambar dan video lesson.

**Rencana Implementasi:**

1.  **Image Gallery (Modal Slider)**:
    *   Saat gambar cover diklik, akan muncul Modal (Dialog) yang berisi slider/carousel gambar-gambar course tersebut.
    *   Menggunakan komponen `Dialog` dari shadcn/ui.
    *   Navigasi slide menggunakan tombol panah Kiri/Kanan.
    *   Menampilkan indikator posisi gambar (1/3, 2/3, dst).

2.  **Video Player (Lesson)**:
    *   Saat lesson diklik (dan statusnya *unlocked*), akan muncul Modal (Dialog) yang memutar video lesson tersebut.
    *   Mendukung embed YouTube (karena data video berupa URL YouTube).
    *   Jika lesson *locked*, tetap menampilkan gembok dan tidak bisa diklik (sesuai logika sebelumnya).

3.  **Teknis**:
    *   Menginstall komponen `Dialog` dari shadcn/ui.
    *   Membuat state `selectedImageIndex` untuk mengatur slider gambar.
    *   Membuat state `selectedVideo` untuk mengatur video yang sedang diputar.
    *   Menambahkan helper function untuk mengekstrak YouTube Video ID dari URL.

Saya akan mulai dengan menginstall komponen `Dialog` terlebih dahulu.