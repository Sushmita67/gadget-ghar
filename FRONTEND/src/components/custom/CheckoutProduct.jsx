import { Colors } from "@/constants/colors";
import React from "react";
import { IMAGE_BASE_URL } from "@/config/api";

const CheckoutProduct = ({
  name = "Custom design keyboard",
  price = 299,
  image = null,
  quantity = 2,
  color = Colors.customYellow,
  stock = 5,
}) => {
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
    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-zinc-900">
      <div className="flex flex-row items-center gap-2">
        {imageUrl ? (
          <img 
            src={imageUrl}
            alt={name} 
            className="w-20 sm:w-24 rounded-lg" 
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`w-20 sm:w-24 h-20 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">No Image</span>
        </div>
        <div className="grid sm:gap-1">
          <h1 className="font-semibold text-sm sm:text-base">{name}</h1>
          <p className="flex flex-col sm:flex-row sm:gap-2 text-gray-500 dark:text-customGray text-xs sm:text-sm my-0">
            <span className="font-semibold">
              Color : <span style={{ backgroundColor: color }}>{color}</span>{" "}
            </span>
            <span className="hidden sm:block">|</span>
            <span className="font-semibold">
              Qty :
              <span className="font-bold text-customYellow"> {quantity}</span>
            </span>
            <span className="hidden sm:block">|</span>
            <span className="font-semibold">
              Price :
              <span className="font-bold text-customYellow"> Rs.{price}</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProduct;
