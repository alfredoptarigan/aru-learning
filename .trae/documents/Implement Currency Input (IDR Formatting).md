Tentu, kita bisa memformat input Price agar otomatis menampilkan format mata uang IDR (Rupiah) saat diketik.

### Masalah
Saat ini input menggunakan `type="number"`. Ini membatasi input hanya angka, tapi tidak bisa menampilkan pemisah ribuan (titik) atau simbol "Rp".

### Solusi
Saya akan membuat komponen baru `CurrencyInput` (atau memodifikasi input yang ada secara lokal) yang:
1.  Menerima input angka.
2.  Menampilkannya dengan format Rupiah (contoh: `1.000.000`).
3.  Tetap mengirimkan *raw number* (angka murni) ke `useForm` agar backend menerima data yang benar (`1000000`).

Saya akan menggunakan logika sederhana untuk formatting on-the-fly.

#### Langkah Implementasi
1.  Modifikasi `CreateCourse.tsx`:
    -   Ganti input `price` dengan logic formatting.
    -   Buat fungsi `formatRupiah` untuk display.
    -   Buat handler `handlePriceChange` untuk membersihkan format sebelum disimpan ke state.

Apakah Anda setuju saya update `CreateCourse.tsx` dengan logic ini?