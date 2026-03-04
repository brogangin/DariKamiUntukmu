import React, { useEffect, useRef, useState } from "react";
import { Users, Instagram, Facebook } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CoupleProfile = ({ invitation }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

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

    if (!invitation) return null;

    return (
        <section ref={sectionRef} className="couple-profile py-24 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <Users className="w-12 h-12 text-amber-600 mx-auto mb-6" />
                    <h2 className="text-5xl md:text-6xl font-serif text-gray-800 mb-4">Mempelai</h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                    {/* Bride */}
                    <div
                        className={`transition-all duration-1000 delay-200 ${
                            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                        }`}
                    >
                        <Card className="border-none shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300">
                            <div className="relative h-96 overflow-hidden group">
                                <img
                                    src={
                                        invitation.bride_image_url ||
                                        "https://images.unsplash.com/photo-1707193392409-1762d0dafbf5"
                                    }
                                    alt="Bride"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <CardContent className="p-8 text-center bg-gradient-to-b from-amber-50 to-white">
                                <h3 className="text-4xl font-serif text-gray-800 mb-2">
                                    {invitation.bride_name}
                                </h3>
                                <p className="text-amber-700 font-medium mb-4">Mempelai Wanita</p>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {invitation.bride_parents}
                                </p>
                                <div className="flex justify-center gap-4">
                                    {invitation.bride_instagram && (
                                        <a
                                            href={`https://instagram.com/${invitation.bride_instagram.replace(/@/, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-amber-600 hover:text-amber-700 transition-colors"
                                        >
                                            <Instagram className="w-6 h-6" />
                                        </a>
                                    )}
                                    {invitation.bride_facebook && (
                                        <a
                                            href={`https://facebook.com/${invitation.bride_facebook}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-amber-600 hover:text-amber-700 transition-colors"
                                        >
                                            <Facebook className="w-6 h-6" />
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Groom */}
                    <div
                        className={`transition-all duration-1000 delay-400 ${
                            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                        }`}
                    >
                        <Card className="border-none shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300">
                            <div className="relative h-96 overflow-hidden group">
                                <img
                                    src={
                                        invitation.groom_image_url ||
                                        "https://images.unsplash.com/photo-1707193392375-a2b283a0713d"
                                    }
                                    alt="Groom"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <CardContent className="p-8 text-center bg-gradient-to-b from-amber-50 to-white">
                                <h3 className="text-4xl font-serif text-gray-800 mb-2">
                                    {invitation.groom_name}
                                </h3>
                                <p className="text-amber-700 font-medium mb-4">Mempelai Pria</p>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {invitation.groom_parents}
                                </p>
                                <div className="flex justify-center gap-4">
                                    {invitation.groom_instagram && (
                                        <a
                                            href={`https://instagram.com/${invitation.groom_instagram.replace(/@/, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-amber-600 hover:text-amber-700 transition-colors"
                                        >
                                            <Instagram className="w-6 h-6" />
                                        </a>
                                    )}
                                    {invitation.groom_facebook && (
                                        <a
                                            href={`https://facebook.com/${invitation.groom_facebook}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-amber-600 hover:text-amber-700 transition-colors"
                                        >
                                            <Facebook className="w-6 h-6" />
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoupleProfile;
