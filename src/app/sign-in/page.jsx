"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Mail, Lock, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";

const Page = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    // create a browser supabase client that will sync auth state with the server
    const [sb] = React.useState(() => createPagesBrowserClient());

    useEffect(() => {
        let mounted = true;

        async function checkSession() {
            try {
                const { data } = await sb.auth.getSession();
                const session = data?.session;
                if (session?.user) {
                    // if already logged in, redirect to dashboard
                    router.replace("/dashboard");
                }
            } catch (err) {
                // ignore; don't block the form
                console.error("Error checking session on sign-in page:", err);
            }
        }

        checkSession();

        const { data: subscription } = sb.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                // reactive redirect when user signs in
                router.replace("/dashboard");
            }
        });

        return () => {
            mounted = false;
            try {
                subscription?.subscription?.unsubscribe?.();
            } catch (e) {
                try {
                    subscription?.unsubscribe?.();
                } catch (_) {}
            }
        };
    }, [router, sb]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error } = await sb.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                setError(error.message || "Terjadi kesalahan saat login.");
            } else {
                toast({
                    title: "Login Berhasil!",
                    description: "Selamat datang kembali.",
                });
                // Redirect to the dashboard page
                router.push("/dashboard");
            }
        } catch (err) {
            setError(err?.message || "Terjadi kesalahan saat login.");
        }

        setLoading(false);
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth
        toast({
            title: "Coming Soon",
            description: "Google login akan segera tersedia.",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center px-4">
            <Card className="w-full max-w-md shadow-2xl border-none">
                <CardContent className="p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <Heart className="w-10 h-10 text-rose-600 group-hover:text-rose-500" />
                            <span className="text-3xl font-bold text-gray-900">DigiWedding</span>
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
                            Masuk ke Akun Anda
                        </h2>
                        <p className="text-gray-600">Kelola undangan digital Anda</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="nama@email.com"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-6"
                        >
                            {loading ? "Memproses..." : "Masuk"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Atau masuk dengan</span>
                        </div>
                    </div>

                    {/* Google Login */}
                    <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full py-6 border-2"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Masuk dengan Google
                    </Button>

                    {/* Register Link */}
                    <p className="mt-6 text-center text-gray-600">
                        Belum punya akun?{" "}
                        <Link
                            href="/sign-up"
                            className="font-medium text-rose-600 hover:text-rose-500"
                        >
                            Daftar sekarang
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
