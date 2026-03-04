# Link Undangan Publik - Dokumentasi

## Overview

Fitur ini memungkinkan pengguna untuk membagikan link undangan digital mereka kepada siapa saja (publik) tanpa perlu login. Undangan yang sudah **published** dan sudah dibayar bisa diakses siapa saja melalui link unik.

## Fitur

### 1. **Link Publik Unik**

- Setiap undangan memiliki link unik di format: `/undangan/{invitation_id}`
- Contoh: `https://dari-kami-untukmu.com/undangan/abc-123-def-456`

### 2. **Akses Kontrol**

- ✅ Publik bisa melihat undangan yang sudah **published**
- ✅ Publik bisa share ke WhatsApp, Facebook
- ✅ Publik bisa copy link undangan
- ❌ Hanya pemilik bisa edit undangan
- ❌ Hanya pemilik bisa lihat undangan draft/pending

### 3. **Tombol Share**

Di dashboard, untuk undangan yang sudah published, ada 3 tombol:

- **Lihat Publik** - Buka undangan dalam tab baru
- **Salin Link** - Copy link ke clipboard
- **WhatsApp** - Share langsung ke WhatsApp dengan pesan template

## Setup yang Diperlukan

### Step 1: Update RLS Policies di Supabase

Buka **SQL Editor** di Supabase dan jalankan file:
[RLS_POLICY_PUBLIC_INVITATION.sql](./RLS_POLICY_PUBLIC_INVITATION.sql)

Atau jalankan query ini:

```sql
-- Policy 1: Siapa saja bisa membaca undangan yang sudah published
CREATE POLICY "public_can_read_published_invitations" ON public.invitations
  FOR SELECT
  USING (status = 'published');

-- Policy 2: Hanya pemilik yang bisa membaca undangan draft/pending
CREATE POLICY "users_can_read_own_draft_invitations" ON public.invitations
  FOR SELECT
  USING (auth.uid() = user_id AND (status = 'draft' OR status = 'pending_payment'));
```

## Alur Pembagian Undangan

```
┌─ Dashboard Pengguna
│   └─ Undangan yang Published
│       ├─ Tombol "Lihat Publik"
│       ├─ Tombol "Salin Link" → Salin ke clipboard
│       └─ Tombol "WhatsApp" → Share ke teman
│
├─ Link Publik (/undangan/{id})
│   ├─ Bisa diakses siapa saja (publik)
│   ├─ Tombol "Salin Link"
│   ├─ Tombol "Bagikan ke WhatsApp"
│   ├─ Tombol "Bagikan ke Facebook"
│   └─ Share footer dengan tombol share
│
└─ Tamu/Keluarga
    └─ Buka link untuk melihat undangan
```

## File yang Relevan

### Frontend

- **[/src/app/undangan/[id]/page.jsx](./src/app/undangan/[id]/page.jsx)** - Halaman publik undangan
- **[/src/app/dashboard/page.jsx](./src/app/dashboard/page.jsx)** - Dashboard dengan tombol share

### Database

- **[RLS_POLICY_PUBLIC_INVITATION.sql](./RLS_POLICY_PUBLIC_INVITATION.sql)** - RLS policy untuk akses publik

## Cara Menggunakan

### Untuk Pemilik Undangan:

1. Buat undangan di dashboard → Edit undangan
2. Klik "Lanjut ke Pembayaran" → Bayar
3. Setelah pembayaran sukses, undangan status menjadi **published**
4. Di dashboard, klik tombol:
    - **Lihat Publik** - untuk preview
    - **Salin Link** - untuk copy link
    - **WhatsApp** - untuk share ke WhatsApp

### Untuk Tamu/Keluarga:

1. Terima link undangan (via WhatsApp, SMS, Email, dll)
2. Buka link di browser
3. Lihat undangan digital dengan fitur share ke teman

## Fitur Share

### Copy Link

- Menyalin URL unik ke clipboard
- Toast notification saat berhasil copied

### WhatsApp

- Share langsung ke WhatsApp
- Pesan otomatis dengan link undangan
- Penerima bisa langsung klik dan lihat

### Facebook

- Share ke Facebook dengan link preview
- Tampilan menarik di feed

## Keamanan

✅ **RLS Policy**: Hanya undangan dengan status `published` yang bisa diakses publik
✅ **Authentication**: Halaman publik tidak memerlukan login
✅ **Data Privacy**: Hanya data undangan yang ditampilkan, tidak ada data user lain
✅ **URL Protection**: Link unik dengan invitation_id sebagai identifier

## Mobile Responsive

✅ Full responsive design
✅ Share buttons optimal untuk mobile
✅ Portrait layout untuk preview undangan
✅ Bottom share footer yang mudah diakses

## Troubleshooting

### Link tidak bisa diakses publik

- Pastikan undangan status sudah **published** (bukan draft/pending)
- Pastikan RLS policy sudah ditambahkan (cek di SQL Editor)
- Clearkan browser cache

### Share button tidak muncul

- Hanya undangan dengan status **published** yang punya share buttons
- Undangan draft/pending hanya bisa dilihat pemilik

### Copy link tidak work

- Periksa browser console untuk error
- Pastikan browser support Clipboard API

## Future Enhancement

- [ ] QR Code generator untuk setiap undangan
- [ ] Analytics tracking (berapa kali link diklik, dibuka dari mana)
- [ ] Custom link (contoh: dari-kami-untukmu.com/undangan/adam-hawa)
- [ ] Reset link untuk keamanan
- [ ] Expiration date untuk link
