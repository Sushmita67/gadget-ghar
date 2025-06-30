import React, { useState, useEffect } from "react";
import CheckoutProduct from "@/components/custom/CheckoutProduct";
import { Card } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useErrorLogout from "@/hooks/use-error-logout";
import { toast } from "sonner";
import { sanitizeHTML } from '@/constants/Helper';

const Checkout = () => {
  const [address, setAddress] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: ""
  });
  const { cartItems, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleErrorLogout } = useErrorLogout();

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems.length, navigate]);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (address.trim() === "") {
      toast.error("Please enter Your Address");
      return;
    }
    
    // Navigate to payment page with order data
    navigate("/payment", {
      state: {
        orderData: {
          address: address,
          products: cartItems,
          totalAmount: totalPrice
        }
      }
    });
  };

  return (
    <div>
      <div className="w-[90vw] mx-auto sm:w-[60vw] flex justify-between items-center sm:my-20">
        <div className="flex flex-col sm:flex-row gap-5 mx-auto my-10">
          {/* product details */}
          <div className="space-y-8">
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-medium">Order Summery</h2>
              <div className="space-y-1 text-3xl">
                {cartItems.length === 0 ? (
                  <h2 className="text-primary text-3xl">
                    Nothing to Show, Please add some Products
                  </h2>
                ) : (
                  cartItems.map((item, index) => (
                    <CheckoutProduct key={`${item._id}-${index}`} {...item}></CheckoutProduct>
                  ))
                )}
              </div>
              <hr />
              <div className="p-3 rounded-md">
                <p className="flex justify-between items-center">
                  <span className="font-semibold text-customGray">
                    Subtotal:
                  </span>
                  <span className="font-bold">Rs. {totalPrice}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-semibold text-customGray">Tax:</span>
                  <span className="font-bold">Rs.0</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-semibold text-customGray">
                    Shipping:
                  </span>
                  <span className="font-bold">Rs.0</span>
                </p>
              </div>
              <hr />
              <p className="flex justify-between items-center px-3">
                <span className="font-bold">Total:</span>
                <span className="font-bold">Rs. {totalPrice}</span>
              </p>
            </div>
          </div>
          {/* personel details*/}
          <div className="w-[90vw] sm:w-[20vw]">
            <Card className="shadow-md p-4">
              <h2 className="text-xl font-medium">Billing Information</h2>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Sushmita B"
                  className="w-full mt-2"
                  value={userData.name || user?.name || ""}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full mt-2"
                  value={userData.email || user?.email || ""}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
                <Label htmlFor="address">Shipping Address</Label>
                <Textarea
                  id="address"
                  placeholder="Gyaneshwor, Kathmandu"
                  className="w-full h-[175px] mt-2"
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Button
                  onClick={handleCheckout}
                  className="w-full cursor-pointer"
                >
                  Place Order
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
