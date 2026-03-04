"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Heart, AlertCircle, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import WeddingInvitation from "@/components/undangan/WeddingInvitation";

export default function PublicInvitationPage() {
    const params = useParams();
    const invitationId = params.id;

    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [supabase] = useState(() => createBrowserSupabaseClient());

    useEffect(() => {
        fetchInvitation();
    }, [invitationId]);

    const fetchInvitation = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from("invitations")
                .select("*")
                .eq("id", invitationId)
                .eq("status", "published")
                .single();

            if (fetchError) {
                if (fetchError.code === "PGRST116") {
                    setError("Undangan tidak ditemukan atau tidak tersedia");
                } else {
                    setError("Gagal memuat undangan");
                }
                return;
            }

            setInvitation(data);
        } catch (err) {
            console.error("Error fetching invitation:", err);
            setError("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/undangan/${invitationId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast({
            title: "Link Salin!",
            description: "Link undangan telah disalin ke clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareWhatsApp = () => {
        const url = `${window.location.origin}/undangan/${invitationId}`;
        const text = `Halo! Kami mengundang Anda di pernikahan kami. Silakan buka undangan digital ini: ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    const handleShareFacebook = () => {
        const url = `${window.location.origin}/undangan/${invitationId}`;
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            "_blank",
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Heart className="w-12 h-12 text-rose-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">Loading undangan...</p>
                </div>
            </div>
        );
    }

    if (error || !invitation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center px-4">
                <Card className="w-full max-w-md border-none shadow-lg">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {error || "Undangan tidak ditemukan"}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Kemungkinan undangan telah dihapus atau belum dipublikasikan
                        </p>
                        <Button
                            onClick={() => (window.location.href = "/")}
                            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                        >
                            Kembali ke Beranda
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Share Header */}
            <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Heart className="w-6 h-6 text-rose-600" />
                            <span className="font-semibold text-gray-900">{invitation.title}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleCopyLink}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Tersalin
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Salin Link
                                    </>
                                )}
                            </Button>

                            <div className="hidden sm:flex items-center gap-2">
                                <Button
                                    onClick={handleShareWhatsApp}
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                    WhatsApp
                                </Button>
                                <Button
                                    onClick={handleShareFacebook}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Facebook
                                </Button>
                            </div>

                            {/* Mobile Menu */}
                            <div className="sm:hidden">
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleShareWhatsApp}
                                        size="sm"
                                        className="text-xs"
                                    >
                                        <Share2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invitation Content */}
            <div className="py-8">
                <div className="max-w-2xl mx-auto">
                    <WeddingInvitation invitation={invitation} />
                </div>
            </div>

            {/* Share Footer */}
            <div className="bg-white border-t py-6">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-gray-600 mb-4">
                        Bagikan undangan ini dengan teman dan keluarga
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button
                            onClick={handleCopyLink}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Salin Link
                        </Button>
                        <Button
                            onClick={handleShareWhatsApp}
                            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            Bagikan ke WhatsApp
                        </Button>
                        <Button
                            onClick={handleShareFacebook}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            Bagikan ke Facebook
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
