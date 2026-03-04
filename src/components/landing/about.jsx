"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="py-20 bg-gradient-to-b from-amber-50 to-pink-50 " id="about">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8 font-poppins bg-gradient-to-r from-pink-500 to-amber-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Tentang Kami
        </motion.h2>

        <motion.p
          className="text-justify text-black mb-6 leading-relaxed font-medium"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          DariKamiUntukmu lahir dari cinta kami terhadap cerita indah di setiap
          perayaan. Kami percaya, undangan bukan hanya sekadar ajakan datang,
          tapi juga cara untuk berbagi kebahagiaan dan momen spesial kepada
          orang-orang tersayang.
        </motion.p>

        <motion.p
          className="text-justify text-black leading-relaxed font-medium"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Lewat undangan digital, kami ingin membantu setiap pasangan
          menceritakan kisah cintanya dengan cara yang hangat, modern, dan tetap
          berkesan. Karena bagi kami, setiap cinta pantas untuk dirayakan dengan
          indah.
        </motion.p>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <img
            src="/logo.png"
            alt="Logo DariKamiUntukmu"
            className="w-28 h-auto drop-shadow-md"
          />
        </motion.div>
      </div>
    </section>
  );
}
