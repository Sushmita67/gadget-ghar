import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Shield, 
  Truck, 
  HeadphonesIcon,
  Star,
  Users,
  Award,
  Globe
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Wide Selection",
      description: "Browse through thousands of high-quality gadgets and electronics from top brands."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Shopping",
      description: "Your data and payments are protected with industry-leading security measures."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Get your products delivered quickly with our reliable shipping network."
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Our customer support team is always ready to help you with any questions."
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "50K+", label: "Happy Customers" },
    { icon: <ShoppingBag className="w-6 h-6" />, value: "10K+", label: "Products Sold" },
    { icon: <Star className="w-6 h-6" />, value: "4.8", label: "Average Rating" },
    { icon: <Award className="w-6 h-6" />, value: "5+", label: "Years Experience" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Gadget Ghar
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Your trusted destination for premium gadgets and electronics. We're passionate about 
          bringing you the latest technology with exceptional service and competitive prices.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            At Gadget Ghar, we believe that technology should be accessible to everyone. 
            Our mission is to provide high-quality gadgets and electronics at competitive 
            prices while delivering exceptional customer service.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            We carefully curate our product selection to ensure that every item meets our 
            high standards for quality, reliability, and value. Whether you're a tech enthusiast, 
            professional, or casual user, we have something for everyone.
          </p>
          <Link to="/products">
            <Button size="lg">
              Explore Our Products
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Globe className="w-24 h-24 text-white" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Why Choose Gadget Ghar?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-16">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-blue-600 mb-2 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="flex items-center justify-center">
          <div className="w-full h-80 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <Award className="w-24 h-24 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Story
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Founded in 2019, Gadget Ghar started as a small local shop with a big vision. 
            We wanted to create a place where technology enthusiasts could find quality products 
            without breaking the bank.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Over the years, we've grown from a local store to a trusted online destination 
            for gadgets and electronics. Our commitment to quality, customer service, and 
            competitive pricing has remained unchanged.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Today, we serve customers across the country, offering a wide range of products 
            from smartphones and laptops to gaming accessories and smart home devices.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Shop?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Discover our amazing collection of gadgets and electronics today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="secondary">
                Browse Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About; 