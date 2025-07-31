import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Menu, 
  X, 
  User, 
  ShoppingCart, 
  Heart, 
  Settings,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ModeToggle from "./ModeToggle";
import CartDrawer from "./CartDrawer";
import LogoutToggle from "./LogoutToggle";
import { useSelector } from "react-redux";
import logo from "../../assets/gadgetghar-logo-only.svg";
import { toast } from "sonner";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const cartItemsCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      toast.info("Search functionality coming soon!");
    }
  };

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <img src={logo} alt="GadgetGhar Logo" className="w-8 h-8" />
            <span className="hidden sm:block">Gadget Ghar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              {isSearchFocused && searchQuery && (
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2"
                >
                  Search
                </Button>
              )}
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search Icon for Mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => toast.info("Search coming soon!")}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Cart */}
            {isAuthenticated && (
              <div className="relative">
                <CartDrawer />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </div>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <LogoutToggle user={user} />
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">Login</span>
                </Button>
              </Link>
            )}

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon className="w-5 h-5" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="w-5 h-5" />
                    Wishlist
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
