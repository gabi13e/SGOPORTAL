import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Facebook } from "lucide-react";

export default function Contact() {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-10">
        Get in touch with the Scholars and Grants Office. [Replace with official details.]
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Office Information</CardTitle>
            <CardDescription>Visit us during office hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">Office Address</p>
                <p className="text-muted-foreground">SGO Office, [Building], Main Campus, [Address Placeholder]</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">Office Hours</p>
                <p className="text-muted-foreground">Monday – Friday, 8:00 AM – 5:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reach Us Online</CardTitle>
            <CardDescription>For inquiries and follow-ups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" />
              <span>sgo@yourschool.edu.ph</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" />
              <span>(+63) 000-000-0000</span>
            </div>
            <div className="flex items-center gap-3">
              <Facebook className="h-4 w-4 text-primary" />
              <span>facebook.com/SGOyourschool</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
