"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const staffMembers = [
  {
    name: "Prof. Maria Isabel Guevara, RGC",
    role: "Coordinator",
    description:
      "Oversees and manages the counseling schedule, ensuring students receive timely, organized, and compassionate support.",
    src: "/images/staff/Ms_Maria_Isabel_Guevara.jpg",
  },
  {
    name: "Ms. Filomena De Jesus, RGC",
    role: "Guidance Counselor",
    description:
      "Provides expert guidance and manages student cases with care, helping ensure meaningful and focused one-on-one sessions.",
    src: "/images/staff/Ms_Filomena_De_Jesus.jpg",
  },
  {
    name: "Ms. Connie Magsino, RGC, RPm",
    role: "Guidance Counselor",
    description:
      "Supports students through personalized guidance and assists those navigating SafeHub and SWS services.",
    src: "/images/staff/Ms_Connie_Magsino.jpg",
  },
  {
    name: "Ms. Sciroan Torres, RPm, CHRA",
    role: "Psychometrician/Career and Job Placement Officer",
    description:
      "Assists students with assessments, career guidance, and navigation of SafeHub and SWS resources for their personal and professional development.",
    src: "/images/staff/Ms_Sciroan_Torres.jpg",
  },
  {
    name: "Ms. Justine Fe Brusola",
    role: "Psychometrician",
    description:
      "Facilitates assessments and offers supportive guidance while helping students access SafeHub and SWS services effectively.",
    src: "/images/staff/Ms_Justine_Fe_Brusola.jpg",
  },
];

const Staff = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % staffMembers.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) =>
      (prev - 1 + staffMembers.length) % staffMembers.length
    );
  };

  useEffect(() => {
    if (isHovered) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % staffMembers.length);
    }, 4500);

    return () => clearInterval(id);
  }, [isHovered]);

  return (
    <section
      id="staff"
      className="relative py-20 bg-gradient-to-b from-primary to-primary/90 text-primary-content overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent_60%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3 text-primary-content/80">
            Meet the team
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">SWS Staff Members</h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-primary-content/80">
            The Social Welfare Services (SWS) team behind SafeHub is here to
            listen, support, and guide LCUP students every step of the way.
          </p>
        </motion.div>

        <div className="relative mt-6">
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-stretch justify-center gap-4 md:gap-6">
              {/* Prev button beside first visible card */}
              <button
                type="button"
                onClick={handlePrev}
                className="btn btn-sm btn-ghost border border-primary/30 text-primary-content/80 hover:border-primary/60 self-center"
              >
                ◀
              </button>

              {[-1, 0, 1].map((offsetStep) => {
                const index =
                  (activeIndex + offsetStep + staffMembers.length) %
                  staffMembers.length;
                const staff = staffMembers[index];
                const distance = Math.abs(offsetStep);
                const scale = Math.max(0.75, 1 - distance * 0.15);
                const opacity = Math.max(0.5, 1 - distance * 0.25);
                const x = offsetStep * 120; // side cards slide in/out horizontally

                return (
                  <motion.article
                    key={staff.name}
                    initial={{ opacity: 0, x }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    animate={{ scale, opacity, x }}
                    transition={{ type: "tween", duration: 0.6, ease: "easeInOut" }}
                    className="card bg-base-100 text-base-content shadow-xl border border-white/10 origin-center w-52 md:w-60 lg:w-64"
                  >
                    <figure className="p-4 pb-0 flex justify-center">
                      <img
                        src={staff.src}
                        alt={staff.name}
                        className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover"
                      />
                    </figure>
                    <div className="card-body items-center text-center px-5 pb-6">
                      <h3 className="card-title flex flex-col gap-0 text-sm md:text-lg">
                        {staff.name}
                        <span className="text-xs md:text-sm text-primary font-medium">
                          {staff.role}
                        </span>
                      </h3>
                      <p className="text-xs md:text-sm text-base-content/80 mt-2">
                        {staff.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}

              {/* Next button beside last visible card */}
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-sm btn-ghost border border-primary/30 text-primary-content/80 hover:border-primary/60 self-center"
              >
                ▶
              </button>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {staffMembers.map((staff, index) => (
                <button
                  key={staff.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full border transition-colors duration-200 ${
                    index === activeIndex
                      ? "bg-primary border-primary"
                      : "bg-primary-content/20 border-primary-content/40 hover:bg-primary-content/40"
                  }`}
                  aria-label={`Go to ${staff.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Staff;
