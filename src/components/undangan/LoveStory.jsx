import React, { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

const LoveStory = ({ invitation }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    if (!invitation?.love_story) return null;

    return (
        <section
            ref={sectionRef}
            className="love-story py-24 px-4 bg-gradient-to-b from-white via-amber-50 to-white"
        >
            <div className="max-w-4xl mx-auto text-center">
                <div
                    className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                    <Heart className="w-12 h-12 text-amber-600 mx-auto mb-6 animate-pulse" />

                    <h2 className="text-5xl md:text-6xl font-serif text-gray-800 mb-8">
                        Kisah Cinta Kami
                    </h2>

                    <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-12"></div>

                    <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                        <p className="font-light whitespace-pre-wrap">{invitation.love_story}</p>

                        <div className="mt-12 pt-8">
                            <p className="text-2xl font-serif text-amber-700 italic">
                                "Cinta adalah ketika dua jiwa bertemu dan menjadi satu."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoveStory;
