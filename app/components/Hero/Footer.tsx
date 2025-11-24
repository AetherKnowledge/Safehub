"use client";

import { motion } from "framer-motion";
import { FaCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="bg-base-300/90 backdrop-blur border-t border-base-200 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10 py-4 gap-2 text-sm text-base-content/80"
    >
      <div className="flex flex-row items-center gap-2">
        <FaCopyright className="w-4 h-4" />
        <span>SafeHub · LCUP Social Welfare Services</span>
      </div>
      <p className="text-xs text-base-content/60">
        Built as a capstone project to support student counseling and
        development.
      </p>
    </motion.footer>
  );
};

export default Footer;
