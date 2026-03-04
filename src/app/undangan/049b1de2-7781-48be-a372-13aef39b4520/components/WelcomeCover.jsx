import React from "react";
import { Heart, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const WelcomeCover = ({ onOpen }) => {
    return (
        <div
            className="welcome-cover min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
                backgroundImage:
                    "url(https://images.unsplash.com/photo-1640439505734-3851b53e5035)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="relative z-10 text-center px-4 animate-fade-in">
                <div className="mb-8 flex justify-center">
                    <Mail className="w-16 h-16 text-amber-300 animate-pulse" />
                </div>

                <h1 className="text-6xl md:text-8xl font-serif text-white mb-4 tracking-wide">
                    Adam & Hawa
                </h1>

                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px w-16 bg-amber-300"></div>
                    <Heart className="w-6 h-6 text-amber-300" />
                    <div className="h-px w-16 bg-amber-300"></div>
                </div>

                <p className="text-xl md:text-2xl text-white mb-4 font-light tracking-wider">
                    Undangan Pernikahan
                </p>

                <p className="text-lg text-amber-100 mb-12">Jumat, 12:00 WIB</p>

                <Button
                    onClick={onOpen}
                    className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white px-12 py-6 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                    Buka Undangan
                </Button>
            </div>
        </div>
    );
};

export default WelcomeCover;
