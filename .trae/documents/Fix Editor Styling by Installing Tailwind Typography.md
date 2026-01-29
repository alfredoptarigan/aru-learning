Masalah ini terjadi karena **Tailwind CSS secara default me-reset semua styling HTML standard** (seperti `h1`, `h2`, `ul`, `ol`) menjadi teks biasa tanpa format.

Di dalam kode `PixelEditor.tsx` yang saya buat, saya sudah menambahkan class `prose`, yang merujuk pada plugin **@tailwindcss/typography**. Plugin inilah yang bertugas mengembalikan styling standard tersebut dengan cara yang rapi.

Namun, plugin tersebut **belum terinstall** di project Anda.

### Solusi
1.  **Install Plugin**: Saya akan menginstall `@tailwindcss/typography`.
2.  **Update Config**: Saya akan mendaftarkan plugin tersebut ke `tailwind.config.js`.

Setelah ini, tombol H1, H2, dan List akan langsung berfungsi (terlihat bedanya) karena class `prose` akhirnya akan bekerja.