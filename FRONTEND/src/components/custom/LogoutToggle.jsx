import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserLogout } from "@/redux/slices/authSlice";
import { User } from "lucide-react";

const LogoutToggle = ({ user }) => {
  const [image, setImage] = useState("");
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      const { profileImg } = userData;
      setImage(profileImg);
    }
  }, []);
  const dispatch = useDispatch();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer w-8 h-8">
          <AvatarImage className="bg-gray-200 dark:bg-gray-700" src={image} />
          <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link to="/orders">
          <DropdownMenuItem className="cursor-pointer">
            My Orders
          </DropdownMenuItem>
        </Link>
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer">
            My Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => dispatch(setUserLogout())}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LogoutToggle;
