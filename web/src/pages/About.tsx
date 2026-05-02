import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">About the Scholars and Grants Office</h1>
      <p className="text-muted-foreground mb-10">
        [Replace this content with your official SGO description.]
      </p>

      <div className="prose max-w-none mb-10">
        <p className="text-base leading-relaxed text-foreground">
          The Scholars and Grants Office (SGO) is the academic unit responsible for the administration of
          scholarship and grant programs offered by the institution and its partner organizations. The office
          oversees the entire scholarship lifecycle — from application screening and eligibility verification,
          to renewal monitoring and graduation — ensuring transparent, equitable access for deserving students.
        </p>
        <p className="text-base leading-relaxed text-foreground mt-4">
          Through this digital portal, the SGO modernizes its operations by automating manual processes,
          centralizing scholar records, and offering real-time analytics for evidence-based decision-making.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <Target className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            [Placeholder] To provide deserving students access to quality education through well-managed
            scholarship and grant programs.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Eye className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Vision</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            [Placeholder] To be a leading scholarships office recognized for transparency, efficiency, and
            scholar success.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Heart className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Core Values</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            [Placeholder] Integrity · Service · Excellence · Stewardship.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
