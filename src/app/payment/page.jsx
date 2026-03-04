"use client";

import { Suspense } from "react";
import { useAuth } from "@/components/AuthProviderClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Heart, CheckCircle, Clock, AlertCircle, Download, Home } from "lucide-react";

// Disable static prerendering for this dynamic page
export const dynamic = "force-dynamic";

function PaymentContent() {
    const { user, supabase } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const invitationId = searchParams.get("invitation");

    const [invitation, setInvitation] = useState(null);
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [snapToken, setSnapToken] = useState(null);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    useEffect(() => {
        if (!invitationId) {
            router.push("/dashboard");
            return;
        }

        fetchInvitationAndTransaction();
    }, [invitationId]);

    const fetchInvitationAndTransaction = async () => {
        try {
            setLoading(true);

            // Fetch invitation
            const { data: invitationData, error: invError } = await supabase
                .from("invitations")
                .select("*")
                .eq("id", invitationId)
                .eq("user_id", user.id)
                .single();

            if (invError) throw invError;
            setInvitation(invitationData);

            // Fetch latest transaction for this invitation
            const { data: transactionData, error: txnError } = await supabase
                .from("transactions")
                .select("*")
                .eq("invitation_id", invitationId)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (!txnError && transactionData) {
                setTransaction(transactionData);
                if (transactionData.payment_id) {
                    setSnapToken(transactionData.payment_id);
                }
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            toast({
                title: "Error",
                description: "Gagal memuat data pembayaran",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckPayment = async () => {
        try {
            setPaymentLoading(true);

            if (!transaction?.payment_id) {
                toast({
                    title: "Error",
                    description: "ID pembayaran tidak ditemukan",
                });
                return;
            }

            // Call API to check payment status
            const response = await fetch("/api/payment/check-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transactionId: transaction.id,
                    paymentId: transaction.payment_id,
                    invitationId,
                }),
            });

            const result = await response.json();

            if (result.success) {
                if (result.status === "paid") {
                    toast({
                        title: "Pembayaran Berhasil!",
                        description: "Undangan Anda sudah aktif dan siap diedit",
                    });
                    setShowReceipt(true);

                    // Refresh transaction data
                    await fetchInvitationAndTransaction();
                } else if (result.status === "pending") {
                    toast({
                        title: "Pembayaran Masih Menunggu",
                        description: "Silakan selesaikan pembayaran Anda",
                    });
                } else {
                    toast({
                        title: "Pembayaran Gagal",
                        description: "Silakan coba lagi",
                    });
                }
            } else {
                toast({
                    title: "Error",
                    description: "Gagal mengecek status pembayaran",
                });
            }
        } catch (err) {
            console.error("Error checking payment:", err);
            toast({
                title: "Error",
                description: err?.message || "Terjadi kesalahan",
            });
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleInitiatePayment = async () => {
        try {
            setPaymentLoading(true);

            if (!invitation) {
                toast({
                    title: "Error",
                    description: "Data undangan tidak ditemukan",
                });
                return;
            }

            // Create new transaction
            const { data: newTransaction, error: txnError } = await supabase
                .from("transactions")
                .insert({
                    user_id: user.id,
                    invitation_id: invitationId,
                    amount: 150000, // Harga paket undangan
                    status: "pending",
                })
                .select()
                .single();

            if (txnError) throw txnError;

            // Call API to create Midtrans transaction
            const response = await fetch("/api/payment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transactionId: newTransaction.id,
                    userId: user.id,
                    invitationId,
                    amount: 150000,
                    email: user.email,
                    name: invitation.title,
                }),
            });

            const result = await response.json();

            if (result.success && result.snapToken) {
                setSnapToken(result.snapToken);
                setTransaction(newTransaction);

                // Update transaction with payment_id
                await supabase
                    .from("transactions")
                    .update({ payment_id: result.snapToken })
                    .eq("id", newTransaction.id);

                // Load Snap
                window.snap.pay(result.snapToken, {
                    onSuccess: function (result) {
                        handleCheckPayment();
                    },
                    onPending: function (result) {
                        toast({
                            title: "Pembayaran Tertunda",
                            description: "Tunggu konfirmasi dari bank atau layanan pembayaran Anda",
                        });
                    },
                    onError: function (result) {
                        toast({
                            title: "Pembayaran Gagal",
                            description: "Terjadi kesalahan saat memproses pembayaran",
                        });
                    },
                });
            } else {
                toast({
                    title: "Error",
                    description: "Gagal membuat transaksi pembayaran",
                });
            }
        } catch (err) {
            console.error("Error initiating payment:", err);
            toast({
                title: "Error",
                description: err?.message || "Terjadi kesalahan",
            });
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleDownloadReceipt = () => {
        // TODO: Implement receipt download
        toast({
            title: "Fitur Segera Hadir",
            description: "Fitur download nota akan segera tersedia",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Loading data pembayaran...</p>
                </div>
            </div>
        );
    }

    if (!invitation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Undangan Tidak Ditemukan
                        </h2>
                        <Button onClick={() => router.push("/dashboard")} className="mt-4">
                            Kembali ke Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isPaid = transaction?.status === "paid";

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Heart className="w-8 h-8 text-rose-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
                        </div>
                        <Button
                            onClick={() => router.push("/dashboard")}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Dashboard
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Invitation Details */}
                    <div>
                        <Card className="border-none shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="w-5 h-5" />
                                    Detail Undangan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-200">
                                    {invitation.image_thumbnail ? (
                                        <img
                                            src={invitation.image_thumbnail}
                                            alt={invitation.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-200 to-pink-200">
                                            <Heart className="w-20 h-20 text-rose-400" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Judul Undangan</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {invitation.title}
                                        </p>
                                    </div>

                                    {invitation.bride_name && invitation.groom_name && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Mempelai</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {invitation.bride_name} & {invitation.groom_name}
                                            </p>
                                        </div>
                                    )}

                                    {invitation.wedding_date && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">
                                                Tanggal Pernikahan
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {new Date(
                                                    invitation.wedding_date,
                                                ).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Payment */}
                    <div>
                        <Card className="border-none shadow-lg">
                            <CardHeader
                                className={`text-white ${
                                    isPaid
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                        : "bg-gradient-to-r from-amber-500 to-orange-500"
                                }`}
                            >
                                <CardTitle className="flex items-center gap-2">
                                    {isPaid ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Pembayaran Berhasil
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="w-5 h-5" />
                                            Menunggu Pembayaran
                                        </>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {/* Amount */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">Total Pembayaran</p>
                                    <p className="text-4xl font-bold text-rose-600">Rp 50.000</p>
                                </div>

                                {/* Status */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">Status</p>
                                    <div className="flex items-center gap-2">
                                        {isPaid ? (
                                            <>
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <p className="font-semibold text-green-600">
                                                    Sudah Dibayar
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-5 h-5 text-yellow-600" />
                                                <p className="font-semibold text-yellow-600">
                                                    Belum Dibayar
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Transaction ID */}
                                {transaction && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">ID Transaksi</p>
                                        <p className="font-mono text-sm text-gray-900 break-all">
                                            {transaction.id}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="space-y-3">
                                    {!isPaid ? (
                                        <>
                                            <Button
                                                onClick={handleInitiatePayment}
                                                disabled={paymentLoading}
                                                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-6 text-lg"
                                            >
                                                {paymentLoading ? "Memproses..." : "Bayar Sekarang"}
                                            </Button>
                                            <Button
                                                onClick={handleCheckPayment}
                                                disabled={paymentLoading || !transaction}
                                                variant="outline"
                                                className="w-full py-6"
                                            >
                                                {paymentLoading
                                                    ? "Mengecek..."
                                                    : "Cek Status Pembayaran"}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={handleDownloadReceipt}
                                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-6"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download Nota
                                            </Button>
                                            <Button
                                                onClick={() => router.push("/dashboard")}
                                                className="w-full py-6"
                                            >
                                                Kembali ke Dashboard
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    router.push(`/edit-undangan?id=${invitationId}`)
                                                }
                                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-6"
                                            >
                                                Edit Undangan
                                            </Button>
                                        </>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    Pembayaran diproses oleh Midtrans secara aman
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Load Snap script */}
            <script src="https://app.sandbox.midtrans.com/snap/snap.js" async></script>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen">Loading...</div>
            }
        >
            <PaymentContent />
        </Suspense>
    );
}
