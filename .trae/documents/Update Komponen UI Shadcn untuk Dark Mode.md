Saya telah melakukan audit terhadap komponen UI di direktori `resources/js/Components/ui` dan menemukan beberapa komponen yang belum sepenuhnya mendukung Dark Mode, terutama pada penggunaan border statis (`border-black`), background (`bg-white`), dan shadow statis.

Berikut adalah rencana perbaikan menyeluruh untuk setiap komponen:

1.  **Card (`ui/card.tsx`)**:
    *   Mengubah `border-black` menjadi `border-black dark:border-white`.
    *   Mengubah `bg-white` menjadi `bg-white dark:bg-gray-800`.
    *   Menambahkan shadow putih untuk dark mode: `dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`.
    *   Menyesuaikan warna teks: `text-card-foreground dark:text-gray-100`.

2.  **Input (`ui/input.tsx`)**:
    *   Mengubah `border-black` menjadi `dark:border-white`.
    *   Mengubah `bg-white` menjadi `dark:bg-gray-800`.
    *   Menambahkan shadow putih untuk dark mode.
    *   Menyesuaikan warna teks dan placeholder: `text-base dark:text-white placeholder:text-muted-foreground dark:placeholder:text-gray-400`.

3.  **Select (`ui/select.tsx`)**:
    *   **Trigger**: Menyesuaikan border, background, teks, dan shadow agar sesuai dengan tema gelap.
    *   **Content**: Mengubah background dropdown menu (`bg-white` -> `dark:bg-gray-800`), border, dan warna teks item.
    *   **Item**: Menyesuaikan warna hover (`hover:bg-gray-100` -> `dark:hover:bg-gray-700`).

4.  **Dialog/Modal (`ui/dialog.tsx`)**:
    *   **Overlay**: Sudah cukup baik (`bg-black/80`), tapi perlu memastikan kontras.
    *   **Content**: Mengubah background (`bg-background` -> `dark:bg-gray-900`), border, dan shadow.
    *   **Close Button**: Menyesuaikan warna ikon close agar terlihat di background gelap.

5.  **Button (`ui/button.tsx`)**:
    *   Memperbarui varian `outline`, `secondary`, dan `ghost` agar memiliki kontras yang baik di dark mode (border putih, hover effect yang sesuai).
    *   Menyesuaikan shadow pixel art agar berwarna putih di mode gelap.

Saya akan mengeksekusi perbaikan ini satu per satu mulai dari komponen yang paling dasar (Card & Input) hingga yang lebih kompleks (Select & Dialog).