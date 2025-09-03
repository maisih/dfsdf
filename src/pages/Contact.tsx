import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Building2, Linkedin, Send } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <div className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-surface border-r border-border shadow-soft overflow-y-auto">
          <Sidebar />
        </div>
        <main className="flex-1 md:ml-64 ml-0 p-4 md:p-6 pb-24">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 via-primary to-primary/70 text-primary-foreground">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.4),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.25),transparent_40%)]" />
            <div className="relative p-8">
              <div className="flex items-start md:items-center justify-between gap-6 flex-col md:flex-row">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                    MT
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Mustapha Tourabi</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm opacity-95">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Civil Engineer
                      </Badge>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> Morocco
                      </span>
                    </div>
                  </div>
                </div>
                <a
                  href="mailto:tourabimustapha10@outlook.com"
                  className="inline-flex items-center gap-2 rounded-md bg-white text-primary px-4 py-2 font-medium shadow hover:shadow-md transition-shadow"
                >
                  <Mail className="h-4 w-4" /> Contact: tourabimustapha10@outlook.com
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5"/>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  I’m Mustapha Tourabi, a civil engineer from Morocco, focused on modern site workflows, safety, and delivery at scale.
                  This platform streamlines construction management with clarity and speed.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5"/>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <a href="mailto:tourabimustapha10@outlook.com" className="text-primary font-medium hover:underline">
                  tourabimustapha10@outlook.com
                </a>
                <p className="text-xs text-muted-foreground mt-2">Expect replies within 24–48 hours.</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Send className="h-5 w-5"/>Quick Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  For project inquiries, partnerships, or support, reach out via email.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contact;
