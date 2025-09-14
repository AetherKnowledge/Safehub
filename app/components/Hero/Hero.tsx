import SafehubIcon from "../Icons/SafehubIcon";
import Navbar from "../Navbar";
import LoginButton from "./LoginButton";

const Hero = () => {
  return (
    <>
      <Navbar />
      <section
        id="hero"
        className="hero w-full h-screen bg-gradient-to-r from-black/95 to-gray-700/95 overflow-hidden py-6"
      >
        {/* Background image layer */}
        <div
          className="absolute h-screen inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${"/images/lcupBg.png"})`,
            opacity: 0.33, // Adjust this value (0 to 1)
          }}
        />

        {/* Content layer */}
        <div className="flex isolate items-center gap-5 text-white lg:pl-20 flex-col w-full lg:flex-row">
          <div className="text-center lg:text-left sm:items-center">
            <h1 className="heading-step-1 font-bold">Need Guidance?</h1>
            <p className="py-6 text-step-1 font-light px-20 lg:px-0">
              Here at LCUP, our Social Welfare Services offers guidance either
              offline or online through SafeHub
            </p>

            <LoginButton />
          </div>
          <div className="flex items-center justify-center w-full ">
            <div className="w-[clamp(25rem,30vw,80rem)]">
              <SafehubIcon className="hidden lg:block" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
