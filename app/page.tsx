import Hero from "./components/Hero";
import About from "./components/Hero/About";
import ContactUs from "./components/Hero/ContactUs";
import Footer from "./components/Hero/Footer";
import Staff from "./components/Hero/Staff";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col gap-0">
        <Hero />
        <About />
        <Staff />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}
