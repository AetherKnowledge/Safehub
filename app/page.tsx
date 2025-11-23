import Hero from "./components/Hero";
import About from "./components/Hero/About";
import ContactUs from "./components/Hero/ContactUs";
import Footer from "./components/Hero/Footer";
import Staff from "./components/Hero/Staff";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col bg-base-100 text-base-content gap-10 overflow-y-auto">
      <Navbar />
      <Hero />
      <About />
      <Staff />
      <ContactUs />
      <Footer />
    </div>
  );
}
