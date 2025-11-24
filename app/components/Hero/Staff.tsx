"use client";

import { motion } from "framer-motion";

const staffMembers = [
  {
    name: "Ms. Dela Cruz",
    role: "Assistant Manager",
    description:
      "Supports students in scheduling and coordinating counseling sessions, ensuring every booking is handled with care.",
  },
  {
    name: "Mr. Manansala",
    role: "Assistant Manager",
    description:
      "Helps manage student cases and availability so counselors can focus on meaningful, one-on-one conversations.",
  },
  {
    name: "Ms. Trinidad",
    role: "Assistant Manager",
    description:
      "Provides guidance and assistance for students who need help navigating SafeHub and SWS services.",
  },
];

const Staff = () => {
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

        <div className="grid gap-8 md:grid-cols-3">
          {staffMembers.map((staff, index) => (
            <motion.article
              key={staff.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card bg-base-100 text-base-content shadow-xl border border-white/10 hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300"
            >
              <figure className="p-4 pb-0 flex justify-center">
                <img
                  src="/images/noUser.svg"
                  alt={staff.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title flex flex-col gap-0">
                  {staff.name}
                  <span className="text-sm text-primary font-medium">
                    {staff.role}
                  </span>
                </h3>
                <p className="text-sm text-base-content/80 mt-2">
                  {staff.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Staff;
