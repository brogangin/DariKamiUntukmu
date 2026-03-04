# Setup Supabase Storage untuk Upload Foto Pengantin

## Langkah-Langkah Setup:

### 1. Buat Bucket di Supabase

- Login ke [Supabase Dashboard](https://app.supabase.com)
- Pilih project Anda
- Jalan ke **Storage** → **Buckets**
- Klik **Create a new bucket**
- Nama bucket: `invitations`
- **Penting**: Pilih **Public bucket** (agar foto bisa diakses public tanpa auth)
- Klik **Create bucket**

### 2. Set Policy (Tidak wajib karena Public Bucket)

Jika ingin lebih aman, buat policy:

```sql
-- Allow public read access to all files
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT
USING (bucket_id = 'invitations');

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated upload" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'invitations'
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own files
CREATE POLICY "Allow delete own files" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'invitations'
  AND auth.uid() = owner
);
```

### 3. Test Upload

1. Buka Edit Undangan
2. Di bagian "Foto Pengantin Wanita" dan "Foto Pengantin Pria"
3. Klik tombol **"Pilih Foto"**
4. Pilih gambar dari perangkat
5. Foto otomatis terupload ke Supabase Storage
6. URL disimpan di database

### 4. Struktur Folder di Storage

```
invitations/
├── undangan/pengantin/
│   ├── 1677123456-abc123.jpg
│   ├── 1677123457-def456.png
│   └── ...
└── ...
```

### 5. File Size & Type Limits

- **Max Size**: 5MB per file
- **Allowed Types**: JPG, PNG, GIF, WebP, etc.
- Validasi dilakukan di ImageUploader component

### 6. API Endpoint

- **Route**: `/api/upload`
- **Method**: POST
- **Input**: FormData dengan fields `file` dan `folder`
- **Output**: JSON dengan `{ url: "public_url" }`

### 7. Troubleshooting

**Error: "API error: Bucket invitations not found"**

- Pastikan bucket `invitations` sudah dibuat
- Pastikan bucket di-set sebagai **Public**

**Error: "Upload failed"**

- Cek ukuran file (max 5MB)
- Cek tipe file (harus image)
- Cek internet connection

**Foto tidak muncul di preview undangan**

- Pastikan URL disimpan dengan benar
- Cek di browser console untuk error
- Clear browser cache

## Environment Variables yang Diperlukan

File `.env.local` sudah harus memiliki:

```
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

Service Role Key digunakan server-side untuk upload tanpa validasi RLS.
