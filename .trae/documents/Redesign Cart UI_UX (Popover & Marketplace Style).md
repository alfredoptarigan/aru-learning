# Rencana Redesign Cart UI/UX

Baik, saya mengerti. Anda ingin mengubah *user experience* (UX) dan *user interface* (UI) dari fitur keranjang belanja agar lebih modern dan *seamless*, mirip dengan *marketplace* populer (seperti Tokopedia).

Berikut adalah rencana perubahannya:

## 1. Redesign Navbar Cart (Hover Popover)
Alih-alih langsung berpindah halaman saat ikon keranjang diklik, kita akan membuat *Popover* (tampilan melayang) saat user mengarahkan *cursor* (hover) ke ikon keranjang.

*   **Behavior**:
    *   **Hover**: Menampilkan *dropdown* ringkasan isi keranjang (max 3-5 item terbaru).
    *   **Content**: Gambar produk, Nama, Harga, dan Tombol "Lihat Keranjang".
    *   **Click**: Jika user mengklik tombol "Lihat Keranjang" di dalam popover, barulah diarahkan ke halaman detail keranjang.

## 2. Redesign Halaman Detail Cart (`Cart/Index.tsx`)
Halaman ini akan dirombak total agar tidak terlihat seperti "Dashboard", melainkan halaman belanja yang bersih dan fokus.

*   **Layout**: Menggunakan layout `Landing` (Navbar & Footer yang sama dengan halaman depan), BUKAN `AuthenticatedLayout` (yang ada sidebar dashboard).
*   **Struktur**:
    *   **Kiri**: Daftar item dengan *checkbox* (opsional untuk masa depan, saat ini *select all* by default), gambar produk yang jelas, nama, harga, dan tombol hapus (icon tong sampah).
    *   **Kanan (Sticky)**: "Ringkasan Belanja" berisi Total Harga dan Tombol "Beli" (Checkout).
*   **Style**: Mengikuti design system yang sudah ada (font `VT323`, border tebal hitam/putih, shadow tajam) namun dengan layout yang lebih luas dan nyaman.

## 3. Langkah Implementasi

### Phase 1: Komponen Navbar Cart Popover
1.  Modifikasi `Navbar.tsx`.
2.  Implementasi `HoverCard` atau logic `onMouseEnter/Leave` kustom.
3.  Fetching data cart *preview* (mungkin perlu endpoint API ringan atau inject data via Inertia props). *Catatan: Untuk efisiensi saat ini kita gunakan data yang sudah ada di props jika memungkinkan, atau fetch via AJAX saat hover.*

### Phase 2: Halaman Cart Baru
1.  Ubah `Cart/Index.tsx` untuk menggunakan `Navbar` dan `Footer` landing page, bukan `AuthenticatedLayout`.
2.  Styling ulang list item agar mirip referensi (gambar di kiri, detail di tengah, harga di kanan).
3.  Styling ulang "Ringkasan Belanja" agar *sticky* dan menonjol.

### Phase 3: Integrasi & Cleanup
1.  Pastikan navigasi antar halaman lancar.
2.  Cek responsivitas di mobile.

Apakah rencana redesign ini sesuai dengan ekspektasi Anda?