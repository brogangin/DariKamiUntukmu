"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, X, Loader } from "lucide-react";

// Dynamically import map component to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import("./LeafletMap"), {
    ssr: false,
    loading: () => (
        <div className="flex-1 min-h-[400px] w-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <Loader className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Memuat peta...</p>
            </div>
        </div>
    ),
});

export default function LocationMapPicker({ onSelectLocation, initialLocation, locationType }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(initialLocation || "");
    const [searching, setSearching] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearching(true);
        // Search is handled by LeafletMap component
        setTimeout(() => setSearching(false), 500);
    };

    const handleMapLocationSelect = (location) => {
        setSelectedLocation(location);
    };

    const handleConfirm = () => {
        if (!selectedLocation.trim()) {
            alert("Silakan pilih lokasi terlebih dahulu");
            return;
        }
        onSelectLocation(selectedLocation);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="border-b p-4 flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-xl">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Pilih Lokasi {locationType}
                    </h2>
                    <button
                        onClick={() => onSelectLocation(null)}
                        className="hover:bg-white/20 p-1 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Cari lokasi (cth: Masjid Al-Bahagia, Jakarta)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            disabled={searching}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        >
                            <Search className="w-4 h-4" />
                        </Button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2">
                        💡 Atau klik langsung di peta untuk memilih lokasi
                    </p>
                </div>

                {/* Map - Dynamically imported */}
                <LeafletMap onSelectLocation={handleMapLocationSelect} searchQuery={searchQuery} />

                {/* Selected Location Info */}
                <div className="border-t p-4 bg-gray-50">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lokasi Terpilih:
                            </label>
                            <div className="bg-white border rounded-lg p-3 text-sm text-gray-700 break-words max-h-20 overflow-y-auto">
                                {selectedLocation || "Belum ada lokasi yang dipilih"}
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button onClick={() => onSelectLocation(null)} variant="outline">
                                Batal
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                            >
                                Pilih Lokasi Ini
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
