import React from "react";
import { Heart, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Closing = ({ invitation }) => {
    const handleAddToCalendar = () => {
        if (!invitation?.wedding_date) return;

        const date = new Date(invitation.wedding_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const ceremonyHour = invitation.ceremony_time?.split(" ")[0]?.split(":")[0] || "12";
        const ceremonyMin = invitation.ceremony_time?.split(" ")[0]?.split(":")[1] || "00";
        const receptionTime = invitation.reception_time?.split(" ")[0] || "15:00";
        const receptionHour = receptionTime.split(":")[0];
        const receptionMin = receptionTime.split(":")[1];

        const startDate = `${year}${month}${day}T${ceremonyHour}${ceremonyMin}00Z`;
        const endDate = `${year}${month}${day}T${receptionHour}${receptionMin}00Z`;

        const title = `Pernikahan ${invitation.bride_name} & ${invitation.groom_name}`;
        const details = "Akad Nikah dan Resepsi Pernikahan";
        const location = invitation.ceremony_location || "Lokasi Pernikahan";

        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            title,
        )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
            location,
        )}&dates=${startDate}/${endDate}`;

        window.open(calendarUrl, "_blank");
    };

    if (!invitation) return null;

    return (
        <section className="closing py-24 px-4 bg-gradient-to-b from-white to-amber-50">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-12 animate-fade-in">
                    <Heart className="w-16 h-16 text-amber-600 mx-auto mb-8 animate-pulse" />

                    <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-6">
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami
                    </h2>

                    <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                        Apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada
                        kami.
                    </p>

                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>

                    <p className="text-2xl font-serif text-amber-700 italic mb-12">
                        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
                        pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan
                        merasa tenteram kepadanya."
                    </p>

                    <p className="text-lg text-gray-600 mb-12">QS. Ar-Rum: 21</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                    <Button
                        onClick={handleAddToCalendar}
                        className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white px-8 py-6 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        <Calendar className="w-5 h-5" />
                        Simpan ke Kalender
                    </Button>

                    <Button
                        onClick={() => {
                            const url = `https://www.google.com/maps/search/${encodeURIComponent(
                                invitation.ceremony_location || "Lokasi Pernikahan",
                            )}`;
                            window.open(url, "_blank");
                        }}
                        variant="outline"
                        className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-6 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        <MapPin className="w-5 h-5" />
                        Lihat Lokasi
                    </Button>
                </div>

                {/* Closing Message */}
                <div className="border-t-2 border-amber-200 pt-12">
                    <p className="text-gray-600 mb-4">
                        Atas kehadiran dan doa restunya, kami ucapkan
                    </p>
                    <h3 className="text-4xl font-serif text-amber-700 mb-8">Terima Kasih</h3>

                    <div className="flex items-center justify-center gap-3 text-amber-600">
                        <div className="h-px w-12 bg-amber-400"></div>
                        <Heart className="w-6 h-6" />
                        <div className="h-px w-12 bg-amber-400"></div>
                    </div>

                    <p className="mt-8 text-2xl font-serif text-gray-800">
                        {invitation.bride_name} & {invitation.groom_name}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Closing;
