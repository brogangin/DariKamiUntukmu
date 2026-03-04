import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Midtrans API
const midtransServerKey = process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY;
const midtransUrl = "https://app.sandbox.midtrans.com/snap/v1/transactions";

export async function POST(request) {
    try {
        const { transactionId, userId, invitationId, amount, email, name } = await request.json();

        // Prepare Midtrans payload
        const payload = {
            transaction_details: {
                order_id: transactionId,
                gross_amount: amount,
            },
            customer_details: {
                email: email,
                first_name: name,
            },
            credit_card: {
                secure: true,
            },
        };

        // Create Snap token
        const response = await fetch(midtransUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + Buffer.from(midtransServerKey + ":").toString("base64"),
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.token) {
            return Response.json({
                success: true,
                snapToken: result.token,
            });
        } else {
            return Response.json(
                {
                    success: false,
                    error: "Failed to create Snap token",
                },
                { status: 400 },
            );
        }
    } catch (error) {
        console.error("Payment creation error:", error);
        return Response.json(
            {
                success: false,
                error: error.message || "Internal server error",
            },
            { status: 500 },
        );
    }
}
