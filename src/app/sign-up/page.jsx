"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Mail, Lock, User, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { register } from "@/lib/auth";

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Password tidak cocok");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password minimal 6 karakter");
            setLoading(false);
            return;
        }

        const result = await register(formData.name, formData.email, formData.password);

        if (result.success) {
            toast({
                title: "Registrasi Berhasil!",
                description: "Selamat datang di DigiWedding.",
            });
            router.push("/dashboard");
        } else {
            setError(result.error || "Terjadi kesalahan saat registrasi.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md shadow-2xl border-none">
                <CardContent className="p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <Heart className="w-10 h-10 text-rose-600 group-hover:text-rose-500" />
                            <span className="text-3xl font-bold text-gray-900">DigiWedding</span>
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
                            Buat Akun Baru
                        </h2>
                        <p className="text-gray-600">Mulai buat undangan digital Anda</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nama Anda"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

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
                                    placeholder="Minimal 6 karakter"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Ulangi password"
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
                            {loading ? "Memproses..." : "Daftar Sekarang"}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-gray-600">
                        Sudah punya akun?{" "}
                        <Link
                            href="/sign-in"
                            className="font-medium text-rose-600 hover:text-rose-500"
                        >
                            Masuk di sini
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterPage;
