import React from "react";
import { motion } from "framer-motion";

const Loader = ({ size = "default", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const dotVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className={`border-2 border-gray-300 border-t-blue-600 rounded-full ${sizeClasses[size]}`}
      />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {text}
        </span>
      )}
    </div>
  );
};

// Page Loader Component
export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 mx-auto"
        >
          <div className="w-full h-full border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading Gadget Ghar
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we prepare your experience...
          </p>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader for Products
export const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-700 h-64"></div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

// Dots Loader
export const DotsLoader = () => {
  return (
    <div className="flex items-center justify-center gap-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={dotVariants}
          animate="animate"
          transition={{
            delay: index * 0.1,
          }}
          className="w-2 h-2 bg-blue-600 rounded-full"
        />
      ))}
    </div>
  );
};

export default Loader;
