import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModeToggle from "./ModeToggle";
import CartDrawer from "./CartDrawer";
import { User } from "lucide-react";
import LogoutToggle from "./LogoutToggle";
import { useSelector } from "react-redux";
import logo from "../../assets/gadgetghar-logo-only.svg";


const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <nav className="flex justify-between items-center px-8 py-5 border-b dark:bg-zinc-900">
      {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <img src={logo} alt="GadgetGhar Logo" className="w-32 h-auto" />
            Gadget Ghar Nepal
        </Link>





        <div className="flex gap-4 items-center">
        {isAuthenticated && <CartDrawer></CartDrawer>}
        {isAuthenticated ? (
          <LogoutToggle user={user} />
        ) : (
          <Link to="/login">
            <User
              strokeWidth={1.3}
              className="text-gray-800 dark:text-white cursor-pointer hover:scale-105 transition-all transition-ease-in-out"
            ></User>
          </Link>
        )}
        <ModeToggle></ModeToggle>
      </div>
    </nav>
  );
};

export default Navbar;
