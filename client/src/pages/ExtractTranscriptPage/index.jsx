import { motion } from "framer-motion";
import TranscriptExtractor from "@/components/shared/TranscriptExtractor";

export default function ExtractTranscriptPage() {
  return (
    <div className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Extract Transcript</h1>
          <p className="mt-2 text-lg text-gray-600">
            Paste a YouTube URL to extract and analyze its transcript
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm p-8 md:p-12"
        >
          <TranscriptExtractor />
          
          <div className="mt-8 text-center space-y-4">
            <h3 className="text-xl font-medium text-gray-800">
              Why extract YouTube transcripts?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-blue-600 mb-2">Research</h4>
                <p className="text-gray-600">Extract key information from lectures, interviews, and educational content</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-blue-600 mb-2">Accessibility</h4>
                <p className="text-gray-600">Make video content accessible for reading and better comprehension</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-blue-600 mb-2">Analysis</h4>
                <p className="text-gray-600">Search for specific topics or quotes within lengthy video content</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
