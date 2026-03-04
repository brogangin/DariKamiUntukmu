"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

const AuthContext = createContext({ user: null, supabase: null });

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProviderClient({ initialUser = null, children }) {
    const [supabase] = useState(() => createBrowserSupabaseClient());
    const [user, setUser] = useState(initialUser ?? null);

    useEffect(() => {
        // Subscribe to auth changes to keep client state in sync
        const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            // unsubscribe safely for different helper shapes
            try {
                subscription?.subscription?.unsubscribe?.();
            } catch (e) {
                try {
                    subscription?.unsubscribe?.();
                } catch (_) {}
            }
        };
    }, [supabase]);

    return <AuthContext.Provider value={{ user, supabase }}>{children}</AuthContext.Provider>;
}
