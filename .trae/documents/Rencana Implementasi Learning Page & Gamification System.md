# Rencana Implementasi Learning Page & Gamification

Kamu ingin membuat pengalaman belajar yang imersif dan menarik. Saya akan merancang sistem **Learning Page** yang modern, berbeda dari referensi, namun tetap fungsional, serta mengintegrasikan sistem **RPG/Gamification**.

## 1. Database & Struktur Data (Gamification & Progress)
Kita perlu memodifikasi database untuk mendukung tracking progress dan sistem RPG.

*   **`categories` table**: Menambahkan kolom `type` atau `skill_path` (e.g., Frontend, Backend) untuk keperluan grafik skill dashboard.
*   **`user_video_progress` table**: Menyimpan status tontonan per video.
    *   `user_id`, `video_id`, `is_completed` (boolean), `completed_at` (timestamp).
*   **`user_skills` / `user_stats` table**: Menyimpan EXP dan Level user.
    *   `user_id`, `total_exp`, `level`, `skill_points` (JSON: {frontend: 100, backend: 50}).

## 2. Backend Logic (Learning Controller)
*   **`LearningController`**: Menangani halaman "Player" video.
*   **`ProgressController`**: API untuk:
    *   `markAsComplete`: Menandai video selesai -> Tambah EXP -> Cek Level Up -> Return Next Video URL.
    *   Logic Gamification: Setiap video completed = +X EXP (misal: 100 EXP).

## 3. Frontend Implementation (Learning Interface)
Desain akan menggunakan konsep **"Focus Mode"** dengan sentuhan **Retro/Pixel Art** (sesuai branding ARU Learning).

*   **Layout**:
    *   **Sidebar Kiri (Collapsible)**: Daftar Materi (Accordion Module). Progress bar di atasnya.
    *   **Main Content (Tengah)**: Video Player Besar (YouTube Embed).
    *   **Bottom Bar**: Tombol Navigasi (Prev/Next), Tombol "Mark as Complete" (besar & satisfying), dan EXP Gained notification.
    *   **Gamification HUD**: Di pojok kanan atas, menampilkan Level User & EXP Bar saat ini.

## 4. Langkah Eksekusi

### Phase 1: Database & Migrations
1.  Buat migration `user_video_progress`.
2.  Update table `users` atau buat `user_stats` untuk simpan EXP.
3.  Seed kategori skill jika belum ada.

### Phase 2: Learning Controller & API
1.  Buat `LearningController` untuk render halaman player.
2.  Implementasi logic `markAsCompleted` yang otomatis menambah EXP user.
3.  Logic `getNextVideo` untuk auto-redirect.

### Phase 3: Learning Page UI/UX
1.  Buat Layout baru `LearningLayout` (Full width, no distractions).
2.  Implementasi Video Player dengan state management (selesai nonton -> trigger complete).
3.  Desain Sidebar Materi yang interaktif (menandakan mana yang sudah selesai/terkunci).

### Phase 4: Gamification & Dashboard (Foundation)
1.  Implementasi efek visual saat "Level Up" atau "Video Complete" (Confetti/Sound).
2.  Persiapan data untuk Dashboard Student (Skill Graph) di tugas berikutnya.

Apakah kamu setuju dengan rencana ini? Kita akan mulai dari **Phase 1: Database Migrations**.