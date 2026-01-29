Tentu, berikut adalah solusi untuk kedua poin tersebut:

### 1. Handling Refresh Browser (Pencegahan Data Hilang)
Kita akan menggunakan **Dua Lapis Perlindungan**:
*   **Lapis 1: `beforeunload` Event**: Ini adalah standar browser. Jika user mencoba me-refresh atau menutup tab saat form belum disubmit, browser akan memunculkan popup konfirmasi *"Changes you made may not be saved"*. Ini sangat efektif untuk "kecelakaan" klik.
*   **Lapis 2: `localStorage` Persistence (Auto-Save)**:
    *   Setiap kali user mengetik, kita simpan data teks (Title, Description, Subcourses) ke memori browser (`localStorage`).
    *   Jika browser ter-refresh, kita ambil kembali data tersebut saat halaman dimuat ulang.
    *   **Catatan Penting**: File gambar **tidak bisa** disimpan di `localStorage`. Jadi jika refresh terjadi, user harus memilih ulang gambarnya, tapi setidaknya teks panjang yang sudah diketik tidak hilang.

### 2. Partial Validation (Validasi Bertahap)
Kita akan membuat endpoint khusus untuk memvalidasi Step 1 sebelum lanjut ke Step 2.
*   **Backend**: Route `POST /courses/validate-step-1` yang hanya mengecek validasi (Title unique, dll) tanpa menyimpan ke database.
*   **Frontend**: Saat tombol "Next" di Step 1 ditekan, kita tembak endpoint ini dulu. Jika lolos -> Lanjut Step 2. Jika gagal -> Muncul error merah di form.

---

### Rencana Eksekusi Final:

1.  **Backend (`CourseController` & `Routes`)**:
    *   Buat method `validateStep1(Request $request)`.
    *   Update method `store` untuk menangani "Mega Payload" (Course + Images + Subcourses + Videos).
    *   Update `CourseService` untuk Transactional Save.

2.  **Frontend (`CreateCourse.tsx` - Main Container)**:
    *   Implementasi `useForm` global.
    *   Implementasi `useEffect` untuk **Auto-Save ke LocalStorage** & **Restore**.
    *   Implementasi `useBeforeUnload` listener.

3.  **Frontend (`Step Components`)**:
    *   **Step 1**: Ubah tombol "Save" menjadi "Next" yang memanggil `axios.post('/courses/validate-step-1')`.
    *   **Step 2**: Ubah tombol "Save" menjadi "Next" (Update state parent).
    *   **Step 3**: Tampilkan ringkasan data dari state, dan tombol "Finish" untuk submit final.

Apakah Anda setuju dengan pendekatan ini? Saya akan mulai dari sisi Backend terlebih dahulu.