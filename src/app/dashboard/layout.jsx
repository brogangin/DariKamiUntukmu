import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthProviderClient from "@/components/AuthProviderClient";

export const metadata = {
    title: "Dashboard",
};

export default async function DashboardLayout({ children }) {
    // create a Supabase server component client using cookies from the request
    // `cookies()` should be awaited in some Next.js versions/contexts before using
    // to avoid the runtime error about sync dynamic APIs.
    const cookieStore = await cookies();
    // Some versions of @supabase/auth-helpers-nextjs expect `cookies` to be a function
    // that returns the cookie store when called. Newer Next.js runtimes may require
    // awaiting `cookies()` first — so we await it here and pass a wrapper function
    // that returns the resolved store. This keeps compatibility across versions.
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    // If there is no session, redirect server-side before rendering children
    if (!session) {
        redirect("/sign-in");
    }

    // If authenticated, render the subtree wrapped with a client-side
    // AuthProvider which receives the initial user from the server.
    return <AuthProviderClient initialUser={session.user}>{children}</AuthProviderClient>;
}
