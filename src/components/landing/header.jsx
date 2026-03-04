"use client";

import React, { useState } from "react";
import Logo from "./logo";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/AuthProviderClient";

// motion-enabled Link to preserve framer-motion props on navigation links
const MotionLink = motion.create(Link);

const Header = ({ menuItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const yOffset = -80;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
            setIsOpen(false);
        }
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full px-6 py-4 fixed top-0 left-0 z-50 bg-white/90 backdrop-blur-md shadow-md"
        >
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <motion.div
                    onClick={() => scrollToSection("hero")}
                    className="cursor-pointer font-semibold text-lg text-black flex items-center gap-2"
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Logo size={60} textSize="text-2xl" />
                </motion.div>

                {/* Desktop */}
                <nav className="hidden md:flex space-x-8 ml-2">
                    {menuItems.map((item, index) => (
                        <motion.button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="relative text-gray-500 text-base font-medium hover:text-black transition cursor-pointer group"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            {item.label}
                            <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-gradient-to-r from-pink-500 to-amber-500 transition-all duration-300 group-hover:w-full"></span>
                        </motion.button>
                    ))}
                </nav>

                <div className="hidden md:flex items-center space-x-3">
                    {user ? (
                        <MotionLink
                            href="/dashboard"
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md cursor-pointer"
                        >
                            Dashboard
                        </MotionLink>
                    ) : (
                        <>
                            <MotionLink
                                href="/sign-in"
                                whileHover={{ scale: 1.07 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md cursor-pointer"
                            >
                                Masuk
                            </MotionLink>
                            <MotionLink
                                href="/sign-up"
                                whileHover={{ scale: 1.07 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="px-5 py-2 rounded-full text-sm font-semibold border border-pink-500 text-pink-600 bg-white hover:bg-pink-50 shadow-sm cursor-pointer"
                            >
                                Daftar
                            </MotionLink>
                        </>
                    )}
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    <motion.button
                        className="text-pink-500 focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                        whileTap={{ scale: 0.9 }}
                    >
                        {isOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
                    </motion.button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden mt-4 px-6 pt-5 space-y-4 bg-white/95 backdrop-blur-md shadow-lg pb-6 rounded-xl"
                    >
                        {menuItems.map((item, i) => (
                            <motion.button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="block w-full text-left text-gray-700 text-base font-medium hover:text-pink-600 transition"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                            >
                                {item.label}
                            </motion.button>
                        ))}

                        <div className="flex flex-col space-y-3 pt-4">
                            {user ? (
                                <MotionLink
                                    href="/dashboard"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full h-[40px] flex items-center justify-center rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md"
                                >
                                    Dashboard
                                </MotionLink>
                            ) : (
                                <>
                                    <MotionLink
                                        href="/sign-in"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full h-[40px] flex items-center justify-center rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md"
                                    >
                                        Masuk
                                    </MotionLink>
                                    <MotionLink
                                        href="/sign-up"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full h-[40px] flex items-center justify-center rounded-full text-sm font-semibold border border-pink-500 text-pink-600 bg-white hover:bg-pink-50 shadow-sm"
                                    >
                                        Daftar
                                    </MotionLink>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Header;
