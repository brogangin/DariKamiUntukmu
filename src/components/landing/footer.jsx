"use client";

import { motion } from "framer-motion";
import { FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-amber-50 to-pink-50 py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-[250px] text-center md:text-left items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center md:justify-start gap-3">
            <motion.img
              src="/logo.png"
              alt="Logo"
              className="w-16"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-amber-500 text-transparent bg-clip-text">
              DariKamiUntukmu
            </h2>
          </div>

          <p className="mt-3 text-black font-medium italic">
            Merayakan cinta, menghubungkan cerita.
          </p>

          <div className="flex justify-center md:justify-start gap-5 mt-5 text-2xl">
            {[
              { icon: <FaWhatsapp />, href: "#" },
              { icon: <FaInstagram />, href: "#" },
              { icon: <FaTiktok />, href: "#" },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                className="text-pink-600 hover:text-amber-500"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="text-black"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="font-semibold mb-3 text-lg">Metode Pembayaran</h3>
          <motion.img
            src="/payments.png"
            alt="Metode Pembayaran"
            className="w-full max-w-xs mx-auto md:mx-0 shadow-md rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>

      <motion.div
        className="text-center mt-10 text-gray-600 text-sm font-medium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        viewport={{ once: true }}
      >
        © 2025 DariKamiUntukmu. All Rights Reserved.
      </motion.div>
    </footer>
  );
}