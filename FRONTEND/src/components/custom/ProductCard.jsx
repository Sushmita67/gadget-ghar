import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { starGenerator } from "@/constants/Helper";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "@/config/api";

const ProductCard = ({
  name = "Product Title",
  price = 2000,
  rating = 2.5,
  image = null,
  stock = 10,
  discount = 0,
  isNew = false,
  isHot = false,
  _id = null,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Helper function to get the correct image URL
  const getImageUrl = (imageData) => {
    if (!imageData) return null;
    
    // If imageData is a string (direct URL)
    if (typeof imageData === 'string') {
      return imageData.startsWith('http') ? imageData : `${IMAGE_BASE_URL}${imageData}`;
    }
    
    // If imageData is an object with url property
    if (imageData.url) {
      return imageData.url.startsWith('http') ? imageData.url : `${IMAGE_BASE_URL}${imageData.url}`;
    }
    
    return null;
  };

  const imageUrl = getImageUrl(image);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        _id: _id,
        name: name,
        price: price,
        quantity: 1,
        image: imageUrl,
        stock: stock,
      })
    );
    toast.success("Added to cart!");
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleQuickView = () => {
    navigate(`/product/${name.split(" ").join("-")}`);
  };

  const discountedPrice = price - (price * discount) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNew && (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            New
          </Badge>
        )}
        {isHot && (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            Hot
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Heart
          className={`w-5 h-5 transition-colors duration-200 ${
            isWishlisted
              ? "text-red-500 fill-current"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </motion.button>

      {/* Image Container */}
      <div className="relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
          <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
        </div>
        
        {/* Quick Actions Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleQuickView}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Eye className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="p-3 bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {starGenerator(rating)}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({rating})
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            Rs.{discountedPrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
              Rs.{price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              stock > 10 ? 'bg-green-500' : stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {stock > 10 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
