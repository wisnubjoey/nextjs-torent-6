# Rencana Penerapan Authorization (Admin)

Dokumen ini berisi langkah-langkah lengkap untuk menerapkan fitur admin authorization menggunakan `better-auth` di proyek ini.

## 1. Persiapan Database (Schema)
Kita perlu menambahkan kolom-kolom baru pada tabel `user` untuk mendukung fitur admin dan pemblokiran user.

**File:** `src/db/auth-schema.ts`
- Tambahkan kolom `role` (text)
- Tambahkan kolom `banned` (boolean)
- Tambahkan kolom `banReason` (text)
- Tambahkan kolom `banExpires` (timestamp)

**Langkah Selanjutnya:**
Jalankan migrasi database untuk menerapkan perubahan schema:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## 2. Konfigurasi Server (better-auth)
Aktifkan plugin admin pada konfigurasi server authentication.

**File:** `src/lib/auth.ts`
- Import `admin` dari `better-auth/plugins`.
- Tambahkan `admin()` ke dalam array `plugins`.
- Opsional: Tambahkan `adminUserIds` jika ingin menentukan admin secara hardcoded lewat ID.

## 3. Konfigurasi Client (better-auth client)
Aktifkan plugin admin pada sisi client agar bisa menggunakan fungsi-fungsi admin di frontend.

**File:** `src/lib/auth-client.ts`
- Import `adminClient` dari `better-auth/client/plugins`.
- Tambahkan `adminClient()` ke dalam array `plugins` pada `createAuthClient`.

## 4. Proteksi Route (Middleware)
Pastikan route admin hanya bisa diakses oleh user yang memiliki role `admin`.

**File:** `middleware.ts`
- Tambahkan pengecekan `session.user.role === "admin"` untuk path yang dimulai dengan `/admin`.
- Update `matcher` di config middleware untuk menyertakan `/admin/:path*`.

## 5. Cara Menjadi Admin
Ada dua cara untuk memberikan hak akses admin ke user:

### Cara A: Melalui Konfigurasi (Hardcoded)
Di `src/lib/auth.ts`, tambahkan ID user Anda ke dalam array `adminUserIds`:
```typescript
admin({
    adminUserIds: ["id-user-anda-disini"]
})
```

### Cara B: Melalui Database (Manual)
Update kolom `role` menjadi `"admin"` untuk user yang diinginkan langsung di database:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'email@anda.com';
```

## 6. Fitur yang Tersedia
Setelah diterapkan, Anda dapat menggunakan fungsi berikut melalui `authClient`:
- `authClient.admin.listUsers()`: Melihat daftar semua user.
- `authClient.admin.setRole()`: Mengubah role user lain.
- `authClient.admin.banUser()`: Memblokir user.
- `authClient.admin.unbanUser()`: Membuka blokir user.

---
*Catatan: Semua langkah di atas telah diimplementasikan dalam kode. Anda hanya perlu menjalankan migrasi database dan menentukan siapa yang menjadi admin pertama.*
