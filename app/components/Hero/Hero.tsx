import Image from "next/image";
import SafehubIcon from "../Icons/SafehubIcon";
import LoginButton from "./LoginButton";

const Hero = () => {
  return (
    <section
      id="hero"
      className="hero w-full h-[calc(100vh-5rem)] overflow-hidden py-6 mt-20"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.8), rgba(55,65,81,0.3)), url(/images/lcupBg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
  );
};

function BgImage() {
  return (
    <section
      id="hero"
      className="hero w-full bg-gradient-to-r h-[calc(50vh-5rem)] from-black/95 to-gray-700/95 overflow-hidden py-6 mt-20"
    >
      <Image
        src="/images/lcupBg.png"
        alt="LCUP background"
        fill
        priority
        className="absolute inset-0 z-0 object-cover object-center opacity-30"
        sizes="(max-width: 768px) 1280px"
      />
    </section>
  );
}

export default Hero;
