import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/custom/Loader";
import { sanitizeHTML } from '@/constants/Helper';
import API_BASE_URL from "@/config/api";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (!email.trim()) {
        toast.error("Email is required");
        setErrorMsg("Email is required");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/user/forgot-password`,
        {
          email: email.toLowerCase().trim(),
        }
      );

      const data = res.data;
      if (data.success) {
        setSuccessMsg(data.message);
        toast.success(data.message);
        setEmail("");
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
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email to receive a password reset link
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
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                />
              </div>
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
                  <span className="ml-2">Sending...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Send Reset Link
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

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              <strong>Note:</strong> Check your email inbox and spam folder for the password reset link. The link will expire in 1 hour.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword; 