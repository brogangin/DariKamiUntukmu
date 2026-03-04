import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const midtransServerKey = process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY;

export async function POST(request) {
    try {
        const { transactionId, paymentId, invitationId } = await request.json();

        // Check status dari Midtrans
        const midtransUrl = `https://app.sandbox.midtrans.com/v2/${paymentId}/status`;

        const response = await fetch(midtransUrl, {
            method: "GET",
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(midtransServerKey + ":").toString("base64"),
            },
        });

        const result = await response.json();

        let transactionStatus = "pending";

        if (result.transaction_status === "settlement") {
            transactionStatus = "paid";

            // Update transaction status in Supabase
            await supabase
                .from("transactions")
                .update({
                    status: "paid",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", transactionId);

            // Update invitation status to published
            await supabase
                .from("invitations")
                .update({
                    status: "published",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", invitationId);
        } else if (
            result.transaction_status === "cancel" ||
            result.transaction_status === "deny"
        ) {
            transactionStatus = "failed";

            await supabase
                .from("transactions")
                .update({
                    status: "failed",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", transactionId);
        }

        return Response.json({
            success: true,
            status: transactionStatus,
            midtransStatus: result.transaction_status,
        });
    } catch (error) {
        console.error("Check payment status error:", error);
        return Response.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
