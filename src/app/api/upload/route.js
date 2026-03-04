import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const folder = formData.get("folder") || "undangan";

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const ext = file.name.split(".").pop();
        const filename = `${folder}/${timestamp}-${random}.${ext}`;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from("invitations")
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("Upload error:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("invitations").getPublicUrl(data.path);

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: error.message || "Upload failed" },
            { status: 500 }
        );
    }
}
