"use client";

import { useAuth } from "@/components/AuthProviderClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Heart, Save, X, Home, Eye, MapPin } from "lucide-react";
import WeddingInvitation from "@/components/undangan/WeddingInvitation";
import LocationMapPicker from "@/components/LocationMapPicker";
import ImageUploader from "@/components/ImageUploader";

// Disable prerendering for this dynamic page
export const dynamic = "force-dynamic";

export default function EditUndanganPage() {
    const { user, supabase } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const invitationId = searchParams.get("id");
    const templateId = searchParams.get("template");

    const [template, setTemplate] = useState(null);
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(null); // "ceremony" atau "reception"
    const [formData, setFormData] = useState({
        title: "",
        bride_name: "",
        groom_name: "",
        bride_image_url: "",
        groom_image_url: "",
        bride_parents: "",
        groom_parents: "",
        bride_instagram: "",
        bride_facebook: "",
        groom_instagram: "",
        groom_facebook: "",
        wedding_date: "",
        ceremony_start_time: "",
        ceremony_end_time: "",
        ceremony_location: "",
        reception_start_time: "",
        reception_end_time: "",
        reception_location: "",
        love_story: "",
        closing_message: "",
    });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    useEffect(() => {
        if (invitationId) {
            fetchInvitation();
        } else if (templateId) {
            fetchTemplate();
            createNewInvitation();
        } else {
            router.push("/dashboard");
        }
    }, [invitationId, templateId]);

    const fetchInvitation = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("invitations")
                .select("*")
                .eq("id", invitationId)
                .eq("user_id", user.id)
                .single();

            if (error) throw error;

            setInvitation(data);

            // Parse time ranges from ceremony_time and reception_time
            const parseCeremonyTime = (ceremonyTime) => {
                if (!ceremonyTime) return { start: "", end: "" };
                const match = ceremonyTime.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
                return match ? { start: match[1], end: match[2] } : { start: "", end: "" };
            };

            const parsedCeremony = parseCeremonyTime(data.ceremony_time);
            const parsedReception = parseCeremonyTime(data.reception_time);

            setFormData({
                title: data.title || "",
                bride_name: data.bride_name || "",
                groom_name: data.groom_name || "",
                bride_image_url: data.bride_image_url || "",
                groom_image_url: data.groom_image_url || "",
                bride_parents: data.bride_parents || "",
                groom_parents: data.groom_parents || "",
                bride_instagram: data.bride_instagram || "",
                bride_facebook: data.bride_facebook || "",
                groom_instagram: data.groom_instagram || "",
                groom_facebook: data.groom_facebook || "",
                wedding_date: data.wedding_date || "",
                ceremony_start_time: parsedCeremony.start,
                ceremony_end_time: parsedCeremony.end,
                ceremony_location: data.ceremony_location || "",
                reception_start_time: parsedReception.start,
                reception_end_time: parsedReception.end,
                reception_location: data.reception_location || "",
                love_story: data.love_story || "",
                closing_message: data.closing_message || "",
            });

            // Fetch template
            const { data: templateData } = await supabase
                .from("templates")
                .select("*")
                .eq("id", data.template_id)
                .single();

            if (templateData) {
                setTemplate(templateData);
            }
        } catch (err) {
            console.error("Error fetching invitation:", err);
            toast({
                title: "Error",
                description: "Gagal memuat data undangan",
            });
            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplate = async () => {
        try {
            const { data, error } = await supabase
                .from("templates")
                .select("*")
                .eq("id", templateId)
                .single();

            if (error) throw error;
            setTemplate(data);
        } catch (err) {
            console.error("Error fetching template:", err);
            toast({
                title: "Error",
                description: "Gagal memuat template",
            });
        }
    };

    const createNewInvitation = async () => {
        try {
            const { data, error } = await supabase
                .from("invitations")
                .insert({
                    user_id: user.id,
                    template_id: templateId,
                    title: "Undangan Baru",
                    status: "draft",
                })
                .select()
                .single();

            if (error) throw error;

            setInvitation(data);
            setFormData((prev) => ({
                ...prev,
                title: data.title,
            }));
        } catch (err) {
            console.error("Error creating invitation:", err);
            toast({
                title: "Error",
                description: "Gagal membuat undangan baru",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectLocation = (location) => {
        if (!location) {
            setShowMapPicker(null);
            return;
        }

        if (showMapPicker === "ceremony") {
            setFormData((prev) => ({
                ...prev,
                ceremony_location: location,
            }));
        } else if (showMapPicker === "reception") {
            setFormData((prev) => ({
                ...prev,
                reception_location: location,
            }));
        }

        setShowMapPicker(null);
        toast({
            title: "Berhasil!",
            description: "Lokasi berhasil dipilih",
        });
    };

    const handleSave = async () => {
        try {
            if (!invitation) {
                toast({
                    title: "Error",
                    description: "Undangan tidak ditemukan",
                });
                return;
            }

            // Validate inputs
            if (!formData.wedding_date) {
                toast({
                    title: "Error",
                    description: "Tanggal pernikahan harus diisi",
                });
                return;
            }

            if (!formData.ceremony_start_time || !formData.ceremony_end_time) {
                toast({
                    title: "Error",
                    description: "Waktu akad nikah harus diisi",
                });
                return;
            }

            if (!formData.ceremony_location) {
                toast({
                    title: "Error",
                    description: "Lokasi akad nikah harus diisi",
                });
                return;
            }

            if (!formData.reception_start_time || !formData.reception_end_time) {
                toast({
                    title: "Error",
                    description: "Waktu resepsi harus diisi",
                });
                return;
            }

            if (!formData.reception_location) {
                toast({
                    title: "Error",
                    description: "Lokasi resepsi harus diisi",
                });
                return;
            }

            setSaving(true);

            // Combine time ranges
            const ceremonyTimeStr = `${formData.ceremony_start_time} - ${formData.ceremony_end_time} WIB`;
            const receptionTimeStr = `${formData.reception_start_time} - ${formData.reception_end_time} WIB`;

            const { error } = await supabase
                .from("invitations")
                .update({
                    title: formData.title,
                    bride_name: formData.bride_name,
                    groom_name: formData.groom_name,
                    bride_image_url: formData.bride_image_url,
                    groom_image_url: formData.groom_image_url,
                    bride_parents: formData.bride_parents,
                    groom_parents: formData.groom_parents,
                    bride_instagram: formData.bride_instagram,
                    bride_facebook: formData.bride_facebook,
                    groom_instagram: formData.groom_instagram,
                    groom_facebook: formData.groom_facebook,
                    wedding_date: formData.wedding_date,
                    ceremony_time: ceremonyTimeStr,
                    ceremony_location: formData.ceremony_location,
                    reception_time: receptionTimeStr,
                    reception_location: formData.reception_location,
                    love_story: formData.love_story,
                    closing_message: formData.closing_message,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", invitation.id)
                .eq("user_id", user.id);

            if (error) throw error;

            toast({
                title: "Berhasil!",
                description: "Undangan berhasil disimpan",
            });

            setInvitation((prev) => ({
                ...prev,
                ...formData,
                ceremony_time: ceremonyTimeStr,
                reception_time: receptionTimeStr,
            }));
        } catch (err) {
            console.error("Error saving invitation:", err);
            toast({
                title: "Error",
                description: "Gagal menyimpan undangan",
            });
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        try {
            if (!invitation) {
                toast({
                    title: "Error",
                    description: "Undangan tidak ditemukan",
                });
                return;
            }

            // Validate inputs
            if (!formData.wedding_date) {
                toast({
                    title: "Error",
                    description: "Tanggal pernikahan harus diisi",
                });
                return;
            }

            if (!formData.ceremony_start_time || !formData.ceremony_end_time) {
                toast({
                    title: "Error",
                    description: "Waktu akad nikah harus diisi",
                });
                return;
            }

            if (!formData.ceremony_location) {
                toast({
                    title: "Error",
                    description: "Lokasi akad nikah harus diisi",
                });
                return;
            }

            if (!formData.reception_start_time || !formData.reception_end_time) {
                toast({
                    title: "Error",
                    description: "Waktu resepsi harus diisi",
                });
                return;
            }

            if (!formData.reception_location) {
                toast({
                    title: "Error",
                    description: "Lokasi resepsi harus diisi",
                });
                return;
            }

            setSaving(true);

            // Combine time ranges
            const ceremonyTimeStr = `${formData.ceremony_start_time} - ${formData.ceremony_end_time} WIB`;
            const receptionTimeStr = `${formData.reception_start_time} - ${formData.reception_end_time} WIB`;

            const { error } = await supabase
                .from("invitations")
                .update({
                    title: formData.title,
                    bride_name: formData.bride_name,
                    groom_name: formData.groom_name,
                    bride_image_url: formData.bride_image_url,
                    groom_image_url: formData.groom_image_url,
                    bride_parents: formData.bride_parents,
                    groom_parents: formData.groom_parents,
                    bride_instagram: formData.bride_instagram,
                    bride_facebook: formData.bride_facebook,
                    groom_instagram: formData.groom_instagram,
                    groom_facebook: formData.groom_facebook,
                    wedding_date: formData.wedding_date,
                    ceremony_time: ceremonyTimeStr,
                    ceremony_location: formData.ceremony_location,
                    reception_time: receptionTimeStr,
                    reception_location: formData.reception_location,
                    love_story: formData.love_story,
                    closing_message: formData.closing_message,
                    status: "pending_payment",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", invitation.id)
                .eq("user_id", user.id);

            if (error) throw error;

            toast({
                title: "Berhasil!",
                description: "Undangan siap untuk dipublikasikan. Lanjutkan ke pembayaran.",
            });

            router.push(`/payment?invitation=${invitation.id}`);
        } catch (err) {
            console.error("Error publishing invitation:", err);
            toast({
                title: "Error",
                description: "Gagal mempersiapkan undangan",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!invitation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <Heart className="w-12 h-12 text-rose-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Undangan tidak ditemukan
                        </h2>
                        <Button onClick={() => router.push("/dashboard")} className="mt-4">
                            Kembali ke Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Heart className="w-8 h-8 text-rose-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Edit Undangan</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setShowPreview(!showPreview)}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                {showPreview ? "Edit" : "Preview"}
                            </Button>
                            <Button onClick={() => router.push("/dashboard")} variant="ghost">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {showPreview ? (
                <div className="py-8">
                    <div className="max-w-2xl mx-auto">
                        <WeddingInvitation
                            invitation={{
                                ...invitation,
                                ...formData,
                                ceremony_time: `${formData.ceremony_start_time} - ${formData.ceremony_end_time} WIB`,
                                reception_time: `${formData.reception_start_time} - ${formData.reception_end_time} WIB`,
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <Card>
                                <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                                    <CardTitle>Informasi Dasar</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Judul Undangan
                                        </label>
                                        <Input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan judul undangan"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Mempelai */}
                            <Card>
                                <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                                    <CardTitle>Data Mempelai</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nama Pengantin Wanita
                                            </label>
                                            <Input
                                                name="bride_name"
                                                value={formData.bride_name}
                                                onChange={handleInputChange}
                                                placeholder="Nama pengantin wanita"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nama Pengantin Pria
                                            </label>
                                            <Input
                                                name="groom_name"
                                                value={formData.groom_name}
                                                onChange={handleInputChange}
                                                placeholder="Nama pengantin pria"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Foto Pengantin Wanita
                                            </label>
                                            <ImageUploader
                                                onUploadComplete={(url) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        bride_image_url: url,
                                                    }))
                                                }
                                                currentImageUrl={formData.bride_image_url}
                                                folder="undangan/pengantin"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Foto Pengantin Pria
                                            </label>
                                            <ImageUploader
                                                onUploadComplete={(url) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        groom_image_url: url,
                                                    }))
                                                }
                                                currentImageUrl={formData.groom_image_url}
                                                folder="undangan/pengantin"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Orang Tua Pengantin Wanita
                                            </label>
                                            <Input
                                                name="bride_parents"
                                                value={formData.bride_parents}
                                                onChange={handleInputChange}
                                                placeholder="Nama orang tua"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Orang Tua Pengantin Pria
                                            </label>
                                            <Input
                                                name="groom_parents"
                                                value={formData.groom_parents}
                                                onChange={handleInputChange}
                                                placeholder="Nama orang tua"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Instagram Pengantin Wanita
                                            </label>
                                            <Input
                                                name="bride_instagram"
                                                value={formData.bride_instagram}
                                                onChange={handleInputChange}
                                                placeholder="@username"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Instagram Pengantin Pria
                                            </label>
                                            <Input
                                                name="groom_instagram"
                                                value={formData.groom_instagram}
                                                onChange={handleInputChange}
                                                placeholder="@username"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Facebook Pengantin Wanita
                                            </label>
                                            <Input
                                                name="bride_facebook"
                                                value={formData.bride_facebook}
                                                onChange={handleInputChange}
                                                placeholder="Username atau URL Facebook"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Facebook Pengantin Pria
                                            </label>
                                            <Input
                                                name="groom_facebook"
                                                value={formData.groom_facebook}
                                                onChange={handleInputChange}
                                                placeholder="Username atau URL Facebook"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Jadwal Acara */}
                            <Card>
                                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                    <CardTitle>Jadwal Acara</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tanggal Pernikahan *
                                        </label>
                                        <Input
                                            name="wedding_date"
                                            value={formData.wedding_date}
                                            onChange={handleInputChange}
                                            type="date"
                                        />
                                    </div>

                                    {/* Akad Nikah */}
                                    <div className="space-y-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                            <span className="text-lg">📍</span> Akad Nikah
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Jam Mulai *
                                                </label>
                                                <Input
                                                    name="ceremony_start_time"
                                                    value={formData.ceremony_start_time}
                                                    onChange={handleInputChange}
                                                    type="time"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Jam Selesai *
                                                </label>
                                                <Input
                                                    name="ceremony_end_time"
                                                    value={formData.ceremony_end_time}
                                                    onChange={handleInputChange}
                                                    type="time"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Lokasi Akad Nikah *
                                            </label>
                                            <div className="flex gap-2">
                                                <Input
                                                    name="ceremony_location"
                                                    value={formData.ceremony_location}
                                                    onChange={handleInputChange}
                                                    placeholder="Cth: Masjid Al-Bahagia, Jl. Merdeka No. 123"
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => setShowMapPicker("ceremony")}
                                                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                    Pilih Peta
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resepsi */}
                                    <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                            <span className="text-lg">🎉</span> Resepsi
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Jam Mulai *
                                                </label>
                                                <Input
                                                    name="reception_start_time"
                                                    value={formData.reception_start_time}
                                                    onChange={handleInputChange}
                                                    type="time"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Jam Selesai *
                                                </label>
                                                <Input
                                                    name="reception_end_time"
                                                    value={formData.reception_end_time}
                                                    onChange={handleInputChange}
                                                    type="time"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Lokasi Resepsi *
                                            </label>
                                            <div className="flex gap-2">
                                                <Input
                                                    name="reception_location"
                                                    value={formData.reception_location}
                                                    onChange={handleInputChange}
                                                    placeholder="Cth: Gedung Kartika Wijaya, Jl. Ahmad Yani No. 456"
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => setShowMapPicker("reception")}
                                                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                    Pilih Peta
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Konten */}
                            <Card>
                                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    <CardTitle>Konten</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kisah Cinta
                                        </label>
                                        <Textarea
                                            name="love_story"
                                            value={formData.love_story}
                                            onChange={handleInputChange}
                                            placeholder="Ceritakan kisah cinta Anda..."
                                            className="min-h-32"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pesan Penutup
                                        </label>
                                        <Textarea
                                            name="closing_message"
                                            value={formData.closing_message}
                                            onChange={handleInputChange}
                                            placeholder="Pesan akhir untuk tamu..."
                                            className="min-h-32"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                            <Card className="sticky top-24">
                                <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                                    <CardTitle>Aksi</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving ? "Menyimpan..." : "Simpan"}
                                    </Button>

                                    <Button
                                        onClick={handlePublish}
                                        disabled={saving || invitation.status === "published"}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                                    >
                                        {invitation.status === "published"
                                            ? "Sudah Dipublikasikan"
                                            : "Lanjut ke Pembayaran"}
                                    </Button>

                                    <Button
                                        onClick={() => router.push("/dashboard")}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Home className="w-4 h-4 mr-2" />
                                        Kembali
                                    </Button>

                                    <div className="pt-4 border-t space-y-2">
                                        <p className="text-sm text-gray-600 font-semibold">
                                            Status
                                        </p>
                                        <p
                                            className={`text-sm font-semibold ${
                                                invitation.status === "published"
                                                    ? "text-green-600"
                                                    : invitation.status === "pending_payment"
                                                      ? "text-yellow-600"
                                                      : "text-gray-600"
                                            }`}
                                        >
                                            {invitation.status === "published"
                                                ? "✓ Dipublikasikan"
                                                : invitation.status === "pending_payment"
                                                  ? "⏳ Menunggu Pembayaran"
                                                  : "✏️ Draft"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {/* Location Map Picker Modal */}
            {showMapPicker && (
                <LocationMapPicker
                    onSelectLocation={handleSelectLocation}
                    initialLocation={
                        showMapPicker === "ceremony"
                            ? formData.ceremony_location
                            : formData.reception_location
                    }
                    locationType={showMapPicker === "ceremony" ? "Akad Nikah" : "Resepsi"}
                />
            )}
        </div>
    );
}
