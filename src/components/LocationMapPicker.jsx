"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, X } from "lucide-react";

// Fix Leaflet icon issue in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

export default function LocationMapPicker({ onSelectLocation, initialLocation, locationType }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(initialLocation || "");
    const [mapCenter, setMapCenter] = useState([-6.2088, 106.8456]); // Jakarta default
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current).setView(mapCenter, 13);

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        // Handle map click to add marker
        const onMapClick = (e) => {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            // Remove existing marker
            if (markerRef.current) {
                mapInstanceRef.current.removeLayer(markerRef.current);
            }

            // Add new marker
            markerRef.current = L.marker([lat, lng])
                .addTo(mapInstanceRef.current)
                .bindPopup(
                    `<b>Lokasi Terpilih</b><br/>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}`,
                );

            // Fetch address from coordinates
            fetchAddress(lat, lng);
        };

        mapInstanceRef.current.on("click", onMapClick);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.off("click", onMapClick);
                mapInstanceRef.current.remove();
            }
        };
    }, []);

    const fetchAddress = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            );
            const data = await response.json();
            const address =
                data.address?.name || data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setSelectedLocation(address);
        } catch (err) {
            console.error("Error fetching address:", err);
            setSelectedLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchQuery,
                )}&limit=1`,
            );
            const results = await response.json();

            if (results.length > 0) {
                const result = results[0];
                const lat = parseFloat(result.lat);
                const lng = parseFloat(result.lon);

                // Update map center and marker
                mapInstanceRef.current.setView([lat, lng], 15);

                // Remove existing marker
                if (markerRef.current) {
                    mapInstanceRef.current.removeLayer(markerRef.current);
                }

                // Add new marker
                markerRef.current = L.marker([lat, lng])
                    .addTo(mapInstanceRef.current)
                    .bindPopup(`<b>${result.name}</b>`);

                setSelectedLocation(result.display_name);
            } else {
                alert("Lokasi tidak ditemukan. Silakan coba kata kunci lain.");
            }
        } catch (err) {
            console.error("Error searching location:", err);
            alert("Gagal mencari lokasi");
        } finally {
            setSearching(false);
        }
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

                {/* Map */}
                <div ref={mapRef} className="flex-1 min-h-[400px] w-full" />

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
