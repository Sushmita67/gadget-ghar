import { MapPin, Phone, Mail } from "lucide-react";
import {
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="dark:bg-zinc-900 text-white border-t py-10 px-6 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start">
        {/* Contact Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <MapPin className="text-gray-500" />
            <div>
              <p className="text-gray-500">Gongabu (Near Bus Park)</p>
              <p className="text-gray-400 dark:text-white font-bold">
                Kathmandu, Nepal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Phone className="text-gray-500" />
            <p className="text-gray-400 dark:text-white font-bold">
              +977 9812131415
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Mail className="text-gray-500" />
            <Link to="hello@gadgetghar.com.np" className="text-blue-400 font-bold">
              hello@gadgetghar.com.np
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8 md:mt-0 md:w-1/2">
          <h3 className=" text-gray-500 dark:text-white font-bold text-xl mb-2">
            About Gadget Ghar
          </h3>
          <p className="text-gray-400 dark:text-gray-400  text-sm">
           One-stop solution for latest gadgets trend.
          </p>

          {/* Social Media Links */}
          <div className="flex gap-4 mt-4">
            <Link
              to="https://www.instagram.com/"
              className="bg-gray-700 p-2 rounded hover:bg-gray-500"
            >
              <FaInstagram />
            </Link>
            <Link
              to="https://api.whatsapp.com/"
              className="bg-gray-700 p-2 rounded hover:bg-gray-500"
            >
              <FaWhatsapp />
            </Link>
            <Link
              to="https://www.linkedin.com/"
              className="bg-gray-700 p-2 rounded hover:bg-gray-500"
            >
              <FaLinkedinIn />
            </Link>
            <Link
              to="https://github.com/"
              className="bg-gray-700 p-2 rounded hover:bg-gray-500"
            >
              <FaGithub />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
