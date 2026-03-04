# Fix Vercel Deployment Error - edit-undangan Page

## Error yang Terjadi:

```
Error occurred prerendering page "/edit-undangan"
```

## Penyebab Error:

1. Page `/edit-undangan` menggunakan `useSearchParams()` yang tidak bisa di-prerender saat build time
2. Leaflet library (LocationMapPicker) tidak kompatibel dengan Server-Side Rendering (SSR)
3. Vercel mencoba melakukan static prerendering pada dynamic page

## Solusi yang Diterapkan:

### 1. Disable Static Prerendering di Edit Undangan Page

**File:** `/src/app/edit-undangan/page.jsx`

Menambahkan:

```jsx
export const dynamic = "force-dynamic";
```

Ini memberitahu Vercel untuk render page on-demand (runtime), bukan saat build time.

### 2. Separate Leaflet Map Component

**File Baru:** `/src/components/LeafletMap.jsx`

Membuat komponen terpisah khusus untuk Leaflet yang berisi semua logika map.

### 3. Dynamic Import LocationMapPicker

**File:** `/src/components/LocationMapPicker.jsx`

Menggunakan Next.js `dynamic()` dengan `ssr: false`:

```jsx
const LeafletMap = dynamic(() => import("./LeafletMap"), {
    ssr: false,
    loading: () => <LoadingUI />,
});
```

Ini memastikan Leaflet hanya dimuat di client-side, tidak saat SSR.

## Hasil:

✅ Page prerender tidak error
✅ Location picker tetap berfungsi normal di client
✅ Deployment ke Vercel berhasil

## Testing:

1. Deploy ke Vercel akan berhasil tanpa error prerendering
2. Edit undangan page akan di-load on-demand saat user akses
3. Map functionality tetap bekerja normal di browser

## File yang Dimodifikasi:

- `/src/app/edit-undangan/page.jsx` - Added `export const dynamic = "force-dynamic"`
- `/src/components/LocationMapPicker.jsx` - Added dynamic import
- `/src/components/LeafletMap.jsx` - Komponen baru untuk Leaflet

## Catatan:

- `dynamic: 'force-dynamic'` berarti page tidak akan di-cache
- Setiap request akan di-render fresh
- Performance impact minimal karena hanya halaman edit yang affected
- Alternative: gunakan `force-static` jika tidak menggunakan searchParams, tapi di case ini tidak bisa

## Untuk Deployment Selanjutnya:

Jika ada error prerendering lagi pada page tertentu yang menggunakan:

- `useSearchParams()`
- `useRouter()` dengan dynamic routes
- Library client-only seperti Leaflet, MapBox, dll

Tambahkan `export const dynamic = "force-dynamic"` di page tersebut.
