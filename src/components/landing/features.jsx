"use client";

import { FaLeaf, FaShareAlt, FaCheckSquare } from "react-icons/fa";
import { BsEnvelopeHeartFill } from "react-icons/bs";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      icon: (
        <FaCheckSquare className="text-3xl text-pink-500 group-hover:text-amber-500 transition-colors" />
      ),
      title: "Praktis & Simpel",
      desc: "Tinggal pilih desain, isi detail, dan undanganmu langsung siap dibagikan.",
    },
    {
      icon: (
        <BsEnvelopeHeartFill className="text-3xl text-pink-500 group-hover:text-amber-500 transition-colors" />
      ),
      title: "Romantis & Personal",
      desc: "Setiap desain punya sentuhan cinta yang bisa kamu sesuaikan.",
    },
    {
      icon: (
        <FaLeaf className="text-3xl text-pink-500 group-hover:text-amber-500 transition-colors" />
      ),
      title: "Ramah Lingkungan",
      desc: "Tanpa kertas, tanpa ribet, lebih peduli sama bumi.",
    },
    {
      icon: (
        <FaShareAlt className="text-3xl text-pink-500 group-hover:text-amber-500 transition-colors" />
      ),
      title: "Mudah Dibagikan",
      desc: "Cukup satu link untuk semua orang tersayang.",
    },
  ];

  return (
    <section
      className="py-20 bg-gradient-to-b from-pink-50 to-amber-50"
      id="features"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12 bg-gradient-to-r from-pink-500 to-amber-500 text-transparent bg-clip-text"
        >
          Kenapa pilih DariKamiUntukmu?
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="flex justify-center mb-4 bg-gradient-to-r from-pink-100 to-amber-100 p-4 rounded-full shadow-inner">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
