import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactInformation from "./ContactInformation";
import SocialLinks from "./SocialLinks";
import ContactForm from "./ContactForm";
import FaqTab from "./FaqTab";

export default function ContactPage() {
  return (
    <div className="container min-h-screen flex flex-col justify-center items-center py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground">
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
        <div className="md:col-span-1 space-y-6">
          <ContactInformation />

          <SocialLinks />
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="message" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="message"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Send Message
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Quick Help
              </TabsTrigger>
            </TabsList>

            <TabsContent value="message">
              <ContactForm />
            </TabsContent>

            <TabsContent value="faq">
              <FaqTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
