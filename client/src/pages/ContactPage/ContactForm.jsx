import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export default function ContactForm() {
  const [formStatus, setFormStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const inputs = [
    {
      id: "name",
      name: "name",
      type: "text",
      placeholder: "John Doe",
      label: "Name",
      required: true,
    },
    {
      id: "email",
      name: "email",
      type: "email",
      placeholder: "test@example.com",
      label: "Email",
      required: true,
    },
    {
      id: "subject",
      name: "subject",
      type: "text",
      placeholder: "Subject",
      label: "Subject",
      required: true,
    },
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setFormStatus({ type: null, message: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormStatus({
        type: "success",
        message: "Thank you for your message! We'll get back to you soon.",
      });

      console.log(data);
      reset();
    } catch (error) {
      console.log(error);
      setFormStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Send us a Message</CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you within 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formStatus.type && (
          <Alert
            className={`mb-4 ${
              formStatus.type === "success"
                ? "border-green-500/50 text-green-500"
                : "border-destructive/50 text-destructive"
            }`}
          >
            {formStatus.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {formStatus.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{formStatus.message}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {inputs.map((input) => (
              <div
                key={input.id}
                className={`space-y-2 ${
                  input.id === "subject" && "col-span-2"
                }`}
              >
                <label htmlFor="name" className="text-sm font-medium">
                  {input.label}
                </label>
                <Input
                  id={input.id}
                  name={input.name}
                  placeholder={input.placeholder}
                  {...register(input.name)}
                  className="transition-all duration-200"
                />
                <p className="text-sm text-destructive">
                  {errors[input.name]?.message}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full min-h-[100px] rounded-md border border-input focus:outline-1 bg-background px-3 py-2 text-sm"
              placeholder="Your message..."
              {...register("message")}
            />
            <p className="text-sm text-destructive">
              {errors.message?.message}
            </p>
          </div>
          <Button
            type="submit"
            className="w-full transition-all duration-200 hover:scale-[1.02]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
