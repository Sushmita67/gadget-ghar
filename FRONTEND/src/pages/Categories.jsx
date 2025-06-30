import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Watch,
  Camera,
  Gamepad2,
  Speaker,
  Monitor,
  Tablet,
  Keyboard,
  Mouse,
  Printer
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from "@/config/api";
import { toast } from "sonner";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/product/get-categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to default categories if API fails
      setCategories([
        "Smartphones",
        "Laptops",
        "Headphones",
        "Smartwatches",
        "Cameras",
        "Gaming",
        "Speakers",
        "Monitors",
        "Tablets",
        "Accessories"
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      "Smartphones": <Smartphone className="w-8 h-8" />,
      "Laptops": <Laptop className="w-8 h-8" />,
      "Headphones": <Headphones className="w-8 h-8" />,
      "Smartwatches": <Watch className="w-8 h-8" />,
      "Cameras": <Camera className="w-8 h-8" />,
      "Gaming": <Gamepad2 className="w-8 h-8" />,
      "Speakers": <Speaker className="w-8 h-8" />,
      "Monitors": <Monitor className="w-8 h-8" />,
      "Tablets": <Tablet className="w-8 h-8" />,
      "Accessories": <Keyboard className="w-8 h-8" />,
      "Keyboards": <Keyboard className="w-8 h-8" />,
      "Mice": <Mouse className="w-8 h-8" />,
      "Printers": <Printer className="w-8 h-8" />
    };
    return iconMap[category] || <Smartphone className="w-8 h-8" />;
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      "Smartphones": "from-blue-500 to-cyan-500",
      "Laptops": "from-purple-500 to-pink-500",
      "Headphones": "from-green-500 to-emerald-500",
      "Smartwatches": "from-orange-500 to-red-500",
      "Cameras": "from-indigo-500 to-purple-500",
      "Gaming": "from-red-500 to-pink-500",
      "Speakers": "from-yellow-500 to-orange-500",
      "Monitors": "from-blue-600 to-indigo-600",
      "Tablets": "from-green-600 to-teal-600",
      "Accessories": "from-gray-500 to-slate-500",
      "Keyboards": "from-gray-500 to-slate-500",
      "Mice": "from-gray-500 to-slate-500",
      "Printers": "from-gray-500 to-slate-500"
    };
    return colorMap[category] || "from-blue-500 to-cyan-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Product Categories
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explore our wide range of product categories. Find exactly what you're looking for 
          from smartphones to gaming accessories.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Card 
            key={index} 
            className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getCategoryColor(category)} flex items-center justify-center text-white`}>
                {getCategoryIcon(category)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {category}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Explore {category.toLowerCase()} and accessories
              </p>
              <Link to={`/products?category=${encodeURIComponent(category)}`}>
                <Button variant="outline" size="sm" className="w-full">
                  Browse {category}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Featured Categories */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Featured Categories
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Smartphones */}
          <Card className="overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-white">
              <Smartphone className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Smartphones</h3>
              <p className="opacity-90 mb-4">
                Latest smartphones from top brands with cutting-edge technology
              </p>
              <Link to="/products?category=Smartphones">
                <Button variant="secondary" size="lg">
                  Shop Now
                </Button>
              </Link>
            </div>
          </Card>

          {/* Laptops */}
          <Card className="overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
              <Laptop className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Laptops</h3>
              <p className="opacity-90 mb-4">
                High-performance laptops for work, gaming, and creativity
              </p>
              <Link to="/products?category=Laptops">
                <Button variant="secondary" size="lg">
                  Shop Now
                </Button>
              </Link>
            </div>
          </Card>

          {/* Gaming */}
          <Card className="overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-8 text-white">
              <Gamepad2 className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Gaming</h3>
              <p className="opacity-90 mb-4">
                Gaming consoles, accessories, and peripherals for gamers
              </p>
              <Link to="/products?category=Gaming">
                <Button variant="secondary" size="lg">
                  Shop Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Category Selection Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Browse {selectedCategory}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You're about to browse our {selectedCategory.toLowerCase()} collection.
            </p>
            <div className="flex gap-4">
              <Link to={`/products?category=${encodeURIComponent(selectedCategory)}`}>
                <Button className="flex-1">
                  Continue
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory(null)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Categories; 