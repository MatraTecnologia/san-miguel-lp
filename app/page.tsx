import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureStrip from "./components/FeatureStrip";
import PromoBanner from "./components/PromoBanner";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import {
  HomeCategoryGrid,
  HomeFeaturedProducts,
  HomeLatestProducts,
} from "./components/HomeSections";
import {
  CategoryGridSkeleton,
  ProductGridSkeleton,
} from "@/components/skeletons";
import Testimonials from "./components/Testimonials";

async function getHeroConfig() {
  const configs = await prisma.storeConfig.findMany({
    where: { key: { in: ["whatsapp", "whatsapp_message"] } },
  });
  const map = Object.fromEntries(configs.map((c) => [c.key, c.value]));
  return {
    whatsapp: map.whatsapp ?? "5543999999999",
    message: map.whatsapp_message ?? "Olá! Gostaria de saber mais sobre os produtos.",
  };
}

export default async function Home() {
  const { whatsapp, message } = await getHeroConfig();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero whatsapp={whatsapp} message={message} />
        <FeatureStrip />

        <Suspense fallback={<CategoryGridSkeleton />}>
          <HomeCategoryGrid />
        </Suspense>

        <Suspense
          fallback={
            <section className="bg-white py-20 px-6">
              <div className="max-w-6xl mx-auto">
                <ProductGridSkeleton count={6} />
              </div>
            </section>
          }
        >
          <HomeFeaturedProducts />
        </Suspense>

        <PromoBanner />

        <Suspense
          fallback={
            <section className="bg-marfim py-20 px-6">
              <div className="max-w-6xl mx-auto">
                <ProductGridSkeleton count={8} />
              </div>
            </section>
          }
        >
          <HomeLatestProducts />
        </Suspense>

        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
