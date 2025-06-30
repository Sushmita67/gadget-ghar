import { Star, StarHalf } from "lucide-react";
import { Colors } from "./colors";
import DOMPurify from "dompurify";

export const starGenerator = (rating, stroke = "0", size, fill = Colors.customYellow) => {
  return Array.from({ length: 5 }, (element, index) => {
    if (rating >= index + 1) {
      return <Star key={index} size={size} strokeWidth={stroke} fill={fill} color={fill} />;
    } else if (rating > index && rating < index + 1) {
      return <StarHalf key={index} size={size} strokeWidth={stroke} fill={fill} color={fill} />;
    } else {
      return <Star key={index} size={size} strokeWidth={stroke} fill="none" color={fill} />;
    }
  });
};

export function sanitizeHTML(dirty) {
  return DOMPurify.sanitize(dirty);
}
