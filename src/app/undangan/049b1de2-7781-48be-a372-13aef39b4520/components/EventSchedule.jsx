import React, { useState, useEffect, useRef } from "react";
import { Calendar, Clock, MapPin, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EventSchedule = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const sectionRef = useRef(null);

    // Set wedding date - using a future Friday for countdown
    const weddingDate = new Date("2025-08-15T12:00:00");

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate.getTime() - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setCountdown({ days, hours, minutes, seconds });
            } else {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="event-schedule py-24 px-4 bg-gradient-to-b from-white via-amber-50 to-white"
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <Calendar className="w-12 h-12 text-amber-600 mx-auto mb-6" />
                    <h2 className="text-5xl md:text-6xl font-serif text-gray-800 mb-4">
                        Jadwal Acara
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto"></div>
                </div>

                {/* Countdown Timer */}
                <div
                    className={`mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                >
                    <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Timer className="w-8 h-8 text-white" />
                            <h3 className="text-2xl font-serif text-white">Hitung Mundur</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-4 md:gap-8">
                            {[
                                { label: "Hari", value: countdown.days },
                                { label: "Jam", value: countdown.hours },
                                { label: "Menit", value: countdown.minutes },
                                { label: "Detik", value: countdown.seconds },
                            ].map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-2">
                                        <p className="text-3xl md:text-5xl font-bold text-white">
                                            {String(item.value).padStart(2, "0")}
                                        </p>
                                    </div>
                                    <p className="text-white text-sm md:text-base font-medium">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Event Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Ceremony */}
                    <div
                        className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    >
                        <Card className="border-2 border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-6 text-center">
                                <Calendar className="w-10 h-10 text-white mx-auto mb-3" />
                                <h3 className="text-3xl font-serif text-white">Akad Nikah</h3>
                            </div>
                            <CardContent className="p-8 space-y-4">
                                <div className="flex items-center gap-4">
                                    <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Jumat</p>
                                        <p className="text-gray-600">12:00 - 13:00 WIB</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Jatim Expo</p>
                                        <p className="text-gray-600 text-sm">
                                            Grand City Convention Center
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Reception */}
                    <div
                        className={`transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    >
                        <Card className="border-2 border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                            <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-center">
                                <Calendar className="w-10 h-10 text-white mx-auto mb-3" />
                                <h3 className="text-3xl font-serif text-white">Resepsi</h3>
                            </div>
                            <CardContent className="p-8 space-y-4">
                                <div className="flex items-center gap-4">
                                    <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Jumat</p>
                                        <p className="text-gray-600">15:00 - 17:00 WIB</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Jatim Expo</p>
                                        <p className="text-gray-600 text-sm">
                                            Grand City Convention Center
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Google Maps */}
                <div
                    className={`mt-12 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                    <Card className="overflow-hidden shadow-2xl border-none">
                        <CardContent className="p-0">
                            <div className="relative w-full h-96 rounded-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.3736642798643!2d112.75691631477547!3d-7.309506894729842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbc9c0c0c0c1%3A0x1234567890abcdef!2sJatim%20Expo!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-500"
                                    title="Wedding Venue Map"
                                ></iframe>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default EventSchedule;
