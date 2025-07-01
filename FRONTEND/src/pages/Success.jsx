import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Package } from "lucide-react";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, amount } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                Thank you for your purchase! Your order has been placed successfully.
              </p>
              {orderId && (
                <p className="text-sm text-gray-500">
                  Order ID: <span className="font-mono">{orderId}</span>
                </p>
              )}
              {amount && (
                <p className="text-lg font-semibold text-green-600">
                  Amount Paid: Rs.{amount}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Order Confirmed</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    We'll send you an email with order details
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Payment Processed</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Your payment has been securely processed
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/")}
                className="flex-1"
                variant="outline"
              >
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
              <Button
                onClick={() => navigate("/orders")}
                className="flex-1"
              >
                <Package className="w-4 h-4 mr-2" />
                View Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Success;
