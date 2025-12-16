"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

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
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % staffMembers.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex(
      (prev) => (prev - 1 + staffMembers.length) % staffMembers.length
    );
  };

  useEffect(() => {
    if (isHovered) return;

    const id = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % staffMembers.length);
    }, 5000);

    return () => clearInterval(id);
  }, [isHovered]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <section
      id="staff"
      className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-content overflow-hidden"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 border-2 border-primary-content/10 rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 border-2 border-primary-content/10 rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-primary-content/10 backdrop-blur-sm rounded-full text-xs font-bold tracking-[0.2em] uppercase border border-primary-content/20">
              Meet the Team
            </span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-content to-primary-content/80">
            SWS Staff Members
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-base md:text-lg text-primary-content/90 leading-relaxed">
            The Student Welfare Services (SWS) team behind SafeHub is here to
            listen, support, and guide LCUP students every step of the way.
          </p>
        </motion.div>

        {/* Desktop View - 3 Cards Carousel */}
        <div className="hidden md:block">
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center justify-center gap-6 lg:gap-8 min-h-[420px]">
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="btn btn-circle btn-lg bg-primary-content/10 backdrop-blur-sm border-2 border-primary-content/30 text-primary-content hover:bg-primary-content/20 hover:border-primary-content/50 transition-all duration-300 shadow-xl shrink-0"
              >
                <HiChevronLeft className="text-2xl" />
              </motion.button>

              {/* Cards Container */}
              <div className="flex items-center justify-center gap-6 relative">
                {[-1, 0, 1].map((offsetStep) => {
                  const index =
                    (activeIndex + offsetStep + staffMembers.length) %
                    staffMembers.length;
                  const staff = staffMembers[index];
                  const isCenter = offsetStep === 0;

                  return (
                    <motion.article
                      key={`${staff.name}-${index}`}
                      initial={false}
                      animate={{
                        scale: isCenter ? 1 : 0.85,
                        opacity: isCenter ? 1 : 0.6,
                        y: isCenter ? 0 : 10,
                        zIndex: isCenter ? 10 : 1,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      className={`card bg-base-100 text-base-content shadow-2xl border-2 ${
                        isCenter
                          ? "border-primary/30 w-80 lg:w-96"
                          : "border-base-content/10 w-72 lg:w-80"
                      } hover:shadow-primary/20 transition-all duration-300 shrink-0`}
                    >
                      <figure className="pt-8 px-8">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-full blur-xl opacity-30 ${
                              isCenter ? "scale-110" : "scale-100"
                            } transition-transform duration-500`}
                          />
                          <img
                            src={staff.src}
                            alt={staff.name}
                            className="relative w-full h-full rounded-full object-cover object-top border-4 border-primary/20"
                          />
                        </div>
                      </figure>
                      <div className="card-body items-center text-center px-6 pb-8">
                        <div className="space-y-2 min-h-[80px] flex flex-col items-center justify-start">
                          <h3 className="font-bold text-lg leading-tight">
                            {staff.name}
                          </h3>
                          <div className="badge badge-primary badge-outline text-xs font-semibold px-3 py-3">
                            {staff.role}
                          </div>
                        </div>
                        <p className="text-sm text-base-content/70 leading-relaxed mt-4 min-h-[120px]">
                          {staff.description}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="btn btn-circle btn-lg bg-primary-content/10 backdrop-blur-sm border-2 border-primary-content/30 text-primary-content hover:bg-primary-content/20 hover:border-primary-content/50 transition-all duration-300 shadow-xl shrink-0"
              >
                <HiChevronRight className="text-2xl" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile View - Single Card with Slide Animation */}
        <div className="md:hidden">
          <div className="relative min-h-[500px] flex items-center justify-center px-4">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.article
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="card bg-base-100 text-base-content shadow-2xl border-2 border-primary/30 w-full max-w-sm absolute"
              >
                <figure className="pt-8 px-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-full blur-xl opacity-30" />
                    <img
                      src={staffMembers[activeIndex].src}
                      alt={staffMembers[activeIndex].name}
                      className="relative w-32 h-32 rounded-full object-cover object-top border-4 border-primary/20"
                    />
                  </div>
                </figure>
                <div className="card-body items-center text-center px-6 pb-8">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold leading-tight">
                      {staffMembers[activeIndex].name}
                    </h3>
                    <div className="badge badge-primary badge-outline text-xs font-semibold px-3 py-3">
                      {staffMembers[activeIndex].role}
                    </div>
                  </div>
                  <p className="text-sm text-base-content/70 leading-relaxed mt-4">
                    {staffMembers[activeIndex].description}
                  </p>
                </div>
              </motion.article>
            </AnimatePresence>

            {/* Mobile Navigation Buttons */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="btn btn-circle bg-primary-content/10 backdrop-blur-sm border-2 border-primary-content/30 text-primary-content pointer-events-auto shadow-xl"
              >
                <HiChevronLeft className="text-xl" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="btn btn-circle bg-primary-content/10 backdrop-blur-sm border-2 border-primary-content/30 text-primary-content pointer-events-auto shadow-xl"
              >
                <HiChevronRight className="text-xl" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="mt-8 md:mt-12 flex justify-center gap-2">
          {staffMembers.map((staff, index) => (
            <motion.button
              key={staff.name}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex
                  ? "w-12 h-3 bg-primary-content shadow-lg"
                  : "w-3 h-3 bg-primary-content/30 hover:bg-primary-content/50"
              }`}
              aria-label={`Go to ${staff.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Staff;
