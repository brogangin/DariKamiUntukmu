-- ============================================
-- RLS Policy untuk Undangan Publik
-- ============================================
-- Jalankan query ini di Supabase SQL Editor untuk membuat policy
-- yang memungkinkan undangan dengan status "published" diakses siapa saja

-- Policy 1: Siapa saja bisa membaca undangan yang sudah published
CREATE POLICY "public_can_read_published_invitations" ON public.invitations
  FOR SELECT
  USING (status = 'published');

-- Policy 2: Hanya pemilik yang bisa membaca undangan draft/pending
CREATE POLICY "users_can_read_own_draft_invitations" ON public.invitations
  FOR SELECT
  USING (auth.uid() = user_id AND (status = 'draft' OR status = 'pending_payment'));

-- Verifikasi policies sudah aktif:
-- SELECT * FROM pg_policies WHERE tablename = 'invitations';

-- ============================================
-- CATATAN:
-- ============================================
-- Jika Anda sudah membuat policies sebelumnya, mungkin ada duplicate.
-- Anda bisa menghapus policy lama terlebih dahulu dengan:
-- DROP POLICY IF EXISTS "policy_name" ON public.invitations;
-- 
-- Kemudian jalankan CREATE POLICY baru di atas
-- ============================================
