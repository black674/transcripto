import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function SocialLinks() {
  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  ];

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Connect With Us</CardTitle>
        <CardDescription>Follow us on social media for updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around">
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full transition-colors hover:bg-muted"
              title={label}
            >
              <Icon className="h-6 w-6 transition-transform hover:scale-110" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
