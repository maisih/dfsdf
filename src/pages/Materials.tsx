import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Truck, AlertCircle, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

const materials = [
  {
    id: 1,
    name: "Portland Cement",
    project: "Downtown Office Complex",
    quantity: 150,
    unit: "bags",
    unitCost: 12.50,
    totalCost: 1875,
    supplier: "BuildMart Supply Co.",
    status: "In Stock",
    orderDate: "Nov 15, 2024",
    deliveryDate: "Nov 20, 2024",
    location: "Warehouse A"
  },
  {
    id: 2,
    name: "Steel Reinforcement Bars",
    project: "Residential Tower Phase 2",
    quantity: 50,
    unit: "tons",
    unitCost: 850,
    totalCost: 42500,
    supplier: "MetalWorks Inc.",
    status: "Ordered",
    orderDate: "Nov 25, 2024",
    deliveryDate: "Dec 2, 2024",
    location: "Pending"
  },
  {
    id: 3,
    name: "Concrete Blocks",
    project: "Industrial Warehouse",
    quantity: 2000,
    unit: "units",
    unitCost: 3.25,
    totalCost: 6500,
    supplier: "Mason Supply",
    status: "Low Stock",
    orderDate: "Nov 10, 2024",
    deliveryDate: "Nov 18, 2024",
    location: "Yard B"
  },
  {
    id: 4,
    name: "Electrical Conduits",
    project: "Shopping Center Renovation",
    quantity: 500,
    unit: "meters",
    unitCost: 4.50,
    totalCost: 2250,
    supplier: "ElectroSupply Ltd.",
    status: "Delivered",
    orderDate: "Nov 20, 2024",
    deliveryDate: "Nov 24, 2024",
    location: "Storage Room 3"
  }
];

const Materials = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-success/10 text-success border-success/20";
      case "Delivered":
        return "bg-success/10 text-success border-success/20";
      case "Low Stock":
        return "bg-warning/10 text-warning border-warning/20";
      case "Ordered":
        return "bg-primary/10 text-primary border-primary/20";
      case "Out of Stock":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Stock":
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "Low Stock":
      case "Out of Stock":
        return <AlertCircle className="h-4 w-4" />;
      case "Ordered":
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
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
              <h1 className="text-3xl font-bold text-foreground">Materials</h1>
              <p className="text-muted-foreground">Manage inventory and material requests</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Material Request</Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Material
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {materials.map((material) => (
              <Card key={material.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">{material.name}</h3>
                        <Badge variant="outline" className={getStatusColor(material.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(material.status)}
                            {material.status}
                          </div>
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{material.project}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Quantity</span>
                          <p className="font-semibold">{material.quantity.toLocaleString()} {material.unit}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm text-muted-foreground">Unit Cost</span>
                          <p className="font-semibold">${material.unitCost.toFixed(2)}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm text-muted-foreground">Total Cost</span>
                          <p className="font-semibold">${material.totalCost.toLocaleString()}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm text-muted-foreground">Location</span>
                          <p className="font-semibold">{material.location}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span>Supplier: </span>
                          <span className="font-medium text-foreground">{material.supplier}</span>
                        </div>
                        
                        <div>
                          <span>Order Date: </span>
                          <span className="font-medium text-foreground">{material.orderDate}</span>
                        </div>
                        
                        <div>
                          <span>Delivery Date: </span>
                          <span className="font-medium text-foreground">{material.deliveryDate}</span>
                        </div>
                      </div>
                      
                      {material.status === "Low Stock" && (
                        <div className="mt-4 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-warning">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">Low Stock Alert:</span>
                            <span>Consider reordering soon to avoid project delays</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Order More</Button>
                      <Button variant="outline" size="sm">History</Button>
                    </div>
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

export default Materials;