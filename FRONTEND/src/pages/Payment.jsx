import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, Lock, Shield, CheckCircle } from "lucide-react";
import { emptyCart } from "@/redux/slices/cartSlice";
import axios from "axios";
import API_BASE_URL, { IMAGE_BASE_URL } from "@/config/api";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

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

  // Redirect if no cart items or no payment data
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
      return;
    }

    if (!location.state?.orderData) {
      navigate("/checkout");
      return;
    }
  }, [cartItems, location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      if (formatted.length <= 19) { // 16 digits + 3 spaces
        setPaymentData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }

    // Format expiry month (01-12)
    if (name === "expiryMonth") {
      const month = value.replace(/\D/g, "");
      if (month.length <= 2 && parseInt(month) <= 12) {
        setPaymentData(prev => ({ ...prev, [name]: month }));
      }
      return;
    }

    // Format expiry year (4 digits)
    if (name === "expiryYear") {
      const year = value.replace(/\D/g, "");
      if (year.length <= 4) {
        setPaymentData(prev => ({ ...prev, [name]: year }));
      }
      return;
    }

    // Format CVV (3-4 digits)
    if (name === "cvv") {
      const cvv = value.replace(/\D/g, "");
      if (cvv.length <= 4) {
        setPaymentData(prev => ({ ...prev, [name]: cvv }));
      }
      return;
    }

    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { cardNumber, cardName, expiryMonth, expiryYear, cvv } = paymentData;
    
    if (!cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
      toast.error("Please enter a valid 16-digit card number");
      return false;
    }

    if (!cardName.trim()) {
      toast.error("Please enter the cardholder name");
      return false;
    }

    if (!expiryMonth || !expiryYear) {
      toast.error("Please enter expiry date");
      return false;
    }

    if (parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
      toast.error("Please enter a valid month (01-12)");
      return false;
    }

    const currentYear = new Date().getFullYear();
    if (parseInt(expiryYear) < currentYear) {
      toast.error("Card has expired");
      return false;
    }

    if (!cvv.match(/^\d{3,4}$/)) {
      toast.error("Please enter a valid CVV");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order in backend
      const orderData = {
        products: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          color: item.color
        })),
        totalAmount: totalPrice,
        shippingAddress: location.state.orderData.address,
        paymentMethod: "Credit Card",
        paymentStatus: "completed"
      };

      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${API_BASE_URL}/order/create-order`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Payment successful! Order placed successfully.");
        dispatch(emptyCart());
        navigate("/success", { 
          state: { 
            orderId: response.data.data._id,
            amount: totalPrice 
          } 
        });
      } else {
        toast.error("Failed to create order");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const orderData = location.state?.orderData;

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your purchase securely
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Credit Card Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={handleInputChange}
                  className="mt-1"
                  maxLength={19}
                />
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  placeholder="Sushmita B"
                  value={paymentData.cardName}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expiryMonth">Month</Label>
                  <Input
                    id="expiryMonth"
                    name="expiryMonth"
                    placeholder="MM"
                    value={paymentData.expiryMonth}
                    onChange={handleInputChange}
                    className="mt-1"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryYear">Year</Label>
                  <Input
                    id="expiryYear"
                    name="expiryYear"
                    placeholder="YYYY"
                    value={paymentData.expiryYear}
                    onChange={handleInputChange}
                    className="mt-1"
                    maxLength={4}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="password"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    className="mt-1"
                    maxLength={4}
                  />
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Pay Rs.{totalPrice}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item, index) => {
                    const imageUrl = getImageUrl(item.image);
                    
                    return (
                      <div key={`${item._id}-${index}`} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
                            <span className="text-xs text-gray-500 dark:text-gray-400">No Image</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">Rs.{item.price * item.quantity}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs.{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Rs.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>Rs.0</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>Rs.{totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Your data is protected</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 