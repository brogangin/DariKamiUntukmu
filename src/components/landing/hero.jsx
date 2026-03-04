"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative w-full h-[911px] flex items-center" id="hero">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: "url('/bg-image.png')",
                }}
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 max-w-3xl px-6 lg:px-0 lg:ml-96 text-white">
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-3xl lg:text-6xl font-semibold leading-normal text-left bg-gradient-to-r from-pink-500 to-amber-400 text-transparent bg-clip-text"
                >
                    Bukan sekadar undangan, tapi cara merayakan cinta dengan penuh makna.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="mt-6 text-sm lg:text-base text-gray-200 max-w-xl text-left"
                >
                    Lewat undangan digital dari{" "}
                    <span className="italic font-semibold bg-gradient-to-r from-pink-500 to-amber-400 text-transparent bg-clip-text">
                        DariKamiUntukmu
                    </span>
                    , momen spesialmu bisa dibagikan dengan cara yang lebih hangat, modern, dan
                    penuh makna.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                    className="mt-10 flex gap-4"
                >
                    <Link
                        href="/sign-in"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-amber-400 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:from-white hover:to-white hover:text-pink-500 transition-all duration-200 cursor-pointer"
                    >
                        Buat Undangan
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
