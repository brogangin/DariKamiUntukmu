"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="py-20 bg-gradient-to-b from-pink-50 to-amber-50" id="contact">
      <div className="max-w-4xl mx-auto px-6 text-center font-poppins">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-amber-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Kontak Kami
        </motion.h2>

        <motion.p
          className="text-black mb-10 font-medium max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Punya pertanyaan, atau siap buat undangan digital impianmu?  
          <br />Kami selalu senang mendengar cerita cintamu.
        </motion.p>

        <motion.form
          className="grid gap-4 text-left max-w-xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <input
            type="text"
            placeholder="Nama"
            className="border border-pink-500 p-3 rounded-xl bg-white focus:ring-2 focus:ring-amber-400 outline-none transition font-medium"
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-pink-500 p-3 rounded-xl bg-white focus:ring-2 focus:ring-amber-400 outline-none transition font-medium"
          />
          <textarea
            placeholder="Pesan"
            rows="4"
            className="border border-pink-500 p-3 rounded-xl bg-white focus:ring-2 focus:ring-amber-400 outline-none transition font-medium"
          ></textarea>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-amber-400 text-white rounded-full font-semibold shadow-md cursor-pointer hover:opacity-90 transition"
          >
            Kirim
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
