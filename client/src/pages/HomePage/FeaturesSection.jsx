import { motion } from "framer-motion";

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12 text-center">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: "🌐",
              title: "Multi-language Support",
              description:
                "Extract transcripts in multiple languages from videos around the world.",
            },
            {
              icon: "✓",
              title: "High Accuracy",
              description:
                "Our advanced algorithms ensure the highest possible transcript accuracy.",
            },
            {
              icon: "📄",
              title: "Download Options",
              description:
                "Save your transcripts as TXT or PDF files for easy reference.",
            },
            {
              icon: "⚡",
              title: "Lightning Fast",
              description: "Get your transcript in seconds, not minutes.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
