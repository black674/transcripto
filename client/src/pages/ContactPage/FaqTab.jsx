import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FaqTab() {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>
          Quick answers to common questions. Can't find what you're looking for?
          Switch to the message tab to contact us directly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:text-primary transition-colors">
              How do I get started with Transcripto?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Simply sign up for an account, paste your YouTube video URL, and
              we'll generate the transcript for you. You can start with our free
              tier to try out the service.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:text-primary transition-colors">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              We accept all major credit cards, PayPal, and various payment
              methods through Stripe. All payments are secure and encrypted.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="hover:text-primary transition-colors">
              Can I cancel my subscription anytime?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, you can cancel your subscription at any time from your
              account settings. You'll continue to have access until the end of
              your billing period.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="hover:text-primary transition-colors">
              How accurate are the transcripts?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our transcripts are highly accurate and use the same technology as
              YouTube's auto-captions. The accuracy depends on the video's audio
              quality and speaker clarity.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
