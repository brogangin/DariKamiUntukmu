import { handleAuth } from "@supabase/auth-helpers-nextjs";

// Forward all methods to Supabase auth helper route handler.
// This endpoint is required for the client helper (createBrowserSupabaseClient)
// to sync auth state (set cookies) so server-side checks can read the session.
export const GET = handleAuth;
export const POST = handleAuth;
export const PUT = handleAuth;
export const DELETE = handleAuth;
