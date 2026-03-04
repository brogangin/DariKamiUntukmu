"use client";

import { useAuth } from "@/components/AuthProviderClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, LogOut, Plus, Clock, Share2, Copy, Check, Eye } from "lucide-react";

export default function Page() {
    const { user, supabase } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);
    const [myInvitations, setMyInvitations] = useState([]);
    const [pendingInvitations, setPendingInvitations] = useState([]);

    // Fetch data
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch templates
                const { data: templatesData, error: templatesError } = await supabase
                    .from("templates")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (templatesError) throw templatesError;
                setTemplates(templatesData || []);

                // Fetch user's invitations
                const { data: invitationsData, error: invitationsError } = await supabase
                    .from("invitations")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (invitationsError) throw invitationsError;
                setMyInvitations(invitationsData || []);

                // Fetch pending (unpaid) invitations
                const { data: pendingData, error: pendingError } = await supabase
                    .from("invitations")
                    .select(
                        `
                        *,
                        transactions:transactions(status)
                    `,
                    )
                    .eq("user_id", user.id)
                    .eq("status", "pending_payment")
                    .order("created_at", { ascending: false });

                if (pendingError) throw pendingError;
                setPendingInvitations(pendingData || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                toast({
                    title: "Error",
                    description: "Gagal memuat data",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, supabase]);

    if (!user) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p>Loading...</p>
            </div>
        );
    }

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                toast({ title: "Logout gagal", description: error.message || String(error) });
                return;
            }
            toast({ title: "Logout", description: "Anda telah keluar." });
            router.replace("/sign-in");
        } catch (err) {
            toast({ title: "Logout error", description: err?.message || String(err) });
        }
    };

    const handleCreateInvitation = (templateId) => {
        toast({
            title: "Membuat Undangan",
            description: "Mengarahkan ke halaman pembuatan undangan...",
        });
        router.push(`/edit-undangan?template=${templateId}`);
    };

    const handleCopyLink = (invitationId, e) => {
        e.stopPropagation();
        const url = `${typeof window !== "undefined" ? window.location.origin : ""}/undangan/${invitationId}`;
        navigator.clipboard.writeText(url);
        toast({
            title: "Link Tersalin!",
            description: "Link undangan telah disalin ke clipboard",
        });
    };

    const handleShareWhatsApp = (invitationId, title, e) => {
        e.stopPropagation();
        const url = `${typeof window !== "undefined" ? window.location.origin : ""}/undangan/${invitationId}`;
        const text = `Halo! Kami mengundang Anda di pernikahan ${title}. Silakan buka undangan digital ini: ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    const handlePreviewPublic = (invitationId, e) => {
        e.stopPropagation();
        window.open(`/undangan/${invitationId}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Heart className="w-8 h-8 text-rose-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                                <p className="text-sm text-gray-600">
                                    Selamat datang, {user?.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={() => router.push("/")} variant="outline">
                                Ke Beranda
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Keluar
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading data...</p>
                    </div>
                ) : (
                    <>
                        {/* Section: Buat Undangan Baru */}
                        <section>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Plus className="w-6 h-6 text-rose-600" />
                                    Buat Undangan Baru
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Pilih kategori undangan untuk memulai
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.length > 0 ? (
                                    templates.map((template) => (
                                        <Card
                                            key={template.id}
                                            className="overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            <div className="relative w-full aspect-[3/4] bg-gray-200">
                                                {template.image_url ? (
                                                    <img
                                                        src={template.image_url}
                                                        alt={template.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-200 to-pink-200">
                                                        <Heart className="w-12 h-12 text-rose-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                                    {template.name}
                                                </h3>
                                                {template.description && (
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        {template.description}
                                                    </p>
                                                )}
                                                <Button
                                                    onClick={() =>
                                                        handleCreateInvitation(template.id)
                                                    }
                                                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Buat Undangan
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <p className="text-gray-600">
                                            Tidak ada template yang tersedia
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Section: Undangan Anda */}
                        <section>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Undangan Anda</h2>
                                <p className="text-gray-600 mt-1">
                                    Daftar undangan yang telah Anda buat
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myInvitations.length > 0 ? (
                                    myInvitations.map((invitation) => (
                                        <Card
                                            key={invitation.id}
                                            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                            onClick={() =>
                                                router.push(`/edit-undangan?id=${invitation.id}`)
                                            }
                                        >
                                            <div className="relative w-full aspect-[3/4] bg-gray-200">
                                                {invitation.image_thumbnail ? (
                                                    <img
                                                        src={invitation.image_thumbnail}
                                                        alt={invitation.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                                                        <Heart className="w-12 h-12 text-purple-400" />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold">
                                                    <span
                                                        className={
                                                            invitation.status === "published"
                                                                ? "text-green-600"
                                                                : invitation.status ===
                                                                    "pending_payment"
                                                                  ? "text-yellow-600"
                                                                  : "text-gray-600"
                                                        }
                                                    >
                                                        {invitation.status === "published"
                                                            ? "Dipublikasikan"
                                                            : invitation.status ===
                                                                "pending_payment"
                                                              ? "Menunggu Pembayaran"
                                                              : "Draft"}
                                                    </span>
                                                </div>
                                            </div>
                                            <CardContent className="p-4 space-y-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                                        {invitation.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {invitation.bride_name &&
                                                            invitation.groom_name && (
                                                                <>
                                                                    {invitation.bride_name} &
                                                                    {invitation.groom_name}
                                                                </>
                                                            )}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Dibuat:{" "}
                                                        {new Date(
                                                            invitation.created_at,
                                                        ).toLocaleDateString("id-ID")}
                                                    </p>
                                                </div>

                                                {invitation.status === "published" && (
                                                    <div className="pt-2 border-t space-y-2 flex flex-col gap-2">
                                                        <Button
                                                            onClick={(e) =>
                                                                handlePreviewPublic(
                                                                    invitation.id,
                                                                    e,
                                                                )
                                                            }
                                                            size="sm"
                                                            variant="outline"
                                                            className="w-full text-xs flex items-center justify-center gap-1"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            Lihat Publik
                                                        </Button>
                                                        <Button
                                                            onClick={(e) =>
                                                                handleCopyLink(invitation.id, e)
                                                            }
                                                            size="sm"
                                                            className="w-full text-xs flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                            Salin Link
                                                        </Button>
                                                        <Button
                                                            onClick={(e) =>
                                                                handleShareWhatsApp(
                                                                    invitation.id,
                                                                    invitation.title,
                                                                    e,
                                                                )
                                                            }
                                                            size="sm"
                                                            className="w-full text-xs flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600"
                                                        >
                                                            <Share2 className="w-3 h-3" />
                                                            WhatsApp
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12 bg-white rounded-lg">
                                        <p className="text-gray-600">
                                            Belum ada undangan yang dibuat
                                        </p>
                                        <Button
                                            onClick={() =>
                                                document
                                                    .querySelector("[data-template-scroll]")
                                                    ?.scrollIntoView({
                                                        behavior: "smooth",
                                                    })
                                            }
                                            variant="link"
                                            className="text-rose-600 mt-2"
                                        >
                                            Buat sekarang
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Section: Pending Pembayaran */}
                        {pendingInvitations.length > 0 && (
                            <section>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <Clock className="w-6 h-6 text-yellow-600" />
                                        Menunggu Pembayaran
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        Undangan yang belum selesai proses pembayaran
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pendingInvitations.map((invitation) => (
                                        <Card
                                            key={invitation.id}
                                            className="overflow-hidden border-yellow-200 hover:shadow-lg transition-shadow"
                                        >
                                            <div className="relative w-full aspect-[3/4] bg-gray-200 border-b-4 border-yellow-400">
                                                {invitation.image_thumbnail ? (
                                                    <img
                                                        src={invitation.image_thumbnail}
                                                        alt={invitation.title}
                                                        className="w-full h-full object-cover opacity-75"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-200 to-orange-200">
                                                        <Clock className="w-12 h-12 text-yellow-600" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg bg-yellow-600 px-4 py-2 rounded-lg">
                                                        Menunggu Pembayaran
                                                    </span>
                                                </div>
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                                    {invitation.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    {invitation.bride_name &&
                                                        invitation.groom_name && (
                                                            <>
                                                                {invitation.bride_name} &
                                                                {invitation.groom_name}
                                                            </>
                                                        )}
                                                </p>
                                                <Button
                                                    onClick={() =>
                                                        router.push(
                                                            `/payment?invitation=${invitation.id}`,
                                                        )
                                                    }
                                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                                                >
                                                    Selesaikan Pembayaran
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
