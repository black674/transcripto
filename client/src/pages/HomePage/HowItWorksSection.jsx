import { motion } from "framer-motion";

export default function HowItWorksSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              number: "1",
              title: "Paste YouTube Link",
              description:
                "Copy the URL of any YouTube video you want to transcribe.",
            },
            {
              number: "2",
              title: "Click Extract Transcript",
              description:
                "Our system will process the video and extract the transcript.",
            },
            {
              number: "3",
              title: "Read or Download",
              description:
                "View the transcript online or download it in your preferred format.",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-[#1E88E5] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
