"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Templates() {
  const templates = [
    {
      id: "01",
      name: "Warm",
      img: "/warm.png",
    },
    {
      id: "02",
      name: "Cool",
      img: "/cool.png",
    },
    {
      id: "03",
      name: "Earth",
      img: "/earth.png",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50 to-pink-50" id="templates">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-12 font-poppins bg-gradient-to-r from-pink-500 to-amber-500 text-transparent bg-clip-text"
        >
          Template Desain Undangan
        </motion.h2>

        <div className="grid gap-10 md:grid-cols-3">
          {templates.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-[32px] shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
            >
              <img
                src={t.img}
                alt={t.name}
                className="rounded-[28px] w-[270px] h-[420px] object-cover mx-auto shadow-md"
              />
              <h3 className="mt-6 font-semibold text-lg font-poppins text-gray-800">
                {t.id} - {t.name}
              </h3>
              <div className="mt-6 flex flex-col gap-3 w-full">
                <Link href="/preview-undangan" className="inline-block px-4 py-2 bg-amber-500 text-white rounded-full text-base font-semibold font-poppins hover:bg-pink-500 hover:text-white transition cursor-pointer">
                  Lihat Template
                </Link>
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded-full text-base font-semibold font-poppins shadow-md hover:scale-105 hover:from-pink-600 hover:to-amber-600 transition-all duration-200 cursor-pointer">
                  Pesan Sekarang
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
