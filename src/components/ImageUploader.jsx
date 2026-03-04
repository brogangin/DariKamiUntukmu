"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function ImageUploader({ onUploadComplete, currentImageUrl, folder = "undangan" }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImageUrl || "");
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Error",
                description: "Hanya file gambar yang diizinkan",
            });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "Ukuran file maksimal 5MB",
            });
            return;
        }

        setUploading(true);
        try {
            // Create FormData for API
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);

            // Call API route to upload
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            const imageUrl = data.url;

            // Set preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result);
            };
            reader.readAsDataURL(file);

            // Callback with URL
            onUploadComplete(imageUrl);

            toast({
                title: "Berhasil!",
                description: "Foto berhasil diunggah",
            });
        } catch (err) {
            console.error("Upload error:", err);
            toast({
                title: "Error",
                description: "Gagal mengunggah foto",
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = () => {
        setPreview("");
        onUploadComplete("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-3">
            {preview ? (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                        Klik untuk memilih foto atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500">Maksimal 5MB, format: JPG, PNG, GIF</p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
            />

            <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
                {uploading ? (
                    <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Mengunggah...
                    </>
                ) : preview ? (
                    "Ubah Foto"
                ) : (
                    "Pilih Foto"
                )}
            </Button>
        </div>
    );
}
