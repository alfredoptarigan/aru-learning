# Rencana Implementasi Sistem Pembelian & Jurnal Keuangan

Terima kasih atas tambahannya. Poin tentang **Jurnal Keuangan** sangat krusial untuk tracking arus uang (audit trail) dan rekapitulasi pendapatan nantinya. Saya telah memasukkannya ke dalam rencana.

Berikut adalah rencana teknis yang telah diperbarui:

## 1. Database & Struktur Data
Kita akan menambahkan tabel `financial_journals` selain tabel transaksi standar.

*   **`carts` & `cart_items`**: Keranjang belanja user.
*   **`orders` & `order_items`**: Pencatatan transaksi/invoice (Total, Promo, Status).
*   **`user_courses`**: Hak akses user terhadap course (User <-> Course).
*   **`financial_journals` (NEW)**: Buku besar pencatatan uang.
    *   Kolom: `type` (e.g., 'income', 'refund', 'failed_payment'), `amount`, `status`, `description`, `reference_id` (relasi ke order), `metadata` (simpan response JSON dari Stripe).
    *   Fungsi: Mencatat setiap pergerakan status pembayaran (Berhasil, Gagal, Pending) untuk keperluan rekap/laporan.

## 2. Backend Logic
*   **Cart & Checkout System**: Logic standar keranjang dan checkout.
*   **Journal Service**: Service khusus untuk mencatat log keuangan. Akan dipanggil saat:
    *   User memulai pembayaran (Log: *Payment Initiated*).
    *   Stripe Webhook menerima sukses (Log: *Payment Success/Income*).
    *   Stripe Webhook menerima gagal (Log: *Payment Failed*).

## 3. Frontend Implementation
*   **Navbar Cart**: Icon & Counter.
*   **Checkout Page**: Integrasi Stripe Elements & Promo Code.
*   **History/Invoice**: (Opsional tahap awal) User bisa melihat status order mereka.

## 4. Langkah Eksekusi

### Phase 1: Database Migrations
1.  Buat migration `user_courses`, `carts`, `cart_items`.
2.  Buat migration `orders`, `order_items`.
3.  **Buat migration `financial_journals`**.

### Phase 2: Cart System
1.  Implementasi Controller & Model untuk Cart.
2.  Update UI Navbar & Page Cart.

### Phase 3: Checkout, Stripe & Jurnal
1.  Setup Stripe SDK.
2.  Implementasi Checkout dengan Promo Code.
3.  **Integrasi Journal Logging** setiap kali ada attempt pembayaran.

### Phase 4: Webhook & Fulfillment
1.  Handle Stripe Webhook.
2.  Finalisasi status Order -> `PAID`.
3.  Catat `financial_journals` -> `INCOME`.
4.  Grant akses di `user_courses`.

Kita akan mulai dari **Phase 1: Database Migrations** untuk menyiapkan pondasi datanya. Apakah ini sudah sesuai?