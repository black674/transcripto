import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const defaultMessages = [
  "Booting the engine...",
  "Fetching transcript...",
  "Analyzing video...",
  "Processing data...",
  "Almost done...",
];

export const LoadingOverlay = ({
  isLoading,
  messages = defaultMessages,
  onComplete,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [visible, setVisible] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setCurrentMessageIndex(0);

      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => {
          if (prev < messages.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);

      return () => clearInterval(interval);
    } else {
      const timeout = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isLoading, messages, onComplete]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-background/95 backdrop-blur-sm rounded-xl border border-border shadow-xl p-8 max-w-md w-full mx-4"
      >
        <div className="flex flex-col items-center">
          <div className="relative h-20 w-20 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-3 rounded-full border-4 border-t-primary border-r-transparent border-l-transparent border-b-transparent"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-full border-4 border-t-transparent border-r-primary border-l-transparent border-b-transparent"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-4 rounded-full bg-primary/20"
            >
              <img
                src="/logo_icons/web-app-manifest-512x512.png"
                alt="Logo"
                className="object-contain w-full h-full rounded-full"
              />
            </motion.div>
          </div>

          <h3 className="text-xl font-semibold mb-6 text-primary">
            Processing Your Request
          </h3>

          <div className="h-24 relative w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center text-center"
              >
                <p className="text-lg text-foreground/80">
                  {messages[currentMessageIndex]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex space-x-2 mt-6">
            {messages.map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: currentMessageIndex === index ? 1.2 : 1,
                  opacity: currentMessageIndex === index ? 1 : 0.5,
                }}
                className={`h-2.5 w-2.5 rounded-full ${
                  index <= currentMessageIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingOverlay;
