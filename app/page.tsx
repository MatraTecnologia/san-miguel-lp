import Hero from "./components/Hero";
import About from "./components/About";
import Products from "./components/Products";
import Differentials from "./components/Differentials";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <About />
      <Products />
      <Differentials />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
