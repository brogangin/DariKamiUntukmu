import { supabase } from "@/lib/supabaseClient";

import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Templates from "@/components/landing/templates";
import Pricing from "@/components/landing/pricing";
import About from "@/components/landing/about";
import Contact from "@/components/landing/contact";
import Footer from "@/components/landing/footer";

export default function Home() {
    return (
        <div className=" border-gray-200 font-Poppins">
            <Header
                menuItems={[
                    { id: "templates", label: "Template" },
                    { id: "pricing", label: "Harga" },
                    { id: "about", label: "Tentang" },
                    { id: "contact", label: "Kontak" },
                ]}
            />
            <Hero />
            <Features />
            <Templates />
            <Pricing />
            <About />
            <Contact />
            <Footer />
        </div>
    );
}
