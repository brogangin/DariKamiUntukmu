"use client";

import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Pricing() {
    const router = useRouter();

    const handleSimpleLove = () => {
        router.push("/sign-up");
    };

    const handleEternalLove = () => {
        const whatsappUrl =
            "https://wa.me/628813509520?text=Halo%2C%20saya%20tertarik%20dengan%20Paket%20Eternal%20Love%20dari%20Dari%20Kami%20Untukmu";
        window.open(whatsappUrl, "_blank");
    };
    const packages = [
        {
            name: "Paket Simple Love",
            price: "Rp 150.000",
            features: [
                "1 Desain Template",
                "Tambahkan cerita cinta",
                "Edit Konten Undangan tanpa batas",
                "Link undangan siap dibagikan",
            ],
            note: "Cocok untuk kamu yang suka simpel & praktis.",
        },
        {
            name: "Paket Eternal Love",
            price: "Rp 250.000",
            features: [
                "Custom Undangan sesuai keinginan",
                "Semua fitur Paket Simple Love",
                "Tambahan galeri foto",
            ],
            note: "Pas buat kamu yang ingin undangan lebih personal.",
        },
    ];

    return (
        <section
            className="py-20 bg-gradient-to-b from-pink-50 to-amber-50 font-poppins"
            id="pricing"
        >
            <div className="max-w-6xl mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold mb-14 bg-gradient-to-r from-pink-500 to-amber-500 text-transparent bg-clip-text"
                >
                    Paket Harga
                </motion.h2>

                <div className="grid gap-10 md:grid-cols-2">
                    {packages.map((p, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl flex flex-col justify-between items-center shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="w-full flex flex-col items-center flex-1">
                                <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
                                <p className="text-2xl font-bold mb-6">{p.price}</p>
                                <ul className="text-sm text-gray-700 space-y-2 mb-6 w-full text-left">
                                    {p.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <FaCheckCircle className="text-pink-500 mt-1" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-sm font-medium text-gray-800 mb-6">{p.note}</p>
                            </div>

                            <button
                                onClick={
                                    p.name === "Paket Simple Love"
                                        ? handleSimpleLove
                                        : handleEternalLove
                                }
                                className="w-full md:w-[170px] px-6 py-3 bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded-full text-md font-semibold shadow-md hover:scale-105 hover:from-pink-600 hover:to-amber-600 transition-all duration-200 cursor-pointer"
                            >
                                Pilih Paket
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
