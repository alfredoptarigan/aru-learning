# Implementasi Durasi Video & Auto-Fetch YouTube

## Tujuan
Menambahkan fitur pencatatan durasi video pada modul kursus, dengan kemampuan mengambil data durasi secara otomatis dari YouTube API untuk meningkatkan efisiensi input data.

## 1. Persiapan Database
### Migrasi Schema
- Membuat migrasi baru untuk menambahkan kolom `duration` (integer) ke tabel `subcourse_videos`.
- Kolom ini akan menyimpan durasi dalam satuan **detik** (untuk memudahkan penjumlahan total durasi nanti).

## 2. Backend (Laravel)
### YouTube Service Helper
- Membuat Helper/Service sederhana (`YouTubeService`) untuk:
  1. Mengekstrak Video ID dari URL YouTube (mendukung format `youtube.com` dan `youtu.be`).
  2. Memanggil YouTube Data API v3 (`videos` endpoint).
  3. Mengonversi format durasi ISO 8601 (misal: `PT1H2M10S`) menjadi integer detik.

### Update Controller & Logic
- Menambahkan endpoint baru (misal: `/api/video-metadata`) yang menerima URL dan mengembalikan Title & Duration.
- Mengupdate `CourseController` (`storeSubCourses` dan `updateModules`) untuk menyimpan data `duration` ke database.

## 3. Frontend (React/Inertia)
### Update Komponen `Step2SubCourses`
- Menambahkan state `duration` pada interface video.
- Menambahkan field input untuk Durasi (format `MM:SS` atau `HH:MM:SS` agar mudah dibaca manusia).
- **Fitur Auto-Fetch:** Saat user melakukan *paste* pada input URL Video, sistem otomatis memanggil endpoint backend untuk mengisi Judul dan Durasi secara otomatis.
- Menambahkan visualisasi total durasi per modul (SubCourse).

## 4. Konfigurasi
- Menambahkan `YOUTUBE_API_KEY` ke dalam file `.env`. (Anda perlu membuat API Key di Google Cloud Console, tapi saya bisa buatkan logika kodenya dulu).

---
**Apakah Anda setuju dengan rencana ini?** Jika ya, saya akan mulai dari langkah database dan backend.
(Catatan: Untuk pengetesan, jika Anda belum punya API Key, saya bisa buatkan *mock* data dulu agar fitur tetap jalan).