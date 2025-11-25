"use client";

import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa";
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
            Facebook or send us an email and we&apos;ll get back to you as soon
            as possible.
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
              <FaPhone className="text-4xl text-primary" />
              <p className="font-semibold text-base-content">Contact us</p>
              <p className="text-sm opacity-80">
                BED: (044) 931-8638 Local 138 Local 112
              </p>
              <p className="text-sm opacity-80">
                College/Career: (044) 931-8615 Local 115
              </p>
              <p className="text-sm opacity-80">
                Extension Office: (044) 931-8659 Local 119
              </p>
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
            <button className="flex flex-col items-center text-center gap-1 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <MdEmail className="text-4xl text-primary" />
              <p className="text font-semibold text-base-content">Email us</p>
              <p className="text-sm opacity-80">
                lcupguidance.kto10@email.lcup.edu.ph
              </p>
              <p className="text-sm opacity-80">
                lcupguidance.shs@email.lcup.edu.ph
              </p>
              <p className="text-sm opacity-80">
                lcupguidance.college@email.lcup.edu.ph
              </p>
              <p className="text-sm opacity-80">
                lcupguidance.gs@email.lcup.edu.ph
              </p>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
