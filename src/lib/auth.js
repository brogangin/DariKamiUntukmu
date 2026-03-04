import { supabase } from "./supabaseClient";

/**
 * Attempt to sign in a user with email & password using Supabase.
 * Returns an object: { success: boolean, data?: any, error?: string }
 */
export async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, error: error.message || String(error) };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err?.message || String(err) };
    }
}

/**
 * Register a new user with Supabase using email & password.
 * Stores additional user metadata (name) if provided.
 * Returns { success: boolean, data?, error? }
 */
export async function register(name, email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (error) {
            return { success: false, error: error.message || String(error) };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err?.message || String(err) };
    }
}

// Optional: export other auth helpers here in future (logout, oauth, etc.)
