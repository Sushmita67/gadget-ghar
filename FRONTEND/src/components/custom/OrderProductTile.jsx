import React from "react";
import { IMAGE_BASE_URL } from "@/config/api";

const OrderProductTile = ({ quantity, id, color }) => {
  // Helper function to get the correct image URL
  const getImageUrl = (product) => {
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
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === 'string') {
        return firstImage.startsWith('http') ? firstImage : `${IMAGE_BASE_URL}${firstImage}`;
      }
      if (firstImage.url) {
        return firstImage.url.startsWith('http') ? firstImage.url : `${IMAGE_BASE_URL}${firstImage.url}`;
      }
    }
    
    return null;
  };

  const imageUrl = getImageUrl(id);

  return (
    <div className="flex justify-between items-start sm:items-center p-3 rounded-lg bg-gray-100 dark:bg-zinc-900">
      <div className="flex flex-row items-center gap-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={id?.name}
            className="w-20 sm:w-24 rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`w-20 sm:w-24 h-20 sm:h-24 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg ${imageUrl ? 'hidden' : ''}`}>
          <span className="text-gray-500 dark:text-gray-400 text-xs">No Image</span>
        </div>
        <div className="grid sm:gap-1">
          <h1 className="font-semibold text-sm sm:text-base">{id?.name}</h1>
          <p className="flex flex-col sm:flex-row sm:gap-2 text-gray-500 dark:text-customGray text-xs sm:text-sm my-0">
            <span className="font-semibold">
              Color : <span style={{ backgroundColor: color }}>{color}</span>{" "}
            </span>
            <span className="hidden sm:block">|</span>
            <span className="font-semibold">
              Qty :{" "}
              <span className="font-medium text-customYellow">{quantity}</span>{" "}
            </span>
            <span className="hidden sm:block">|</span>
            <span className="font-semibold">
              Price :{" "}
              <span className="font-medium text-customYellow">
                Rs. {id?.price}
              </span>{" "}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderProductTile;
