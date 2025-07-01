import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/custom/Loader";
import PasswordStrengthIndicator from "@/components/custom/PasswordStrengthIndicator";
import { toast } from "sonner";
import axios from "axios";
import { sanitizeHTML } from '@/constants/Helper';
import API_BASE_URL from "@/config/api";

const Signup = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, isValid: false });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordStrengthChange = (strength) => {
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { fullName, email, phone, password } = e.target.elements;

    // 🔹 Check empty fields
    if (
      !fullName.value.trim() ||
      !email.value.trim() ||
      !phone.value.trim() ||
      !password.value.trim()
    ) {
      setErrorMsg("Please fill all the fields.");
      toast.error("Please fill all the fields.");
      setLoading(false);
      return;
    }

    // 🔹 Check password strength
    if (!passwordStrength.isValid) {
      setErrorMsg("Password does not meet security requirements.");
      toast.error("Password does not meet security requirements.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/user/signup`,
        {
          fullName: fullName.value.trim(),
          phone: phone.value.trim(),
          email: email.value.trim(),
          password: password.value,
        }
      );

      const data = res.data;

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        setErrorMsg(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      // 🔹 Proper error handling
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setErrorMsg("Something went wrong! Please try again.");
        toast.error("Something went wrong! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center sm:items-center sm:min-h-screen mt-10 sm:mt-0 bg-gray-100 dark:bg-black text-black dark:text-white">
      <div className="w-96 p-6 bg-white dark:bg-[#000000] dark:border-gray-700 dark:border rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-4">
          Register your account
        </h2>

        {/* 🔹 Error Message */}
        {errorMsg && (
          <div className="text-red-500 text-sm font-semibold mb-4 text-center">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(errorMsg) }} />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter Your Name"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="phone" className="mb-2">
              Phone
            </Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter Your Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="mb-2">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={handleInputChange}
            />
            <PasswordStrengthIndicator 
              password={password}
              userInfo={{ 
                email: formData.email, 
                name: formData.fullName 
              }}
              onChange={handlePasswordStrengthChange}
            />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Checkbox id="terms" onCheckedChange={setIsChecked} />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>

          {/* 🔹 Signup Button with Loader */}
          <Button
            className="w-full cursor-pointer"
            disabled={!isChecked || loading || !passwordStrength.isValid}
          >
            {loading ? <Loader /> : "Signup"}
          </Button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
