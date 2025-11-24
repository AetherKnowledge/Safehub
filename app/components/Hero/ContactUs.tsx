"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import SafehubIcon from "../Images/SafehubIcon";

const ContactUs = () => {
  return (
    <section
      id="contact"
      className="relative py-20 bg-base-100 flex flex-col items-center justify-center px-4"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-base-100 via-base-200 to-base-100" />

      <div className="relative z-10 flex flex-col text-center items-center justify-center w-full gap-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-2 text-base-content/60">
            We are here to listen
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-base-content">
            Contact SafeHub
          </h2>
          <p className="mt-3 text-sm md:text-base text-base-content/70 max-w-2xl mx-auto">
            Reach out to LCUP Social Welfare Services online. Message us on
            Facebook or send us an email and we&apos;ll get back to you as soon as
            possible.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative w-64 md:w-80">
              <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-xl" />
              <div className="relative rounded-3xl bg-base-200 border border-base-300 p-6 flex items-center justify-center">
                <SafehubIcon className="w-full" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6 items-stretch w-full max-w-md"
          >
            {/* Facebook */}
            <div className="flex flex-col items-center text-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <FaFacebook className="text-4xl text-blue-600" />
              <p className="font-semibold text-base-content">
                Message us on Facebook
              </p>
              <Link
                className="text-sm opacity-80 break-all hover:text-primary transition-colors"
                href="https://facebook.com/sws.lcup.college"
                target="_blank"
                rel="noreferrer"
              >
                https://facebook.com/sws.lcup.college
              </Link>
            </div>

            {/* OR Separator */}
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 h-px bg-base-content/30" />
              <span className="font-semibold text-xs text-base-content/70">
                OR
              </span>
              <div className="flex-1 h-px bg-base-content/30" />
            </div>

            {/* Email */}
            <button className="flex flex-col items-center text-center gap-1 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm cursor-default">
              <MdEmail className="text-4xl text-primary" />
              <p className="text font-semibold text-base-content">Email us</p>
              <p className="text-sm opacity-80">
                lcupguidance.college@email.lcup.edu.ph
              </p>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
