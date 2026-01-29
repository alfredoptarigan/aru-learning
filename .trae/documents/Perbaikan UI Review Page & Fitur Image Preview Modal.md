Baik, saya akan melakukan perbaikan UI di `Step3Review.tsx` sesuai permintaan Anda:

### 1. Hapus Simbol `$`
Saya akan menghapus ikon `DollarSign` dan memastikan format harga hanya menggunakan "Rp".

### 2. Margin pada Status
Saya akan menambahkan `ml-2` (margin-left) atau mengatur layout flex agar ada jarak yang pas antara label "STATUS" dan badge statusnya.

### 3. Preview Gambar dengan Modal
Ini fitur yang menarik. Saya akan mengimplementasikannya dengan cara berikut:
*   **Logic Tampilan**:
    *   Jika 0 gambar: Tampilkan teks "No images selected".
    *   Jika 1 gambar: Tampilkan preview gambar tersebut (thumbnail).
    *   Jika >1 gambar: Tampilkan thumbnail gambar pertama dengan overlay "+(N) more".
*   **Interaksi**:
    *   Saat thumbnail diklik, buka komponen `Dialog` (Modal) dari shadcn/ui.
    *   Di dalam modal, tampilkan grid atau list semua gambar yang dipilih.
    *   Karena `data.images` berisi objek `File`, kita perlu membuat URL sementara menggunakan `URL.createObjectURL(file)` agar bisa ditampilkan di tag `<img>`. Saya akan menangani *cleanup* URL ini juga.

**Rencana Teknis:**
1.  Import `Dialog, DialogContent, DialogHeader, DialogTitle` dari `@/Components/ui/dialog`.
2.  Buat state `isOpen` untuk modal.
3.  Buat fungsi helper untuk merender preview gambar yang aman memori.

Saya akan mulai mengerjakan perubahan ini sekarang.