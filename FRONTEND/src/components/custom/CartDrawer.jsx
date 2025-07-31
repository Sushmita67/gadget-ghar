import React from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { useSelector, useDispatch } from "react-redux";
import CartProduct from "./CartProduct";
import LinkButton from "./LinkButton";
import { emptyCart } from "@/redux/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { cartItems, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
      return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="relative" onClick={() => setIsOpen(true)}>
        {totalQuantity > 0 && (
          <Badge className={`absolute px-1 py-0`}>{totalQuantity}</Badge>
        )}
        <ShoppingCart
          className="text-gray-800 dark:text-white hover:scale-105 cursor-pointer transition-all ease-in-out"
          strokeWidth={1.3}
          size={28}
        ></ShoppingCart>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Shopping Cart</DrawerTitle>
          <DrawerDescription>
            Total Items: {totalQuantity} <br />
            Total Price: Rs. {totalPrice}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col sm:flex-row justify-start gap-3 h-[70vh] overflow-y-scroll sm:overflow-y-hidden sm:h-auto mx-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <h2 className="text-primary text-lg mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add some products to get started
              </p>
              <Button 
                onClick={() => {
                  setIsOpen(false);
                  navigate("/products");
                }}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            cartItems.map((item, index) => <CartProduct key={`${item._id}-${index}`} {...item} />)
          )}
        </div>
        <DrawerFooter className="flex gap-2">
          {cartItems.length > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={() => dispatch(emptyCart())}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </Button>
              <Button 
                onClick={() => {
                  setIsOpen(false);
                  navigate("/checkout");
                }}
                className="h-9 px-4 py-2 has-[>svg]:px-3 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
              >
                Checkout
              </Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
