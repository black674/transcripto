import { motion } from "framer-motion";
import TranscriptExtractor from "@/components/shared/TranscriptExtractor";
import PricingTiers from "@/components/shared/pricingTiers/PricingTiers";
import HowItWorksSection from "./HowItWorksSection";
import FAQSection from "./FAQSection";
import CallToActionSection from "./CallToActionSection";
import FeaturesSection from "./FeaturesSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="w-full bg-gradient-to-r from-[#42A5F5] to-[#00BCD4] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white my-[60px] mx-auto max-w-[700px] w-full px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get Your <span className="inline-block animate-float">YouTube</span>{" "}
            Video Transcript Instantly
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TranscriptExtractor />
            <p className="text-white mt-4">
              Get started for free — create your account in seconds!
            </p>
          </motion.div>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <PricingTiers />
        </div>
      </section>
      <FAQSection />
      <CallToActionSection />
    </div>
  );
}
