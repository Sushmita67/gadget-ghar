import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { starGenerator } from "@/constants/Helper";
import { Circle, Minus, Plus, Heart, Share2, Truck, Shield, Clock, Star, ArrowLeft } from "lucide-react";
import { Colors } from "@/constants/colors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReviewComponent from "@/components/custom/ReviewComponent";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import useRazorpay from "@/hooks/use-razorpay";
import { sanitizeHTML } from '@/constants/Helper';
import { IMAGE_BASE_URL } from "@/config/api";

const Product = () => {
  const { productName } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { generatePayment, verifyPayment } = useRazorpay();

  const [product, setProduct] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [productColor, setProductColor] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [purchaseProduct, setPurchaseProduct] = useState(false);
  const [address, setAddress] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductByName = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/product/get-product/${productName}`
        );
        const { data } = res.data;
        setProduct(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProductByName();
  }, [productName]);

  const calculateEmi = (price) => Math.round(price / 6);

  const checkAvailability = async () => {
    if (pincode.trim() === "") {
      setAvailabilityMessage("Please enter a valid pincode");
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/pincode/${pincode}`
      );
      const data = res.data;
      if (data.success) {
        setAvailabilityMessage(data.message);
      } else {
        setAvailabilityMessage(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to check availability");
    }
  };

  // Helper function to get the correct image URL
  const getImageUrl = (product, index = 0) => {
    if (!product) return null;
    
    // Check if product has image field (from backend)
    if (product.image) {
      if (typeof product.image === 'string') {
        return product.image.startsWith('http') ? product.image : `${IMAGE_BASE_URL}${product.image}`;
      }
      if (product.image.url) {
        return product.image.url.startsWith('http') ? product.image.url : `${IMAGE_BASE_URL}${product.image.url}`;
      }
    }
    
    // Fallback to images array if image field doesn't exist
    if (product.images && product.images.length > index) {
      const image = product.images[index];
      if (typeof image === 'string') {
        return image.startsWith('http') ? image : `${IMAGE_BASE_URL}${image}`;
      }
      if (image.url) {
        return image.url.startsWith('http') ? image.url : `${IMAGE_BASE_URL}${image.url}`;
      }
    }
    
    return null;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (productColor === "") {
      toast.error("Please select a color");
      return;
    }
    
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: productQuantity,
        image: getImageUrl(product),
        color: productColor,
        stock: product.stock,
        blacklisted: product.blacklisted,
      })
    );
    setProductQuantity(1);
    toast.success("Product added to cart!");
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in first to purchase this product.");
      navigate("/login");
      return;
    }
    if (productQuantity > product.stock) {
      toast.error("Product out of stock");
      return;
    }
    if (product.blacklisted) {
      toast.error("Product isn't available for purchase");
      return;
    }
    if (productColor === "") {
      toast.error("Please select a color");
      return;
    }

    const order = await generatePayment(product.price * productQuantity);
    await verifyPayment(
      order,
      [{ id: product._id, quantity: productQuantity, color: productColor }],
      address
    );
    setPurchaseProduct(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Main Image */}
            <div className="relative group">
              {getImageUrl(product, selectedImage) ? (
                <img
                  src={getImageUrl(product, selectedImage)}
                  alt={product?.name}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-96 lg:h-[500px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-2xl shadow-lg">
                  <span className="text-gray-500 dark:text-gray-400 text-lg">No Image Available</span>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleWishlist}
                  className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {(product?.images && product.images.length > 1) || (product?.image && product.image.length > 1) ? (
              <div className="grid grid-cols-4 gap-4">
                {product.images ? product.images.map((img, index) => (
                  <motion.button
                    key={img.id || index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <img
                      src={getImageUrl(product, index)}
                      alt={`${product?.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                      crossOrigin="anonymous"
                    />
                  </motion.button>
                )) : null}
              </div>
            ) : null}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Product Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {product?.isNew && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">
                    New
                  </Badge>
                )}
                {product?.isHot && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white">
                    Hot
                  </Badge>
                )}
                {product?.discount > 0 && (
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                    -{product.discount}% OFF
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                {product?.name}
              </h1>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product?.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {starGenerator(product?.rating || 0, "0", 20)}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  ({product?.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  Rs.{product?.price?.toLocaleString()}
                </span>
                {product?.discount > 0 && (
                  <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                    Rs.{(product.price * (1 + product.discount / 100)).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>or</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  Rs.{calculateEmi(product?.price)}/month
                </span>
                <span>for 6 months</span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  product?.stock > 10 ? 'bg-green-500' : product?.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product?.stock > 10 ? 'In Stock' : product?.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Color Selection */}
            {product?.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Choose Color
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setProductColor(color)}
                      className={`relative p-1 rounded-full border-2 transition-all duration-200 ${
                        productColor === color
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <Circle
                        fill={color}
                        size={32}
                        className="rounded-full"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProductQuantity((qty) => (qty > 1 ? qty - 1 : 1))}
                    disabled={productQuantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
                    {productQuantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProductQuantity((qty) => (qty < product?.stock ? qty + 1 : qty))}
                    disabled={productQuantity >= product?.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {product?.stock - productQuantity > 0 && product?.stock - productQuantity <= 5 && (
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    Only {product.stock - productQuantity} left!
                  </div>
                )}
              </div>
            </div>

            {/* Pincode Check */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Check Delivery
              </h3>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter your pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={checkAvailability}>
                  Check
                </Button>
              </div>
              {availabilityMessage && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {availabilityMessage}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={() => setPurchaseProduct(true)}
                  disabled={!productColor || product?.stock === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  Buy Now
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={!productColor || product?.stock === 0}
                  variant="outline"
                  className="flex-1"
                >
                  Add to Cart
                </Button>
              </div>

              {purchaseProduct && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <Input
                    placeholder="Enter your delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    onClick={handleBuyNow}
                    disabled={!address.trim()}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Confirm Order
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Secure Payment</p>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Fast Delivery</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <ReviewComponent productId={product?._id} />
        </motion.div>
      </div>
    </div>
  );
};

export default Product;
