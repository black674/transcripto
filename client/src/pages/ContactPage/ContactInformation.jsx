import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

export default function ContactInformation() {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Get in Touch</CardTitle>
        <CardDescription>
          Choose the most convenient way to reach us
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 transition-colors hover:text-primary">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-muted-foreground">support@fake.com</p>
          </div>
        </div>
        <div className="flex items-center gap-3 transition-colors hover:text-primary">
          <Phone className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="flex items-center gap-3 transition-colors hover:text-primary">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-sm text-muted-foreground">
              San Francisco, CA 94105
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 transition-colors hover:text-primary">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Business Hours</p>
            <p className="text-sm text-muted-foreground">
              Mon - Fri: 9am - 6pm PST
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
