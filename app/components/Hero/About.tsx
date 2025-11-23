import AboutSVG from "./AboutSVG";

const About = () => {
  return (
    <section
      id="about"
      className="flex flex-col bg-base-100 w-full h-full items-center justify-center pb-10 px-2"
    >
      <h2 className="text-center text-base-content font-bold uppercase tracking-widest heading-step-2">
        About Us
      </h2>
      <div className="flex flex-col lg:flex-row justify-center items-center">
        <div className="w-full flex justify-center text-base-content">
          <div className="relative square-image-1 text-base-content">
            <AboutSVG />
          </div>
        </div>
        <div className="w-full flex flex-col items-start px-2">
          <h3 className="text-step-1 font-semibold text-base-content mb-2">
            Welcome to SafeHub,
          </h3>
          <p className="text-step-2 leading-relaxed text-base-content/80">
            The online booking system designed specifically for SWS of LCUP! We
            understand the challenges of coordinating schedules, and our goal is
            to make booking appointments and managing your time as simple and
            straightforward as possible.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
