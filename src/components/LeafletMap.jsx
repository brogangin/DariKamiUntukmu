"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

export default function LeafletMap({ onSelectLocation, searchQuery }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [mapCenter] = useState([-6.2088, 106.8456]); // Jakarta default

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
    }, [mapCenter]);

    const fetchAddress = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            );
            const data = await response.json();
            const address =
                data.address?.name || data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            onSelectLocation(address);
        } catch (err) {
            console.error("Error fetching address:", err);
            onSelectLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
    };

    // Handle search query changes
    useEffect(() => {
        if (!searchQuery || !mapInstanceRef.current) return;

        const performSearch = async () => {
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

                    onSelectLocation(result.display_name);
                }
            } catch (err) {
                console.error("Error searching location:", err);
            }
        };

        performSearch();
    }, [searchQuery, onSelectLocation]);

    return <div ref={mapRef} className="flex-1 min-h-[400px] w-full rounded-lg" />;
}
