import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              question: "How accurate are the transcripts?",
              answer:
                "Our transcripts typically achieve 90-95% accuracy depending on audio quality, accents, and background noise. For professional videos with clear audio, accuracy can reach up to 98%.",
            },
            {
              question: "Which languages are supported?",
              answer:
                "We currently support over 30 languages including English, Spanish, French, German, Japanese, Chinese, Russian, and many more. The accuracy may vary depending on the language.",
            },
            {
              question: "Do you store the transcripts?",
              answer:
                "Yes, transcripts are stored in your account history with no time limit. You can access and re-download them anytime, regardless of your plan.",
            },
            {
              question: "Can I transcribe multiple videos at once?",
              answer:
                "Yes! You can select multiple videos and extract their transcripts simultaneously, saving time and improving your workflow.",
            },
            {
              question: "Do you support playlists from YouTube channels?",
              answer:
                "Absolutely. You can import entire playlists from a YouTube channel and extract transcripts for each video with a single click.",
            },
          ].map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
