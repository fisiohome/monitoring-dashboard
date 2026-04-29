# 🚀 Feature: Dashboard Reminders Data & Custom Styled Excel Export

## 📝 Deskripsi Singkat
Pull Request ini menambahkan halaman baru **"Reminders"** di dashboard untuk memantau data appointment reminder yang disesuaikan per tanggal dan tipe terapis. Selain itu, PR ini memperkenalkan fungsionalitas ekspor data Excel kustom yang didesain agar terlihat rapi dan elegan (mirip dengan implementasi script Python), lengkap dengan tab **Summary** tambahan. 

## ✨ Fitur & Perubahan Utama

### 1. Halaman & UI Baru
- **Sidebar Menu** (`lib/constants/sidebar.ts`): Menambahkan navigasi `Reminders` (ikon Calendar) pada grup Monitoring.
- **Reminders Page** (`app/dashboard/reminders/page.tsx`): 
  - Membuat tabel interaktif untuk mem-preview data reminder (`therapist_name`, `email`, `type`, `status`, dan `appt_time_wib`).
  - Menambahkan filter dinamis berdasarkan **Date** (default H+1) dan **Therapist Type** (Both, Internal, External).
  - Dilengkapi fitur skeleton loading dan navigasi paginasi tabel (10, 25, 50, 100, 500, 1000 items per page).

### 2. Custom Excel Export (`exceljs`)
- Meng-install library baru `exceljs` (`package.json`) untuk mendobrak keterbatasan styling pada utilitas standar.
- **Kompatibilitas Belakang (Backward Compatibility)**: Meng-upgrade `ExportExcelButton.tsx` agar menerima prop opsional `onCustomExport`. Jika tidak diberikan, ekspor menggunakan cara lama (`xlsx`). Jika diberikan, akan menggunakan algoritma ekspor yang baru.
- **Custom Export Utils** (`lib/reminders-export.ts`): 
  - Mengonversi *timezone* UTC ke WIB.
  - Memberi warna latar (fills), font bold, border pada Header & Cells (mis. Warna spesifik untuk status `SCHEDULED`, `PAID`, `PENDING PATIENT APPROVAL`).
  - Melakukan *freeze panes* di baris A2.
  - Menghasilkan tab kedua (**Summary**) untuk mengakumulasi total status reminder/appointment secara otomatis.

### 3. API Integrations
- Menyiapkan tipe data respons (`ReminderDataItem`, `ReminderDataResponse`) di `lib/api/types.ts`.
- Menambahkan fungsi `fetchReminderData` di `lib/api/dashboard.ts` untuk melayani request data reminders dari *Backend*.

## 📂 File yang Berubah
- `package.json` & `bun.lockb`
- `lib/constants/sidebar.ts`
- `lib/api/types.ts`
- `lib/api/dashboard.ts`
- `lib/reminders-export.ts` (Baru)
- `components/ui/ExportExcelButton.tsx`
- `app/dashboard/reminders/page.tsx` (Baru)

## 📸 Cara Testing
1. Masuk ke halaman `/dashboard/reminders`.
2. Ubah-ubah filter *Date* atau *Therapist Type*.
3. Verifikasi loading indikator dan tabel pagination.
4. Klik opsi **Export All Data** pada tombol Export, tunggu progress selesai, dan buka file `Reminders_{Tanggal}.xlsx` untuk mengecek *styling* dan *Summary sheet*.
