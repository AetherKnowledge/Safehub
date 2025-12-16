"use client";

import { motion } from "framer-motion";
import AboutSVG from "./AboutSVG";

const featureItems = [
  {
    title: "Appointment Booking",
    description:
      "Students can quickly book counseling sessions, while counselors manage their availability in real time using Supabase.",
  },
  {
    title: "Secure Video Counseling",
    description:
      "One-on-one video calls powered by WebRTC help students connect with counselors in a safe, private space.",
  },
  {
    title: "Announcements & Updates",
    description:
      "Admins and counselors can publish important posts and reminders so students never miss key information.",
  },
  {
    title: "AI Chatbot Support",
    description:
      "When no counselor is available, an AI chatbot—powered by n8n workflows and Ollama models—offers instant support.",
  },
  {
    title: "Roles & Access Control",
    description:
      "NextAuth + Supabase Auth handle authentication for students, counselors, and admins with the right permissions.",
  },
  {
    title: "Modern LCUP Tech Stack",
    description:
      "Built with Next.js, Tailwind/DaisyUI, Supabase, WebRTC, n8n, and Docker-based deployments for reliability.",
  },
];

const About = () => {
  return (
    <section
      id="about"
      className="relative bg-base-100 py-20 flex items-center justify-center px-4"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-base-100 via-base-200/60 to-base-100" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-5/12 flex justify-center"
        >
          <div className="relative w-full max-w-sm">
            <div className="absolute -inset-6 rounded-3xl bg-primary/10 blur-2xl" />
            <div className="relative rounded-3xl bg-base-200 border border-base-300 p-6 flex items-center justify-center">
              <AboutSVG />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="w-full lg:w-7/12"
        >
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3 text-primary">
            About SafeHub
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            A digital space for LCUP student support
          </h2>
          <p className="text-sm md:text-base text-base-content/80 mb-6">
            SafeHub is a capstone project built for La Consolacion University
            Philippines (LCUP) to streamline the student counseling and
            development process. It gives students a safe, convenient way to
            connect with Student Welfare Services wherever they are.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {featureItems.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl bg-base-100 border border-base-300/70 p-4 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-base-content mb-1">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-base-content/75">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
