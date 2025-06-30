import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/custom/Loader";
import { sanitizeHTML } from '@/constants/Helper';
import API_BASE_URL from "@/config/api";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setErrorMsg("Invalid reset link. Please request a new password reset.");
      toast.error("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
    const errors = [];
    if (password.length < minLength) errors.push(`At least ${minLength} characters`);
    if (!hasUpperCase) errors.push("1 uppercase letter");
    if (!hasNumber) errors.push("1 number");
    if (!hasSpecialChar) errors.push("1 special character");
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (!token) {
        toast.error("Invalid reset link");
        setErrorMsg("Invalid reset link");
        setLoading(false);
        return;
      }

      if (!formData.newPassword.trim() || !formData.confirmPassword.trim()) {
        toast.error("All fields are required");
        setErrorMsg("All fields are required");
        setLoading(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        setErrorMsg("Passwords do not match");
        setLoading(false);
        return;
      }

      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        const errorMessage = `Password must contain: ${passwordErrors.join(", ")}`;
        toast.error(errorMessage);
        setErrorMsg(errorMessage);
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/user/reset-password`,
        {
          token: token,
          newPassword: formData.newPassword,
        }
      );

      const data = res.data;
      if (data.success) {
        setSuccessMsg(data.message);
        toast.success(data.message);
        setFormData({ newPassword: "", confirmPassword: "" });
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(data.message);
        setErrorMsg(data.message);
      }
    } catch (error) {
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

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link 
              to="/forgot-password" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Request New Reset Link
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your new password below
            </p>
          </div>

          {/* Success Message */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(successMsg) }} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
            >
              <div className="text-red-600 dark:text-red-400 text-sm font-medium">
                <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(errorMsg) }} />
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="pl-10 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className="pl-10 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                Password Requirements:
              </p>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                <li>• At least 8 characters</li>
                <li>• 1 uppercase letter</li>
                <li>• 1 number</li>
                <li>• 1 special character</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader />
                  <span className="ml-2">Resetting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Reset Password
                  <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-8">
            <Link 
              to="/login" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword; 