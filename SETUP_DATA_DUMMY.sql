-- ============================================
-- SQL Data Dummy untuk Testing
-- ============================================

-- CATATAN: Ganti 'USER_ID_ANDA_DI_SINI' dengan ID user Anda dari auth.users
-- Anda bisa cek di Supabase Dashboard > Authentication > Users

-- 1. Insert Template (jika belum ada)
INSERT INTO public.templates (id, name, description, image_url, category)
VALUES (
  '049b1de2-7781-48be-a372-13aef39b4520',
  'Template Undangan Modern',
  'Template undangan pernikahan modern dengan desain elegan',
  'https://images.unsplash.com/photo-1707193392409-1762d0dafbf5?w=500&h=667&fit=crop',
  'wedding'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Invitation (Ganti USER_ID_ANDA_DI_SINI)
INSERT INTO public.invitations (
  user_id,
  template_id,
  title,
  bride_name,
  groom_name,
  bride_image_url,
  groom_image_url,
  bride_parents,
  groom_parents,
  bride_instagram,
  bride_facebook,
  groom_instagram,
  groom_facebook,
  wedding_date,
  ceremony_time,
  ceremony_location,
  reception_time,
  reception_location,
  love_story,
  closing_message,
  status,
  image_thumbnail
)
VALUES (
  'USER_ID_ANDA_DI_SINI',
  '049b1de2-7781-48be-a372-13aef39b4520',
  'Pernikahan Adam & Hawa',
  'Hawa',
  'Adam',
  'https://images.unsplash.com/photo-1707193392409-1762d0dafbf5?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1707193392375-a2b283a0713d?w=300&h=300&fit=crop',
  'Bapak Abdullah & Ibu Aisyah',
  'Bapak Muhammad & Ibu Fatimah',
  '@hawa_bride',
  'hawa.profile',
  '@adam_groom',
  'adam.profile',
  '2025-08-15',
  '12:00 - 13:00 WIB',
  'Jatim Expo, Grand City Convention Center',
  '15:00 - 17:00 WIB',
  'Jatim Expo, Grand City Convention Center',
  'Pertemuan kami dimulai pada suatu sore yang cerah di sebuah taman kota. Adam sedang membaca buku favoritnya di bangku taman, sementara Hawa berjalan menikmati indahnya sore sambil membawa kamera untuk memotret pemandangan. Tanpa sengaja, Hawa menjatuhkan lensanya tepat di depan bangku Adam. Dengan sigap, Adam mengambil lensa tersebut dan mengembalikannya sambil tersenyum. Dari situlah percakapan dimulai, membicarakan tentang buku dan fotografi.',
  'Apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami, kami menucapkan terima kasih yang sebesar-besarnya.',
  'published',
  'https://images.unsplash.com/photo-1707193392409-1762d0dafbf5?w=300&h=400&fit=crop'
)
RETURNING id;

-- 3. Insert Transaction (COPY invitation_id dari output query #2)
-- Ganti 'INVITATION_ID_DARI_STEP_2' dan 'USER_ID_ANDA_DI_SINI'
INSERT INTO public.transactions (
  user_id,
  invitation_id,
  amount,
  status,
  payment_method,
  payment_id
)
VALUES (
  'USER_ID_ANDA_DI_SINI',
  'INVITATION_ID_DARI_STEP_2',
  50000,
  'paid',
  'credit_card',
  'dummy-payment-token-12345'
);

-- ============================================
-- Cara Menggunakan Script Ini:
-- ============================================
-- 1. Login ke Supabase Dashboard
-- 2. Masuk ke SQL Editor
-- 3. Buat query baru dan copy-paste script ini
-- 4. Ganti 'USER_ID_ANDA_DI_SINI' dengan user_id Anda dari auth.users
-- 5. Jalankan queries satu per satu:
--    - Query 1: Insert template
--    - Query 2: Insert invitation, COPY invitation_id dari hasil
--    - Query 3: Ganti INVITATION_ID_DARI_STEP_2 dengan id dari step 2
-- 6. Jalankan query 3 untuk insert transaction
-- 7. Selesai! Sekarang Anda bisa login dan langsung edit undangan
