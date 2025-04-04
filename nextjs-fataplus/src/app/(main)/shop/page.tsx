'use client';

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ShoppingCart } from "lucide-react";

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  // Mock products data
  const products = [
    {
      id: "1",
      name: "Organic Rice Seeds",
      price: 15000,
      description: "High-quality organic rice seeds for planting",
      sellerName: "Rakoto Farms",
      location: "Antananarivo",
      imageUrl: "https://placehold.co/300x200",
      category: "seeds",
    },
    {
      id: "2",
      name: "Farming Hoe",
      price: 25000,
      description: "Durable farming hoe for field work",
      sellerName: "Agri Tools",
      location: "Toamasina",
      imageUrl: "https://placehold.co/300x200",
      category: "tools",
    },
    {
      id: "3",
      name: "Organic Fertilizer",
      price: 30000,
      description: "Natural fertilizer for better crop yield",
      sellerName: "Eco Farms",
      location: "Fianarantsoa",
      imageUrl: "https://placehold.co/300x200",
      category: "fertilizer",
    },
    {
      id: "4",
      name: "Tomato Seeds",
      price: 8000,
      description: "High-yield tomato seeds",
      sellerName: "Seed Master",
      location: "Mahajanga",
      imageUrl: "https://placehold.co/300x200",
      category: "seeds",
    },
    {
      id: "5",
      name: "Watering Can",
      price: 12000,
      description: "5-liter capacity watering can",
      sellerName: "Garden Tools",
      location: "Antananarivo",
      imageUrl: "https://placehold.co/300x200",
      category: "tools",
    },
    {
      id: "6",
      name: "Pesticide Sprayer",
      price: 35000,
      description: "Manual pesticide sprayer",
      sellerName: "Agri Tools",
      location: "Toliara",
      imageUrl: "https://placehold.co/300x200",
      category: "tools",
    },
  ];

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout title="Shop">
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Agricultural Marketplace</h1>
          <Button variant="outline" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="seeds">Seeds</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="fertilizer">Fertilizer</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{product.sellerName}</span>
                      <span className="mx-2">•</span>
                      <span>{product.location}</span>
                    </div>
                  </div>
                  <div className="font-bold text-lg">
                    {product.price.toLocaleString()} Ar
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
