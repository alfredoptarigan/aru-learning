Untuk menampilkan notifikasi error (toast/sonner) di frontend ketika terjadi error di backend, kita perlu melakukan beberapa hal:

1.  **Install Sonner**: Ini adalah library toast yang sangat bagus dan sesuai dengan stack Shadcn kita.
2.  **Setup Flash Messages di HandleInertiaRequests**: Middleware ini bertugas mengirim pesan `success` atau `error` dari session Laravel ke props Inertia.
3.  **Setup Toaster di Layout**: Komponen `Toaster` harus dipasang di layout utama agar bisa muncul di semua halaman.
4.  **Update `CreateCourse.tsx`**: Menggunakan `useEffect` untuk memantau props `flash` atau `errors` dan memunculkan toast.

Saat ini, `CourseController` Anda sudah mengirim `withErrors(['error' => ...])` atau `with('success', ...)` saat redirect. Namun, frontend belum "mendengarkan" pesan ini.

### Rencana Implementasi

1.  **Install Sonner**: `npm install sonner`.
2.  **Setup Shadcn Sonner**: `npx shadcn@latest add sonner`.
3.  **Styling Sonner**: Sesuaikan dengan tema Pixel Art (border tebal, font VT323).
4.  **Middleware**: Pastikan `HandleInertiaRequests.php` mengirim flash messages.
5.  **Frontend Logic**:
    -   Pasang `<Toaster />` di `AuthenticatedLayout` (atau layout utama).
    -   Tambahkan logic di `CreateCourse.tsx` (atau global hook) untuk memunculkan toast saat ada flash message.

Apakah Anda setuju dengan rencana ini?