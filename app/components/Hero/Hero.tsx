"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SafehubIcon from "../Images/SafehubIcon";
import LoginButton from "./LoginButton";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative w-full py-10 overflow-hidden mt-15 flex items-center justify-center"
    >
      {/* Background overlay */}
      <div className="absolute inset-0">
        <Image
          className="absolute inset-0 bg-cover bg-center"
          src="/images/lcupBg.png"
          alt="LCUP Campus Background"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-slate-800/60" />
        <motion.div
          className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-blue-500/30 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="absolute -left-40 bottom-0 w-[28rem] h-[28rem] rounded-full bg-indigo-500/25 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex isolate items-center gap-10 text-white px-8 lg:px-20 flex-col-reverse lg:flex-row w-full max-w-8xl">
        <motion.div
          className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-1 text-xs font-medium tracking-[0.2em] uppercase backdrop-blur-sm"
          >
            LCUP · Social Welfare Services
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="heading-step-1 font-extrabold leading-tight drop-shadow-lg bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent"
          >
            Need someone
            <br />
            to talk to?
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="py-6 text-step-1 font-light max-w-xl text-white/80"
          >
            SafeHub connects LCUP students with counselors through a secure,
            online platform. Book appointments, join video sessions, and reach
            out whenever you need support—on-campus or at home.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <LoginButton />
            <p className="text-xs sm:text-sm text-white/70 max-w-xs">
              Available for LCUP college students.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="relative w-[clamp(18rem,28vw,26rem)]">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-sky-400/40 to-emerald-400/40 blur-2xl" />
            <div className="relative rounded-3xl bg-white/5 border border-white/15 backdrop-blur-xl p-6 shadow-2xl flex items-center justify-center">
              <SafehubIcon className="w-full" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
