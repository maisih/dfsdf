import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Camera, Download, Eye, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const photos = [
  {
    id: 1,
    title: "Foundation Progress - East Wing",
    project: "Downtown Office Complex",
    date: "Nov 27, 2024",
    uploadedBy: "Sarah Johnson",
    category: "Progress",
    tags: ["foundation", "concrete", "progress"],
    description: "Foundation excavation completed, ready for concrete pour",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 2,
    title: "Steel Frame Installation",
    project: "Residential Tower Phase 2",
    date: "Nov 26, 2024",
    uploadedBy: "Mike Chen",
    category: "Construction",
    tags: ["steel", "frame", "installation"],
    description: "Level 3-4 steel frame installation in progress",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 3,
    title: "Safety Inspection Checkpoint",
    project: "Industrial Warehouse",
    date: "Nov 25, 2024",
    uploadedBy: "Alex Rodriguez",
    category: "Safety",
    tags: ["safety", "inspection", "compliance"],
    description: "Weekly safety inspection completed - all areas compliant",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 4,
    title: "Electrical Conduit Layout",
    project: "Shopping Center Renovation",
    date: "Nov 24, 2024",
    uploadedBy: "Emily Davis",
    category: "MEP",
    tags: ["electrical", "conduit", "layout"],
    description: "Electrical conduit routing for main distribution panel",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 5,
    title: "Before/After - Site Preparation",
    project: "Downtown Office Complex",
    date: "Nov 23, 2024",
    uploadedBy: "Tom Wilson",
    category: "Before/After",
    tags: ["site", "preparation", "comparison"],
    description: "Site before and after initial preparation work",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 6,
    title: "Material Delivery Documentation",
    project: "Residential Tower Phase 2",
    date: "Nov 22, 2024",
    uploadedBy: "Sarah Johnson",
    category: "Delivery",
    tags: ["materials", "delivery", "documentation"],
    description: "Steel beam delivery and quality inspection photos",
    thumbnail: "/api/placeholder/300/200"
  }
];

const Photos = () => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Progress":
        return "bg-primary/10 text-primary border-primary/20";
      case "Safety":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Construction":
        return "bg-success/10 text-success border-success/20";
      case "MEP":
        return "bg-warning/10 text-warning border-warning/20";
      case "Before/After":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Delivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Photos</h1>
              <p className="text-muted-foreground">Project documentation and progress photos</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export All
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Photos
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="shadow-soft hover:shadow-medium transition-all duration-300 group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={photo.thumbnail}
                    alt={photo.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Full
                    </Button>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`absolute top-2 right-2 ${getCategoryColor(photo.category)}`}
                  >
                    {photo.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{photo.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{photo.project}</p>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {photo.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {photo.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                    <div className="flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      {photo.uploadedBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {photo.date}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Photos;