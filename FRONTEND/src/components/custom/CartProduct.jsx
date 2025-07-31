import { Colors } from "@/constants/colors";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { Minus, Plus } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "@/config/api";

const CartProduct = ({ name, price, _id, image, quantity, stock }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <div className="border w-fit rounded-2xl overflow-clip grid z-1 relative hover:shadow-md">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-[30rem] sm:w-[20rem] h-[20rem] object-cover rounded-t-2xl"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className={`w-[30rem] sm:w-[20rem] h-[20rem] bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-2xl ${imageUrl ? 'hidden' : ''}`}>
        <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
      </div>
      <div className="px-3 grid gap-1 py-2 absolute bg-white dark:bg-zinc-900 w-full bottom-0 rounded-xl">
        <h2 className="text-md">{name}</h2>
        <h2 className="text-md font-semibold">Rs. {price}</h2>
        <div className="flex justify-between my-2">
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-5 bg-gray-100 rounded-lg px-3 py-2 w-fit ">
              <Minus
                className="cursor-pointer"
                size={15}
                stroke={Colors.customGray}
                onClick={() => {
                  if (quantity >= 2) {
                    dispatch(removeFromCart({ _id, quantity: 1, price }));
                  }
                }}
              />{" "}
              <span className="text-slate-950 text-sm sm:text-md">
                {quantity}
              </span>{" "}
              <Plus
                className="cursor-pointer"
                size={15}
                stroke={Colors.customGray}
                onClick={() => {
                  stock === quantity
                    ? toast.error("Maximum Stock Reached")
                    : dispatch(addToCart({ _id, quantity: 1, price }));
                }}
              />
            </div>
          </div>
          <Button onClick={() => navigate("/checkout")} size="sm">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
